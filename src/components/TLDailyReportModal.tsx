'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Send,
  FileSpreadsheet,
  Paperclip,
  X,
  ExternalLink,
  CheckCircle2,
  Download,
  Copy,
  Sparkles,
  Check,
  Eye,
  FileEdit,
  Code,
  Bookmark,
  Users,
} from 'lucide-react';
import {
  generateTLReportHTML,
  generateTLReportPlainText,
  DEFAULT_TL_RECIPIENTS,
  DEFAULT_TL_REPORT_DATA,
  buildDynamicTLReport,
  TLReportData,
} from '@/lib/weekly-curriculum';
import { useToast } from '@/components/Toast';

export default function TLDailyReportModal({
  isOpen,
  onClose,
  defaultRecipient = '',
  sheetDate = '28-10-2026',
  batchNumber = '3',
  rows = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  sheetDate?: string;
  batchNumber?: string | number;
  rows?: any[];
}) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'raw'>('preview');
  const [currentBatch, setCurrentBatch] = useState<string>(String(batchNumber || '3'));

  // Exact recipients from official Outlook screenshot
  const [toRecipients, setToRecipients] = useState(
    DEFAULT_TL_RECIPIENTS.to.join('; ')
  );
  const [ccRecipients, setCcRecipients] = useState(
    DEFAULT_TL_RECIPIENTS.cc.join('; ')
  );

  // Exact Subject: Status_Report_<date>:
  const [subject, setSubject] = useState(`Status_Report_${sheetDate}:`);

  // Report Content State — dynamically built based on the Curriculum Day and Trainees' working rows!
  const [reportData, setReportData] = useState<TLReportData>(() =>
    buildDynamicTLReport({
      date: sheetDate || '28-10-2026',
      batchNumber: batchNumber || '3',
      rows,
    })
  );

  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const [extraAttachments, setExtraAttachments] = useState<
    { filename: string; content: string; size: string }[]
  >([]);

  // Sync currentBatch when batchNumber prop changes
  useEffect(() => {
    if (batchNumber) {
      setCurrentBatch(String(batchNumber));
    }
  }, [batchNumber]);

  // Keep subject and data in sync when sheetDate, currentBatch, or rows changes
  useEffect(() => {
    if (sheetDate) {
      setSubject(`Status_Report_${sheetDate}:`);
      setReportData(
        buildDynamicTLReport({
          date: sheetDate,
          batchNumber: currentBatch,
          rows,
        })
      );
    }
  }, [sheetDate, currentBatch, rows]);

  // Generate HTML and PlainText
  const htmlContent = useMemo(() => {
    return generateTLReportHTML(reportData);
  }, [reportData]);

  const plainTextContent = useMemo(() => {
    return generateTLReportPlainText(reportData);
  }, [reportData]);

  if (!isOpen) return null;

  const downloadExcel = () => {
    if (currentBatch === 'both' || currentBatch === '3 & 4') {
      window.open(`/api/daily-tracker/export-excel?date=${sheetDate}&batch=3`, '_blank');
      setTimeout(() => {
        window.open(`/api/daily-tracker/export-excel?date=${sheetDate}&batch=4`, '_blank');
      }, 500);
      toastSuccess(
        'Both Batch Excel Reports Downloaded',
        'Technical Team batch-3 and batch-4 spreadsheets downloaded to your machine.'
      );
    } else {
      window.location.href = `/api/daily-tracker/export-excel?date=${sheetDate}&batch=${currentBatch}`;
      toastSuccess(
        'Excel Report Downloaded',
        `Technical Team batch-${currentBatch}_Daily_Status_Report.xlsx downloaded to your machine.`
      );
    }
  };

  const handleCopyFormattedTable = async () => {
    try {
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([plainTextContent], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
      await navigator.clipboard.write(data);
      setCopiedHtml(true);
      toastSuccess(
        'Formatted Table Copied!',
        'Exact Outlook table copied with borders & formatting. Press Ctrl+V in your Outlook compose window!'
      );
      setTimeout(() => setCopiedHtml(false), 3000);
    } catch {
      // Fallback to text copy
      navigator.clipboard.writeText(plainTextContent);
      toastInfo('Text Copied', 'Plain text copied to clipboard.');
    }
  };

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(plainTextContent);
    setCopiedText(true);
    toastSuccess('Plain Text Copied', 'Report text copied to clipboard.');
    setTimeout(() => setCopiedText(false), 3000);
  };

  const downloadDraftEml = () => {
    window.location.href = `/api/daily-tracker/export-draft-eml?date=${sheetDate}&batch=${currentBatch}`;
    toastSuccess(
      'Draft File Downloaded (.eml)',
      `Double-click Status_Report_${sheetDate}_Batch_${currentBatch}.eml to open directly in Outlook as a draft with the Excel file pre-attached!`
    );
  };

  // Open in Outlook Web Composer (https://outlook.cloud.microsoft/mail/)
  const openOutlookWeb = async () => {
    downloadExcel();
    await handleCopyFormattedTable();

    // Outlook Web deeplinks require comma-separated recipients, not semicolons
    const cleanTo = toRecipients.split(';').map((s) => s.trim()).filter(Boolean).join(',');
    const cleanCc = ccRecipients.split(';').map((s) => s.trim()).filter(Boolean).join(',');

    const encodedTo = encodeURIComponent(cleanTo);
    const encodedCc = encodeURIComponent(cleanCc);
    const encodedSubject = encodeURIComponent(subject);

    const outlookUrl = `https://outlook.cloud.microsoft/mail/deeplink/compose?to=${encodedTo}&cc=${encodedCc}&subject=${encodedSubject}`;
    window.open(outlookUrl, '_blank');

    toastSuccess(
      'Table Copied & Outlook Web Opened!',
      'Press Ctrl+V inside the message area to paste the full formatted table. The .xlsx file is downloaded to attach!'
    );
  };

  // Open in Gmail Web Composer
  const openGmailWeb = () => {
    downloadExcel();
    const encodedTo = encodeURIComponent(toRecipients);
    const encodedCc = encodeURIComponent(ccRecipients);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(plainTextContent);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&cc=${encodedCc}&su=${encodedSubject}&body=${encodedBody}`,
      '_blank'
    );
    toastInfo(
      'Excel Downloaded & Gmail Opened',
      'The Excel file is in your Downloads. Drag it into your Gmail compose window!'
    );
  };

  // Save Draft directly to Mailbox Drafts
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      const res = await fetch('/api/daily-tracker/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'draft',
          to: toRecipients,
          cc: ccRecipients,
          date: sheetDate,
          batch: currentBatch,
          subject: subject.trim(),
          html: htmlContent,
          message: plainTextContent,
          rows: rows && rows.length > 0 ? rows : undefined,
          extraAttachments: extraAttachments.map((att) => ({
            filename: att.filename,
            content: att.content,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess('Draft Saved to Mailbox!', data.message);
        if (!data.savedInMailbox) {
          openOutlookWeb();
        }
      } else {
        toastError('Draft Error', data.error || 'Could not save draft');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with mail service.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Send Email Directly with Excel Attached
  const handleSendEmail = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/daily-tracker/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          to: toRecipients,
          cc: ccRecipients,
          date: sheetDate,
          batch: currentBatch,
          subject: subject.trim(),
          html: htmlContent,
          message: plainTextContent,
          rows: rows && rows.length > 0 ? rows : undefined,
          extraAttachments: extraAttachments.map((att) => ({
            filename: att.filename,
            content: att.content,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess('Report Dispatched to Team Lead!', data.message);
        onClose();
      } else {
        toastError('Failed to Send', data.error || 'Could not send daily report to TL.');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with mail service.');
    } finally {
      setSending(false);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      setExtraAttachments((prev) => [
        ...prev,
        {
          filename: file.name,
          content: base64,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        },
      ]);
      toastSuccess('File Attached', `${file.name} added to attachments.`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0d1322',
          border: '1.5px solid rgba(14, 165, 233, 0.45)',
          borderRadius: 14,
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(0, 120, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 120, 212, 0.5)',
              }}
            >
              <Send size={19} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Team Lead (TL) Daily Status Report & Draft
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#38bdf8',
                    background: 'rgba(0, 120, 212, 0.2)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(0, 120, 212, 0.4)',
                  }}
                >
                  Outlook Exact Template
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Official 2-Column Table Format for Varaprasad Sir & Vineetha Mam
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Batch Selector Pills */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 3,
                background: 'rgba(0, 0, 0, 0.45)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                gap: 3,
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentBatch('3')}
                style={{
                  padding: '4px 11px',
                  borderRadius: 6,
                  border: 'none',
                  background: currentBatch === '3' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
                  color: currentBatch === '3' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Batch 3
              </button>
              <button
                type="button"
                onClick={() => setCurrentBatch('4')}
                style={{
                  padding: '4px 11px',
                  borderRadius: 6,
                  border: 'none',
                  background: currentBatch === '4' ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : 'transparent',
                  color: currentBatch === '4' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Batch 4
              </button>
              <button
                type="button"
                onClick={() => setCurrentBatch('both')}
                style={{
                  padding: '4px 11px',
                  borderRadius: 6,
                  border: 'none',
                  background:
                    currentBatch === 'both' || currentBatch === '3 & 4'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'transparent',
                  color:
                    currentBatch === 'both' || currentBatch === '3 & 4'
                      ? '#ffffff'
                      : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Both (3 & 4)
              </button>
            </div>

            <button onClick={onClose} className="btn btn-ghost btn-sm">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {/* Metadata Grid (To, Cc, Subject) */}
          <div
            style={{
              padding: 16,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan-light)' }}>To:</span>
              <input
                className="input"
                value={toRecipients}
                onChange={(e) => setToRecipients(e.target.value)}
                placeholder="varaprasad.vellanki@nybinfotech.com; vineetha.sunil@nybinfotech.com"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet-light)' }}>Cc:</span>
              <input
                className="input"
                value={ccRecipients}
                onChange={(e) => setCcRecipients(e.target.value)}
                placeholder="chandramohan.reddy@nybinfotech.com; sushma.pedapudi@nybinfotech.com"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-light)' }}>Subject:</span>
              <input
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Status_Report_${sheetDate}:`}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Attached Workbook Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 10,
              background:
                currentBatch === '4'
                  ? 'rgba(147, 51, 234, 0.12)'
                  : currentBatch === 'both'
                  ? 'rgba(16, 185, 129, 0.14)'
                  : 'rgba(2, 132, 199, 0.12)',
              border:
                currentBatch === '4'
                  ? '1.5px solid rgba(147, 51, 234, 0.5)'
                  : currentBatch === 'both'
                  ? '1.5px solid rgba(16, 185, 129, 0.5)'
                  : '1.5px solid rgba(2, 132, 199, 0.45)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              boxShadow:
                currentBatch === '4'
                  ? '0 4px 16px rgba(147, 51, 234, 0.18)'
                  : currentBatch === 'both'
                  ? '0 4px 16px rgba(16, 185, 129, 0.18)'
                  : '0 4px 16px rgba(2, 132, 199, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background:
                    currentBatch === '4'
                      ? 'linear-gradient(135deg, #7e22ce, #6b21a8)'
                      : currentBatch === 'both'
                      ? 'linear-gradient(135deg, #059669, #047857)'
                      : 'linear-gradient(135deg, #107c41, #0e5c30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>
                    {currentBatch === 'both'
                      ? 'Technical Team batch-3 & batch-4 spreadsheets'
                      : `Technical Team batch-${currentBatch}_Daily_Status_Report.xlsx`}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background:
                        currentBatch === '4'
                          ? 'rgba(147, 51, 234, 0.35)'
                          : currentBatch === 'both'
                          ? 'rgba(16, 185, 129, 0.35)'
                          : 'rgba(2, 132, 199, 0.3)',
                      color:
                        currentBatch === '4'
                          ? '#c084fc'
                          : currentBatch === 'both'
                          ? '#34d399'
                          : '#38bdf8',
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      border:
                        currentBatch === '4'
                          ? '1px solid rgba(147, 51, 234, 0.6)'
                          : currentBatch === 'both'
                          ? '1px solid rgba(16, 185, 129, 0.6)'
                          : '1px solid rgba(2, 132, 199, 0.5)',
                    }}
                  >
                    📎 {currentBatch === 'both' ? '2 WORKBOOKS PRE-ATTACHED' : `PRE-ATTACHED (BATCH ${currentBatch})`}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color:
                      currentBatch === '4'
                        ? '#e9d5ff'
                        : currentBatch === 'both'
                        ? '#a7f3d0'
                        : '#bae6fd',
                    marginTop: 2,
                  }}
                >
                  {currentBatch === 'both'
                    ? '✓ Both Official 13-Column Workbooks Attached automatically (batch-3 & batch-4 .xlsx with all October sheets & live trainee evaluations)'
                    : `✓ Official 13-Column Spreadsheet Attached automatically for Batch ${currentBatch} (with all October sheets & live trainee evaluations)`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={downloadExcel}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: 11.5,
                color:
                  currentBatch === '4'
                    ? '#c084fc'
                    : currentBatch === 'both'
                    ? '#34d399'
                    : '#38bdf8',
                borderColor:
                  currentBatch === '4'
                    ? 'rgba(147, 51, 234, 0.4)'
                    : currentBatch === 'both'
                    ? 'rgba(16, 185, 129, 0.4)'
                    : 'rgba(2, 132, 199, 0.4)',
                background:
                  currentBatch === '4'
                    ? 'rgba(147, 51, 234, 0.12)'
                    : currentBatch === 'both'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(2, 132, 199, 0.1)',
                gap: 6,
              }}
              title="Download local copy of the attached .xlsx workbook(s)"
            >
              <Download size={13} /> {currentBatch === 'both' ? 'Download Both .xlsx' : 'Download .xlsx Copy'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                background: activeTab === 'preview' ? 'rgba(14, 165, 233, 0.2)' : 'none',
                border: activeTab === 'preview' ? '1px solid var(--cyan)' : '1px solid transparent',
                color: activeTab === 'preview' ? 'var(--cyan-light)' : 'var(--text-muted)',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Eye size={14} /> Outlook Web Table Preview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              style={{
                background: activeTab === 'edit' ? 'rgba(14, 165, 233, 0.2)' : 'none',
                border: activeTab === 'edit' ? '1px solid var(--cyan)' : '1px solid transparent',
                color: activeTab === 'edit' ? 'var(--cyan-light)' : 'var(--text-muted)',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileEdit size={14} /> Edit Tasks & Sections
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              style={{
                background: activeTab === 'raw' ? 'rgba(14, 165, 233, 0.2)' : 'none',
                border: activeTab === 'raw' ? '1px solid var(--cyan)' : '1px solid transparent',
                color: activeTab === 'raw' ? 'var(--cyan-light)' : 'var(--text-muted)',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Code size={14} /> Plain Text Format
            </button>
          </div>

          {/* TAB 1: OUTLOOK WEB PREVIEW (Exact match to screenshots) */}
          {activeTab === 'preview' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                padding: '24px 28px',
                color: '#000000',
                fontFamily: 'Calibri, Arial, sans-serif',
                fontSize: 13.5,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid #d1d5db',
              }}
            >

              {/* Email Content Header */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: '0 0 12px 0', fontSize: 14 }}>Hi Varaprasad Sir and Vineetha Mam,</p>
                <p style={{ margin: '0 0 12px 0', fontSize: 14 }}>Good Evening,</p>
                <p style={{ margin: '0 0 16px 0', fontSize: 14 }}>Please find below the task summary for today:</p>
              </div>

              {/* Exact 2-Column Table */}
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1.5px solid #000000',
                  fontSize: 13,
                  margin: '14px 0 20px 0',
                }}
              >
                <thead>
                  <tr style={{ background: '#f2f2f2' }}>
                    <th
                      style={{
                        border: '1px solid #000000',
                        padding: '8px 12px',
                        width: '28%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Technology
                    </th>
                    <th
                      style={{
                        border: '1px solid #000000',
                        padding: '8px 12px',
                        width: '72%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {reportData.technology}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      Planned Tasks (Today)
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '14px 16px',
                        verticalAlign: 'top',
                        lineHeight: 1.55,
                      }}
                    >
                      <strong>1.Batch-{reportData.batchNumber}:-</strong>
                      <ul style={{ margin: '6px 0 0 20px', padding: 0, listStyleType: 'disc' }}>
                        {reportData.plannedTasksToday.map((task, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      Completed Tasks (Today)
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '14px 16px',
                        verticalAlign: 'top',
                        lineHeight: 1.55,
                      }}
                    >
                      <strong>1.Batch-{reportData.batchNumber}:-</strong>
                      <ul style={{ margin: '6px 0 0 20px', padding: 0, listStyleType: 'disc' }}>
                        {reportData.completedTasksToday.map((task, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      Pending Tasks (Today)
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {reportData.pendingTasksToday}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      Planned Tasks (Next Day)
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '14px 16px',
                        verticalAlign: 'top',
                        lineHeight: 1.55,
                      }}
                    >
                      <strong>1.Batch-{reportData.batchNumber}:-</strong>
                      <ul style={{ margin: '6px 0 0 20px', padding: 0, listStyleType: 'disc' }}>
                        {reportData.plannedTasksNextDay.map((task, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      Challenges / Blockers if any
                    </td>
                    <td
                      style={{
                        border: '1px solid #000000',
                        padding: '12px 14px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {reportData.challenges}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ margin: '0 0 18px 0', fontSize: 14 }}>
                I have attached the work progress files for your reference.
              </p>

              {/* Official Signature */}
              <div style={{ marginTop: 20, fontSize: 13.5, lineHeight: 1.45 }}>
                <div>Thanks &amp; Regards,</div>
                <div style={{ fontWeight: 'bold', marginTop: 3 }}>{reportData.senderName}</div>
                <div>{reportData.senderRole}</div>
                <div>
                  <a href={`mailto:${reportData.senderEmail}`} style={{ color: '#0078d4', textDecoration: 'none' }}>
                    {reportData.senderEmail}
                  </a>
                </div>
                <div>
                  <a
                    href={reportData.senderLinkedIn}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#0078d4', textDecoration: 'underline' }}
                  >
                    LinkedIn: {reportData.senderName}
                  </a>
                </div>
                <div>NYBInfotech</div>
              </div>

              {/* NavayuvaBharat Logo Badge */}
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    letterSpacing: -0.5,
                    color: '#1e3a8a',
                  }}
                >
                  NavayuvaBharat <span style={{ color: '#f97316', fontSize: 15, fontWeight: 800 }}>INFOTECH</span>
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    color: '#64748b',
                    letterSpacing: 1.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  WHERE IT MEETS INGENUITY
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT CONTENT */}
          {activeTab === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Planned Tasks (Today) — One task per line</label>
                <textarea
                  className="input"
                  rows={7}
                  value={reportData.plannedTasksToday.join('\n')}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      plannedTasksToday: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>

              <div>
                <label className="label">Completed Tasks (Today) — One task per line</label>
                <textarea
                  className="input"
                  rows={7}
                  value={reportData.completedTasksToday.join('\n')}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      completedTasksToday: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>

              <div>
                <label className="label">Planned Tasks (Next Day) — One task per line</label>
                <textarea
                  className="input"
                  rows={5}
                  value={reportData.plannedTasksNextDay.join('\n')}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      plannedTasksNextDay: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Pending Tasks (Today)</label>
                  <input
                    className="input"
                    value={reportData.pendingTasksToday}
                    onChange={(e) => setReportData({ ...reportData, pendingTasksToday: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Challenges / Blockers if any</label>
                  <input
                    className="input"
                    value={reportData.challenges}
                    onChange={(e) => setReportData({ ...reportData, challenges: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLAIN TEXT */}
          {activeTab === 'raw' && (
            <div>
              <label className="label">Consolidated Plain Text Format</label>
              <textarea
                className="input"
                rows={16}
                value={plainTextContent}
                readOnly
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.55 }}
              />
            </div>
          )}

          {/* Extra attachments if any */}
          {extraAttachments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {extraAttachments.map((att, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border)',
                    fontSize: 11,
                  }}
                >
                  <Paperclip size={12} />
                  <span>{att.filename}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({att.size})</span>
                  <button
                    onClick={() =>
                      setExtraAttachments((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11 }}
            >
              <Paperclip size={13} /> Attach File
              <input type="file" onChange={handleCustomFileUpload} style={{ display: 'none' }} />
            </label>

            <button
              type="button"
              onClick={handleCopyFormattedTable}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
              title="Copies table with exact borders so you can paste into Outlook"
            >
              {copiedHtml ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
              {copiedHtml ? 'Table Copied!' : '📋 Copy Table (for Outlook)'}
            </button>

            <button
              type="button"
              onClick={handleCopyPlainText}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11 }}
              title="Copy plain text summary"
            >
              {copiedText ? 'Copied' : 'Copy Text'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                background: 'rgba(0, 120, 212, 0.2)',
                border: '1px solid rgba(0, 120, 212, 0.5)',
                color: '#38bdf8',
                gap: 6,
              }}
              title="Saves directly to Outlook Drafts folder with Technical Team batch Excel pre-attached"
            >
              <Bookmark size={13} />
              {savingDraft ? 'Saving Draft...' : 'Save Draft in Outlook (📎 Attached .xlsx)'}
            </button>

            <button
              type="button"
              onClick={openOutlookWeb}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                background: 'rgba(0, 120, 212, 0.12)',
                color: '#7dd3fc',
                gap: 5,
              }}
              title="Download Excel & open compose window in Outlook Cloud"
            >
              <ExternalLink size={12} /> Outlook Web Draft (📥 Downloads .xlsx)
            </button>

            <button
              type="button"
              onClick={downloadDraftEml}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                gap: 5,
              }}
              title="Download complete .eml draft with the Excel file pre-attached"
            >
              <Download size={12} /> Download Draft (.eml with 📎 .xlsx)
            </button>

            <button
              type="button"
              onClick={openGmailWeb}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, gap: 4 }}
              title="Open Gmail Web composer"
            >
              <ExternalLink size={12} /> Gmail Web
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={sending}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                fontSize: 12.5,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              }}
            >
              <Send size={14} /> {sending ? 'Dispatching...' : 'Send to TL (📎 Attached Excel)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
