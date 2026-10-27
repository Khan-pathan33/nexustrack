'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  CalendarDays, Mail, GraduationCap, FolderGit2, GitBranch,
  ArrowRight, Zap, CheckCircle2, BarChart3, Sparkles,
  Cpu, Activity, RefreshCw, Play, Pause, Clock, Volume2, VolumeX,
  RotateCcw, Download, X, ShieldCheck, FileSpreadsheet, ExternalLink,
  ChevronRight, Check, Terminal, Bell, Layers, Radio
} from 'lucide-react';
import Logo from '@/components/Logo';

// ── Executive Telemetry Metrics ──
const stats = [
  { value: '99.8%', label: 'Telemetry Reliability', sub: 'Zero-loss state tracking' },
  { value: '1,200+', label: 'Trainee Tasks Scanned', sub: 'Extracted & scored' },
  { value: '<45ms', label: 'Gemini Latency', sub: 'Flash 2.5 inference' },
  { value: '100%', label: 'Excel In-Place Sync', sub: 'Authentic workbook preservation' },
];

// ── Bento Grid Capabilities ──
const capabilities = [
  {
    id: 'mail-triage',
    icon: <Mail size={18} />,
    title: 'Autonomous Email Triage',
    tag: '1-Min Cron IMAP',
    badge: 'Automated',
    desc: 'Continuously scans incoming trainee reports, validates zip code attachments, verifies subject formats, and dispatches correction alerts exclusively to the coordinator.',
    accent: '#38bdf8',
  },
  {
    id: 'master-excel',
    icon: <FileSpreadsheet size={18} />,
    title: 'SharePoint Master Excel Sync',
    tag: 'Authentic Workbook',
    badge: 'Zero Hardcoding',
    desc: 'Opens and updates the authentic Technical Team batch-3_Daily_Status_Report.xlsx in-place without rebuilding or corrupting formatting across all 99 historical sheets.',
    accent: '#34d399',
  },
  {
    id: 'trainee-radar',
    icon: <GraduationCap size={18} />,
    title: 'Trainee Performance Radar',
    tag: 'Auto-Graded',
    badge: '0–100 Scoring',
    desc: 'Calculates weighted mastery across React, Next.js, and backend modules with continuous tracking, doubt flags, and one-click PDF scorecard generation.',
    accent: '#c084fc',
  },
  {
    id: 'github-stream',
    icon: <GitBranch size={18} />,
    title: 'GitHub Telemetry Stream',
    tag: 'Live Sync',
    badge: 'Branch Tracing',
    desc: 'Direct repository synchronization tracking daily commit trees, pull requests, language breakdowns, and branch verification for assigned tasks.',
    accent: '#06b6d4',
  },
  {
    id: 'standup-ops',
    icon: <CalendarDays size={18} />,
    title: 'Standup & Attendance Hub',
    tag: 'Operations',
    badge: 'Action Items',
    desc: 'Maintains daily connect schedules, tracks attendance, logs one-on-one discussion summaries, and generates consolidated daily reports for Team Leads.',
    accent: '#fbbf24',
  },
  {
    id: 'notifications',
    icon: <Bell size={18} />,
    title: 'Real-Time Notification Center',
    tag: 'Live Alerts',
    badge: 'Desktop & Toast',
    desc: 'Instant dark-mode toast alerts and Windows native desktop notifications trigger the moment an email is scanned and Excel is updated.',
    accent: '#f43f5e',
  },
];

