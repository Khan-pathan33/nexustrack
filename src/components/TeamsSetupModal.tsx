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
  Calendar,
  History,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface TeamsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
  date: string;
  onAttendanceUpdated?: (punches?: any[]) => void;
}

export default function TeamsSetupModal({
  isOpen,
  onClose,
  batchNumber = '3',
  date,
  onAttendanceUpdated,
}: TeamsSetupModalProps) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'scan' | 'chat-stream' | 'paste' | 'history' | 'webhook'>('scan');
  const [selectedBatch, setSelectedBatch] = useState<string>(batchNumber || '3');
  const [graceMinutes, setGraceMinutes] = useState<15 | 20>(15);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (date) {
      if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [d, m, y] = date.split('-');
        return `${y}-${m}-${d}`;
      }
      return date;
    }
    return new Date().toISOString().split('T')[0];
  });

  const [scanning, setScanning] = useState(false);
  const [applying, setApplying] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [notifyingAbsent, setNotifyingAbsent] = useState(false);

  const [scannedData, setScannedData] = useState<any | null>(null);
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [rawChatText, setRawChatText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [channelName, setChannelName] = useState(
    batchNumber === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III'
  );
  const [copiedSample, setCopiedSample] = useState(false);

  // Sync external batch & date props
  useEffect(() => {
    setSelectedBatch(batchNumber || '3');
    setChannelName(batchNumber === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III');
  }, [batchNumber]);

  useEffect(() => {
    if (date) {
      const norm = /^\d{2}-\d{2}-\d{4}$/.test(date)
        ? `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`
        : date;
      setSelectedDate(norm);
    }
  }, [date]);

  // Load Teams info on modal open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/teams')
        .then((r) => r.json())
        .then((data) => {
          if (data.channel) setChannelName(data.channel);
        })
        .catch(() => {});
      // Auto run initial scan for active batch and date
      handleScanLogins(selectedBatch, selectedDate);
    }
  }, [isOpen, selectedBatch, selectedDate, graceMinutes]);

  const handleScanLogins = async (batch: string, targetDate?: string) => {
    const d = targetDate || selectedDate;
    setScanning(true);
    try {
      const res = await fetch(`/api/teams?action=scan-attendance&batch=${batch}&date=${d}&grace=${graceMinutes}`);
      if (res.ok) {
        const data = await res.json();
        setScannedData(data);
        if (data.availableDates) {
          setAvailableDates(data.availableDates);
        }
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
          date: selectedDate,
          graceMinutes,
          rawChatText: activeTab === 'paste' ? rawChatText : undefined,
          applyToRegister: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toastSuccess(
          'Attendance Registry Updated!',
          `Applied Teams logins for Batch ${selectedBatch} (${scannedData?.displayDate || selectedDate}): ${data.punchedCount}/${data.totalTrainees} logged in.`
        );
        onAttendanceUpdated?.(data.scannedPunches || scannedData?.scannedPunches || []);
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
            date: selectedDate,
          }),
        });
        count++;
      }
      toastSuccess(
        'Absence Alerts Dispatched to Teams!',
        `Sent ${count} morning absence warning notice(s) to ${channelName}.`
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

  const sampleBatch3Chat = `Tejeswar Rao 09:00
Good Morning Team

Althaf Syed 09:00
Good Morning Team

Chandra Shekar K 09:00
Good Morning Team

Bala Krishna Parimi 09:00
Good morning team

Sana Sulthana 09:02
Good Morning Team`;

  const sampleBatch4Chat = `Adinarayana Meesala 08:51
Good morning team, logged in.

Adithya Ram 08:55
Good morning everyone!

Sruthi Badavath 08:58
Good morning team

Jose Amala Kishor 09:04
Good morning ma'am

Snehith Reddy Challa 09:07
Good morning all`;

  const handleLoadSampleChat = () => {
    const sample = selectedBatch === '4' ? sampleBatch4Chat : sampleBatch3Chat;
    setRawChatText(sample);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  // Dynamic quick dates relative to current date
  const todayIso = new Date().toISOString().split('T')[0];
  const dObj = new Date();
  const formatPillDate = (iso: string, isToday = false) => {
    const parts = iso.split('-');
    const day = parts[2];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    return isToday ? `Today (${day} ${month})` : `${day} ${month}`;
  };

  const yesterdayDate = new Date(dObj.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayBeforeYesterday = new Date(dObj.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const quickDates = [
    { label: formatPillDate(todayIso, true), value: todayIso },
    { label: formatPillDate(yesterdayDate), value: yesterdayDate },
    { label: formatPillDate(dayBeforeYesterday), value: dayBeforeYesterday },
    { label: '05 Nov', value: '2026-11-05' },
    { label: '26 Oct', value: '2026-10-26' },
  ].filter((v, idx, arr) => arr.findIndex((t) => t.value === v.value) === idx);

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
          maxWidth: 880,
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
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(91, 95, 199, 0.25), rgba(15, 23, 42, 0.6))',
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
                  🟢 Connected ({channelName})
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>
                9:00 AM Login & “Good Morning” Scanner • Date-wise Attendance Archive • Absence Notices
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

        {/* ── INTERACTIVE DATE & BATCH SELECTOR STRIP ── */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                setChannelName('NYB Technical Group - III');
                handleScanLogins('3', selectedDate);
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
              Batch 3 (NYB Group III)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedBatch('4');
                setChannelName('NYB Technical Group - IV');
                handleScanLogins('4', selectedDate);
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
              Batch 4 (NYB Group IV)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedBatch('all');
                setChannelName('NYB Technical Group - III & IV (Both)');
                handleScanLogins('all', selectedDate);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedBatch === 'all' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedBatch === 'all' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedBatch === 'all' ? '#34d399' : '#94a3b8',
              }}
            >
              🌐 Both Groups (13 Trainees)
            </button>
          </div>

          {/* Date Picker & Quick Date Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} color="#a5b4fc" />
              <span>Select Date:</span>
            </span>

            {quickDates.map((q) => {
              const isActive = selectedDate === q.value;
              return (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => {
                    setSelectedDate(q.value);
                    handleScanLogins(selectedBatch, q.value);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isActive ? '1px solid #5B5FC7' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isActive ? 'linear-gradient(135deg, #5B5FC7, #444791)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    boxShadow: isActive ? '0 2px 8px rgba(91, 95, 199, 0.4)' : 'none',
                  }}
                >
                  {q.label}
                </button>
              );
            })}

            {/* Calendar Input for ANY date */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  handleScanLogins(selectedBatch, e.target.value);
                }
              }}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: 11,
                cursor: 'pointer',
              }}
              title="Pick any date from calendar"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 24px',
            gap: 16,
            overflowX: 'auto',
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
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={15} color={activeTab === 'scan' ? '#7B83EB' : '#94a3b8'} />
            <span>1-Click Teams Ingestion</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat-stream')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'chat-stream' ? '2px solid #5B5FC7' : '2px solid transparent',
              color: activeTab === 'chat-stream' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
            }}
          >
            <MessageSquare size={15} color={activeTab === 'chat-stream' ? '#7B83EB' : '#94a3b8'} />
            <span>💬 Live Chat Stream</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'history' ? '2px solid #5B5FC7' : '2px solid transparent',
              color: activeTab === 'history' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
            }}
          >
            <History size={15} color={activeTab === 'history' ? '#7B83EB' : '#94a3b8'} />
            <span>📅 Date History Archive ({availableDates.length})</span>
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
              whiteSpace: 'nowrap',
            }}
          >
            <Copy size={15} color={activeTab === 'paste' ? '#7B83EB' : '#94a3b8'} />
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
              whiteSpace: 'nowrap',
            }}
          >
            <Settings size={15} color={activeTab === 'webhook' ? '#7B83EB' : '#94a3b8'} />
            <span>Channel & Webhook</span>
          </button>
        </div>

        {/* ── TAB 1: 1-Click Teams Ingestion (Cards View) ── */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                  Roll Call Status:
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 10,
                    background: 'rgba(91, 95, 199, 0.25)',
                    color: '#c7d2fe',
                    border: '1px solid rgba(91, 95, 199, 0.45)',
                    fontWeight: 600,
                  }}
                >
                  💬 {selectedBatch === 'all' ? 'NYB Technical Groups III & IV' : selectedBatch === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III'}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontWeight: 600,
                  }}
                >
                  📅 {scannedData?.displayDate || selectedDate}
                </span>
                {scannedData && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: '3px 10px',
                      borderRadius: 10,
                      background: scannedData.absentCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: scannedData.absentCount > 0 ? '#fbbf24' : '#6ee7b7',
                      border: scannedData.absentCount > 0 ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
                      fontWeight: 600,
                    }}
                  >
                    {scannedData.punchedCount}/{scannedData.totalTrainees} Logged In
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleScanLogins(selectedBatch, selectedDate)}
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
                  <span>{applying ? 'Updating...' : `Sync to Register (${scannedData?.displayDate || selectedDate})`}</span>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                          {punch.traineeName}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: punch.batchNumber === '4' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                            color: punch.batchNumber === '4' ? '#c084fc' : '#38bdf8',
                            fontWeight: 700,
                          }}
                        >
                          {punch.batchNumber === '4' ? 'Group IV' : 'Group III'}
                        </span>
                      </div>
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
                      {scannedData.missingTrainees.length} Trainee(s) Absent on {scannedData.displayDate || selectedDate}
                    </strong>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                    Missing: {scannedData.missingTrainees.map((m: any) => m.traineeName).join(', ')}. Official
                    absence notice drafts are generated and ready for dispatch.
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

        {/* ── TAB 2: Live Teams Chat Stream View (Mirrors MS Teams Screenshot!) ── */}
        {activeTab === 'chat-stream' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Teams Header Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderRadius: 12,
                background: 'rgba(20, 26, 45, 0.95)',
                border: '1px solid rgba(91, 95, 199, 0.35)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#5B5FC7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  NYB
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                    {selectedBatch === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III'}
                  </h4>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    📅 Chat Feed for: <strong style={{ color: '#38bdf8' }}>{scannedData?.displayDate || selectedDate}</strong> • {scannedData?.punchedCount || 0} Good Morning message(s)
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 600,
                }}
              >
                Teams Chat View
              </span>
            </div>

            {/* Conversation Stream Container (Exact Teams Desktop Dark Theme Layout) */}
            <div
              style={{
                background: '#141824',
                borderRadius: 14,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  — {scannedData?.displayDate || selectedDate} Morning Session —
                </span>
              </div>

              {scannedData?.scannedPunches?.map((item: any, idx: number) => {
                if (item.status === 'absent') return null;

                const initials = item.traineeName
                  .split(' ')
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join('');

                const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777', '#0891b2'];
                const avatarBg = colors[idx % colors.length];

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: avatarBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 12,
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      {initials}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                          {item.traineeName}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {item.loginTime ? item.loginTime.replace(' AM', '') : '09:00'}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 6,
                            background: item.status === 'on-time' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: item.status === 'on-time' ? '#34d399' : '#fbbf24',
                            fontWeight: 600,
                          }}
                        >
                          {item.status === 'on-time' ? 'On-Time' : 'Grace'}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          color: '#e2e8f0',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.messageText}
                      </div>

                      {/* Teams Reaction Badges */}
                      <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#94a3b8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          👍 1
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#94a3b8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          ❤️
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Absentees Alert Notice Inside Chat Feed */}
              {scannedData?.missingTrainees?.map((m: any, idx: number) => (
                <div
                  key={`absent-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px dashed rgba(239, 68, 68, 0.35)',
                  }}
                >
                  <AlertTriangle size={18} color="#ef4444" />
                  <div style={{ flex: 1, fontSize: 12, color: '#fca5a5' }}>
                    <strong>{m.traineeName}</strong> — No Good Morning message detected by cutoff.
                  </div>
                  <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                    Absent / Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: Date History Archive (Full Historical Timeline) ── */}
        {activeTab === 'history' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                Teams Daily Attendance & Good Morning Archive
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                Historical log of 9:00 AM Teams logins for {selectedBatch === '4' ? 'Batch 4 (NYB Technical Group - IV)' : 'Batch 3 (NYB Technical Group - III)'}.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableDates.map((item: any) => {
                const isSelected = selectedDate === item.date;
                return (
                  <div
                    key={`${item.date}-${item.batch}`}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(91, 95, 199, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1.5px solid #5B5FC7' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: isSelected ? '#5B5FC7' : 'rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ fontSize: 14, color: '#f8fafc' }}>
                            {item.displayDate}
                          </strong>
                          {isSelected && (
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#5B5FC7', color: '#fff', fontWeight: 700 }}>
                              Active Selection
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                          Channel: {item.channel}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: item.hasAbsentees ? '#fbbf24' : '#34d399' }}>
                          {item.punchedCount}/{item.totalTrainees} Present
                        </div>
                        <span style={{ fontSize: 11, color: item.hasAbsentees ? '#f87171' : '#64748b' }}>
                          {item.hasAbsentees ? `${item.absentCount} Absent` : '100% On-Time 🎉'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.date);
                          handleScanLogins(selectedBatch, item.date);
                          setActiveTab('scan');
                          toastInfo('Date Loaded', `Viewing Teams attendance for ${item.displayDate}`);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          background: isSelected ? 'linear-gradient(135deg, #5B5FC7, #444791)' : 'rgba(255, 255, 255, 0.08)',
                          border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>Inspect Date</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: Paste Teams Chat ── */}
        {activeTab === 'paste' && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  Paste Microsoft Teams Chat Log
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                  Paste morning chat messages for <strong style={{ color: '#38bdf8' }}>{scannedData?.displayDate || selectedDate}</strong> directly from Teams.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (navigator?.clipboard?.readText) {
                        const text = await navigator.clipboard.readText();
                        if (text && text.trim().length > 5) {
                          setRawChatText(text);
                          toastSuccess('Pasted from Clipboard', `Loaded ${text.split('\n').length} lines from Teams.`);
                        } else {
                          toastInfo('Clipboard Empty', 'Please copy chat messages from Teams first.');
                        }
                      } else {
                        toastInfo('Clipboard Unavailable', 'Please press Ctrl+V into the text box below.');
                      }
                    } catch {
                      toastInfo('Permission Needed', 'Please press Ctrl+V to paste into the text box.');
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  }}
                  title="Auto-paste text currently copied to your clipboard"
                >
                  <Copy size={13} />
                  <span>📋 Paste from Clipboard</span>
                </button>
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
            </div>

            <textarea
              value={rawChatText}
              onChange={(e) => setRawChatText(e.target.value)}
              placeholder={`Paste messages from Microsoft Teams here, for example:\nTejeswar Rao 09:00\nGood Morning Team\n\nAlthaf Syed 09:00\nGood Morning Team`}
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
                <span>{applying ? 'Parsing & Updating...' : `Parse & Sync to ${scannedData?.displayDate || selectedDate}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 5: Webhook & Channel Config ── */}
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
                placeholder="NYB Technical Group - III"
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
                <li>Open Microsoft Teams &rarr; Go to your Cohort Channel (e.g. <em>NYB Technical Group - III</em>).</li>
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
            <span>M365 Tenant: Navayuva Bharathi Infotech 703 • Active Date: {scannedData?.displayDate || selectedDate}</span>
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
