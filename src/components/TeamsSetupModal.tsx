'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  X,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  Users,
  Copy,
  Check,
  Radio,
  Sliders,
  Settings,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface TeamsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
  date: string;
  onAttendanceUpdated?: () => void;
}

export default function TeamsSetupModal({
  isOpen,
  onClose,
  batchNumber = '3',
  date,
  onAttendanceUpdated,
}: TeamsSetupModalProps) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'scan' | 'paste' | 'webhook'>('scan');
  const [selectedBatch, setSelectedBatch] = useState<string>(batchNumber || '3');
  const [graceMinutes, setGraceMinutes] = useState<15 | 20>(15);

  const [scanning, setScanning] = useState(false);
  const [applying, setApplying] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [notifyingAbsent, setNotifyingAbsent] = useState(false);

  const [scannedData, setScannedData] = useState<any | null>(null);
  const [rawChatText, setRawChatText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [channelName, setChannelName] = useState('Technical Training - Cohort Standup');
  const [copiedSample, setCopiedSample] = useState(false);

  useEffect(() => {
    setSelectedBatch(batchNumber);
  }, [batchNumber]);

  // Load Teams info on modal open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/teams')
        .then((r) => r.json())
        .then((data) => {
          if (data.channel) setChannelName(data.channel);
        })
        .catch(() => {});
      // Auto run initial scan for active batch
      handleScanLogins(selectedBatch);
    }
  }, [isOpen, selectedBatch, graceMinutes]);

  const handleScanLogins = async (batch: string) => {
    setScanning(true);
    try {
      const res = await fetch(`/api/teams?action=scan-attendance&batch=${batch}&date=${date}&grace=${graceMinutes}`);
      if (res.ok) {
        const data = await res.json();
        setScannedData(data);
      } else {
        toastError('Teams Scan Error', 'Could not scan Teams login messages.');
      }
    } catch {
      toastError('Network Error', 'Failed to connect to Teams scanner service.');
    } finally {
      setScanning(false);
    }
  };

  const handleApplyToRegister = async () => {
    setApplying(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scan-attendance',
          batch: selectedBatch,
          date,
          graceMinutes,
          rawChatText: activeTab === 'paste' ? rawChatText : undefined,
          applyToRegister: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toastSuccess(
          'Attendance Registry Updated!',
          `Applied Teams logins for Batch ${selectedBatch}: ${data.punchedCount}/${data.totalTrainees} logged in.`
        );
        onAttendanceUpdated?.();
      } else {
        toastError('Failed to Apply', 'Could not update attendance register.');
      }
    } catch {
      toastError('Error', 'Failed to communicate with attendance register.');
    } finally {
      setApplying(false);
    }
  };

  const handlePostAbsenceAlertsToTeams = async () => {
    if (!scannedData?.missingTrainees?.length) {
      toastInfo('No Absentees', 'All trainees have logged in on time!');
      return;
    }

    setNotifyingAbsent(true);
    try {
      let count = 0;
      for (const t of scannedData.missingTrainees) {
        await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-absence-alert',
            traineeName: t.traineeName,
            batch: selectedBatch,
            date,
          }),
        });
        count++;
      }
      toastSuccess(
        'Absence Alerts Dispatched to Teams!',
        `Sent ${count} morning absence warning notice(s) to Teams channel.`
      );
    } catch {
      toastError('Error', 'Failed to post alerts to Teams.');
    } finally {
      setNotifyingAbsent(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess('Teams Connected!', 'Successfully dispatched test card to Microsoft Teams channel.');
      } else {
        toastError('Teams Error', data.error || 'Failed to dispatch card to Teams.');
      }
    } catch {
      toastError('Connection Error', 'Could not connect to Teams webhook.');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSaveWebhook = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-webhook',
          webhookUrl,
          channelName,
        }),
      });
      if (res.ok) {
        toastSuccess('Saved!', 'Teams Webhook and channel configurations updated.');
      }
    } catch {
      toastError('Error', 'Failed to save Teams settings.');
    }
  };

  const sampleBatch3Chat = `[08:52 AM] Althaf Syed: Good morning mam! Working on React functional components and Sunray Hospital project.
[08:56 AM] Bala Krishna Parimi: Good morning ma'am and team.
[09:03 AM] Chandra Shekar K: Good morning team
[09:08 AM] Girish C: Good morning everyone
[09:12 AM] Tejaswar Rao: Good morning team! Starting Day 1 exercises.`;

  const sampleBatch4Chat = `[08:51 AM] Adinarayana Meesala: Good morning team, logged in.
[08:55 AM] Adithya Ram: Good morning everyone!
[08:58 AM] Sruthi Badavath: Good morning team
[09:04 AM] Jose Amala Kishor: Good morning ma'am
[09:07 AM] Snehith Reddy Challa: Good morning all`;

  const handleLoadSampleChat = () => {
    const sample = selectedBatch === '4' ? sampleBatch4Chat : sampleBatch3Chat;
    setRawChatText(sample);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '92vh',
          backgroundColor: '#0d1322',
          border: '1px solid rgba(91, 95, 199, 0.35)', // Teams Purple accent
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(91, 95, 199, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInScale 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(91, 95, 199, 0.22), rgba(15, 23, 42, 0.6))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#5B5FC7', // Official MS Teams brand color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(91, 95, 199, 0.5)',
              }}
            >
              <MessageSquare size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Microsoft Teams Operations Center
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 600,
                  }}
                >
                  🟢 Connected (NYB Infotech)
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>
                9:00 AM Login & “Good Morning” Scanner • Absence Notices • Teams Channel Alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cohort & Policy Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Batch Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Trainee Cohort:</span>
            <button
              type="button"
              onClick={() => {
                setSelectedBatch('3');
                handleScanLogins('3');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedBatch === '3' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedBatch === '3' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedBatch === '3' ? '#38bdf8' : '#94a3b8',
              }}
            >
              Batch 3 (6 Trainees)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedBatch('4');
                handleScanLogins('4');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedBatch === '4' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedBatch === '4' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedBatch === '4' ? '#c084fc' : '#94a3b8',
              }}
            >
              Batch 4 (7 Trainees)
            </button>
          </div>

          {/* Grace Period Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>9:00 AM Grace Window:</span>
            <button
              type="button"
              onClick={() => setGraceMinutes(15)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: graceMinutes === 15 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                background: graceMinutes === 15 ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: graceMinutes === 15 ? '#fbbf24' : '#64748b',
              }}
            >
              15 Mins (Cutoff 9:15 AM)
            </button>
            <button
              type="button"
              onClick={() => setGraceMinutes(20)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: graceMinutes === 20 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                background: graceMinutes === 20 ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: graceMinutes === 20 ? '#fbbf24' : '#64748b',
              }}
            >
              20 Mins (Cutoff 9:20 AM)
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 24px',
            gap: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'scan' ? '2px solid #5B5FC7' : '2px solid transparent',
              color: activeTab === 'scan' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={15} color={activeTab === 'scan' ? '#7B83EB' : '#94a3b8'} />
            <span>1-Click Teams Ingestion</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'paste' ? '2px solid #5B5FC7' : '2px solid transparent',
              color: activeTab === 'paste' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MessageSquare size={15} color={activeTab === 'paste' ? '#7B83EB' : '#94a3b8'} />
            <span>Paste Teams Chat History</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('webhook')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'webhook' ? '2px solid #5B5FC7' : '2px solid transparent',
              color: activeTab === 'webhook' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Settings size={15} color={activeTab === 'webhook' ? '#7B83EB' : '#94a3b8'} />
            <span>Teams Webhook & Channel Config</span>
          </button>
        </div>

        {/* Tab 1: Live Teams Ingestion */}
        {activeTab === 'scan' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Quick Actions Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                  Morning Punch Roll Call:
                </span>
                {scannedData && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: '3px 10px',
                      borderRadius: 10,
                      background: 'rgba(91, 95, 199, 0.2)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(91, 95, 199, 0.4)',
                    }}
                  >
                    {scannedData.punchedCount}/{scannedData.totalTrainees} Logged In
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleScanLogins(selectedBatch)}
                  disabled={scanning}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: scanning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RefreshCw size={14} className={scanning ? 'spin' : ''} />
                  <span>Rescan Teams</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyToRegister}
                  disabled={applying}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #5B5FC7, #444791)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: applying ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(91, 95, 199, 0.4)',
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>{applying ? 'Updating...' : 'Sync to Attendance Register'}</span>
                </button>
              </div>
            </div>

            {/* Trainee Roll Call Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
              {scannedData?.scannedPunches?.map((punch: any, idx: number) => {
                const isOnTime = punch.status === 'on-time';
                const isGrace = punch.status === 'grace-period';
                const isAbsent = punch.status === 'absent';

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: isAbsent
                        ? 'rgba(239, 68, 68, 0.08)'
                        : isGrace
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(16, 185, 129, 0.08)',
                      border: isAbsent
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : isGrace
                        ? '1px solid rgba(245, 158, 11, 0.3)'
                        : '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                        {punch.traineeName}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 8,
                          background: isAbsent
                            ? 'rgba(239, 68, 68, 0.25)'
                            : isGrace
                            ? 'rgba(245, 158, 11, 0.25)'
                            : 'rgba(16, 185, 129, 0.25)',
                          color: isAbsent ? '#f87171' : isGrace ? '#fbbf24' : '#34d399',
                        }}
                      >
                        {isAbsent
                          ? '❌ Absent / Away'
                          : isGrace
                          ? `🟡 Grace (${punch.minutesLate}m Late)`
                          : '🟢 On-Time'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                      <Clock size={13} />
                      <span>Login Punch: </span>
                      <strong style={{ color: punch.loginTime ? '#e2e8f0' : '#ef4444' }}>
                        {punch.loginTime || 'None (Cutoff exceeded)'}
                      </strong>
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: isAbsent ? '#fca5a5' : '#cbd5e1',
                        fontStyle: 'italic',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '6px 8px',
                        borderRadius: 6,
                      }}
                    >
                      “{punch.messageText}”
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Missing Trainees Alert Banner */}
            {scannedData?.missingTrainees?.length > 0 && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.8))',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <strong style={{ fontSize: 14, color: '#f87171' }}>
                      {scannedData.missingTrainees.length} Trainee(s) Absent Past {graceMinutes}m Grace Cutoff
                    </strong>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                    Missing: {scannedData.missingTrainees.map((m: any) => m.traineeName).join(', ')}. Official
                    absence notice drafts are generated and ready for Teams dispatch.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePostAbsenceAlertsToTeams}
                  disabled={notifyingAbsent}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: notifyingAbsent ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <Send size={14} />
                  <span>
                    {notifyingAbsent ? 'Dispatching...' : '📢 Post Warning to Teams Channel'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Teams Chat */}
        {activeTab === 'paste' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  Paste Microsoft Teams Chat Log
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                  Copy-paste morning chat messages directly from your Teams cohort channel.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadSampleChat}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'rgba(91, 95, 199, 0.15)',
                  border: '1px solid rgba(91, 95, 199, 0.3)',
                  color: '#a5b4fc',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {copiedSample ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSample ? 'Sample Loaded!' : 'Load Sample Morning Chat'}</span>
              </button>
            </div>

            <textarea
              value={rawChatText}
              onChange={(e) => setRawChatText(e.target.value)}
              placeholder={`Paste messages from Microsoft Teams here, for example:\n[08:52 AM] Althaf Syed: Good morning mam\n[08:56 AM] Bala Krishna Parimi: Good morning team\n[09:03 AM] Chandra Shekar K: Good morning team`}
              rows={9}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: 12,
                fontFamily: 'Consolas, monospace',
                lineHeight: 1.5,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={handleApplyToRegister}
                disabled={applying || !rawChatText.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #5B5FC7, #444791)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: applying || !rawChatText.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(91, 95, 199, 0.4)',
                }}
              >
                <CheckCircle2 size={15} />
                <span>{applying ? 'Parsing & Updating...' : 'Parse & Sync to Attendance Register'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Webhook & Channel Config */}
        {activeTab === 'webhook' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                Microsoft Teams Incoming Webhook & Channel Settings
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                Configure your Microsoft 365 Teams channel webhook for instant automated alerts and report cards.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                Teams Channel Name:
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Technical Training - Cohort Standup"
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                Teams Incoming Webhook URL:
              </label>
              <input
                type="password"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://navayuvabharatinfotech703.webhook.office.com/webhookb2/..."
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Default connects to Navayuva Bharathi Infotech verified Teams Connector Service.
              </span>
            </div>

            {/* Quick 3-Step Setup Guide */}
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: 'rgba(91, 95, 199, 0.08)',
                border: '1px solid rgba(91, 95, 199, 0.25)',
                fontSize: 12,
                color: '#cbd5e1',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#a5b4fc' }}>💡 How to generate a Teams Webhook in 30 seconds:</strong>
              <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                <li>Open Microsoft Teams &rarr; Go to your Cohort Channel (e.g. <em>Batch 3 Frontend</em>).</li>
                <li>Click <strong>••• (More options)</strong> &rarr; Select <strong>Connectors</strong> (or <strong>Workflows</strong>).</li>
                <li>Choose <strong>Incoming Webhook</strong> &rarr; Click Add &rarr; Copy the generated URL into the box above.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: testingWebhook ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Radio size={14} color="#5B5FC7" />
                <span>{testingWebhook ? 'Dispatching Test...' : 'Send Test Ping to Teams Channel'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveWebhook}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #5B5FC7, #444791)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(91, 95, 199, 0.4)',
                }}
              >
                Save Teams Config
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 15, 29, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
            <Shield size={13} color="#10b981" />
            <span>M365 Tenant: Navayuva Bharathi Infotech 703</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
