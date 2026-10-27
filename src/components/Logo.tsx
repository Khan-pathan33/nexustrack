"use client";
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  animated?: boolean;
  className?: string;
  subtitle?: string;
}

export default function Logo({
  size = 'md',
  withText = true,
  animated = true,
  className = '',
  subtitle,
}: LogoProps) {
  // Dimensions mapping
  const dimensions = {
    sm: { iconSize: 32, fontSize: 16, subFontSize: 9, dotSize: 4 },
    md: { iconSize: 40, fontSize: 20, subFontSize: 10, dotSize: 5 },
    lg: { iconSize: 52, fontSize: 26, subFontSize: 11, dotSize: 6 },
    xl: { iconSize: 68, fontSize: 34, subFontSize: 13, dotSize: 8 },
  }[size];

  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`nexus-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 10 : size === 'lg' ? 14 : size === 'xl' ? 18 : 12,
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* ── ELECTRIC PULSE & ORBIT ICON ── */}
      <div
        className="nexus-logo-icon-container"
        style={{
          position: 'relative',
          width: dimensions.iconSize,
          height: dimensions.iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Ambient neon backglow */}
        <div
          style={{
            position: 'absolute',
            inset: '-15%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 75%)',
            filter: 'blur(10px)',
            opacity: 0.85,
            pointerEvents: 'none',
            animation: animated ? 'logoPulseGlow 3.5s ease-in-out infinite alternate' : 'none',
          }}
        />

        <svg
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.35))',
          }}
        >
          <defs>
            {/* Background container gradient */}
            <linearGradient id={`bgGrad-${uniqueId}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e1338" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            {/* Orbit ring gradient */}
            <linearGradient id={`orbitGrad-${uniqueId}`} x1="4" y1="12" x2="52" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="85%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>

            {/* Electric Pulse Neon Gradient */}
            <linearGradient id={`pulseGrad-${uniqueId}`} x1="8" y1="28" x2="48" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="28%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="75%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            {/* Border Stroke Gradient */}
            <linearGradient id={`borderGrad-${uniqueId}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.7)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.6)" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#06b6d4" floodOpacity="0.6" />
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Squircle Glass Outer Shell */}
          <rect
            x="2"
            y="2"
            width="52"
            height="52"
            rx="15"
            fill={`url(#bgGrad-${uniqueId})`}
            stroke={`url(#borderGrad-${uniqueId})`}
            strokeWidth="1.5"
          />

          {/* Orbital Ring with slight 3D perspective angle */}
          <ellipse
            cx="28"
            cy="28"
            rx="21"
            ry="11"
            transform="rotate(-26 28 28)"
            stroke={`url(#orbitGrad-${uniqueId})`}
            strokeWidth="1.8"
            strokeDasharray="4 2 8 3"
            opacity="0.9"
            style={{
              transformOrigin: '28px 28px',
              animation: animated ? 'logoOrbitRotate 18s linear infinite' : 'none',
            }}
          />

          {/* Secondary faint outer tracking arc */}
          <path
            d="M 12 18 C 18 10, 38 10, 44 18"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* Core telemetry grid crosshair ticks (high-tech aesthetic) */}
          <line x1="28" y1="8" x2="28" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
          <line x1="28" y1="44" x2="28" y2="48" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
          <line x1="8" y1="28" x2="12" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
          <line x1="44" y1="28" x2="48" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />

          {/* ── THE ELECTRIC PULSE WAVE ── */}
          {/* Background glow stroke */}
          <path
            d="M 10 28 L 18 28 L 22 17 L 27 38 L 32 21 L 36 31 L 39 28 L 46 28"
            fill="none"
            stroke={`url(#pulseGrad-${uniqueId})`}
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
            filter={`url(#glow-${uniqueId})`}
          />

          {/* Foreground sharp pulse wave */}
          <path
            d="M 10 28 L 18 28 L 22 17 L 27 38 L 32 21 L 36 31 L 39 28 L 46 28"
            fill="none"
            stroke={`url(#pulseGrad-${uniqueId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Telemetry Tracking Node (Highest Peak) */}
          <circle cx="22" cy="17" r="2.5" fill="#ffffff" filter={`url(#glow-${uniqueId})`} />
          <circle cx="22" cy="17" r="4.5" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />

          {/* Orbit Satellite Node */}
          <circle
            cx="44"
            cy="24"
            r="2"
            fill="#06b6d4"
            filter={`url(#glow-${uniqueId})`}
            style={{
              animation: animated ? 'logoBeaconBlink 2s ease-in-out infinite' : 'none',
            }}
          />
        </svg>

        {/* Live Pulse Radar Ring (Pinging beacon) */}
        {animated && (
          <span
            style={{
              position: 'absolute',
              top: '18%',
              right: '18%',
              width: dimensions.dotSize,
              height: dimensions.dotSize,
              borderRadius: '50%',
              backgroundColor: '#22d3ee',
              boxShadow: '0 0 8px #06b6d4',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* ── LOGO TYPOGRAPHY ── */}
      {withText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontSize: dimensions.fontSize,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            }}
          >
            {/* Nexus in crisp brilliant white with subtle depth */}
            <span
              style={{
                color: '#f8fafc',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              Nexus
            </span>

            {/* Track in high-tech vibrant neon gradient */}
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7 10%, #06b6d4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 900,
                filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.35))',
              }}
            >
              Track
            </span>

            {/* Subtle live indicator badge dot */}
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                marginLeft: 4,
                boxShadow: '0 0 8px #10b981',
                animation: animated ? 'logoPulseGreen 2.5s infinite' : 'none',
              }}
              title="Online Real-time Tracker Active"
            />
          </div>

          {/* Optional Subtitle / Telemetry tag */}
          {subtitle && (
            <span
              style={{
                fontSize: dimensions.subFontSize,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted, #94a3b8)',
                marginTop: 3,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}

      {/* Embedded Micro-Animations */}
      <style jsx global>{`
        @keyframes logoOrbitRotate {
          0% {
            transform: rotate(-26deg);
          }
          50% {
            transform: rotate(-30deg) scale(1.02);
          }
          100% {
            transform: rotate(-26deg);
          }
        }
        @keyframes logoPulseGlow {
          0% {
            opacity: 0.6;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
        @keyframes logoBeaconBlink {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        @keyframes logoPulseGreen {
          0%, 100% {
            opacity: 0.7;
            transform: scale(0.9);
            box-shadow: 0 0 4px #10b981;
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 10px #10b981, 0 0 16px rgba(16, 185, 129, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
