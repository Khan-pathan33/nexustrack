'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Plus, Search, Filter, Award, GitBranch, Edit, Trash2,
  CheckCircle, Clock, AlertCircle, X, Shield, Sparkles, BookOpen, User, Mail
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import TraineeReportCardModal from '@/components/TraineeReportCardModal';
import GithubCommitValidatorModal from '@/components/GithubCommitValidatorModal';
import TraineeAttendanceRegister from '@/components/TraineeAttendanceRegister';
import TraineeAbsenceNoticeModal from '@/components/TraineeAbsenceNoticeModal';


export interface TraineeData {
  _id: string;
  name: string;
  email: string;
  department: string;
  skills: string[];
  overallScore: number;
  status: 'active' | 'completed' | 'on-leave';
  avatar: string;
  joinedDate: string;
}

interface TraineeBatchManagerProps {
  trainees: TraineeData[];
  onRefresh: () => void;
}

export default function TraineeBatchManager({ trainees, onRefresh }: TraineeBatchManagerProps) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [selectedBatch, setSelectedBatch] = useState<string>('3');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on-leave'>('all');

  // Modals state
  const [showAddTraineeModal, setShowAddTraineeModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [selectedTraineeForCard, setSelectedTraineeForCard] = useState<TraineeData | null>(null);
  const [selectedTraineeForGh, setSelectedTraineeForGh] = useState<{ username: string; repo: string } | null>(null);
  const [selectedTraineeForNotice, setSelectedTraineeForNotice] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance'>('roster');

  // New trainee form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Batch 3 Frontend');
  const [newSkills, setNewSkills] = useState('HTML5, CSS3, Flexbox, React');
  const [newAvatar, setNewAvatar] = useState('👩‍💻');

  // New batch form state
  const [newBatchId, setNewBatchId] = useState('5');
  const [newBatchName, setNewBatchName] = useState('Batch 5 — Full Stack & Cloud Track');
  const [newBatchTrack, setNewBatchTrack] = useState('Next.js 16, TypeScript, MongoDB, Cloud Workflows');

  const batches = [
    {
      id: '3',
      name: 'Batch 3 — Core Frontend & React',
      track: 'HTML5, CSS Grid/Flexbox, React 19',
      count: trainees.filter(t => !t.department?.includes('Batch 4') && t.status === 'active').length || 6,
      status: 'Active',
    },
    {
      id: '4',
      name: 'Batch 4 — Web Development Foundation',
      track: 'Modern Web, Semantic HTML, Responsive UI',
      count: trainees.filter(t => t.department?.includes('Batch 4') && t.status === 'active').length || 7,
      status: 'Active',
    },
    { id: '5', name: 'Batch 5 — Full Stack & Cloud', track: 'Next.js 16, TypeScript, MongoDB, REST APIs', count: 4, status: 'Upcoming' },
  ];

  const filteredTrainees = useMemo(() => {
    return trainees.filter(t => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      // Filter by batch heuristic: check department string or match selection
      const matchesBatch =
        selectedBatch === 'all' ||
        (selectedBatch === '3' ? !t.department?.includes('Batch 4') : t.department?.includes(`Batch ${selectedBatch}`));

      return matchesSearch && matchesStatus && matchesBatch;
    });
  }, [trainees, searchQuery, statusFilter, selectedBatch]);

  const handleCreateTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toastError('Validation Error', 'Name and Email are required.');
      return;
    }

    try {
      const res = await fetch('/api/trainees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'trainee',
          name: newName.trim(),
          email: newEmail.trim(),
          department: newDept || `Batch ${selectedBatch} Frontend`,
          skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
          avatar: newAvatar || '👤',
          joinedDate: new Date().toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        toastSuccess('Trainee Enrolled', `${newName} added to Batch ${selectedBatch}.`);
        setShowAddTraineeModal(false);
        setNewName('');
        setNewEmail('');
        onRefresh();
      } else {
        toastError('Failed', 'Could not save trainee.');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with trainees service.');
    }
  };

  const handleToggleStatus = async (trainee: TraineeData) => {
    const nextStatus = trainee.status === 'active' ? 'on-leave' : 'active';
    try {
      const res = await fetch('/api/trainees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: trainee._id,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        toastSuccess('Status Updated', `${trainee.name} marked as ${nextStatus}.`);
        onRefresh();
      }
    } catch {
      toastError('Error', 'Failed to update trainee status.');
    }
  };

  const handleDeleteTrainee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await fetch(`/api/trainees?id=${id}&type=trainee`, { method: 'DELETE' });
      if (res.ok) {
        toastSuccess('Removed', `${name} removed from registry.`);
        onRefresh();
      }
    } catch {
      toastError('Error', 'Failed to remove trainee.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={22} color="#0284c7" />
            Batch & Trainee Management Hub
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
            Manage trainee cohorts, status tracking, performance scorecards, and GitHub code audits
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowAddBatchModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, gap: 6 }}
          >
            <Plus size={14} />
            <span>Create Batch</span>
          </button>
          <button
            onClick={() => setShowAddTraineeModal(true)}
            className="btn btn-primary btn-sm"
            style={{
              fontSize: 12,
              gap: 6,
              background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            }}
          >
            <Plus size={14} />
            <span>Enroll Trainee</span>
          </button>
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {batches.map(b => {
          const isSelected = selectedBatch === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBatch(b.id)}
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                cursor: 'pointer',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(124, 58, 237, 0.12))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isSelected
                  ? '1px solid rgba(2, 132, 199, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? '0 10px 25px rgba(2, 132, 199, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: isSelected ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#38bdf8' : '#94a3b8',
                  }}
                >
                  Cohort #{b.id}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: b.status === 'Active' ? '#10b981' : '#f59e0b',
                  }}
                >
                  ● {b.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>
                {b.name}
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                {b.track}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                <span>{b.count} Enrolled Trainees</span>
                <span style={{ color: isSelected ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                  {isSelected ? '✓ Selected' : 'Click to View'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-Tab Navigation: Roster vs 9:00 AM Attendance & Login/Logout Register */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '6px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('roster')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeSubTab === 'roster' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeSubTab === 'roster' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Users size={14} />
            <span>Trainee Cohort Roster ({filteredTrainees.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('attendance')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeSubTab === 'attendance' ? 'linear-gradient(135deg, #0284c7, #7c3aed)' : 'transparent',
              color: activeSubTab === 'attendance' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Clock size={14} />
            <span>9:00 AM Attendance & Login/Logout Register</span>
            <span
              style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              Live Monitor
            </span>
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#64748b', paddingRight: 8 }}>
          Cohort: <strong>Batch {selectedBatch}</strong>
        </div>
      </div>

      {activeSubTab === 'attendance' ? (
        <TraineeAttendanceRegister batchNumber={selectedBatch} onBatchChange={setSelectedBatch} />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search trainees by name, email, or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#f8fafc',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Status:</span>
          {(['all', 'active', 'on-leave'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`btn btn-sm ${statusFilter === s ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                textTransform: 'capitalize',
                background: statusFilter === s ? 'rgba(2, 132, 199, 0.2)' : 'transparent',
                color: statusFilter === s ? '#38bdf8' : '#94a3b8',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Trainees Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {filteredTrainees.map(t => (
          <div
            key={t._id}
            style={{
              padding: 18,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'rgba(2, 132, 199, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    {t.avatar || '👤'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                      {t.name}
                    </h4>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{t.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(t)}
                  title="Click to toggle status"
                  style={{
                    background: t.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: t.status === 'active' ? '#10b981' : '#f59e0b',
                    border: t.status === 'active' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.status}
                </button>
              </div>

              {/* Skills Tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {(t.skills || ['HTML5', 'CSS3', 'React']).slice(0, 4).map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      fontSize: 10,
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Score bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                  <span>Performance Rating</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{t.overallScore || 75}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${t.overallScore || 75}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #0284c7, #10b981)',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setSelectedTraineeForCard(t)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, gap: 5, padding: '5px 10px' }}
                  title="Generate Branded Performance PDF Report Card"
                >
                  <Award size={13} color="#a78bfa" />
                  <span>Report Card</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedTraineeForGh({
                      username: t.name.toLowerCase().replace(/\s+/g, '-'),
                      repo: 'frontend-tracker',
                    })
                  }
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, gap: 5, padding: '5px 10px' }}
                  title="Audit Trainee GitHub Commits with Gemini AI"
                >
                  <GitBranch size={13} color="#38bdf8" />
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedTraineeForNotice({
                      traineeId: t._id,
                      traineeName: t.name,
                      traineeEmail: t.email,
                      batchNumber: selectedBatch,
                    })
                  }
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, gap: 5, padding: '5px 8px', color: '#f87171' }}
                  title="Draft 9:00 AM Absence & Login Clarification Notice"
                >
                  <Mail size={12} color="#ef4444" />
                  <span>Notice</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteTrainee(t._id, t.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: 4,
                  opacity: 0.7,
                }}
                title="Remove Trainee"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* Enroll Trainee Modal */}
      {showAddTraineeModal && (
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
              maxWidth: 480,
              background: '#0d1322',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                Enroll New Trainee in Batch {selectedBatch}
              </h3>
              <button onClick={() => setShowAddTraineeModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTrainee} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohith Varma"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rohith.varma@nybinfotech.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="HTML5, CSS3, Flexbox, React 19"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddTraineeModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #0284c7, #7c3aed)' }}>
                  Save & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Batch Modal */}
      {showAddBatchModal && (
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
              maxWidth: 480,
              background: '#0d1322',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                Create New Cohort / Batch
              </h3>
              <button onClick={() => setShowAddBatchModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Batch Identifier / Number</label>
                <input
                  type="text"
                  value={newBatchId}
                  onChange={e => setNewBatchId(e.target.value)}
                  placeholder="e.g. 5"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Batch Name & Track</label>
                <input
                  type="text"
                  value={newBatchName}
                  onChange={e => setNewBatchName(e.target.value)}
                  placeholder="e.g. Batch 5 — Enterprise Cloud & Next.js"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Syllabus Focus</label>
                <input
                  type="text"
                  value={newBatchTrack}
                  onChange={e => setNewBatchTrack(e.target.value)}
                  placeholder="React 19, Node.js, Cloud APIs, SharePoint Automation"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddBatchModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toastSuccess('Batch Created', `${newBatchName} is now ready for enrollment.`);
                    setShowAddBatchModal(false);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #7c3aed)' }}
                >
                  Create Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trainee Report Card Modal */}
      <TraineeReportCardModal
        isOpen={Boolean(selectedTraineeForCard)}
        onClose={() => setSelectedTraineeForCard(null)}
        trainee={selectedTraineeForCard}
        batchNumber={selectedBatch}
      />

      {/* GitHub Commit Validator Modal */}
      <GithubCommitValidatorModal
        isOpen={Boolean(selectedTraineeForGh)}
        onClose={() => setSelectedTraineeForGh(null)}
        defaultUsername={selectedTraineeForGh?.username || 'PathanNafisa'}
        defaultRepoName={selectedTraineeForGh?.repo || 'frontend-tracker'}
      />

      {/* 9:00 AM Absence & Login Notice Modal */}
      <TraineeAbsenceNoticeModal
        isOpen={Boolean(selectedTraineeForNotice)}
        onClose={() => setSelectedTraineeForNotice(null)}
        trainee={selectedTraineeForNotice}
        onNoticeSent={onRefresh}
      />
    </div>
  );
}
