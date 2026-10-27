'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  X,
  Download,
  ShieldCheck,
  Volume2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface NotificationItem {
  id: string;
  trainee: string;
  batch: string;
  submissionDate: string;
  time: string;
  subject: string;
  hasZip: boolean;
  zipFilename: string;
  mistakesFound: string[];
  reviewStatus: string;
  performanceScore: number;
  type: 'success' | 'warning';
  excelUpdated: boolean;
  excelSheetName: string;
}

export default function NexusTrackNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [desktopPerm, setDesktopPerm] = useState<string>('default');
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check initial notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setDesktopPerm(Notification.permission);
    }
  }, []);

  // Play subtle web audio notification chime
  const playNotificationChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Trigger browser Windows native notification
  const sendDesktopNotification = (item: NotificationItem) => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const title = `NexusTrack: ${item.trainee} Email Scanned`;
        const options: NotificationOptions = {
          body: `Excel Sheet "${item.excelSheetName}" updated successfully.\nScore: ${item.performanceScore}/100 • Batch ${item.batch}`,
          icon: '/favicon.ico',
        };
        new Notification(title, options);
      }
    } catch {}
  };

  const showLiveAlert = (item: NotificationItem) => {
    playNotificationChime();
    setToastNotification(item);
    sendDesktopNotification(item);

    // Auto-dismiss floating toast after 7 seconds
    setTimeout(() => {
      setToastNotification((curr) => (curr && curr.id === item.id ? null : curr));
    }, 7000);
  };

  const requestDesktopPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setDesktopPerm(perm);
      if (perm === 'granted') {
        // Send instant test notification
        new Notification('NexusTrack Alerts Enabled', {
          body: 'You will receive desktop alerts whenever emails arrive and Excel is updated.',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const triggerTestNotification = () => {
    const testItem: NotificationItem = {
      id: `test_${Date.now()}`,
      trainee: 'Bala Krishna Parimi',
      batch: '3',
      submissionDate: '14-10-2026',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: 'Fw: Dailly Status Report_ (14-10-2026)',
      hasZip: true,
      zipFilename: 'Balakrishna_(14-10-2026).zip',
      mistakesFound: [],
      reviewStatus: 'Reviewed. Complete coverage and verified assignment code.',
      performanceScore: 95,
      type: 'success',
      excelUpdated: true,
      excelSheetName: '14-10-2026',
    };
    showLiveAlert(testItem);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/mails/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        const items: NotificationItem[] = data.notifications;
        setNotifications(items);

        if (items.length > 0) {
          const newestItem = items[0];
          const storedLastSeen = localStorage.getItem('nexustrack_last_seen_notif');

          if (!storedLastSeen) {
            localStorage.setItem('nexustrack_last_seen_notif', newestItem.id);
            setUnreadCount(items.length);
          } else if (storedLastSeen !== newestItem.id) {
            // A brand new email arrived!
            localStorage.setItem('nexustrack_last_seen_notif', newestItem.id);
            setUnreadCount((prev) => prev + 1);
            showLiveAlert(newestItem);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 seconds for immediate alert reaction
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      setUnreadCount(0);
      if (notifications.length > 0) {
        localStorage.setItem('nexustrack_last_seen_notif', notifications[0].id);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* ================= FLOATING ON-SCREEN TOAST POPUP ================= */}
      {toastNotification && (
        <div
          style={{
            position: 'fixed',
            top: 76,
            right: 24,
            zIndex: 10000,
            width: 360,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #38bdf8',
            borderRadius: 12,
            boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 25px rgba(56, 189, 248, 0.4)',
            backdropFilter: 'blur(16px)',
            padding: 16,
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}
              >
                <FileSpreadsheet size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                  Gmail Scanned &amp; Excel Updated!
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {toastNotification.trainee} (Batch {toastNotification.batch})
                </div>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={15} />
            </button>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: '6px 10px',
              background: 'rgba(56, 189, 248, 0.1)',
              borderRadius: 6,
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontSize: 11,
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Excel Sheet: <strong>{toastNotification.excelSheetName}</strong></span>
            <span>Score: <strong>{toastNotification.performanceScore}/100</strong></span>
          </div>

          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 6 }}>
            Subject: <em>&ldquo;{toastNotification.subject}&rdquo;</em>
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={() => {
                setToastNotification(null);
                setIsOpen(true);
              }}
              style={{
                background: '#0284c7',
                border: 'none',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* ================= BELL ICON & DROPDOWN ================= */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        {/* Bell Icon Trigger */}
        <button
          type="button"
          onClick={handleToggle}
          style={{
            position: 'relative',
            background: isOpen ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.7)',
            border: isOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOpen ? '#38bdf8' : '#e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isOpen ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none',
          }}
          title="NexusTrack Live Mail & Excel Notifications"
        >
          <Bell size={17} />

          {/* Counter Badge */}
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                background: '#ef4444',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 800,
                borderRadius: '50%',
                minWidth: 17,
                height: 17,
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Flyout Notification Center */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 44,
              right: 0,
              width: 400,
              maxHeight: 560,
              background: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 14,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.2)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                  NexusTrack Live Notifications
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div
              style={{
                padding: '8px 16px',
                background: 'rgba(56, 189, 248, 0.08)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#38bdf8' }}>
                <ShieldCheck size={13} /> 1-Min Auto-Sync Active
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {desktopPerm !== 'granted' ? (
                  <button
                    onClick={requestDesktopPermission}
                    style={{
                      background: 'rgba(56, 189, 248, 0.18)',
                      border: '1px solid #38bdf8',
                      color: '#38bdf8',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Enable Windows Alerts
                  </button>
                ) : (
                  <span style={{ color: '#10b981', fontSize: 10, fontWeight: 600 }}>
                    ✓ Windows Alerts ON
                  </span>
                )}

                <button
                  onClick={triggerTestNotification}
                  title="Test audio chime & toast banner"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#e2e8f0',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Volume2 size={10} /> Test
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '8px 0',
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: 12,
                  }}
                >
                  📭 No email scan events yet today.
                  <br />
                  Reports will appear here automatically when received.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      background: item.type === 'warning' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(16, 185, 129, 0.03)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.type === 'warning' ? (
                          <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        ) : (
                          <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                          {item.trainee}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 6,
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                          }}
                        >
                          Batch {item.batch}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>
                        {item.time}
                      </span>
                    </div>

                    {/* Excel Sheet Updated Tag */}
                    <div
                      style={{
                        margin: '6px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#34d399',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      <FileSpreadsheet size={12} /> Master Excel Updated: <strong>Sheet &ldquo;{item.excelSheetName}&rdquo;</strong>
                    </div>

                    {/* Subject line */}
                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0' }}>
                      Subject: <em>&ldquo;{item.subject}&rdquo;</em>
                    </div>

                    {item.hasZip && (
                      <div style={{ fontSize: 10, color: '#38bdf8', marginTop: 2 }}>
                        📦 Code Zip: {item.zipFilename}
                      </div>
                    )}

                    {/* Discrepancies / Warnings */}
                    {item.mistakesFound && item.mistakesFound.length > 0 && (
                      <div
                        style={{
                          marginTop: 6,
                          padding: '6px 10px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          borderLeft: '2px solid #ef4444',
                          borderRadius: '0 6px 6px 0',
                          fontSize: 11,
                          color: '#fca5a5',
                        }}
                      >
                        {item.mistakesFound.map((m, mIdx) => (
                          <div key={mIdx} style={{ margin: '2px 0' }}>
                            ⚠️ {m}
                          </div>
                        ))}
                        <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>
                          📬 Discrepancy sent exclusively to: <strong>nafisakhanampathan65@gmail.com</strong>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <a
                href="/api/daily-tracker/export-excel?batch=3"
                download="Technical Team batch-3_Daily_Status_Report.xlsx"
                style={{
                  fontSize: 11,
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Download size={12} /> Download Master Excel (.xlsx)
              </a>

              <button
                type="button"
                onClick={fetchNotifications}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <RefreshCw size={11} /> Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
