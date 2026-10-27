"use client";
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText, Loader2 } from 'lucide-react';

export default function ExportPdfButton({
  targetId,
  filename,
  style: customStyle,
}: {
  targetId: string;
  filename: string;
  style?: React.CSSProperties;
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    const target = document.getElementById(targetId);
    if (!target) {
      console.warn(`ExportPdfButton: Element with id "${targetId}" not found`);
      return;
    }

    setExporting(true);
    try {
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for tabular layout
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pdfHeight - 10) {
        pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
      } else {
        // Multi-page slicing for large spreadsheets
        let heightLeft = imgHeight;
        let position = 5;

        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`${filename || 'Daily_Status_Report'}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="btn btn-sm"
      style={{
        fontSize: 12,
        gap: 6,
        background: 'rgba(2, 132, 199, 0.2)',
        border: '1px solid rgba(2, 132, 199, 0.4)',
        color: '#38bdf8',
        fontWeight: 700,
        padding: '7px 12px',
        borderRadius: 8,
        cursor: exporting ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        ...customStyle,
      }}
      title="Export Executive PDF Report"
    >
      {exporting ? (
        <>
          <Loader2 size={13} className="animate-spin" /> Exporting PDF...
        </>
      ) : (
        <>
          <FileText size={13} /> Export PDF
        </>
      )}
    </button>
  );
}
