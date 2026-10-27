'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Copy,
  Send,
  Check,
  ChevronRight,
  Sparkles,
  Layout,
  Code2,
  Smartphone,
  Globe,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  WEEKLY_CURRICULUM,
  WEEKLY_TASK_ALLOCATION_EMAIL_TEXT,
  DayCurriculum,
} from '@/lib/weekly-curriculum';
import { useToast } from '@/components/Toast';

export default function WeeklyScheduleView({
  onSelectDayForTLReport,
}: {
  onSelectDayForTLReport?: (dayNumber: number) => void;
}) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1); // Default to Day 1 (React Fundamentals & JSX)
  const [copied, setCopied] = useState(false);

  // Email Dispatch Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [recipient, setRecipient] = useState('nafisakhanampathan65@gmail.com');
  const [subject, setSubject] = useState(
    '5-Day React Task Allocation for This Week — Technical Team Batch-3'
  );
  const [emailText, setEmailText] = useState(WEEKLY_TASK_ALLOCATION_EMAIL_TEXT);
  const [sending, setSending] = useState(false);

  const selectedDay =
    WEEKLY_CURRICULUM.find((d) => d.dayNumber === selectedDayNumber) ||
    WEEKLY_CURRICULUM[0];

  const handleCopySchedule = () => {
    navigator.clipboard.writeText(WEEKLY_TASK_ALLOCATION_EMAIL_TEXT);
    setCopied(true);
    toastSuccess(
      'Schedule Copied!',
      'Full 5-day React curriculum copied to clipboard. Ready to paste into Teams, WhatsApp, or Outlook.'
    );
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDispatchEmail = async () => {
    if (!recipient.trim()) {
      toastError('Recipient Required', 'Please enter at least one recipient email.');
      return;
    }
    if (recipient.toLowerCase().includes('@nybinfotech.com')) {
      toastError(
        'Blocked Recipient',
        'Direct emails to @nybinfotech.com are strictly blocked per security policy. Target must be nafisakhanampathan65@gmail.com.'
      );
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/daily-tracker/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipient.trim(),
          subject: subject.trim(),
          message: emailText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess(
          'Curriculum Dispatched!',
          `Weekly 5-Day React Task Allocation successfully emailed to trainees via Gmail SMTP.`
        );
        setShowDispatchModal(false);
      } else {
        toastError('Failed to Send', data.error || 'Could not send schedule email.');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with mail service.');
    } finally {
      setSending(false);
    }
  };

  const getDayIcon = (dayNumber: number) => {
    switch (dayNumber) {
      case 1:
        return <Code2 size={20} color="var(--violet-light)" />;
      case 2:
        return <Layout size={20} color="var(--cyan-light)" />;
      case 3:
        return <Smartphone size={20} color="var(--emerald-light)" />;
      case 4:
        return <Globe size={20} color="var(--amber-light)" />;
      case 5:
        return <Award size={20} color="#f43f5e" />;
      default:
        return <BookOpen size={20} color="var(--primary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background:
            'linear-gradient(135deg, rgba(15, 76, 129, 0.22) 0%, rgba(124, 58, 237, 0.16) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: 'rgba(14, 165, 233, 0.2)',
                  color: 'var(--cyan-light)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                }}
              >
                Every Friday Evening / Monday Morning Allocation
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-light)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                Batch-3 Web Development (React.js)
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              5-Day React Task Allocation &amp; Practical Curriculum
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 780 }}>
              Structured 5-day intensive program strengthening practical React skills through React Fundamentals, JSX,
              Props, State, Component Communication, Lists, Forms, Events, useEffect, API Integration, Context API, and Custom Hooks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleCopySchedule}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {copied ? <Check size={14} color="var(--emerald)" /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy 5-Day React Schedule'}
            </button>
            <button
              onClick={() => setShowDispatchModal(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Send size={14} /> Dispatch Plan to Team
            </button>
          </div>
        </div>

        {/* 5 Days Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
            marginTop: 8,
          }}
        >
          {WEEKLY_CURRICULUM.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            return (
              <div
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayNumber(day.dayNumber);
                }}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected
                    ? 'rgba(14, 165, 233, 0.16)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected
                    ? '1.5px solid var(--cyan)'
                    : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isSelected
                      ? 'rgba(14, 165, 233, 0.25)'
                      : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getDayIcon(day.dayNumber)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isSelected ? 'var(--cyan-light)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {day.dayTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {day.daySubtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Header Bar with explicit Switch to Tracker Sheet button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '14px 20px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Curriculum Deep Dive
          </span>
          <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
            {selectedDay.dayTitle}: {selectedDay.daySubtitle}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Theme: {selectedDay.theme}
          </p>
        </div>

        {onSelectDayForTLReport && (
          <button
            type="button"
            onClick={() => onSelectDayForTLReport(selectedDay.dayNumber)}
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 8,
            }}
            title={`Switch to the Daily Tracker spreadsheet for ${selectedDay.dayTitle}`}
          >
            Open {selectedDay.dayTitle} Sheet Tracker &rarr;
          </button>
        )}
      </div>

      {/* Selected Day Deep Dive */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 24,
        }}
      >
        {/* Left Column: Topics & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Topics Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(14, 165, 233, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={16} color="var(--cyan-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Topics Covered</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Mandatory revision & theoretical modules
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedDay.topicsCovered.map((cat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--cyan-light)',
                      marginBottom: 8,
                    }}
                  >
                    {cat.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cat.items.map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        style={{
                          fontSize: 12,
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '3px 10px',
                          borderRadius: 6,
                          color: 'var(--text-primary)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontFamily: item.includes('(') || item.startsWith(':') || item.startsWith('@') ? 'var(--font-mono)' : 'inherit',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Code2 size={16} color="var(--emerald-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Assigned Practice Tasks</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Must be coded by trainees and pushed to GitHub
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedDay.assignedTasks.map((task, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--emerald-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Practical Task & Expected Outcome */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Practical Assignment Card */}
          {(selectedDay.practicalTask || selectedDay.finalAssignment) && (
            <div
              className="glass-card"
              style={{
                padding: 24,
                border: '1.5px solid rgba(124, 58, 237, 0.35)',
                background:
                  'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, rgba(6, 9, 19, 0.5) 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={16} color="var(--violet-light)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {selectedDay.finalAssignment ? 'Final Practical Assignment' : 'Mandatory Practical Task'}
                  </h3>
                  <span style={{ fontSize: 11, color: 'var(--violet-light)', fontWeight: 600 }}>
                    {selectedDay.practicalTask?.title || selectedDay.finalAssignment?.title}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                {selectedDay.practicalTask?.description || selectedDay.finalAssignment?.description}
              </p>

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 8,
                    letterSpacing: '0.05em',
                  }}
                >
                  Required Layout Sections & Components:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(
                    selectedDay.practicalTask?.components ||
                    selectedDay.finalAssignment?.components ||
                    []
                  ).map((comp, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12,
                        color: 'var(--text-primary)',
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <CheckCircle2 size={13} color="var(--emerald)" />
                      {comp}
                    </div>
                  ))}
                </div>
              </div>

              {selectedDay.finalAssignment && (
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: 8,
                      letterSpacing: '0.05em',
                    }}
                  >
                    Evaluation Requirements:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {selectedDay.finalAssignment.requirements.map((req, rIdx) => (
                      <div
                        key={rIdx}
                        style={{
                          fontSize: 11,
                          color: 'var(--amber-light)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <ChevronRight size={11} color="var(--amber)" /> {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Expected Outcome Card */}
          <div
            className="glass-card"
            style={{
              padding: 22,
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Sparkles size={16} color="var(--emerald)" />
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--emerald-light)' }}>
                Expected Outcome
              </h4>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
              {selectedDay.expectedOutcome}
            </p>
          </div>

          {/* Guidance Note */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(234, 179, 8, 0.06)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--amber-light)' }}>Mentorship Rule:</strong> Ensure that
            the team focuses on writing the HTML and CSS themselves and understanding the
            implementation, rather than copying existing designs or templates.
          </div>
        </div>
      </div>

      {/* Dispatch 1-Week Schedule Email Modal */}
      {showDispatchModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDispatchModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
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
              maxWidth: 720,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              background: '#0d1322',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                  ✉️ Dispatch 1-Week Task Allocation to Batch-3 Team
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Sends complete 4-day syllabus directly from your connected Gmail SMTP
                </span>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Recipients (Trainee Email Addresses)</label>
                <textarea
                  className="input"
                  rows={2}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>

              <div>
                <label className="label">Subject Line</label>
                <input
                  className="input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Full 4-Day HTML & CSS Task Allocation Body</label>
                <textarea
                  className="input"
                  rows={14}
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5 }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="btn btn-secondary"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDispatchEmail}
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Send size={15} /> {sending ? 'Dispatching...' : 'Send Schedule to Team'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
