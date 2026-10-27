'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Mail,
  FileSpreadsheet,
  Eye,
  EyeOff,
  CheckCircle2,
  Save,
  X,
  ExternalLink,
  Lock,
  Server,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function CredentialsSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [batch, setBatch] = useState('3');
  const [excelFilename, setExcelFilename] = useState('Technical Team batch-3_Daily_Status_Report.xlsx');
  const [emailProvider, setEmailProvider] = useState<'both' | 'gmail' | 'outlook' | 'custom'>('both');

  // Dual Credentials
  const [gmailUser, setGmailUser] = useState('nafisakhanampathan65@gmail.com');
  const [gmailPass, setGmailPass] = useState('');
  const [outlookUser, setOutlookUser] = useState('nafisa.khanam@nybinfotech.com');
  const [outlookPass, setOutlookPass] = useState('');

  // Custom IMAP / SMTP options
  const [imapHost, setImapHost] = useState('outlook.office365.com');
  const [imapPort, setImapPort] = useState(993);
  const [smtpHost, setSmtpHost] = useState('smtp.office365.com');
  const [smtpPort, setSmtpPort] = useState(587);

  const [excelPassword, setExcelPassword] = useState('');
  const [tlEmail, setTlEmail] = useState('nafisa.khanam@nybinfotech.com');
  const [sharepointUrl, setSharepointUrl] = useState(
    'https://navayuvabharatinfotech703-my.sharepoint.com/:x:/g/personal/pathan_nafisakhanam_nybinfotech_com/Technical_Team_batch-3_Daily_Status_Report'
  );

  const [showGmailPass, setShowGmailPass] = useState(false);
  const [showOutlookPass, setShowOutlookPass] = useState(false);
  const [showExcelPass, setShowExcelPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/settings/credentials')
        .then((r) => r.json())
        .then((data) => {
          if (data.credentials) {
            if (data.credentials.emailProvider) {
              setEmailProvider(data.credentials.emailProvider);
            }
            if (data.credentials.gmailUser) setGmailUser(data.credentials.gmailUser);
            if (data.credentials.gmailPass) setGmailPass(data.credentials.gmailPass);
            if (data.credentials.outlookUser) setOutlookUser(data.credentials.outlookUser);
            if (data.credentials.outlookPass) setOutlookPass(data.credentials.outlookPass);

            if (data.credentials.imapHost) setImapHost(data.credentials.imapHost);
            if (data.credentials.imapPort) setImapPort(Number(data.credentials.imapPort) || 993);
            if (data.credentials.smtpHost) setSmtpHost(data.credentials.smtpHost);
            if (data.credentials.smtpPort) setSmtpPort(Number(data.credentials.smtpPort) || 587);

            setExcelPassword(data.credentials.excelPassword || '');
            setTlEmail(data.credentials.tlEmail || 'nafisa.khanam@nybinfotech.com');
            setSharepointUrl(data.credentials.sharepointUrl || '');
            if (data.credentials.batch) setBatch(data.credentials.batch);
            if (data.credentials.excelFilename) setExcelFilename(data.credentials.excelFilename);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleProviderSelect = (provider: 'both' | 'gmail' | 'outlook' | 'custom') => {
    setEmailProvider(provider);
    if (provider === 'gmail') {
      setImapHost('imap.gmail.com');
      setImapPort(993);
      setSmtpHost('smtp.gmail.com');
      setSmtpPort(465);
    } else if (provider === 'outlook' || provider === 'both') {
      setImapHost('outlook.office365.com');
      setImapPort(993);
      setSmtpHost('smtp.office365.com');
      setSmtpPort(587);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanBatch = String(batch).replace(/batch/gi, '').trim() || '3';
      const cleanFilename = excelFilename.trim() || `Technical Team batch-${cleanBatch}_Daily_Status_Report.xlsx`;

      const primaryUser = emailProvider === 'gmail' ? gmailUser : outlookUser;
      const primaryPass = emailProvider === 'gmail' ? gmailPass : (outlookPass || gmailPass);

      const res = await fetch('/api/settings/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: cleanBatch,
          excelFilename: cleanFilename,
          emailProvider,
          gmailUser,
          gmailPass,
          outlookUser,
          outlookPass,
          emailUser: primaryUser,
          emailPass: primaryPass,
          imapHost,
          imapPort,
          smtpHost,
          smtpPort,
          excelPassword,
          tlEmail,
          sharepointUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess('Coordinator Workspace Saved', `Batch ${cleanBatch} configured with ${emailProvider === 'both' ? 'Gmail & Outlook Dual-Sync' : emailProvider.toUpperCase()}!`);
        onClose();
      } else {
        toastError('Save Error', data.error || 'Could not save credentials');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with credentials service');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0d1322',
          border: '1.5px solid rgba(14, 165, 233, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          padding: 26,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <Lock size={18} color="var(--cyan-light)" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Excel & Mail Security Credentials
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Configured & securely attached to NexusTrack Operations
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={16} />
          </button>
        </div>

        {/* Security Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background:
                emailProvider === 'both'
                  ? 'rgba(14, 165, 233, 0.12)'
                  : emailProvider === 'outlook'
                  ? 'rgba(0, 120, 212, 0.1)'
                  : 'rgba(16, 185, 129, 0.08)',
              border:
                emailProvider === 'both'
                  ? '1.5px solid rgba(14, 165, 233, 0.5)'
                  : emailProvider === 'outlook'
                  ? '1px solid rgba(0, 120, 212, 0.4)'
                  : '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle2
              size={18}
              color={
                emailProvider === 'both'
                  ? 'var(--cyan-light)'
                  : emailProvider === 'outlook'
                  ? '#38bdf8'
                  : 'var(--emerald)'
              }
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    emailProvider === 'both'
                      ? 'var(--cyan-light)'
                      : emailProvider === 'outlook'
                      ? '#7dd3fc'
                      : 'var(--emerald-light)',
                }}
              >
                {emailProvider === 'both'
                  ? 'Dual Mailbox Connected'
                  : emailProvider === 'outlook'
                  ? 'Outlook / M365 Attached'
                  : emailProvider === 'custom'
                  ? 'Custom IMAP Attached'
                  : 'Gmail SMTP Attached'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {emailProvider === 'both'
                  ? 'Gmail + Outlook (Dual Sync Active)'
                  : emailProvider === 'outlook'
                  ? 'outlook.office365.com:993'
                  : 'imap.gmail.com:993'}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle2 size={18} color="var(--emerald)" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-light)' }}>
                Draft-Only Safety Enforced
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                No auto-replies sent • Saved in Drafts
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Batch Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={13} color="var(--violet-light)" /> Assigned Batch
              </label>
              <input
                className="input"
                value={batch}
                onChange={(e) => {
                  const val = e.target.value;
                  setBatch(val);
                  setExcelFilename(`Technical Team batch-${val || '3'}_Daily_Status_Report.xlsx`);
                }}
                placeholder="e.g. 3 or 5"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
              />
            </div>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileSpreadsheet size={13} color="var(--cyan-light)" /> Target Excel Workbook Name
              </label>
              <input
                className="input"
                value={excelFilename}
                onChange={(e) => setExcelFilename(e.target.value)}
                placeholder="Technical Team batch-3_Daily_Status_Report.xlsx"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
              />
            </div>
          </div>

          {/* Email Provider Selector - 4 Options */}
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={13} color="var(--cyan-light)" /> Mail Service Mode
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {emailProvider === 'both'
                  ? 'Dual Mode: Gmail + Outlook Cloud Monitored'
                  : emailProvider === 'outlook'
                  ? 'Microsoft 365 / Outlook Only'
                  : emailProvider === 'gmail'
                  ? 'Google Workspace / Gmail Only'
                  : 'Custom Server'}
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleProviderSelect('both')}
                style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: emailProvider === 'both' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: emailProvider === 'both' ? '2px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: emailProvider === 'both' ? 'var(--cyan-light)' : 'var(--text-muted)',
                }}
              >
                <Sparkles size={14} color={emailProvider === 'both' ? 'var(--cyan-light)' : 'var(--text-muted)'} />
                <span>Both (Dual Sync)</span>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('gmail')}
                style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: emailProvider === 'gmail' ? 'rgba(234, 67, 53, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: emailProvider === 'gmail' ? '1.5px solid rgba(234, 67, 53, 0.65)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: emailProvider === 'gmail' ? '#ff7b72' : 'var(--text-muted)',
                }}
              >
                <span>📮 Gmail</span>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('outlook')}
                style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: emailProvider === 'outlook' ? 'rgba(0, 120, 212, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: emailProvider === 'outlook' ? '1.5px solid #0078d4' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: emailProvider === 'outlook' ? '#38bdf8' : 'var(--text-muted)',
                }}
              >
                <span>💼 Outlook</span>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('custom')}
                style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: emailProvider === 'custom' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: emailProvider === 'custom' ? '1.5px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: emailProvider === 'custom' ? 'var(--violet-light)' : 'var(--text-muted)',
                }}
              >
                <Server size={13} />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Informational Guidance Banner */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 11.5,
              lineHeight: 1.5,
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              color: '#cbd5e1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <strong style={{ color: 'var(--cyan-light)' }}>
                {emailProvider === 'both' ? '⚡ Dual-Mailbox Synchronization Active:' : 'Mailbox Status:'}
              </strong>
              <a
                href="https://outlook.cloud.microsoft/mail/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#38bdf8',
                  fontSize: 11,
                  textDecoration: 'underline',
                }}
              >
                Open outlook.cloud.microsoft <ExternalLink size={10} />
              </a>
            </div>
            <div>
              • <strong>Gmail:</strong> <code style={{ color: '#fca5a5' }}>{gmailUser}</code> (imap.gmail.com:993)
            </div>
            <div>
              • <strong>Outlook Cloud:</strong> <code style={{ color: '#7dd3fc' }}>{outlookUser}</code> (outlook.office365.com:993)
            </div>
            <div style={{ marginTop: 5, padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--emerald-light)' }}>
              🛡️ <strong>Draft-Only Policy:</strong> Trainees can submit to <strong>either</strong> Gmail or Outlook. Discrepancy notices are automatically placed into your Outlook/Mailbox <strong>Drafts</strong> folder. No auto-replies are ever sent out!
            </div>
          </div>

          {/* DUAL MODE INPUTS (Gmail + Outlook side by side or stacked) */}
          {(emailProvider === 'both' || emailProvider === 'gmail') && (
            <div style={{ padding: 14, borderRadius: 8, background: 'rgba(234, 67, 53, 0.05)', border: '1px solid rgba(234, 67, 53, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 15 }}>📮</span>
                <strong style={{ fontSize: 13, color: '#ff7b72' }}>Google Workspace & Gmail Configuration</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" style={{ fontSize: 11 }}>Gmail Address (GMAIL_USER)</label>
                  <input
                    className="input"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    placeholder="coordinator@gmail.com"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 11 }}>Google App Password (16-char)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type={showGmailPass ? 'text' : 'password'}
                      value={gmailPass}
                      onChange={(e) => setGmailPass(e.target.value)}
                      placeholder="16-character google app password"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 12, paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGmailPass(!showGmailPass)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 2,
                      }}
                    >
                      {showGmailPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(emailProvider === 'both' || emailProvider === 'outlook') && (
            <div style={{ padding: 14, borderRadius: 8, background: 'rgba(0, 120, 212, 0.06)', border: '1px solid rgba(0, 120, 212, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15 }}>💼</span>
                  <strong style={{ fontSize: 13, color: '#38bdf8' }}>Microsoft 365 Cloud (outlook.cloud.microsoft)</strong>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>IMAP: outlook.office365.com:993</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" style={{ fontSize: 11 }}>Outlook / M365 Email (OUTLOOK_USER)</label>
                  <input
                    className="input"
                    value={outlookUser}
                    onChange={(e) => setOutlookUser(e.target.value)}
                    placeholder="nafisa.khanam@nybinfotech.com"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 11 }}>Microsoft Password / App Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type={showOutlookPass ? 'text' : 'password'}
                      value={outlookPass}
                      onChange={(e) => setOutlookPass(e.target.value)}
                      placeholder="Microsoft App Password"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 12, paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOutlookPass(!showOutlookPass)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 2,
                      }}
                    >
                      {showOutlookPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Server Configuration (if Custom selected) */}
          {emailProvider === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: 10 }}>
              <div>
                <label className="label" style={{ fontSize: 11 }}>IMAP Host</label>
                <input
                  className="input"
                  value={imapHost}
                  onChange={(e) => setImapHost(e.target.value)}
                  placeholder="imap.domain.com"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: 11 }}>IMAP Port</label>
                <input
                  className="input"
                  type="number"
                  value={imapPort}
                  onChange={(e) => setImapPort(Number(e.target.value))}
                  placeholder="993"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: 11 }}>SMTP Host</label>
                <input
                  className="input"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.domain.com"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: 11 }}>SMTP Port</label>
                <input
                  className="input"
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  placeholder="587"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>
            </div>
          )}

          {/* Excel Password */}
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileSpreadsheet size={13} color="var(--emerald-light)" /> Excel & SharePoint Sheet Password (EXCEL_PASSWORD)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showExcelPass ? 'text' : 'password'}
                value={excelPassword}
                onChange={(e) => setExcelPassword(e.target.value)}
                placeholder="Password for Excel report protection"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowExcelPass(!showExcelPass)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                {showExcelPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Team Lead Email */}
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} color="var(--violet-light)" /> Team Lead (TL) Recipient Email (TL_EMAIL)
            </label>
            <input
              className="input"
              value={tlEmail}
              onChange={(e) => setTlEmail(e.target.value)}
              placeholder="nafisa.khanam@nybinfotech.com"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
            />
          </div>

          {/* SharePoint URL */}
          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={13} color="var(--text-muted)" /> Official SharePoint Excel Online Link
            </label>
            <input
              className="input"
              value={sharepointUrl}
              onChange={(e) => setSharepointUrl(e.target.value)}
              placeholder="https://...sharepoint.com/:x:/..."
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <button onClick={onClose} className="btn btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save & Attach to NexusTrack'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
