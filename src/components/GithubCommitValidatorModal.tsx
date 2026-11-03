'use client';

import React, { useState } from 'react';
import {
  X, GitBranch, GitCommit, CheckCircle2, AlertTriangle, Sparkles,
  ExternalLink, RefreshCw, ShieldCheck, Play
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface GithubCommitValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername?: string;
  defaultRepoName?: string;
  defaultDate?: string;
  syllabusTopic?: string;
}

export default function GithubCommitValidatorModal({
  isOpen,
  onClose,
  defaultUsername = 'PathanNafisa',
  defaultRepoName = 'nexus-trainee-frontend',
  defaultDate = new Date().toISOString().split('T')[0],
  syllabusTopic = 'CSS Flexbox, Grid, Responsive Dashboard, React Hooks',
}: GithubCommitValidatorModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [username, setUsername] = useState(defaultUsername);
  const [repoName, setRepoName] = useState(defaultRepoName);
  const [date, setDate] = useState(defaultDate);
  const [topic, setTopic] = useState(syllabusTopic);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  React.useEffect(() => {
    if (defaultUsername) setUsername(defaultUsername);
    if (defaultRepoName) setRepoName(defaultRepoName);
    if (defaultDate) setDate(defaultDate);
    if (syllabusTopic) setTopic(syllabusTopic);
  }, [defaultUsername, defaultRepoName, defaultDate, syllabusTopic]);

  if (!isOpen) return null;

  const runAudit = async () => {
    if (!username.trim()) {
      toastError('Username Required', 'Please enter a GitHub username to audit.');
      return;
    }

    setLoading(true);
    setAuditResult(null);

    try {
      const res = await fetch('/api/github/validate-commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          repoName: repoName.trim(),
          targetDate: date,
          topicRequirements: topic,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuditResult(data);
        toastSuccess(
          'GitHub Audit Completed',
          `Verified ${data.todayCommitCount || 0} commit(s) for ${data.username}.`
        );
      } else {
        toastError('Audit Failed', data.error || 'Failed to inspect GitHub repository');
      }
    } catch {
      toastError('Network Error', 'Could not communicate with GitHub validator.');
    } finally {
      setLoading(false);
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
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
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
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(124, 58, 237, 0.1))',
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
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <GitBranch size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f8fafc' }}>
                GitHub Daily Commit & Code Validator
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                Automated commit activity verification powered by Google Gemini AI
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
          {/* Inputs Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                GitHub Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. susmitha-samudrala"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Repository Name:
              </label>
              <input
                type="text"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder="e.g. daily-tasks-frontend"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Target Submission Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* Syllabus Requirement Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
              Expected Syllabus Topics (Audited against commit messages and diff):
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. CSS Grid, Responsive Dashboard Layout, Flexbox"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 13,
              }}
            />
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={runAudit}
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              gap: 8,
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
              marginBottom: 20,
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 15, height: 15 }} />
                <span>Fetching Commits & Running Gemini AI Audit...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Run Gemini AI Code & Commit Audit</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {auditResult && (
            <div style={{ animation: 'fadeUp 0.25s ease-out' }}>
              {/* Score / Verdict Card */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: auditResult.pushedToday
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 9, 19, 0.8))'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(6, 9, 19, 0.8))',
                  border: auditResult.pushedToday
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(239, 68, 68, 0.4)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: auditResult.pushedToday ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: auditResult.pushedToday ? '#10b981' : '#ef4444',
                    }}
                  >
                    {auditResult.pushedToday ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: auditResult.pushedToday ? '#34d399' : '#f87171',
                        }}
                      >
                        {auditResult.aiEvaluation?.verdict || (auditResult.pushedToday ? 'Verified & Active' : 'No Recent Activity')}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: auditResult.pushedToday ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: auditResult.pushedToday ? '#10b981' : '#f87171',
                        }}
                      >
                        Score: {auditResult.aiEvaluation?.score || 0}/100
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                      {auditResult.aiEvaluation?.summary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Commits List */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Verified Commits ({auditResult.commits?.length || 0}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                  {auditResult.commits?.map((c: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <GitCommit size={15} color="#38bdf8" />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#f8fafc',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {c.message}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            <code style={{ color: '#38bdf8' }}>{c.sha}</code> • {new Date(c.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 4,
                          }}
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
