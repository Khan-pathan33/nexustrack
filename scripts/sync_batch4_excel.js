const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const B4_PATH = path.join(PROJECT_ROOT, 'Technical Team batch-4_Daily_Status_Report.xlsx');
const DOWNLOADS_B4_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-4_Daily_Status_Report.xlsx');

const OCT_SHEETS_CONFIG = [
  {
    date: '01-10-2026',
    topics: `Flexbox & CSS Grid\n\nTopics Covered:\n• Flexbox: Container, flex-direction, justify-content, align-items, flex-wrap, gap\n• CSS Grid: Grid Container, Rows & Columns, grid-template-columns/rows, repeat(), fr, minmax()\n• Grid Areas & Item Placement: Nested Grid, CSS Box Model alignment\n• Responsive Multi-Column Navigation, Cards & Form Layouts`,
    tasks: `Assigned Tasks:\n• 6 different layouts using Flexbox, responsive nav, card layouts, multi-column Grid\n• Practice repeat(), fr, minmax() and Compare Flexbox with CSS Grid\n• Practical Task: Full Responsive Dashboard with Header, Sidebar, Cards, Main Content, Table, Footer\n• Mandatory: Code push to GitHub and daily status submission before 6:00 PM`,
    summary: 'Completed Flexbox and CSS Grid layout exercises.'
  },
  {
    date: '05-10-2026',
    topics: `React Fundamentals & JSX\n\nTopics Covered:\n• Introduction to React & Why React is used\n• React Features & Complete Project Structure\n• React Application Setup & Functional Components\n• JSX Syntax, Rules & Valid/Invalid JSX\n• Fragments, Strict Mode, Rendering Components & Calling Functions`,
    tasks: `Assigned Tasks:\n• Create a React project from scratch & understand project structure\n• Create multiple functional components & practice JSX syntax/rules\n• Identify valid and invalid JSX, expressions in JSX & Fragments\n• Mini Assignment: Simple React Profile Page (Header, Profile, Skills, Education, Footer)`,
    summary: 'Completed React project setup and functional components.'
  },
  {
    date: '06-10-2026',
    topics: `Props, State & Component Communication\n\nTopics Covered:\n• Props, State & useState Hook\n• Parent-Child Component Data Flow & Callback Communication\n• Multi-Level Component Hierarchy & Passing Functions as Props\n• Conditional Rendering (Ternary, &&, if-else)`,
    tasks: `Assigned Tasks:\n• Implement parent-to-child data flow using Props\n• Send data from child to parent using callback functions\n• Manage component state using useState hook\n• Mini Assignment: Interactive Product Management UI (List, Details, Add, Edit, Delete)`,
    summary: 'Completed Props and component communication.'
  },
  {
    date: '07-10-2026',
    topics: `Lists, Forms, Events & useEffect\n\nTopics Covered:\n• Event Handling (onClick, onChange, onSubmit, onKeyDown)\n• Form Handling & Controlled Components\n• List Rendering using map() & Keys in Lists\n• useEffect Hook & Component Lifecycle (Mount, Update, Unmount)`,
    tasks: `Assigned Tasks:\n• Handle click, change, and submit events on controlled forms\n• Render dynamic arrays using map() with proper unique keys\n• Manage lifecycle triggers using useEffect and dependency arrays\n• Mini Assignment: User Registration & Dynamic User List application`,
    summary: 'Completed controlled forms and useEffect lifecycle.'
  },
  {
    date: '08-10-2026',
    topics: `REST API Integration & Data Handling\n\nTopics Covered:\n• REST API Operations in React (GET, POST, PUT/PATCH, DELETE)\n• Async/Await Syntax with Fetch API / Axios\n• UI State Management: Loading, Error, and Empty States\n• Real-Time Client-Side Search & Multi-Criteria Filtering`,
    tasks: `Assigned Tasks:\n• Connect React application to REST API endpoints\n• Manage async data fetching with loading spinners & error alerts\n• Implement live search and category filter\n• Practical Assignment: Complete React User Management Application with CRUD`,
    summary: 'Completed REST API CRUD integration.'
  },
  {
    date: '09-10-2026',
    topics: `Context API, Custom Hooks & Final Capstone\n\nTopics Covered:\n• Context API (createContext, Provider, useContext) & Global State\n• Sharing Global Data without Prop Drilling & Context vs Props comparison\n• Custom Hooks: Creation, use- Prefix Rules, Reusable Business Logic (e.g. useFetch)\n• Complete Weekly React Revision & Production Project Architecture`,
    tasks: `Assigned Tasks:\n• Create Context for global application data & theme/auth session\n• Build reusable Custom Hook (e.g. useFetch) & refactor repeated logic\n• Revise all React concepts: Components, JSX, Props, State, useEffect, APIs\n• Final Practical Assignment: Complete React Mini Application combining all weekly topics`,
    summary: 'Completed Context API global state and custom hooks for capstone mini application.'
  },
  {
    date: '14-10-2026',
    topics: `Performance Optimization & React Rendering\n\nTopics Covered:\n• React rendering and re-rendering mechanisms\n• Understanding component re-render behavior & referential equality\n• React.memo, useMemo & useCallback optimizations\n• Lazy loading with React.lazy & Suspense fallback UI\n• Large-list rendering challenges & performance profiling`,
    tasks: `Assigned Tasks:\n• Identify which components re-render when state changes\n• Apply React.memo and useCallback on large list items\n• Practice useMemo for expensive calculations\n• Implement lazy loading with Suspense for routes\n• Mini Assignment: Employee Analytics Dashboard Optimization`,
    summary: 'Completed performance profiling, React.memo, and useCallback optimizations.'
  },
  {
    date: '16-10-2026',
    topics: `Advanced State Management & Custom Hook Patterns\n\nTopics Covered:\n• useReducer for complex multi-action state transitions\n• Reducer pattern vs useState architecture comparison\n• Custom hook abstraction for data fetching, debounce & form validation\n• Global error boundary patterns & clean component separation`,
    tasks: `Assigned Tasks:\n• Refactor complex form state from useState to useReducer\n• Build custom useDebounce hook for search input\n• Implement global toast notification provider using Context + Reducer\n• Practical Assignment: Advanced Task Management Board with drag/drop state`,
    summary: 'Completed useReducer state machine and custom hook abstraction.'
  },
  {
    date: '26-10-2026',
    topics: `Production React Architecture & Full-Stack Integration\n\nTopics Covered:\n• Production folder structure & feature-sliced design\n• Environment variables & secure API client configuration\n• JWT authentication flow & protected route wrappers\n• Full end-to-end testing & build optimization with Vite`,
    tasks: `Assigned Tasks:\n• Set up production project structure with TypeScript\n• Implement auth guard with JWT token handling\n• Connect frontend to backend API endpoints\n• Build production bundle & verify bundle size analysis`,
    summary: 'Completed production architecture setup and auth route guards.'
  },
  {
    date: '28-10-2026',
    topics: `Full Application Testing, Polish & Deployment\n\nTopics Covered:\n• Unit and component testing with Vitest / React Testing Library\n• Cross-browser responsive design testing & accessibility (a11y)\n• Error logging, monitoring, and production deployment preparation\n• Technical mentoring revision & daily status report consolidation`,
    tasks: `Assigned Tasks:\n• Write component test cases for critical user journeys\n• Verify responsive layout across mobile, tablet, and desktop\n• Push final clean repository to GitHub\n• Submit consolidated daily status report with full evaluation remarks`,
    summary: 'Completed component testing, responsive polish, and final code push.'
  }
];

