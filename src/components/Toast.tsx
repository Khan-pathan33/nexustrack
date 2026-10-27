'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'ai';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; message: string; duration?: number }) => void;
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
  ai: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 4500,
    }: {
      type?: ToastType;
      title: string;
      message: string;
      duration?: number;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };
      
      // Defer state update to next macrotask to prevent React render-phase update warnings
      setTimeout(() => {
        setToasts((prev) => [...prev.slice(-4), newToast]);
      }, 0);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration + 50);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message: string) => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((title: string, message: string) => addToast({ type: 'error', title, message }), [addToast]);
  const info = useCallback((title: string, message: string) => addToast({ type: 'info', title, message }), [addToast]);
  const ai = useCallback((title: string, message: string) => addToast({ type: 'ai', title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, ai }}>
      {children}
      {/* Toast Render Stack */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
          maxWidth: 420,
          width: 'calc(100vw - 40px)',
        }}
      >
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              border: 'rgba(16, 185, 129, 0.4)',
              accent: 'var(--emerald, #10b981)',
              glow: 'rgba(16, 185, 129, 0.25)',
              icon: <CheckCircle2 size={16} color="#34d399" />,
            },
            error: {
              border: 'rgba(239, 68, 68, 0.4)',
              accent: 'var(--rose, #ef4444)',
              glow: 'rgba(239, 68, 68, 0.25)',
              icon: <AlertTriangle size={16} color="#f87171" />,
            },
            info: {
              border: 'rgba(6, 182, 212, 0.4)',
              accent: 'var(--cyan, #06b6d4)',
              glow: 'rgba(6, 182, 212, 0.25)',
              icon: <Info size={16} color="#22d3ee" />,
            },
            ai: {
              border: 'rgba(168, 85, 247, 0.45)',
              accent: 'var(--violet, #8b5cf6)',
              glow: 'rgba(168, 85, 247, 0.3)',
              icon: <Sparkles size={16} color="#c084fc" />,
            },
          }[t.type];

          return (
            <div
              key={t.id}
              role="alert"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                background: 'rgba(11, 17, 33, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 14,
                border: `1px solid ${typeConfig.border}`,
                boxShadow: `0 12px 32px -4px rgba(0,0,0,0.65), 0 0 20px ${typeConfig.glow}`,
                position: 'relative',
                overflow: 'hidden',
                animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              {/* Vertical Glowing Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: typeConfig.accent,
                  boxShadow: `0 0 10px ${typeConfig.accent}`,
                }}
              />

              {/* Icon Container */}
              <div
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}
              >
                {typeConfig.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  {t.title}
                  {t.type === 'ai' && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      GEMINI 2.5
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}
                >
                  {t.message}
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease, background 0.15s ease',
                  flexShrink: 0,
                  marginTop: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f8fafc';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
