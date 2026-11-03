'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  CalendarDays, Mail, GraduationCap, FolderGit2, GitBranch,
  BarChart3, Plus, Trash2, RefreshCw, ArrowLeft, Database,
  CheckCircle, XCircle, Clock, AlertCircle, Star, GitFork,
  Users, TrendingUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink,
  Shield, ShieldCheck, Zap, LogOut, Sparkles, Send, FileSpreadsheet, Eye,
  X, Award, AlertTriangle, CheckCircle2, Bot, Play, FileText, Check, ArrowRight,
  Paperclip, Download, Copy, Lock, Save, RotateCcw, FolderOpen, Upload, BookOpen
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Logo from '@/components/Logo';
import ExportPdfButton from '@/components/ExportPdfButton';
import { useToast } from '@/components/Toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import WeeklyScheduleView from '@/components/WeeklyScheduleView';
import { WEEKLY_TASK_ALLOCATION_EMAIL_TEXT } from '@/lib/weekly-curriculum';
import CredentialsSettingsModal from '@/components/CredentialsSettingsModal';
import TLDailyReportModal from '@/components/TLDailyReportModal';
import type { BatchTraineeRow } from '@/lib/generate-batch-report';
import NexusTrackNotificationBell from '@/components/NexusTrackNotificationBell';
import DailyTrackerView from '@/components/DailyTrackerView';
import TraineeBatchManager from '@/components/TraineeBatchManager';


// ── Types ──
interface MeetingData { _id: string; title: string; date: string; time: string; duration: number; attendees: string[]; location: string; status: 'scheduled'|'completed'|'cancelled'; notes: string; actionItems: string[]; }
interface MailData { _id: string; subject: string; from: string; to: string; date: string; priority: 'high'|'medium'|'low'; status: 'pending'|'replied'|'archived'|'follow-up'; category: string; notes: string; }
interface TraineeData { _id: string; name: string; email: string; department: string; skills: string[]; overallScore: number; status: 'active'|'completed'|'on-leave'; avatar: string; joinedDate: string; }
interface AssessmentData { _id: string; traineeId: string; traineeName: string; title: string; subject: string; score: number; maxScore: number; date: string; feedback: string; grade: string; }
interface MilestoneData { title: string; completed: boolean; }
interface ProjectData { _id: string; name: string; description: string; status: 'planning'|'active'|'review'|'completed'|'on-hold'; progress: number; deadline: string; team: string[]; milestones: MilestoneData[]; priority: 'critical'|'high'|'medium'|'low'; color: string; }
interface GithubRepoData { _id: string; username: string; repoName: string; url: string; description: string; stars: number; forks: number; openIssues: number; language: string; lastUpdated: string; isPrivate: boolean; defaultBranch: string; }
interface DbStatus { status: string; message: string; }
interface DailyTrackerData { _id: string; date: string; name: string; pendingTopics: string; completedTopicsStatus: string; completedTopicsDetails: string; taskAssign: string; doubts: string; discussionSummary: string; githubPushStatus: string; emailReviewStatus: string; standupParticipation: string; standupRating: string; standupRemarks: string; selfProjectStatus: string; performanceScore: number; scoreReasoning: string; }

// ── Helpers ──
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
function gradeColor(g: string) { return g.startsWith('A') ? 'var(--emerald)' : g.startsWith('B') ? 'var(--cyan)' : 'var(--amber)'; }
function priorityColor(p: string) { return p === 'high' || p === 'critical' ? 'var(--rose)' : p === 'medium' ? 'var(--amber)' : 'var(--text-muted)'; }
function statusColor(s: string) { if (s === 'completed' || s === 'replied' || s === 'operational') return 'var(--emerald)'; if (s === 'cancelled' || s === 'archived') return 'var(--text-muted)'; if (s === 'follow-up' || s === 'review') return 'var(--amber)'; return 'var(--cyan)'; }

function DbBadge({ status }: { status: DbStatus | null }) {
  if (!status) return <div className="spinner" style={{ width: 16, height: 16 }} />;
  const isMongo = status.status === 'mongodb';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: isMongo ? 'rgba(16,185,129,0.12)' : 'rgba(124,58,237,0.12)', border: `1px solid ${isMongo ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`, borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, color: isMongo ? 'var(--emerald-light)' : 'var(--violet-light)' }}>
      <Database size={11} /> {isMongo ? 'MongoDB' : 'Local'}
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string|number; sub?: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color, marginBottom: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

