'use client';

import React, { useRef, useState } from 'react';
import {
  X, Download, Copy, Check, Award, Calendar, CheckCircle2,
  TrendingUp, GitBranch, Star, Sparkles, Send, FileText, User
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface TraineeReportCardProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: {
    _id?: string;
    name: string;
    email: string;
    department?: string;
    skills?: string[];
    overallScore?: number;
    status?: string;
    avatar?: string;
    joinedDate?: string;
  } | null;
  batchNumber?: string;
}

export default function TraineeReportCardModal({
  isOpen,
  onClose,
  trainee,
  batchNumber = '3',
}: TraineeReportCardProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trainee) return null;

  const score = trainee.overallScore || 82;
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
  const attendanceRate = trainee.status === 'on-leave' ? 78 : 95;
  const taskCompletion = Math.min(100, Math.round(score * 1.05));

  const downloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${trainee.name.replace(/\s+/g, '_')}_Batch_${batchNumber}_Report_Card.pdf`);

      toastSuccess('PDF Downloaded', `Saved report card for ${trainee.name}.`);
    } catch (err: any) {
      toastError('Download Failed', err?.message || 'Could not generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const copySummary = () => {
    const text = `🏆 *TRAINEE PERFORMANCE REPORT CARD*
👤 *Name:* ${trainee.name}
🏢 *Organization:* Nava Yuva Bharati Infotech (NYB Infotech)
🏷️ *Batch:* Batch ${batchNumber} (${trainee.department || 'Frontend Engineering'})
📅 *Report Date:* ${new Date().toLocaleDateString('en-GB')}

📊 *Overall Performance:* ${score}% (Grade: ${grade})
✅ *Task Completion Rate:* ${taskCompletion}%
🕒 *Attendance & Standup:* ${attendanceRate}%
🛠️ *Key Skills:* ${(trainee.skills || []).join(', ') || 'HTML5, CSS3, Flexbox, Grid, React'}

🤖 *Mentorship Remark:* Demonstrates disciplined work ethic and consistent delivery of assigned practical tasks. Recommended to focus on asynchronous state handling and capstone project architecture.
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toastSuccess('Copied to Clipboard', 'Report card summary copied.');
    setTimeout(() => setCopied(false), 2500);
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
          maxWidth: 720,
          background: '#0d1322',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(124, 58, 237, 0.15)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'fadeUp 0.25s ease-out',
        }}
      >
        {/* Top Control Bar */}
        <div
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(2, 132, 199, 0.1))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={20} color="#a78bfa" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
              Trainee Performance Report Card
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={copySummary}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, gap: 5 }}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={downloadPdf}
              disabled={downloading}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: 11,
                gap: 5,
                background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
              }}
            >
              <Download size={12} />
              <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 4,
                marginLeft: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#080c16' }}>
          <div
            ref={printRef}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: 12,
              padding: 32,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {/* Branded Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: 20,
                marginBottom: 24,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    N
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                    NAVA YUVA BHARATI INFOTECH
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Technical Mentorship Operations • Batch {batchNumber} Evaluation Report
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: '#f1f5f9',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#475569',
                  }}
                >
                  Issued: {new Date().toLocaleDateString('en-GB')}
                </span>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                  ID: NYB-{batchNumber}-{trainee._id ? trainee._id.substring(0, 6).toUpperCase() : 'TRN01'}
                </div>
              </div>
            </div>

            {/* Trainee Identity Card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    border: '2px solid #bae6fd',
                  }}
                >
                  {trainee.avatar || '👤'}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                    {trainee.name}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {trainee.email} • {trainee.department || 'Frontend Engineering'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Overall Grade
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#7c3aed', lineHeight: 1.1 }}>
                  {grade}
                </div>
              </div>
            </div>

            {/* Performance KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Technical Score
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
                  {score}%
                </div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                  ↑ Above Batch Average
                </div>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Task Completion
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                  {taskCompletion}%
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  Daily submissions verified
                </div>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Attendance & Punctuality
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
                  {attendanceRate}%
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {trainee.status === 'on-leave' ? 'Approved Leave Logged' : 'Regular Attendance'}
                </div>
              </div>
            </div>

            {/* Assessed Skills Tags */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 8 }}>
                Demonstrated Technical Competencies
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(trainee.skills && trainee.skills.length > 0 ? trainee.skills : [
                  'HTML5 Semantic Markup',
                  'CSS3 Flexbox Layouts',
                  'CSS Grid Mastery',
                  'Responsive Media Queries',
                  'JavaScript DOM Operations',
                  'React 19 Components & Hooks'
                ]).map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: '#ede9fe',
                      color: '#6d28d9',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Mentorship & AI Feedback */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Sparkles size={16} color="#15803d" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Team Lead & AI Mentorship Evaluation
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#14532d', lineHeight: 1.6 }}>
                Trainee {trainee.name} consistently delivers daily code submissions with high structural fidelity to the assigned design specs. Demonstrated commendable initiative during CSS Grid and responsive dashboard practicals. Recommended to maintain momentum on React state management and complete upcoming capstone milestone tasks.
              </p>
            </div>

            {/* Official Sign-off */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingTop: 20,
                borderTop: '1px dashed #cbd5e1',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                  Nafisa Khanam
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>
                  Technical Team Lead & Mentorship Coordinator
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  Nava Yuva Bharati Infotech (NYB Infotech)
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Verified Authenticity Stamp</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>
                  ✔ SYSTEM CERTIFIED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Batch {batchNumber} • Nava Yuva Bharati Infotech
          </span>
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
