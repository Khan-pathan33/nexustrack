/**
 * Precision Formatter to make Excel sheets match SharePoint (Image 2 & 3) exactly.
 * - Row 2: "Today Topics" in A2, "Today Tasks" in B2 (Navy Blue, bold white, centered). C2:M2 are EMPTY.
 * - Row 3: Topics in A3, Tasks in B3 (Top-left, wrapped). C3:M3 are EMPTY.
 * - Row 4: Clean table headers in medium blue with white text.
 * - Rows 5+: Clean data rows with normal black text (NO red text), wrapped, top-aligned.
 * - Perfectly set column widths and row heights.
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const WORKBOOK_PATH = path.join(__dirname, '..', 'Technical Team batch-3_Daily_Status_Report.xlsx');
const DOWNLOADS_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-3_Daily_Status_Report.xlsx');

const TOPICS_OCT14 = `Performance Optimization & React Rendering

Topics Covered
• React rendering and re-rendering
• Understanding component re-render behavior
• React.memo
• useMemo
• useCallback
• Referential equality
• Avoiding unnecessary re-renders
• Lazy loading with React.lazy
• Suspense and fallback UI
• Code splitting
• Large-list rendering challenges
• Performance profiling with React Developer Tools
• Common performance mistakes`;

const TASKS_OCT14 = `Assigned Tasks

• Identify which components re-render when state changes.
• Use React.memo where appropriate.
• Practice useMemo for expensive calculations.
• Practice useCallback when stable function references are useful.
• Compare application behavior before and after optimization.
• Implement lazy loading for selected pages.
• Use Suspense to display fallback UI.
• Inspect component rendering using React Developer Tools.
• Avoid unnecessary optimization where it adds complexity without benefit.

Mini Assignment
Optimize an Employee Analytics Dashboard containing:
• A large employee list
• Search and filtering
• Sorting
• Summary calculations
• Multiple dashboard components
• Lazy-loaded analytics page
• Performance comparison before and after optimization`;

const TRAINEES_OCT14 = [
  {
    sno: 1,
    name: 'Althaf Syed',
    pending: 'Pending: Employee Analytics Dashboard mini assignment was not reported as completed.',
    completed: 'Partial - Completed React rendering and re-rendering, referential equality, React.memo, useMemo, useCallback, lazy loading, Suspense, code splitting, large-list challenges, common mistakes, and assigned optimization tasks. Mini assignment remains unconfirmed.',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: 'Completed the planned performance topics and assigned optimization tasks. The required Employee Analytics Dashboard mini assignment was not included in the completed work.',
    github: 'Yes',
    review: 'Reviewed. Add separate Assigned Tasks and Final Practical Assignment sections with explicit implementation evidence.',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 2,
    name: 'Bala Krishna Parimi',
    pending: 'Pending: assigned performance-optimization implementations and Employee Analytics Dashboard mini assignment were not reported as completed.',
    completed: 'Partial - Learned and practiced React rendering and re-rendering, component behavior, React.memo, useMemo, useCallback, referential equality, reduced re-renders, React.lazy, Suspense, fallback UI, code splitting, large-list challenges, React Developer Tools profiling, and common performance mistakes. Practical assignments remain unconfirmed.',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: 'Completed all planned React performance topic learning. The completed section does not confirm the assigned optimization implementations or the Employee Analytics Dashboard mini assignment.',
    github: 'Yes',
    review: 'Reviewed. Format subject line correctly without typo ("Daily" not "Dailly") and remove trailing underscore.',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 3,
    name: 'Chandra Shekar K',
    pending: 'N/A',
    completed: 'Yes',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: 'Completed all React rendering and optimization topics, assigned tasks, and Employee Analytics Dashboard.',
    github: 'Yes',
    review: 'Reviewed. Complete coverage and verified assignment code.',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 4,
    name: 'Chevva Vinay Kumar',
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 5,
    name: 'Girish C',
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 6,
    name: 'Jayakrishna Madicharla',
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 7,
    name: 'Sana Sulthana',
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  },
  {
    sno: 8,
    name: 'Tejaswar Rao',
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  }
];

function applyPrecisionStyle(sheet, topicsText, tasksText, trainees) {
  // Column definitions with proper widths
  const colWidths = [8, 24, 38, 44, 13, 22, 44, 15, 44, 16, 12, 26, 18];
  colWidths.forEach((w, idx) => {
    sheet.getColumn(idx + 1).width = w;
  });

  // Clear existing rows
  while (sheet.rowCount > 0) {
    sheet.spliceRows(1, 1);
  }

  // Row 1: Empty spacer
  sheet.addRow([]);
  sheet.getRow(1).height = 14;

  // Row 2: "Today Topics" in A2, "Today Tasks" in B2, C2:M2 are empty
  const r2 = sheet.addRow(['Today Topics', 'Today Tasks']);
  r2.height = 24;
  for (let c = 1; c <= 13; c++) {
    const cell = r2.getCell(c);
    if (c === 1 || c === 2) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // Navy Blue like Image 3
      };
      cell.font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.value = null;
    }
  }

  // Row 3: Multiline content in A3 and B3. C3:M3 are completely empty!
  const r3 = sheet.addRow([topicsText, tasksText]);
  r3.height = 360;
  for (let c = 1; c <= 13; c++) {
    const cell = r3.getCell(c);
    if (c === 1 || c === 2) {
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      };
    } else {
      cell.value = null;
    }
  }

  // Row 4: Table Headers
  const headers = [
    'SNo',
    'Name',
    'Pending Topics',
    'Completed Topics (Yes/No)',
    'Task Assign (Yes/No)',
    'Doubts',
    'Discussion Summary',
    'GitHub Push Status(Yes/No)',
    'Email Review Status',
    'Standup Participation',
    'Standup Rating',
    'Standup Remarks',
    'Self-Project Status',
  ];
  const r4 = sheet.addRow(headers);
  r4.height = 28;
  for (let c = 1; c <= 13; c++) {
    const cell = r4.getCell(c);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E75B6' }, // Blue table header like Image 2
    };
    cell.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  }

  // Rows 5+: Trainee Data Rows (Clean Black Text, No Red Font)
  trainees.forEach((t) => {
    const rowValues = [
      t.sno,
      t.name,
      t.pending,
      t.completed,
      t.taskAssign,
      t.doubts,
      t.discussion,
      t.github,
      t.review,
      t.standupPart,
      t.standupRating,
      t.standupRemarks,
      t.selfProject,
    ];
    const newRow = sheet.addRow(rowValues);
    const hasLongText = (t.pending && t.pending.length > 30) || (t.completed && t.completed.length > 50);
    newRow.height = hasLongText ? 110 : 25;

    for (let c = 1; c <= 13; c++) {
      const cell = newRow.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } }; // Pure Black
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };

      if (c === 1 || c === 5 || c === 8 || c === 10 || c === 11 || c === 13) {
        cell.alignment = { horizontal: 'center', vertical: 'top' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
      }
    }
  });
}

async function run() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(WORKBOOK_PATH);

  // 1. Format '14-10-2026' sheet exactly like Image 2 & 3
  let sheet14 = workbook.getWorksheet('14-10-2026');
  if (!sheet14) {
    sheet14 = workbook.addWorksheet('14-10-2026');
  }
  applyPrecisionStyle(sheet14, TOPICS_OCT14, TASKS_OCT14, TRAINEES_OCT14);

  // 2. Format '15-10-2026' sheet (today's clean sheet with empty morning allocation)
  const traineesOct15 = TRAINEES_OCT14.map(t => ({
    ...t,
    pending: '',
    completed: '',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussion: '',
    github: '',
    review: '',
    standupPart: 'Not Conducted',
    standupRating: 'N/A',
    standupRemarks: 'No stand-up call was conducted today.',
    selfProject: 'N/A'
  }));
  let sheet15 = workbook.getWorksheet('15-10-2026');
  if (!sheet15) {
    sheet15 = workbook.addWorksheet('15-10-2026');
  }
  applyPrecisionStyle(sheet15, TOPICS_OCT14, TASKS_OCT14, traineesOct15);

  await workbook.xlsx.writeFile(WORKBOOK_PATH);
  console.log('✅ Formatted workbook successfully at:', WORKBOOK_PATH);

  // Mirror to Downloads
  try {
    await workbook.xlsx.writeFile(DOWNLOADS_PATH);
    console.log('✅ Mirrored to Downloads at:', DOWNLOADS_PATH);
  } catch (err) {
    console.warn('Downloads file currently locked by Excel (close Excel to update it):', err.message);
  }
}

run().catch(console.error);
