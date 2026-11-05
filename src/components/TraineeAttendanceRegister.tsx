'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, LogIn, LogOut, Mail, Send,
  RefreshCw, Check, X, Shield, User, Filter, AlertCircle, Sparkles, Users, MessageSquare
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import TraineeAbsenceNoticeModal from '@/components/TraineeAbsenceNoticeModal';
import TeamsSetupModal from '@/components/TeamsSetupModal';

export interface AttendanceItem {
  _id: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  batchNumber: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  status: 'on-time' | 'grace-period' | 'late' | 'absent' | 'on-leave' | 'logged-out';
  goodMorningSent: boolean;
  absenceNoticeSent: boolean;
  absenceNoticeDraftedAt?: string;
  minutesLate: number;
  remarks: string;
}

interface TraineeAttendanceRegisterProps {
  batchNumber?: string;
  date?: string;
  onBatchChange?: (batch: string) => void;
}

export default function TraineeAttendanceRegister({
  batchNumber = '3',
  date = new Date().toISOString().split('T')[0],
  onBatchChange,
}: TraineeAttendanceRegisterProps) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [activeBatch, setActiveBatch] = useState<string>(batchNumber || '3');
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [graceMinutes, setGraceMinutes] = useState<15 | 20>(15);
  const [selectedForNotice, setSelectedForNotice] = useState<any | null>(null);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Sync internal activeBatch with external prop
  useEffect(() => {
    if (batchNumber && batchNumber !== activeBatch) {
      setActiveBatch(batchNumber);
    }
  }, [batchNumber]);

  // Update live clock
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${date}&batch=${activeBatch}&grace=${graceMinutes}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        setStats(data.stats || null);
      }
    } catch {
      toastError('Network Error', 'Could not load attendance registry.');
    } finally {
      setLoading(false);
    }
  }, [date, activeBatch, graceMinutes]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleSelectBatch = (b: string) => {
    setActiveBatch(b);
    onBatchChange?.(b);
  };

  const handlePunchLogin = async (traineeId: string, traineeName: string) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          traineeId,
          date,
          batch: activeBatch,
          graceMinutes,
        }),
      });

      if (res.ok) {
        toastSuccess('Login Recorded', `${traineeName} punched in.`);
        fetchAttendance();
      }
    } catch {
      toastError('Error', 'Failed to record login.');
    }
  };

  const handlePunchLogout = async (traineeId: string, traineeName: string) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logout',
          traineeId,
          date,
          batch: activeBatch,
        }),
      });

      if (res.ok) {
        toastSuccess('Logout Recorded', `${traineeName} shift concluded.`);
        fetchAttendance();
      }
    } catch {
      toastError('Error', 'Failed to record logout.');
    }
  };

  const handleToggleGM = async (traineeId: string) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-gm',
          traineeId,
          date,
          batch: activeBatch,
        }),
      });

      if (res.ok) {
        fetchAttendance();
      }
    } catch {}
  };

  const missingTrainees = records.filter(
    r => (!r.loginTime || r.status === 'absent') && r.status !== 'on-leave'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Batch Switcher Banner for Separate Attendance Tracking */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 18px',
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
            Active Attendance Cohort:
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleSelectBatch('3')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: activeBatch === '3' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background:
                  activeBatch === '3'
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(14, 165, 233, 0.2))'
                    : 'rgba(255, 255, 255, 0.03)',
                color: activeBatch === '3' ? '#38bdf8' : '#94a3b8',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={14} />
              <span>Batch 3 Attendance (6 Active Trainees)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBatch('4')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: activeBatch === '4' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                background:
                  activeBatch === '4'
                    ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(168, 85, 247, 0.2))'
                    : 'rgba(255, 255, 255, 0.03)',
                color: activeBatch === '4' ? '#c084fc' : '#94a3b8',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={14} />
              <span>Batch 4 Attendance (7 Active Trainees)</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#64748b' }}>
          Separate Tracker: <strong style={{ color: activeBatch === '3' ? '#38bdf8' : '#c084fc' }}>Batch {activeBatch} Active Roster</strong>
        </div>
      </div>
      {/* Policy & Punctuality Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(239, 68, 68, 0.08))',
          border: '1px solid rgba(2, 132, 199, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(2, 132, 199, 0.2)',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
                9:00 AM Punctuality & Attendance Engine
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                🕒 Live: {currentTime || '09:00 AM'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
              Standard Shift Start: <strong>09:00 AM</strong> • Cutoff with Grace Period: <strong>09:{graceMinutes} AM</strong>
            </div>
          </div>
        </div>

        {/* Grace Window Switcher & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: 11, color: '#94a3b8', padding: '0 6px' }}>Grace Window:</span>
            <button
              onClick={() => setGraceMinutes(15)}
              style={{
                background: graceMinutes === 15 ? '#0284c7' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              15 min (9:15 AM)
            </button>
            <button
              onClick={() => setGraceMinutes(20)}
              style={{
                background: graceMinutes === 20 ? '#0284c7' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              20 min (9:20 AM)
            </button>
          </div>

          <button
            onClick={() => setShowTeamsModal(true)}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #5B5FC7, #444791)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(91, 95, 199, 0.35)',
              transition: 'all 0.15s ease',
            }}
            title="Open Microsoft Teams 9:00 AM Attendance & Login Operations"
          >
            <MessageSquare size={14} />
            <span>💬 Teams Operations</span>
          </button>

          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 11, gap: 5 }}
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Enrolled</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{stats.total}</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: 11, color: '#10b981', textTransform: 'uppercase', fontWeight: 600 }}>🟢 On Time (≤ 9:00)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#34d399', marginTop: 4 }}>{stats.onTime}</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ fontSize: 11, color: '#f59e0b', textTransform: 'uppercase', fontWeight: 600 }}>🟡 Grace ({graceMinutes}m)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', marginTop: 4 }}>{stats.gracePeriod}</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ fontSize: 11, color: '#ef4444', textTransform: 'uppercase', fontWeight: 600 }}>🔴 Not Logged In</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f87171', marginTop: 4 }}>{stats.missingPastGrace}</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ fontSize: 11, color: '#818cf8', textTransform: 'uppercase', fontWeight: 600 }}>Shift Completed</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#a5b4fc', marginTop: 4 }}>{stats.loggedOut}</div>
          </div>
        </div>
      )}

      {/* Trainees Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Trainee Name</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Login (9:00 AM Target)</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Good Morning Msg</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Logout Punch</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Absence Notice & Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const isAbsentOrMissing = (!r.loginTime || r.status === 'absent') && r.status !== 'on-leave';
                return (
                  <tr
                    key={r._id || r.traineeId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isAbsentOrMissing ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: isAbsentOrMissing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                          }}
                        >
                          👤
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{r.traineeName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{r.traineeEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Login Punch */}
                    <td style={{ padding: '14px 18px' }}>
                      {r.loginTime ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#34d399' }}>
                            {r.loginTime}
                          </span>
                          {r.minutesLate > 0 && (
                            <span style={{ fontSize: 10, color: '#fbbf24' }}>
                              (+{r.minutesLate}m)
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePunchLogin(r.traineeId, r.traineeName)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: 11, gap: 4, padding: '4px 10px', color: '#38bdf8' }}
                        >
                          <LogIn size={12} />
                          <span>Punch In</span>
                        </button>
                      )}
                    </td>

                    {/* Good Morning Flag */}
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleGM(r.traineeId)}
                        style={{
                          background: r.goodMorningSent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                          border: r.goodMorningSent ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          color: r.goodMorningSent ? '#10b981' : '#f87171',
                          borderRadius: 6,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                        title="Click to toggle Good Morning group check-in status"
                      >
                        {r.goodMorningSent ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        <span>{r.goodMorningSent ? 'GM Acknowledged' : 'No GM Msg'}</span>
                      </button>
                    </td>

                    {/* Logout Punch */}
                    <td style={{ padding: '14px 18px' }}>
                      {r.logoutTime ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a5b4fc' }}>
                          {r.logoutTime}
                        </span>
                      ) : r.loginTime ? (
                        <button
                          type="button"
                          onClick={() => handlePunchLogout(r.traineeId, r.traineeName)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: 11, gap: 4, padding: '4px 10px', color: '#a5b4fc' }}
                        >
                          <LogOut size={12} />
                          <span>Punch Out</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#475569' }}>—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: 6,
                          textTransform: 'uppercase',
                          background:
                            r.status === 'on-time'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : r.status === 'grace-period'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : r.status === 'late'
                              ? 'rgba(249, 115, 22, 0.2)'
                              : r.status === 'logged-out'
                              ? 'rgba(99, 102, 241, 0.2)'
                              : r.status === 'on-leave'
                              ? 'rgba(148, 163, 184, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                          color:
                            r.status === 'on-time'
                              ? '#34d399'
                              : r.status === 'grace-period'
                              ? '#fbbf24'
                              : r.status === 'late'
                              ? '#fb923c'
                              : r.status === 'logged-out'
                              ? '#a5b4fc'
                              : r.status === 'on-leave'
                              ? '#94a3b8'
                              : '#f87171',
                          border:
                            r.status === 'on-time'
                              ? '1px solid rgba(16, 185, 129, 0.4)'
                              : r.status === 'grace-period'
                              ? '1px solid rgba(245, 158, 11, 0.4)'
                              : r.status === 'late'
                              ? '1px solid rgba(249, 115, 22, 0.4)'
                              : r.status === 'logged-out'
                              ? '1px solid rgba(99, 102, 241, 0.4)'
                              : r.status === 'on-leave'
                              ? '1px solid rgba(148, 163, 184, 0.4)'
                              : '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        {r.status === 'on-time'
                          ? 'On Time'
                          : r.status === 'grace-period'
                          ? `Grace (${r.minutesLate}m)`
                          : r.status === 'late'
                          ? `Late (${r.minutesLate}m)`
                          : r.status === 'logged-out'
                          ? 'Shift Done'
                          : r.status === 'on-leave'
                          ? 'On Leave'
                          : 'Not Logged In'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
                        {r.absenceNoticeSent ? (
                          <span
                            style={{
                              fontSize: 11,
                              color: '#10b981',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Notice Logged</span>
                          </span>
                        ) : null}

                        {isAbsentOrMissing && (
                          <button
                            type="button"
                            onClick={() => setSelectedForNotice(r)}
                            className="btn btn-sm"
                            style={{
                              fontSize: 11,
                              gap: 5,
                              padding: '5px 10px',
                              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 700,
                              borderRadius: 6,
                              cursor: 'pointer',
                              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
                            }}
                            title="Draft and send the 9:00 AM absence clarification email"
                          >
                            <Mail size={12} />
                            <span>Draft Absence Mail</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Absence Notice Modal */}
      <TraineeAbsenceNoticeModal
        isOpen={Boolean(selectedForNotice)}
        onClose={() => setSelectedForNotice(null)}
        trainee={selectedForNotice}
        date={date}
        onNoticeSent={fetchAttendance}
      />

      {/* Microsoft Teams Operations Modal */}
      <TeamsSetupModal
        isOpen={showTeamsModal}
        onClose={() => setShowTeamsModal(false)}
        batchNumber={activeBatch}
        date={date}
        onAttendanceUpdated={fetchAttendance}
      />
    </div>
  );
}