function buildSheet(sheet, cfg) {
  sheet.views = [{ showGridLines: true }];
  sheet.columns = [
    { width: 8 },   // A
    { width: 24 },  // B
    { width: 34 },  // C
    { width: 34 },  // D
    { width: 16 },  // E
    { width: 22 },  // F
    { width: 36 },  // G
    { width: 18 },  // H
    { width: 36 },  // I
    { width: 18 },  // J
    { width: 14 },  // K
    { width: 24 },  // L
    { width: 34 },  // M
  ];

  // Row 1 spacer
  sheet.getRow(1).height = 14;

  // Row 2 Banner
  sheet.mergeCells('C2:M2');
  const banner = sheet.getCell('C2');
  banner.value = 'BATCH 4 - DAILY ONE-ON-ONE CONNECT TRACKER';
  banner.font = { name: 'Aptos Narrow', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  banner.alignment = { horizontal: 'center', vertical: 'middle' };
  banner.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF581C87' }, // Purple theme for Batch 4
  };
  sheet.getRow(2).height = 28;

  // Rows 3-12 Topics & Tasks
  sheet.mergeCells('A3:A12');
  const topicsCell = sheet.getCell('A3');
  topicsCell.value = `Today Topics\n\n${cfg.topics}`;
  topicsCell.font = { name: 'Aptos Narrow', size: 10 };
  topicsCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  topicsCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
  topicsCell.border = {
    top: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    left: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    right: { style: 'thin', color: { argb: 'FFDDD6FE' } },
  };

  sheet.mergeCells('B3:B12');
  const tasksCell = sheet.getCell('B3');
  tasksCell.value = `Today Tasks\n\n${cfg.tasks}`;
  tasksCell.font = { name: 'Aptos Narrow', size: 10 };
  tasksCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  tasksCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
  tasksCell.border = {
    top: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    left: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } },
    right: { style: 'thin', color: { argb: 'FFDDD6FE' } },
  };

  for (let r = 3; r <= 12; r++) {
    sheet.getRow(r).height = 20;
  }

  // Row 13 Headers
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
  const r13 = sheet.getRow(13);
  r13.values = headers;
  r13.height = 28;
  for (let c = 1; c <= 13; c++) {
    const cell = r13.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6B21A8' } };
    cell.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  }

  // Rows 14-21 Trainees
  for (let i = 1; i <= 8; i++) {
    const rowNum = 13 + i;
    const row = sheet.getRow(rowNum);
    row.values = [
      i,
      `Trainee ${i} (Batch 4)`,
      'N/A',
      'Yes',
      'Yes',
      'No Blockers Reported',
      cfg.summary,
      'Yes',
      'Reviewed',
      'Conducted',
      'Good',
      'Active participation in Batch 4 session.',
      'N/A',
    ];
    row.height = 24;
    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      if ([1, 4, 5, 8, 10, 11, 13].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      }
    }
  }

  // Row 22 Note
  sheet.mergeCells(`B22:M22`);
  const noteCell = sheet.getCell('B22');
  noteCell.value = "Note: In Completed Topics (Yes/No), mark Yes only when today's topics, assigned tasks, and practical assignment are completed. Self-Project Status is for projects done apart from the assigned practical work; otherwise enter N/A.";
  noteCell.font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: 'FF64748B' } };
  noteCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(22).height = 22;
}

async function main() {
  console.log('Generating complete Batch 4 workbook with all October sheets...');
  const wb = new ExcelJS.Workbook();
  wb.creator = 'NexusTrack AI Operations';
  wb.lastModifiedBy = 'Pathan Nafisa Khanam';
  wb.created = new Date();
  wb.modified = new Date();

  for (const cfg of OCT_SHEETS_CONFIG) {
    const sheet = wb.addWorksheet(cfg.date);
    buildSheet(sheet, cfg);
  }

  await wb.xlsx.writeFile(B4_PATH);
  console.log(`Saved workbook to: ${B4_PATH}`);

  if (fs.existsSync(path.dirname(DOWNLOADS_B4_PATH))) {
    try {
      await wb.xlsx.writeFile(DOWNLOADS_B4_PATH);
      console.log(`Mirrored workbook to Downloads: ${DOWNLOADS_B4_PATH}`);
    } catch (e) {
      console.warn('Could not write to downloads:', e.message);
    }
  }

  console.log('Batch 4 Excel sheets setup complete!');
}

main().catch(console.error);
