"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  ArrowLeft, Mail, Lock, User, Eye, EyeOff,
  Sparkles, GraduationCap, GitBranch, ShieldCheck,
  Zap, AlertCircle
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/components/Toast';
import './login.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('5');
  const [customBatch, setCustomBatch] = useState('');
  const [role, setRole] = useState('coordinator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { success: toastSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please verify your credentials.');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      try {
        const effectiveBatch = batch === 'custom' ? customBatch.trim() || '5' : batch;
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            batch: effectiveBatch,
            role,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setIsLogin(true);
          setError('');
          toastSuccess(
            'Coordinator Account Created',
            `Batch ${effectiveBatch} workspace ready! Please sign in with your email and password.`
          );
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch {
        setError('An error occurred during registration. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-root">
      {/* Ambient Lighting Orbs */}
      <div className="auth-ambient-orb-1" />
      <div className="auth-ambient-orb-2" />

      {/* Floating Back Navigation */}
      <div className="auth-top-nav">
        <Link href="/" className="auth-back-link">
          <ArrowLeft size={14} /> Back to NexusTrack
        </Link>
      </div>

      {/* Main Split Layout Card */}
      <div className="auth-layout-container">
        
        {/* ── LEFT COLUMN: BRAND & SHOWCASE ── */}
        <div className="auth-showcase-column">
          <div className="auth-showcase-header">
            <Logo size="lg" subtitle="Operations Command Center" />
            <h2 className="auth-tagline">
              The Command Center for{' '}
              <span className="auth-tagline-gradient">Team & Trainee Operations</span>
            </h2>
            <p className="auth-description">
              Unify daily engineering standups, Gemini-powered automated trainee evaluation, live GitHub tracking, and sprint pipelines in one unified platform.
            </p>
          </div>

          {/* Capabilities List */}
          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div className="auth-feature-title">Gemini 2.5 Flash Triage</div>
                <div className="auth-feature-subtitle">Automated report parsing, task verification & blocker detection</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <div className="auth-feature-title">Trainee Radar & Grading</div>
                <div className="auth-feature-subtitle">Auto-calculated weighted scores, skill heatmaps & growth metrics</div>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
                <GitBranch size={18} />
              </div>
              <div>
                <div className="auth-feature-title">Real-Time GitHub Sync</div>
                <div className="auth-feature-subtitle">Live repository telemetry with commits, stars, and pull requests</div>
              </div>
            </div>
          </div>

          {/* Live Status Chip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <div className="auth-telemetry-chip">
              <span className="auth-pulse-dot" />
              <span>Telemetry Cloud &bull; Operational</span>
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>v2.5 Release</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: AUTHENTICATION COCKPIT ── */}
        <div className="auth-form-column">
          
          {/* Segmented Tab Switcher */}
          <div className="auth-tab-switcher">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            >
              <Lock size={14} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            >
              <User size={14} /> Create Account
            </button>
          </div>

          <h3 className="auth-form-title">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h3>
          <p className="auth-form-subtitle">
            {isLogin
              ? 'Enter your credentials to access the command center.'
              : 'Register your account to manage team telemetry.'}
          </p>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Credentials Info Card */}
          {isLogin && (
            <div className="auth-credentials-box">
              <div>
                <div className="auth-credentials-title">
                  🔑 Administrator Credentials:
                </div>
                <div className="auth-credentials-text">
                  Email: <span className="auth-credentials-val">admin@trackpulse.com</span> &bull; Password: <span className="auth-credentials-val">admin123</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@trackpulse.com');
                  setPassword('admin123');
                }}
                className="auth-credentials-btn"
                title="Auto-fill credentials"
              >
                Auto-Fill &rarr;
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* Name Field (Sign Up only) */}
            {!isLogin && (
              <div className="auth-input-group">
                <label className="auth-input-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon-left" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="auth-input"
                  />
                </div>
              </div>
            )}

            {/* Batch & Role Fields (Sign Up only) */}
            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label className="auth-input-label">Assigned Batch Workspace</label>
                  <div className="auth-input-wrapper">
                    <GraduationCap size={16} className="auth-input-icon-left" />
                    <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="auth-input"
                      style={{ cursor: 'pointer', appearance: 'none' }}
                    >
                      <option value="5" style={{ background: '#0b1120', color: '#fff' }}>Batch 5 (Frontend / React Track)</option>
                      <option value="4" style={{ background: '#0b1120', color: '#fff' }}>Batch 4 (Full Stack Track)</option>
                      <option value="3" style={{ background: '#0b1120', color: '#fff' }}>Batch 3 (Web Development Track)</option>
                      <option value="6" style={{ background: '#0b1120', color: '#fff' }}>Batch 6 (Data &amp; Python Track)</option>
                      <option value="custom" style={{ background: '#0b1120', color: '#fff' }}>Other / Custom Batch Number...</option>
                    </select>
                  </div>
                </div>

                {batch === 'custom' && (
                  <div className="auth-input-group">
                    <label className="auth-input-label">Custom Batch Number / Code</label>
                    <div className="auth-input-wrapper">
                      <GitBranch size={16} className="auth-input-icon-left" />
                      <input
                        type="text"
                        value={customBatch}
                        onChange={(e) => setCustomBatch(e.target.value)}
                        placeholder="e.g. 7, 8, or AI-Track"
                        required
                        className="auth-input"
                      />
                    </div>
                  </div>
                )}

                <div className="auth-input-group">
                  <label className="auth-input-label">Operational Role</label>
                  <div className="auth-input-wrapper">
                    <ShieldCheck size={16} className="auth-input-icon-left" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="auth-input"
                      style={{ cursor: 'pointer', appearance: 'none' }}
                    >
                      <option value="coordinator" style={{ background: '#0b1120', color: '#fff' }}>Batch Coordinator / Operations Lead</option>
                      <option value="mentor" style={{ background: '#0b1120', color: '#fff' }}>Technical Mentor / Evaluator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Work Email</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon-left" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <Zap size={16} />
              {loading
                ? 'Processing Authorization...'
                : (isLogin ? 'Sign In to Command Center' : 'Create Administrator Account')}
            </button>
          </form>

          {/* Security & Compliance Footer */}
          <div className="auth-security-footer">
            <ShieldCheck size={14} color="#10b981" />
            <span>256-Bit TLS Encryption &bull; Protected by NextAuth JWT</span>
          </div>

        </div>

      </div>
    </div>
  );
}