// ── Interactive Simulator Scenarios ──
const SIMULATOR_PRESETS = [
  {
    id: 'bala',
    trainee: 'Bala Krishna Parimi',
    batch: '3',
    date: '14-10-2026',
    subject: 'Fw: Dailly Status Report_ (14-10-2026)',
    rawText: `Hi Team,\n\nHere is my daily status report for 14-10-2026:\n- Completed Tasks: Full React dashboard implementation, modular widgets, active status filters.\n- Pending Topics: N/A\n- Blockers: No Blockers Reported\n- GitHub: Code pushed and verified.\n- Code Zip: Balakrishna_(14-10-2026).zip attached.\n\nRegards,\nBala Krishna Parimi`,
    score: 95,
    status: 'Verified & Synced',
    excelSheet: '14-10-2026',
    flag: 'Subject typo auto-detected ("Dailly")',
  },
  {
    id: 'sana',
    trainee: 'Sana Sulthana',
    batch: '3',
    date: '07-10-2026',
    subject: 'Fw: Daily Status Report_(07-10-2026)',
    rawText: `Hi Team,\n\nDaily report for 07-10-2026:\n- Completed Topics: React form validation, uncontrolled vs controlled inputs, error states.\n- Pending: None\n- Doubts: None\n- GitHub: Pushed to main branch.\n- Attachment: Sana Sulthana(07-10-2026).zip\n\nThanks,\nSana Sulthana`,
    score: 92,
    status: 'Verified & Synced',
    excelSheet: '07-10-2026',
    flag: 'Trailing underscore in subject flagged',
  },
  {
    id: 'althaf',
    trainee: 'Syed Mahammad Althaf',
    batch: '3',
    date: '08-10-2026',
    subject: 'Fw: Daily Status Report (08-10-2026)',
    rawText: `Hi Ma'am,\n\nStatus for 08-10-2026:\n- Completed: Uncle Tom project documentation and architectural review.\n- Pending: React code archive pending export.\n- Doubts: Blockers resolved during mentor connect.\n- GitHub: Pushed to feature branch.\n\nBest,\nSyed Mahammad Althaf`,
    score: 85,
    status: 'Reviewed with Remarks',
    excelSheet: '08-10-2026',
    flag: 'Zip attachment missing (.zip required)',
  },
];

