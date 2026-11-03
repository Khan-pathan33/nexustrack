'use client';

import React, { useState, useMemo } from 'react';
import {
  X, AlertTriangle, Send, Copy, Check, Mail, Bell, ExternalLink, Download
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export interface MissingTraineeItem {
  id?: string;
  name: string;
  email: string;
  status?: string;
  attendance?: string;
}

interface MissingTraineesModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
  sheetDate: string;
  allTrainees: MissingTraineeItem[];
  submittedNames: string[];
}

export default function MissingTraineesModal({
  isOpen,
  onClose,
  batchNumber,
  sheetDate,
  allTrainees,
  submittedNames,
}: MissingTraineesModalProps) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  // Detect which trainees have NOT submitted
  const detectedMissing = useMemo(() => {
    const subSet = new Set(submittedNames.map(n => n.toLowerCase().trim()));
    return allTrainees.filter(t => !subSet.has(t.name.toLowerCase().trim()));
  }, [allTrainees, submittedNames]);

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync selection when detectedMissing changes
  React.useEffect(() => {
    setSelectedNames(detectedMissing.map(t => t.name));
  }, [detectedMissing]);

  if (!isOpen) return null;

  const toggleSelect = (name: string) => {
    setSelectedNames(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const selectAll = () => {
    if (selectedNames.length === detectedMissing.length) {
      setSelectedNames([]);
    } else {
      setSelectedNames(detectedMissing.map(t => t.name));
    }
  };

  const selectedTrainees = detectedMissing.filter(t => selectedNames.includes(t.name));

  const copyForGroupChat = () => {
    const namesList = selectedTrainees.map((t, idx) => `${idx + 1}. ${t.name}`).join('\n');
    const text = `📢 *DAILY STATUS REPORT REMINDER — BATCH ${batchNumber}*
📅 *Date:* ${sheetDate}
⏰ *Cutoff Time:* 6:00 PM

The following trainees have not yet submitted their Daily Status Report and GitHub code for today:
${namesList || 'None selected'}

⚠️ Please submit your daily reports immediately to avoid attendance and performance mark deductions.
${customNote ? `\n💬 *Note from TL:* ${customNote}` : ''}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toastSuccess('Copied to Clipboard', 'Reminder text ready to paste in WhatsApp/Teams group.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmailReminder = async () => {
    if (selectedTrainees.length === 0) {
      toastError('No Trainees Selected', 'Select at least one trainee to nudge.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/daily-tracker/remind-missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchNumber,
          sheetDate,
          missingTrainees: selectedTrainees,
          customMessage: customNote,
          sendEmailDirectly: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess(
          `🔔 Nudge Recorded for ${selectedTrainees.length} Trainee(s)`,
          data.emailStatus || 'Email notification triggered.'
        );
      } else {
        toastError('Reminder Notice Failed', data.error || 'Could not send reminder');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with reminder service.');
    } finally {
      setSending(false);
    }
  };

  const openWebMailCompose = (provider: 'gmail' | 'outlook') => {
    const emails = selectedTrainees.map(t => t.email).filter(Boolean).join(',');
    const subject = encodeURIComponent(`URGENT: Daily Status Report Pending (${sheetDate}) — Batch ${batchNumber}`);
    const body = encodeURIComponent(
      `Dear Trainees,\n\nThis is a friendly reminder that your Daily Status Report for ${sheetDate} is currently pending.\nPlease ensure you submit your email with planned, completed, pending tasks and code pushed to GitHub before 6:00 PM.\n\n${customNote ? `Note: ${customNote}\n\n` : ''}Regards,\nTeam Lead Desk`
    );

    if (provider === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emails)}&su=${subject}&body=${body}`, '_blank');
    } else {
      window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emails)}&subject=${subject}&body=${body}`, '_blank');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: '#0d1322',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'fadeUp 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(225, 29, 72, 0.1))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f8fafc' }}>
                Nudge Missing Trainees
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                Batch {batchNumber} • Date: {sheetDate} • {detectedMissing.length} of {allTrainees.length} pending
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
              borderRadius: 6,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {detectedMissing.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
              <h4 style={{ margin: '0 0 6px 0', color: '#10b981', fontSize: 16 }}>All Trainees Submitted!</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>
                Every enrolled trainee in Batch {batchNumber} has submitted their daily report for {sheetDate}.
              </p>
            </div>
          ) : (
            <>
              {/* Status Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  padding: '10px 14px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fbbf24' }}>
                  <AlertTriangle size={15} />
                  <span>
                    <strong>{detectedMissing.length} Trainees</strong> haven't submitted reports today.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={selectAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {selectedNames.length === detectedMissing.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Trainee Checkbox List */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 10,
                  marginBottom: 20,
                  maxHeight: 220,
                  overflowY: 'auto',
                  paddingRight: 4,
                }}
              >
                {detectedMissing.map(t => {
                  const isChecked = selectedNames.includes(t.name);
                  return (
                    <div
                      key={t.name}
                      onClick={() => toggleSelect(t.name)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: isChecked
                          ? '1px solid rgba(245, 158, 11, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isChecked
                          ? 'rgba(245, 158, 11, 0.12)'
                          : 'rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: isChecked ? '1px solid #f59e0b' : '1px solid #475569',
                            background: isChecked ? '#f59e0b' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isChecked && <Check size={13} color="#000" strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{t.email || 'No email registered'}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        Pending
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Note Input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  Custom TL Message (Appended to reminder notice):
                </label>
                <textarea
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  placeholder="e.g. Ensure you push your responsive Flexbox layout and include the GitHub commit URL."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#f8fafc',
                    fontSize: 12,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Multi-Channel Action Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  type="button"
                  onClick={copyForGroupChat}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: 12,
                    gap: 6,
                    color: copied ? '#10b981' : '#cbd5e1',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                  title="Copy formatted summary to paste in WhatsApp, Teams, or Slack"
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied Announcement!' : 'Copy Group Announcement'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openWebMailCompose('gmail')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, gap: 6 }}
                >
                  <Mail size={14} color="#ea4335" />
                  <span>Open Gmail Web Compose</span>
                </button>

                <button
                  type="button"
                  onClick={() => openWebMailCompose('outlook')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, gap: 6 }}
                >
                  <ExternalLink size={14} color="#0284c7" />
                  <span>Open Outlook Web</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {selectedTrainees.length} trainee(s) selected
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              disabled={sending}
            >
              Close
            </button>
            {detectedMissing.length > 0 && (
              <button
                type="button"
                onClick={handleSendEmailReminder}
                disabled={sending || selectedTrainees.length === 0}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                }}
              >
                {sending ? (
                  <>Sending Reminders...</>
                ) : (
                  <>
                    <Send size={14} /> Send Reminder Notice
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