// ── MEETINGS TAB ──
function MeetingsTab({ meetings, onRefresh }: { meetings: MeetingData[]; onRefresh: () => void }) {
  const [form, setForm] = useState({ title: '', date: '', time: '09:00', duration: '30', attendees: '', location: 'Google Meet', notes: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function addMeeting() {
    if (!form.title || !form.date) return;
    setAdding(true);
    await fetch('/api/meetings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, duration: parseInt(form.duration), attendees: form.attendees.split(',').map(s => s.trim()).filter(Boolean) }) });
    setForm({ title: '', date: '', time: '09:00', duration: '30', attendees: '', location: 'Google Meet', notes: '' });
    setShowForm(false); onRefresh(); setAdding(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/meetings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateStatus', id, status }) });
    onRefresh();
  }

  async function deleteMeeting(id: string) {
    await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' });
    onRefresh();
  }

  const upcoming = meetings.filter(m => m.status === 'scheduled').sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  const past = meetings.filter(m => m.status !== 'scheduled');

  function StatusIcon({ s }: { s: string }) {
    if (s === 'completed') return <CheckCircle size={15} color="var(--emerald)" />;
    if (s === 'cancelled') return <XCircle size={15} color="var(--rose)" />;
    return <Clock size={15} color="var(--cyan)" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-4">
        <MetricCard icon={<CalendarDays size={15} />} label="Total Meetings" value={meetings.length} color="var(--violet)" />
        <MetricCard icon={<Clock size={15} />} label="Upcoming" value={upcoming.length} sub="Scheduled" color="var(--cyan)" />
        <MetricCard icon={<CheckCircle size={15} />} label="Completed" value={meetings.filter(m => m.status === 'completed').length} color="var(--emerald)" />
        <MetricCard icon={<Users size={15} />} label="Avg Attendees" value={meetings.length ? Math.round(meetings.reduce((a, m) => a + m.attendees.length, 0) / meetings.length) : 0} color="var(--amber)" />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 20 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Meetings</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm"><Plus size={14} /> Schedule Meeting</button>
        </div>
        {showForm && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12, animation: 'fadeUp 0.2s ease' }}>
            <div className="form-group"><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Meeting title" /></div>
            <div className="form-group"><label className="label">Date</label><input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="label">Time</label><input className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
            <div className="form-group"><label className="label">Duration (min)</label><input className="input" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
            <div className="form-group" style={{ gridColumn: '1/3' }}><label className="label">Attendees (comma-separated)</label><input className="input" value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} placeholder="Ahmed, Sara, Reza" /></div>
            <div className="form-group"><label className="label">Location</label><input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Zoom / Room A" /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <button onClick={addMeeting} className="btn btn-primary w-full" disabled={adding || !form.title || !form.date}>{adding ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Notes</label><input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Agenda or notes..." /></div>
          </div>
        )}
      </div>

      {upcoming.length > 0 && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={14} color="var(--cyan)" /> Upcoming Meetings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(m => (
              <div key={m._id} style={{ padding: '14px 18px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                    <span>📅 {m.date} at {m.time}</span>
                    <span>⏱ {m.duration}min</span>
                    <span>📍 {m.location}</span>
                    {m.attendees.length > 0 && <span>👥 {m.attendees.slice(0, 3).join(', ')}{m.attendees.length > 3 ? ` +${m.attendees.length-3}` : ''}</span>}
                  </div>
                  {m.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{m.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                  <button onClick={() => updateStatus(m._id, 'completed')} className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.3)', fontSize: 11 }}>✓ Done</button>
                  <button onClick={() => updateStatus(m._id, 'cancelled')} className="btn btn-sm" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--rose)', border: '1px solid rgba(244,63,94,0.2)', fontSize: 11 }}>✕ Cancel</button>
                  <button onClick={() => deleteMeeting(m._id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} color="var(--emerald)" /> Past Meetings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {past.map(m => (
              <div key={m._id} style={{ padding: '12px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <StatusIcon s={m.status} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{m.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.date} · {m.attendees.length} attendees</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span className={`badge ${m.status === 'completed' ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: 10 }}>{m.status}</span>
                  <button onClick={() => deleteMeeting(m._id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIL TAB ──
function MailTab({ mails, onRefresh }: { mails: MailData[]; onRefresh: () => void }) {
  const [form, setForm] = useState({ subject: '', from: '', to: '', date: new Date().toISOString().split('T')[0], priority: 'medium', category: 'General', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { success: toastSuccess, error: toastError } = useToast();

  async function syncMails() {
    setSyncing(true);
    try {
      const res = await fetch('/api/mails/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toastSuccess('Emails Synced', `Successfully pulled ${data.newMails || 0} new emails via Gmail IMAP.`);
        onRefresh();
      } else {
        toastError('Sync Failed', data.message || 'Unable to sync mailbox.');
      }
    } catch {
      toastError('Sync Error', 'An unexpected error occurred while communicating with the mail server.');
    }
    setSyncing(false);
  }

  async function addMail() {
    if (!form.subject || !form.from) return;
    setAdding(true);
    await fetch('/api/mails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ subject: '', from: '', to: '', date: new Date().toISOString().split('T')[0], priority: 'medium', category: 'General', notes: '' });
    setShowForm(false); onRefresh(); setAdding(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/mails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateStatus', id, status }) });
    onRefresh();
  }

  async function deleteMail(id: string) {
    await fetch(`/api/mails?id=${id}`, { method: 'DELETE' });
    onRefresh();
  }

  const filtered = filterStatus === 'all' ? mails : mails.filter(m => m.status === filterStatus);
  const pending = mails.filter(m => m.status === 'pending').length;
  const followUp = mails.filter(m => m.status === 'follow-up').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-4">
        <MetricCard icon={<Mail size={15} />} label="Total Mail" value={mails.length} color="var(--violet)" />
        <MetricCard icon={<AlertCircle size={15} />} label="Pending Reply" value={pending} sub="Action needed" color="var(--rose)" />
        <MetricCard icon={<Clock size={15} />} label="Follow-up" value={followUp} sub="Needs follow-up" color="var(--amber)" />
        <MetricCard icon={<CheckCircle size={15} />} label="Replied" value={mails.filter(m => m.status === 'replied').length} color="var(--emerald)" />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 20 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Mail Tracker</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="select" style={{ width: 'auto', fontSize: 13, padding: '6px 12px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="follow-up">Follow-up</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <button onClick={syncMails} disabled={syncing} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={syncing ? "spin" : ""} /> {syncing ? "Syncing..." : "Sync Inbox"}
            </button>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm"><Plus size={14} /> Log Mail</button>
          </div>
        </div>
        {showForm && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12, animation: 'fadeUp 0.2s ease' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Subject</label><input className="input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Email subject" /></div>
            <div className="form-group"><label className="label">From</label><input className="input" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} placeholder="sender@email.com" /></div>
            <div className="form-group"><label className="label">To</label><input className="input" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} placeholder="you@company.com" /></div>
            <div className="form-group"><label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div className="form-group"><label className="label">Category</label>
              <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['HR','Client','Technical','Training','Infrastructure','General'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Notes</label><input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes or context..." /></div>
            <div style={{ display: 'flex', gap: 8, gridColumn: '1/-1' }}>
              <button onClick={addMail} className="btn btn-primary" disabled={adding || !form.subject || !form.from}>{adding ? 'Saving...' : 'Save Mail'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(m => (
            <div key={m._id} style={{ padding: '14px 18px', background: m.priority === 'high' && m.status === 'pending' ? 'rgba(244,63,94,0.05)' : 'var(--bg-glass)', border: `1px solid ${m.priority === 'high' && m.status === 'pending' ? 'rgba(244,63,94,0.25)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{m.subject}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${priorityColor(m.priority)}20`, color: priorityColor(m.priority), flexShrink: 0 }}>{m.priority.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>From: {m.from} · {m.date} · {m.category}</div>
                {m.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }} className="truncate">{m.notes}</div>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12, alignItems: 'center' }}>
                <select value={m.status} onChange={e => updateStatus(m._id, e.target.value)} className="select" style={{ fontSize: 11, padding: '4px 8px', width: 'auto', color: statusColor(m.status), background: 'var(--bg-input)' }}>
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="archived">Archived</option>
                </select>
                <button onClick={() => deleteMail(m._id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>No mail found for this filter.</div>}
        </div>
      </div>
    </div>
  );
}

// ── ASSESSMENTS TAB ──
function AssessmentsTab({ trainees, assessments, onRefresh }: { trainees: TraineeData[]; assessments: AssessmentData[]; onRefresh: () => void }) {
  const [traineeForm, setTraineeForm] = useState({ name: '', email: '', department: 'Frontend', skills: '', avatar: '👤' });
  const [assForm, setAssForm] = useState({ traineeId: '', title: '', subject: 'Frontend Development', score: '', maxScore: '100', date: new Date().toISOString().split('T')[0], feedback: '' });
  const [showTraineeForm, setShowTraineeForm] = useState(false);
  const [showAssForm, setShowAssForm] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);

  async function addTrainee() {
    if (!traineeForm.name || !traineeForm.email) return;
    await fetch('/api/trainees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'trainee', ...traineeForm, skills: traineeForm.skills.split(',').map(s => s.trim()).filter(Boolean), joinedDate: new Date().toISOString().split('T')[0] }) });
    setTraineeForm({ name: '', email: '', department: 'Frontend', skills: '', avatar: '👤' });
    setShowTraineeForm(false); onRefresh();
  }

  async function addAssessment() {
    if (!assForm.traineeId || !assForm.title || !assForm.score) return;
    const t = trainees.find(t => t._id === assForm.traineeId);
    await fetch('/api/trainees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'assessment', ...assForm, traineeName: t?.name || '', score: parseFloat(assForm.score), maxScore: parseFloat(assForm.maxScore) }) });
    setAssForm({ traineeId: '', title: '', subject: 'Frontend Development', score: '', maxScore: '100', date: new Date().toISOString().split('T')[0], feedback: '' });
    setShowAssForm(false); onRefresh();
  }

  async function deleteItem(id: string, type: string) {
    await fetch(`/api/trainees?id=${id}&type=${type}`, { method: 'DELETE' });
    onRefresh();
  }

  const avg = trainees.length ? Math.round(trainees.reduce((a, t) => a + t.overallScore, 0) / trainees.length) : 0;
  const topTrainee = trainees.reduce((best, t) => t.overallScore > (best?.overallScore || 0) ? t : best, trainees[0]);
  const traineeAssessments = selectedTrainee ? assessments.filter(a => a.traineeId === selectedTrainee) : assessments;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-4">
        <MetricCard icon={<Users size={15} />} label="Total Trainees" value={trainees.filter(t => t.status === 'active').length} sub="Active" color="var(--violet)" />
        <MetricCard icon={<GraduationCap size={15} />} label="Assessments" value={assessments.length} color="var(--cyan)" />
        <MetricCard icon={<TrendingUp size={15} />} label="Avg Score" value={`${avg}%`} sub="Across all trainees" color="var(--emerald)" />
        <MetricCard icon={<Star size={15} />} label="Top Trainee" value={topTrainee?.name?.split(' ')[0] || '—'} sub={topTrainee ? `${topTrainee.overallScore}% overall` : ''} color="var(--amber)" />
      </div>

      {/* Trainee Cards */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Trainees</h3>
          <button onClick={() => setShowTraineeForm(!showTraineeForm)} className="btn btn-primary btn-sm"><Plus size={14} /> Add Trainee</button>
        </div>
        {showTraineeForm && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20, animation: 'fadeUp 0.2s ease', padding: '16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div className="form-group"><label className="label">Name</label><input className="input" value={traineeForm.name} onChange={e => setTraineeForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
            <div className="form-group"><label className="label">Email</label><input className="input" value={traineeForm.email} onChange={e => setTraineeForm(f => ({ ...f, email: e.target.value }))} placeholder="email@trainee.com" /></div>
            <div className="form-group"><label className="label">Department</label>
              <select className="select" value={traineeForm.department} onChange={e => setTraineeForm(f => ({ ...f, department: e.target.value }))}>
                {['Frontend','Backend','Full Stack','DevOps','Design','QA'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Avatar emoji</label><input className="input" value={traineeForm.avatar} onChange={e => setTraineeForm(f => ({ ...f, avatar: e.target.value }))} placeholder="👤" /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Skills (comma-separated)</label><input className="input" value={traineeForm.skills} onChange={e => setTraineeForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js, TypeScript" /></div>
            <div style={{ display: 'flex', gap: 8, gridColumn: '1/-1' }}>
              <button onClick={addTrainee} className="btn btn-primary">Add Trainee</button>
              <button onClick={() => setShowTraineeForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid-2" style={{ gap: 16 }}>
          {trainees.map(t => (
            <div key={t._id} onClick={() => setSelectedTrainee(selectedTrainee === t._id ? null : t._id)} style={{ padding: '18px 20px', background: selectedTrainee === t._id ? 'rgba(124,58,237,0.08)' : 'var(--bg-glass)', border: `1px solid ${selectedTrainee === t._id ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.department} · {t.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: t.overallScore >= 85 ? 'var(--emerald)' : t.overallScore >= 70 ? 'var(--amber)' : 'var(--rose)' }}>{t.overallScore}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>overall</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteItem(t._id, 'trainee'); }} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
                {t.skills.slice(0, 4).map(s => <span key={s} className="badge badge-violet" style={{ fontSize: 10, padding: '2px 7px' }}>{s}</span>)}
                {t.skills.length > 4 && <span className="badge badge-violet" style={{ fontSize: 10 }}>+{t.skills.length - 4}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessments */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            Assessments {selectedTrainee && <span style={{ fontSize: 12, color: 'var(--violet-light)', fontWeight: 400 }}>— {trainees.find(t => t._id === selectedTrainee)?.name}</span>}
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {selectedTrainee && <button onClick={() => setSelectedTrainee(null)} className="btn btn-ghost btn-sm">Show All</button>}
            <button onClick={() => setShowAssForm(!showAssForm)} className="btn btn-primary btn-sm"><Plus size={14} /> Add Assessment</button>
          </div>
        </div>
        {showAssForm && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 20, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', animation: 'fadeUp 0.2s ease' }}>
            <div className="form-group"><label className="label">Trainee</label>
              <select className="select" value={assForm.traineeId} onChange={e => setAssForm(f => ({ ...f, traineeId: e.target.value }))}>
                <option value="">Select trainee...</option>
                {trainees.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Assessment Title</label><input className="input" value={assForm.title} onChange={e => setAssForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. React Hooks Quiz" /></div>
            <div className="form-group"><label className="label">Subject</label>
              <select className="select" value={assForm.subject} onChange={e => setAssForm(f => ({ ...f, subject: e.target.value }))}>
                {['Frontend Development','Backend Development','DevOps Basics','DevOps Advanced','Database','System Design','General'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Date</label><input className="input" type="date" value={assForm.date} onChange={e => setAssForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="label">Score</label><input className="input" type="number" value={assForm.score} onChange={e => setAssForm(f => ({ ...f, score: e.target.value }))} placeholder="85" /></div>
            <div className="form-group"><label className="label">Max Score</label><input className="input" type="number" value={assForm.maxScore} onChange={e => setAssForm(f => ({ ...f, maxScore: e.target.value }))} /></div>
            <div className="form-group" style={{ gridColumn: '3/-1' }}><label className="label">Feedback</label><input className="input" value={assForm.feedback} onChange={e => setAssForm(f => ({ ...f, feedback: e.target.value }))} placeholder="Feedback notes..." /></div>
            <div style={{ display: 'flex', gap: 8, gridColumn: '1/-1' }}>
              <button onClick={addAssessment} className="btn btn-primary">Save Assessment</button>
              <button onClick={() => setShowAssForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {traineeAssessments.map(a => (
            <div key={a._id} style={{ padding: '14px 18px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${gradeColor(a.grade)}20`, color: gradeColor(a.grade), border: `1px solid ${gradeColor(a.grade)}40` }}>{a.grade}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.traineeName} · {a.subject} · {a.date}</div>
                {a.feedback && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{a.feedback}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: gradeColor(a.grade) }}>{a.score}<span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/{a.maxScore}</span></div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{Math.round((a.score / a.maxScore) * 100)}%</div>
                </div>
                <button onClick={() => deleteItem(a._id, 'assessment')} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {traineeAssessments.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>No assessments yet. Add your first one above!</div>}
        </div>
      </div>
    </div>
  );
}

// ── PROJECTS TAB ──
function ProjectsTab({ projects, onRefresh }: { projects: ProjectData[]; onRefresh: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', deadline: '', team: '', priority: 'medium', color: '#7c3aed', milestones: '' });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function addProject() {
    if (!form.name) return;
    setAdding(true);
    await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, team: form.team.split(',').map(s => s.trim()).filter(Boolean), milestones: form.milestones.split('\n').map(s => s.trim()).filter(Boolean) }) });
    setForm({ name: '', description: '', deadline: '', team: '', priority: 'medium', color: '#7c3aed', milestones: '' });
    setShowForm(false); onRefresh(); setAdding(false);
  }

  async function toggleMilestone(id: string, milestoneIndex: number, completed: boolean) {
    await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggleMilestone', id, milestoneIndex, completed }) });
    onRefresh();
  }

  async function deleteProject(id: string) {
    await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
    onRefresh();
  }

  const statusCfg: Record<string, { color: string; bg: string }> = {
    planning: { color: 'var(--text-muted)', bg: 'rgba(100,116,139,0.15)' },
    active: { color: 'var(--cyan)', bg: 'rgba(6,182,212,0.12)' },
    review: { color: 'var(--amber)', bg: 'rgba(245,158,11,0.12)' },
    completed: { color: 'var(--emerald)', bg: 'rgba(16,185,129,0.12)' },
    'on-hold': { color: 'var(--rose)', bg: 'rgba(244,63,94,0.12)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-4">
        <MetricCard icon={<FolderGit2 size={15} />} label="Total Projects" value={projects.length} color="var(--violet)" />
        <MetricCard icon={<Zap size={15} />} label="Active" value={projects.filter(p => p.status === 'active').length} color="var(--cyan)" />
        <MetricCard icon={<CheckCircle size={15} />} label="Completed" value={projects.filter(p => p.status === 'completed').length} color="var(--emerald)" />
        <MetricCard icon={<TrendingUp size={15} />} label="Avg Progress" value={`${projects.length ? Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) : 0}%`} color="var(--amber)" />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 20 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Projects</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm"><Plus size={14} /> New Project</button>
        </div>
        {showForm && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 20, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', animation: 'fadeUp 0.2s ease' }}>
            <div className="form-group" style={{ gridColumn: '1/3' }}><label className="label">Project Name</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name" /></div>
            <div className="form-group"><label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div className="form-group"><label className="label">Color</label><input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 44, height: 40, border: '1px solid var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer', padding: 4 }} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Description</label><input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief project description" /></div>
            <div className="form-group" style={{ gridColumn: '1/3' }}><label className="label">Team (comma-separated)</label><input className="input" value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))} placeholder="Ahmed, Sara, Reza" /></div>
            <div className="form-group"><label className="label">Deadline</label><input className="input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="label">Milestones (one per line)</label><textarea className="input" style={{ height: 80, resize: 'vertical' }} value={form.milestones} onChange={e => setForm(f => ({ ...f, milestones: e.target.value }))} placeholder={"Design phase\nDevelopment\nTesting\nDeployment"} /></div>
            <div style={{ display: 'flex', gap: 8, gridColumn: '1/-1' }}>
              <button onClick={addProject} className="btn btn-primary" disabled={adding || !form.name}>{adding ? 'Saving...' : 'Create Project'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {projects.map(p => {
          const cfg = statusCfg[p.status] || statusCfg.planning;
          const daysLeft = p.deadline ? daysUntil(p.deadline) : null;
          const isExpanded = expanded === p._id;
          return (
            <div key={p._id} className="glass-card" style={{ padding: 24, borderLeft: `4px solid ${p.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 4, background: cfg.bg, color: cfg.color }}>{p.status}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${priorityColor(p.priority)}15`, color: priorityColor(p.priority) }}>{p.priority}</span>
                  </div>
                  {p.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{p.description}</div>}
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    {p.team.length > 0 && <span>👥 {p.team.join(', ')}</span>}
                    {daysLeft !== null && <span style={{ color: daysLeft < 7 ? 'var(--amber)' : 'var(--text-muted)' }}>📅 {daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d overdue`}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setExpanded(isExpanded ? null : p._id)} className="btn btn-ghost btn-sm">{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Milestones</button>
                  <button onClick={() => deleteProject(p._id)} className="btn btn-icon btn-danger"><Trash2 size={13} /></button>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginBottom: isExpanded ? 20 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: p.color }}>{p.progress}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`, borderRadius: 4, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${p.color}66` }} />
                </div>
              </div>
              {/* Milestones */}
              {isExpanded && p.milestones.length > 0 && (
                <div style={{ animation: 'fadeUp 0.2s ease' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>Milestones ({p.milestones.filter(m => m.completed).length}/{p.milestones.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.milestones.map((m, i) => (
                      <div key={i} onClick={() => toggleMilestone(p._id, i, !m.completed)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: m.completed ? `${p.color}10` : 'var(--bg-glass)', border: `1px solid ${m.completed ? p.color + '33' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${m.completed ? p.color : 'var(--border)'}`, background: m.completed ? p.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                          {m.completed && <span style={{ fontSize: 11, color: 'white' }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 13, color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none', transition: 'all 0.2s' }}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── GITHUB TAB ──
function GithubTab({ repos, onRefresh }: { repos: GithubRepoData[]; onRefresh: () => void }) {
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [adding, setAdding] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  async function addRepo() {
    if (!username || !repoName) return;
    setAdding(true);
    await fetch('/api/github', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, repoName }) });
    setUsername(''); setRepoName(''); onRefresh(); setAdding(false);
  }

  async function refreshRepo(id: string, username: string, repoName: string) {
    setRefreshingId(id);
    await fetch('/api/github', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'refresh', id, username, repoName }) });
    onRefresh(); setRefreshingId(null);
  }

  async function deleteRepo(id: string) {
    await fetch(`/api/github?id=${id}`, { method: 'DELETE' });
    onRefresh();
  }

  const langColors: Record<string, string> = { TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3776ab', Go: '#00add8', Rust: '#ce422b', Java: '#b07219', Unknown: '#64748b' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-4">
        <MetricCard icon={<GitBranch size={15} />} label="Tracked Repos" value={repos.length} color="var(--violet)" />
        <MetricCard icon={<Star size={15} />} label="Total Stars" value={repos.reduce((a, r) => a + r.stars, 0)} color="var(--amber)" />
        <MetricCard icon={<GitFork size={15} />} label="Total Forks" value={repos.reduce((a, r) => a + r.forks, 0)} color="var(--cyan)" />
        <MetricCard icon={<AlertCircle size={15} />} label="Open Issues" value={repos.reduce((a, r) => a + r.openIssues, 0)} color="var(--rose)" />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Track a GitHub Repository</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group"><label className="label">GitHub Username</label><input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. vercel" /></div>
          <div className="form-group"><label className="label">Repository Name</label><input className="input" value={repoName} onChange={e => setRepoName(e.target.value)} placeholder="e.g. next.js" /></div>
          <button onClick={addRepo} className="btn btn-primary" disabled={adding || !username || !repoName} style={{ height: 40 }}>
            {adding ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <><Plus size={16} /> Track Repo</>}
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
          💡 For public repos, live data is fetched from the GitHub API. For private repos, add a <code style={{ background: 'var(--bg-glass)', padding: '1px 5px', borderRadius: 3 }}>GITHUB_TOKEN</code> to .env.local.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {repos.map(r => (
          <div key={r._id} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <GitBranch size={16} color="var(--violet-light)" />
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 15, color: 'var(--violet-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }} onClick={e => e.stopPropagation()}>
                    {r.username}/{r.repoName} <ExternalLink size={12} />
                  </a>
                  {r.isPrivate && <span className="badge badge-rose" style={{ fontSize: 10 }}>Private</span>}
                  {r.language && (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${langColors[r.language] || '#64748b'}20`, color: langColors[r.language] || '#64748b', border: `1px solid ${langColors[r.language] || '#64748b'}40` }}>
                      {r.language}
                    </span>
                  )}
                </div>
                {r.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{r.description}</div>}
                <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber)', fontWeight: 600 }}><Star size={13} fill="var(--amber)" /> {r.stars.toLocaleString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--cyan)', fontWeight: 600 }}><GitFork size={13} /> {r.forks.toLocaleString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--rose)', fontWeight: 600 }}><AlertCircle size={13} /> {r.openIssues} issues</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Branch: {r.defaultBranch}</span>
                  {r.lastUpdated && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Updated: {new Date(r.lastUpdated).toLocaleDateString()}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                <button onClick={() => refreshRepo(r._id, r.username, r.repoName)} className="btn btn-secondary btn-sm" disabled={refreshingId === r._id}>
                  {refreshingId === r._id ? <div className="spinner" style={{ width: 13, height: 13 }} /> : <RefreshCw size={13} />} Refresh
                </button>
                <button onClick={() => deleteRepo(r._id)} className="btn btn-icon btn-danger"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {repos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <GitBranch size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div>No repos tracked yet. Add your first GitHub repository above!</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──
function OverviewTab({ meetings, mails, trainees, assessments, projects, repos, onNavigateTab }: { meetings: MeetingData[]; mails: MailData[]; trainees: TraineeData[]; assessments: AssessmentData[]; projects: ProjectData[]; repos: GithubRepoData[]; onNavigateTab?: (tab: string) => void; }) {
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').slice(0, 3);
  const pendingMails = mails.filter(m => m.status === 'pending' || m.status === 'follow-up');
  const avgScore = trainees.length ? Math.round(trainees.reduce((a, t) => a + t.overallScore, 0) / trainees.length) : 0;
  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-3">
        <MetricCard icon={<CalendarDays size={16} />} label="Upcoming Meetings" value={meetings.filter(m => m.status === 'scheduled').length} sub="Scheduled" color="var(--violet)" />
        <MetricCard icon={<Mail size={16} />} label="Pending Mail" value={pendingMails.length} sub="Need attention" color="var(--rose)" />
        <MetricCard icon={<GraduationCap size={16} />} label="Active Trainees" value={trainees.filter(t => t.status === 'active').length} sub={`Avg ${avgScore}% score`} color="var(--emerald)" />
        <MetricCard icon={<FolderGit2 size={16} />} label="Active Projects" value={activeProjects.length} sub={`${projects.length} total`} color="var(--amber)" />
        <MetricCard icon={<GitBranch size={16} />} label="GitHub Repos" value={repos.length} sub={`${repos.reduce((a, r) => a + r.stars, 0)} total stars`} color="var(--cyan)" />
        <MetricCard icon={<BarChart3 size={16} />} label="Assessments" value={assessments.length} sub="Total conducted" color="#8b5cf6" />
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={14} color="var(--cyan-light)" /> System Activity Pulse (14 Days)</h3>
        <div style={{ height: 280, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: 'Day 1', activity: 42 }, { day: 'Day 2', activity: 55 }, { day: 'Day 3', activity: 48 },
              { day: 'Day 4', activity: 65 }, { day: 'Day 5', activity: 72 }, { day: 'Day 6', activity: 68 },
              { day: 'Day 7', activity: 85 }, { day: 'Day 8', activity: 90 }, { day: 'Day 9', activity: 82 },
              { day: 'Day 10', activity: 105 }, { day: 'Day 11', activity: 95 }, { day: 'Day 12', activity: 110 },
              { day: 'Day 13', activity: 125 }, { day: 'Day 14', activity: 140 }
            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(16px)' }}
                itemStyle={{ color: 'var(--cyan-light)' }}
              />
              <Area type="monotone" dataKey="activity" stroke="var(--cyan)" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={14} color="var(--amber)" /> Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => onNavigateTab ? onNavigateTab('meetings') : null}>
              <CalendarDays size={14} /> Schedule Meeting
            </button>
            <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }} onClick={() => onNavigateTab ? onNavigateTab('mail') : null}>
              <Mail size={14} /> View Inbox
            </button>
            <ExportPdfButton targetId={`tab-overview`} filename={`nexustrack-report`} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24, gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} color="var(--emerald)" /> System Health Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 10px var(--emerald-glow)' }}></div>
              <div style={{ flex: 1, fontSize: 13 }}>MongoDB Atlas Connection Stable</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Just now</span>
            </div>
            {pendingMails.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(244,63,94,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244,63,94,0.2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rose)', boxShadow: '0 0 10px var(--rose-glow)' }}></div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--rose-light)' }}>{pendingMails.length} automated task emails require processing</div>
                <button className="btn btn-sm" style={{ background: 'var(--rose)', color: 'white', padding: '4px 10px', fontSize: 11 }}>Sync</button>
              </div>
            )}
            {activeProjects.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan-glow)' }}></div>
                <div style={{ flex: 1, fontSize: 13 }}>{activeProjects.length} projects are currently active and tracking.</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><CalendarDays size={14} color="var(--violet-light)" /> Upcoming Meetings</h3>
          {upcomingMeetings.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No upcoming meetings</div> : upcomingMeetings.map(m => (
            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.date} at {m.time} · {m.location}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 600, flexShrink: 0 }}>{m.duration}min</span>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="var(--rose)" /> Pending Mail ({pendingMails.length})</h3>
          {pendingMails.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>All mail handled! 🎉</div> : pendingMails.slice(0, 4).map(m => (
            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{m.subject}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>From: {m.from}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${priorityColor(m.priority)}15`, color: priorityColor(m.priority), flexShrink: 0, marginLeft: 8, height: 'fit-content' }}>{m.priority}</span>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><GraduationCap size={14} color="var(--emerald)" /> Top Trainees</h3>
          {trainees.sort((a, b) => b.overallScore - a.overallScore).slice(0, 4).map(t => (
            <div key={t._id} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.department}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, color: t.overallScore >= 85 ? 'var(--emerald)' : 'var(--amber)' }}>{t.overallScore}%</div>
              </div>
              <div style={{ height: 4, background: 'var(--bg-glass)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${t.overallScore}%`, background: t.overallScore >= 85 ? 'var(--emerald)' : 'var(--amber)', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FolderGit2 size={14} color="var(--amber)" /> Project Progress</h3>
          {activeProjects.slice(0, 3).map(p => (
            <div key={p._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, color: p.color }}>{p.progress}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DAILY TRACKER TAB ──
// Delegated to DailyTrackerView (Executive SaaS UI connected dynamically to Excel engine)

// ── MAIN DASHBOARD ──
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [mails, setMails] = useState<MailData[]>([]);
  const [trainees, setTrainees] = useState<TraineeData[]>([]);
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [repos, setRepos] = useState<GithubRepoData[]>([]);
  const [trackers, setTrackers] = useState<DailyTrackerData[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopCredsModal, setShowTopCredsModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    batch?: string;
    emailUser?: string;
    emailProvider?: 'both' | 'gmail' | 'outlook' | 'custom';
    gmailUser?: string;
    outlookUser?: string;
    hasEmailPass?: boolean;
    hasCompletedOnboarding?: boolean;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/credentials');
      if (res.ok) {
        const data = await res.json();
        if (data.credentials) setUserProfile(data.credentials);
      }
    } catch {}
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return {};
          const text = await res.text();
          return text ? JSON.parse(text) : {};
        } catch {
          return {};
        }
      };

      const [m, ml, t, p, g, db, tr] = await Promise.all([
        safeFetch('/api/meetings'),
        safeFetch('/api/mails'),
        safeFetch('/api/trainees'),
        safeFetch('/api/projects'),
        safeFetch('/api/github'),
        safeFetch('/api/db-status'),
        safeFetch('/api/daily-tracker'),
      ]);
      setMeetings(m.meetings || []);
      setMails(ml.mails || []);
      setTrainees(t.trainees || []);
      setAssessments(t.assessments || []);
      setProjects(p.projects || []);
      setRepos(g.repos || []);
      setDbStatus(db?.status ? db : { status: 'local', message: 'Running in Local Storage mode' });
      setTrackers(tr.trackers || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchProfile();
  }, [fetchAll, fetchProfile]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { id: 'tracker', label: 'Daily Tracker', icon: <Database size={14} /> },
    { id: 'trainees', label: 'Batches & Trainees', icon: <Users size={14} /> },
    { id: 'meetings', label: 'Meetings', icon: <CalendarDays size={14} /> },
    { id: 'mail', label: 'Mail', icon: <Mail size={14} /> },
    { id: 'assessments', label: 'Assessments', icon: <GraduationCap size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={14} /> },
    { id: 'github', label: 'GitHub', icon: <GitBranch size={14} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6, 9, 19, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" className="btn btn-ghost btn-sm desktop-only"><ArrowLeft size={14} /> Back</Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo size="sm" />
            </Link>
            <span className="desktop-only" style={{ fontSize: 12, color: 'var(--text-muted)', padding: '2px 8px', background: 'var(--bg-glass)', borderRadius: 4, border: '1px solid var(--border)' }}>Command Center</span>
            {userProfile?.batch && (
              <div
                className="desktop-only"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  background: 'rgba(2, 132, 199, 0.12)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#38bdf8',
                }}
              >
                <span>Batch {userProfile.batch}</span>
                <span style={{ color: '#64748b' }}>&bull;</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>
                  {userProfile.emailUser ? userProfile.emailUser.split('@')[0] : 'Coordinator'}
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ExportPdfButton targetId={`tab-${activeTab}`} filename={`nexustrack-${activeTab}`} />
            <DbBadge status={dbStatus} />
            <NexusTrackNotificationBell />
            <button
              onClick={() => setShowTopCredsModal(true)}
              className="btn btn-secondary btn-sm desktop-only"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
              title="Manage Gmail App Password, Excel Password, and TL Configuration"
            >
              <Lock size={13} /> Excel &amp; Credentials
            </button>
            <button onClick={fetchAll} className="btn btn-secondary btn-sm desktop-only"><RefreshCw size={13} /> Refresh</button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-muted)' }}
              title="Sign Out"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* Coordinator Setup Alert (Shown if credentials not yet connected) */}
        {userProfile && !userProfile.hasEmailPass && (
          <div
            style={{
              marginBottom: 24,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(2, 132, 199, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.35)',
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
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  flexShrink: 0,
                }}
              >
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                  Connect Batch {userProfile.batch || 'Workspace'} {userProfile.emailProvider === 'both' ? 'Gmail & Outlook' : userProfile.emailProvider === 'outlook' ? 'Outlook Cloud' : 'Gmail'} to Automate Report Scanning
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {userProfile.emailProvider === 'both'
                    ? 'Enter your coordinator Gmail App Password and Outlook Cloud Password so NexusTrack can scan both mailboxes simultaneously.'
                    : 'Enter your coordinator credentials so NexusTrack can scan trainee submissions and update your batch Excel sheet automatically.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTopCredsModal(true)}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 12,
                padding: '8px 16px',
              }}
            >
              Setup Workspace Credentials &rarr;
            </button>
          </div>
        )}

        {/* Tab nav */}
        <div style={{ marginBottom: 32, overflowX: 'auto' }}>
          <div className="tab-nav" style={{ width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, gap: 16, color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ width: 32, height: 32 }} /> Loading NexusTrack data...
          </div>
        ) : (
          <div id={`tab-${activeTab}`} style={{ animation: 'fadeUp 0.3s ease', background: 'var(--bg-base)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            {activeTab === 'overview' && <OverviewTab meetings={meetings} mails={mails} trainees={trainees} assessments={assessments} projects={projects} repos={repos} onNavigateTab={setActiveTab} />}
            {activeTab === 'tracker' && <DailyTrackerView onRefresh={fetchAll} />}
            {activeTab === 'trainees' && <TraineeBatchManager trainees={trainees} onRefresh={fetchAll} />}
            {activeTab === 'meetings' && <MeetingsTab meetings={meetings} onRefresh={fetchAll} />}
            {activeTab === 'mail' && <MailTab mails={mails} onRefresh={fetchAll} />}
            {activeTab === 'assessments' && <AssessmentsTab trainees={trainees} assessments={assessments} onRefresh={fetchAll} />}
            {activeTab === 'projects' && <ProjectsTab projects={projects} onRefresh={fetchAll} />}
            {activeTab === 'github' && <GithubTab repos={repos} onRefresh={fetchAll} />}
          </div>
        )}
      </div>

      {/* Top Credentials & Excel Password Modal */}
      <CredentialsSettingsModal
        isOpen={showTopCredsModal}
        onClose={() => setShowTopCredsModal(false)}
      />
    </div>
  );
}
