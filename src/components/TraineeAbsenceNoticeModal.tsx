'use client';

import React, { useState, useEffect } from 'react';
import {
  X, AlertTriangle, Send, Copy, Check, Mail, ExternalLink, Download, Clock
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface TraineeAbsenceNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: {
    traineeId?: string;
    traineeName: string;
    traineeEmail?: string;
    batchNumber?: string;
  } | null;
  date?: string;
  onNoticeSent?: () => void;
}

export default function TraineeAbsenceNoticeModal({
  isOpen,
  onClose,
  trainee,
  date = new Date().toISOString().split('T')[0],
  onNoticeSent,
}: TraineeAbsenceNoticeModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [customText, setCustomText] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emlData, setEmlData] = useState<string | null>(null);

  const firstName = trainee?.traineeName
    ? trainee.traineeName.trim().split(' ')[0]
    : 'Trainee';

  // Default text exactly as specified by user
  const defaultBody = `Hello ${firstName},
I noticed that you have not logged in today, and there has been no Good Morning message from your end in the group as part of the daily login process.
You also appear to be away, and I have not received any leave request or prior communication regarding your absence today.
Clarify the reason for your absence and ensure that the daily login process is followed consistently going forward`;

  useEffect(() => {
    if (trainee) {
      setCustomText(defaultBody);
      setEmlData(null);
    }
  }, [trainee, firstName]);

  if (!isOpen || !trainee) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    toastSuccess('Copied to Clipboard', 'Notice ready to paste in WhatsApp/Teams chat.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadEml = () => {
    const subject = `⚠️ Clarification Required: Daily Login & Absence Notice (${date}) — ${trainee.traineeName}`;
    const emlContent = [
      'X-Unsent: 1',
      `To: ${trainee.traineeEmail || 'trainee@nybinfotech.com'}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      customText,
    ].join('\r\n');

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Absence_Notice_${firstName}_${date}.eml`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess('EML Draft Downloaded', 'Opens directly in Microsoft Outlook.');
  };

  const openWebMail = (provider: 'gmail' | 'outlook') => {
    const subject = encodeURIComponent(`⚠️ Clarification Required: Daily Login & Absence Notice (${date}) — ${trainee.traineeName}`);
    const body = encodeURIComponent(customText);
    const to = encodeURIComponent(trainee.traineeEmail || '');

    if (provider === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`, '_blank');
    } else {
      window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${body}`, '_blank');
    }
  };

  const handleSendNotice = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/attendance/draft-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: trainee.traineeId,
          traineeName: trainee.traineeName,
          traineeEmail: trainee.traineeEmail,
          batch: trainee.batchNumber || '3',
          date,
          customNotice: customText,
          sendDirectEmail: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess('Absence Notice Processed', data.emailStatus || `Notice logged for ${trainee.traineeName}.`);
        onNoticeSent?.();
        onClose();
      } else {
        toastError('Failed to Process Notice', data.error || 'Could not send notice.');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with attendance notice service.');
    } finally {
      setSending(false);
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
          maxWidth: 640,
          background: '#0d1322',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.15)',
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
            padding: '18px 24px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.1))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                9:00 AM Absence & Login Clarification Notice
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                Recipient: <strong style={{ color: '#f1f5f9' }}>{trainee.traineeName}</strong> ({trainee.traineeEmail || 'No email'})
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Policy Info Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: 16,
              fontSize: 12,
              color: '#fbbf24',
            }}
          >
            <Clock size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Punctuality Protocol:</strong> Expected login is <strong>9:00 AM</strong>. Trainee exceeded the 15–20 minute grace period without group check-in or leave request.
            </span>
          </div>

          {/* Email Body Editor */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                Draft Notice Content:
              </label>
              <span style={{ fontSize: 11, color: '#64748b' }}>Exact requested NYB template</span>
            </div>
            <textarea
              rows={6}
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Channel Shortcuts */}
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
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
              title="Copy message to paste into WhatsApp, Teams, or Slack group"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Notice' : 'Copy Notice Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => openWebMail('gmail')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
            >
              <Mail size={13} color="#ea4335" />
              <span>Gmail Web</span>
            </button>

            <button
              type="button"
              onClick={() => openWebMail('outlook')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
            >
              <ExternalLink size={13} color="#0284c7" />
              <span>Outlook Web</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadEml}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
              title="Download pre-addressed .eml draft file for Outlook desktop"
            >
              <Download size={13} />
              <span>Download .eml</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Logs notice timestamp to trainee attendance registry
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendNotice}
              disabled={sending}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                gap: 6,
              }}
            >
              {sending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Absence Notice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