export default function HomePage() {
  const [activeDeckTab, setActiveDeckTab] = useState<'tracker' | 'excel' | 'radar' | 'github'>('tracker');
  const [selectedScenario, setSelectedScenario] = useState(SIMULATOR_PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedComplete, setSimulatedComplete] = useState(true);

  // Video Lightbox Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) closeVideoModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  const runSimulation = (scenario: typeof SIMULATOR_PRESETS[0]) => {
    setSelectedScenario(scenario);
    setIsSimulating(true);
    setSimulatedComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedComplete(true);
    }, 450);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', position: 'relative', overflowX: 'hidden', fontFamily: 'var(--font-sans)' }}>

      {/* ── SUBTLE LINEAR-STYLE TOP STATUS RIBBON ── */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 24px',
          fontSize: 12,
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8', display: 'inline-block' }} />
            NEXUSTRACK OPERATIONS
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>Engine: <strong style={{ color: '#f1f5f9' }}>Gemini 2.5 Flash</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>IMAP Daemon: <strong style={{ color: '#34d399' }}>1-Min Continuous Scan</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>Target: <strong style={{ color: '#cbd5e1' }}>Technical Team batch-3_Daily_Status_Report.xlsx</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>v2.5 Enterprise</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
        </div>
      </div>

      {/* ── NAVIGATION BAR ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(9, 13, 22, 0.85)',
          padding: '0 24px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="md" subtitle="Autonomous Operations" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={openVideoModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <Play size={13} fill="currentColor" /> 16s Walkthrough
            </button>

            <a
              href="#capabilities"
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Capabilities
            </a>

            <a
              href="#simulator"
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              AI Triage Demo
            </a>

            <Link
              href="/login"
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              style={{
                background: '#ffffff',
                color: '#090d16',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                padding: '7px 14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)',
                marginLeft: 4,
              }}
            >
              Launch Dashboard <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (LINEAR / VERCEL MINIMALIST SLATE) ── */}
      <section style={{ position: 'relative', paddingTop: 80, paddingBottom: 64, overflow: 'hidden' }}>
        {/* Subtle radial spotlight (single, soft top center) */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 780,
            height: 480,
            background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          
          {/* Announcement Pill Badge */}
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 24 }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 14px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: 12,
                color: '#cbd5e1',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>NexusTrack 2.5</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span style={{ color: '#94a3b8' }}>Autonomous Trainee Mail Audit &amp; Master Excel Sync</span>
              <ChevronRight size={13} color="#94a3b8" />
            </Link>
          </div>

          {/* Crisp Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5.2vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              maxWidth: 960,
              margin: '0 auto 20px',
              color: '#ffffff',
            }}
          >
            The autonomous operations engine for engineering mentorship.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: '#94a3b8',
              maxWidth: 720,
              margin: '0 auto 36px',
            }}
          >
            NexusTrack eliminates repetitive manual tracking by combining continuous IMAP mail triage, Gemini 2.5 Flash task evaluation, and in-place synchronization into your authentic SharePoint master workbook.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
            <Link
              href="/dashboard"
              style={{
                background: '#ffffff',
                color: '#090d16',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                padding: '11px 22px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <Zap size={15} fill="currentColor" /> Open Command Center
            </Link>

            <button
              onClick={openVideoModal}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                padding: '11px 20px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Play size={14} fill="currentColor" color="#38bdf8" /> Watch 16s Walkthrough
            </button>

            <a
              href="#simulator"
              style={{
                background: 'transparent',
                color: '#94a3b8',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                padding: '11px 18px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Terminal size={14} /> Interactive Sandbox &rarr;
            </a>
          </div>

          {/* ── HERO SHOWCASE: THE SLATE COCKPIT PREVIEW ── */}
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0b1120',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              textAlign: 'left',
            }}
          >
            {/* Window Topbar */}
            <div
              style={{
                padding: '12px 18px',
                background: 'rgba(15, 23, 42, 0.75)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  nexustrack://operations.cluster &bull; live preview
                </span>
              </div>

              {/* Segmented Cockpit Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: 3,
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {[
                  { id: 'tracker', label: 'Daily Mail Triage', icon: <Mail size={12} /> },
                  { id: 'excel', label: 'Master Excel Sheet', icon: <FileSpreadsheet size={12} /> },
                  { id: 'radar', label: 'Trainee Radar', icon: <GraduationCap size={12} /> },
                  { id: 'github', label: 'GitHub Telemetry', icon: <GitBranch size={12} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDeckTab(tab.id as any)}
                    style={{
                      background: activeDeckTab === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: activeDeckTab === tab.id ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cockpit Window Content */}
            <div style={{ padding: 24 }}>
              {/* TAB 1: DAILY MAIL TRIAGE */}
              {activeDeckTab === 'tracker' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                        Latest Evaluated Trainee Report
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Bala Krishna Parimi</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          Score: 95/100
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>
                        Subject: <em>&ldquo;Fw: Dailly Status Report_ (14-10-2026)&rdquo;</em>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#38bdf8' }}>
                        <CheckCircle2 size={13} color="#34d399" />
                        <span>Code Zip verified: Balakrishna_(14-10-2026).zip</span>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                        Automated Master Excel Update
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <FileSpreadsheet size={15} /> Sheet &ldquo;14-10-2026&rdquo; In-Place Updated
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>
                        Row 5 updated with completed topics, doubts cleared, and standup ratings in authentic workbook.
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        Mirrored to: <code style={{ color: '#cbd5e1' }}>Downloads/Technical Team batch-3...xlsx</code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: 12, color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={14} color="#38bdf8" />
                      Discrepancies &amp; correction notices sent exclusively to: <strong style={{ color: '#f1f5f9' }}>nafisakhanampathan65@gmail.com</strong>
                    </span>
                    <span style={{ color: '#64748b' }}>Sync Interval: 60s</span>
                  </div>
                </div>
              )}

              {/* TAB 2: MASTER EXCEL SHEET */}
              {activeDeckTab === 'excel' && (
                <div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileSpreadsheet size={16} color="#34d399" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Technical Team batch-3_Daily_Status_Report.xlsx</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>99 Historical Sheets Connected</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>Current Target:</span> <strong style={{ color: '#ffffff' }}>14-10-2026</strong>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>Layout Styling:</span> <strong style={{ color: '#38bdf8' }}>SharePoint Matching</strong>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>Format Integrity:</span> <strong style={{ color: '#34d399' }}>Zero [Repaired] Warnings</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TRAINEE RADAR */}
              {activeDeckTab === 'radar' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {[
                    { name: 'Bala Krishna Parimi', role: 'Full Stack Trainee', score: 95, modules: ['React Fundamentals', 'Components', 'Props & State'] },
                    { name: 'Sana Sulthana', role: 'Frontend Engineer', score: 92, modules: ['CSS Grid & Flexbox', 'Forms', 'Responsive Design'] },
                    { name: 'Syed Mahammad Althaf', role: 'Software Engineer', score: 85, modules: ['Project Architecture', 'Documentation', 'Routing'] },
                  ].map((tr) => (
                    <div key={tr.name} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{tr.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{tr.role}</div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8' }}>{tr.score}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                        {tr.modules.map((m) => (
                          <span key={m} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: GITHUB TELEMETRY */}
              {activeDeckTab === 'github' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  {[
                    { repo: 'trackpulse-app', branch: 'main', commits: 142, status: 'Active Sync', lang: 'TypeScript' },
                    { repo: 'trainee-batch3-assignments', branch: 'oct-2026', commits: 89, status: 'Verified', lang: 'JavaScript' },
                  ].map((repo) => (
                    <div key={repo.repo} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <GitBranch size={15} color="#38bdf8" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{repo.repo}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8' }}>
                        <span>Branch: <strong>{repo.branch}</strong></span>
                        <span>Commits: <strong>{repo.commits}</strong></span>
                        <span>Lang: <strong>{repo.lang}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.4)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ textAlign: 'left', padding: '0 12px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'var(--font-mono)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO GRID CAPABILITIES ── */}
      <section id="capabilities" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'left', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Modular Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
              Engineered for seamless daily operations.
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 640, marginTop: 8 }}>
              A cohesive telemetry and triage framework designed to automate administrative overhead and maintain accurate records with zero friction.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {capabilities.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.accent,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: 11, color: item.accent, fontWeight: 600, marginBottom: 12 }}>
                  {item.tag}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, flexGrow: 1 }}>
                  {item.desc}
                </p>

                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <Link
                    href="/dashboard"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Explore in Dashboard &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE AI SIMULATOR (TRY THE PARSER) ── */}
      <section id="simulator" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.3)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Interactive Demonstration
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
              Experience Gemini 2.5 Flash Triage in Action
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 600, margin: '8px auto 0' }}>
              Click any trainee scenario to watch Gemini extract completed topics, identify formatting discrepancies, and simulate the exact master Excel update.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {SIMULATOR_PRESETS.map((preset) => {
              const isActive = selectedScenario.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => runSimulation(preset)}
                  style={{
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {isActive && <Check size={12} />} {preset.trainee} ({preset.date})
                </button>
              );
            })}
          </div>

          {/* Side-by-Side Simulation Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Input Email Box */}
            <div
              style={{
                background: '#0b1120',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={13} color="#38bdf8" /> Incoming Trainee Email
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>Date: {selectedScenario.date}</span>
              </div>

              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                <strong>Subject:</strong> <code>{selectedScenario.subject}</code>
              </div>

              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: 14,
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  flexGrow: 1,
                  margin: 0,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {selectedScenario.rawText}
              </pre>

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>IMAP Daemon Protocol</span>
                <button
                  onClick={() => runSimulation(selectedScenario)}
                  disabled={isSimulating}
                  style={{
                    background: '#ffffff',
                    color: '#090d16',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <RefreshCw size={12} className={isSimulating ? 'spin' : ''} />
                  {isSimulating ? 'Processing...' : 'Re-Run Evaluation'}
                </button>
              </div>
            </div>

            {/* Output Structured Record */}
            <div
              style={{
                background: '#0b1120',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} /> Gemini 2.5 Structured Telemetry
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  Score: {selectedScenario.score}/100
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ padding: 10, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Target Excel Sheet</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', marginTop: 2 }}>{selectedScenario.excelSheet}</div>
                </div>
                <div style={{ padding: 10, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Status Verdict</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>{selectedScenario.status}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: 12, borderRadius: 8, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, flexGrow: 1, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ marginBottom: 6 }}>
                  <strong style={{ color: '#f8fafc' }}>Audit Inspection:</strong> Verified code zip attachment and daily tasks.
                </div>
                <div style={{ marginBottom: 6 }}>
                  <strong style={{ color: '#f59e0b' }}>Discrepancy Check:</strong> {selectedScenario.flag}
                </div>
                <div>
                  <strong style={{ color: '#34d399' }}>Master Excel Action:</strong> Updated row without altering historical sheets.
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Inference Latency: 42ms</span>
                <Link
                  href="/dashboard"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  View Full Table in Dashboard &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 12 }}>
            Ready to streamline daily engineering reports?
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Access all tracking modules, review automated trainee email evaluations, and manage your master Excel sheets in real time.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link
              href="/dashboard"
              style={{
                background: '#ffffff',
                color: '#090d16',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                padding: '10px 22px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Open Live Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINIMALIST FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px 24px', background: '#090d16' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo size="sm" withText={true} />
            <span style={{ fontSize: 12, color: '#64748b' }}>
              &copy; {new Date().getFullYear()} NexusTrack Operations. All rights reserved.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#94a3b8' }}>
            <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <a href="#capabilities" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Capabilities
            </a>
            <a href="#simulator" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Simulator
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#10b981', fontSize: 11, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

      {/* ── VIDEO LIGHTBOX MODAL ── */}
      {isVideoModalOpen && (
        <div
          onClick={closeVideoModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(2, 6, 18, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 960,
              background: '#090d16',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                background: 'rgba(15, 23, 42, 0.8)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Play size={13} fill="currentColor" color="#38bdf8" /> NexusTrack Walkthrough (16s)
              </span>
              <button
                onClick={closeVideoModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000000' }}>
              <video
                ref={videoRef}
                src="/demo-walkthrough.webm"
                autoPlay
                loop
                muted={false}
                controls
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
