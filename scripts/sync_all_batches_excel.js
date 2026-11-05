const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const B3_PATH = path.join(PROJECT_ROOT, 'Technical Team batch-3_Daily_Status_Report.xlsx');
const B4_PATH = path.join(PROJECT_ROOT, 'Technical Team batch-4_Daily_Status_Report.xlsx');
const DOWNLOADS_B3_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-3_Daily_Status_Report.xlsx');
const DOWNLOADS_B4_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-4_Daily_Status_Report.xlsx');

// EXACT Trainees as specified by the user:
const BATCH_3_TRAINEES = [
  'Althaf Syed',
  'Bala Krishna Parimi',
  'Chandra Shekar K',
  'Girish C',
  'Sana Sulthana',
  'Tejaswar Rao',
];

const BATCH_4_TRAINEES = [
  'Adinarayana Meesala',
  'Adithya Ram',
  'Jose Amala Kishor',
  'Snehith Reddy Challa',
  'Sruthi Badavath',
  'Nikhil Kumar Kurapati',
  'Ramesh Kumar A',
];

const OCT_SHEETS_CONFIG = [
  {
    date: '01-10-2026',
    title: 'Flexbox & CSS Grid Layouts',
    topics: `Flexbox & CSS Grid\n\nTopics Covered:\n• Flexbox: Container, flex-direction, justify-content, align-items, flex-wrap, gap\n• CSS Grid: Grid Container, Rows & Columns, grid-template-columns/rows, repeat(), fr, minmax()\n• Grid Areas & Item Placement: Nested Grid, CSS Box Model alignment\n• Responsive Multi-Column Navigation, Cards & Form Layouts`,
    tasks: `Assigned Tasks:\n• 6 different layouts using Flexbox, responsive nav, card layouts, multi-column Grid\n• Practice repeat(), fr, minmax() and Compare Flexbox with CSS Grid\n• Practical Task: Full Responsive Dashboard with Header, Sidebar, Cards, Main Content, Table, Footer\n• Mandatory: Code push to GitHub and daily status submission before 6:00 PM`,
    summary: 'Completed Flexbox and CSS Grid layout exercises.'
  },
  {
    date: '05-10-2026',
    title: 'React Fundamentals & JSX',
    topics: `React Fundamentals & JSX\n\nTopics Covered:\n• Introduction to React & Why React is used\n• React Features & Complete Project Structure\n• React Application Setup & Functional Components\n• JSX Syntax, Rules & Valid/Invalid JSX\n• Fragments, Strict Mode, Rendering Components & Calling Functions`,
    tasks: `Assigned Tasks:\n• Create a React project from scratch & understand project structure\n• Create multiple functional components & practice JSX syntax/rules\n• Identify valid and invalid JSX, expressions in JSX & Fragments\n• Mini Assignment: Simple React Profile Page (Header, Profile, Skills, Education, Footer)`,
    summary: 'Completed React project setup and functional components.'
  },
  {
    date: '06-10-2026',
    title: 'Props, State & Component Communication',
    topics: `Props, State & Component Communication\n\nTopics Covered:\n• Props, State & useState Hook\n• Parent-Child Component Data Flow & Callback Communication\n• Multi-Level Component Hierarchy & Passing Functions as Props\n• Conditional Rendering (Ternary, &&, if-else)`,
    tasks: `Assigned Tasks:\n• Implement parent-to-child data flow using Props\n• Send data from child to parent using callback functions\n• Manage component state using useState hook\n• Mini Assignment: Interactive Product Management UI (List, Details, Add, Edit, Delete)`,
    summary: 'Completed Props and component communication.'
  },
  {
    date: '07-10-2026',
    title: 'Lists, Forms, Events & useEffect',
    topics: `Lists, Forms, Events & useEffect\n\nTopics Covered:\n• Event Handling (onClick, onChange, onSubmit, onKeyDown)\n• Form Handling & Controlled Components\n• List Rendering using map() & Keys in Lists\n• useEffect Hook & Component Lifecycle (Mount, Update, Unmount)`,
    tasks: `Assigned Tasks:\n• Handle click, change, and submit events on controlled forms\n• Render dynamic arrays using map() with proper unique keys\n• Manage lifecycle triggers using useEffect and dependency arrays\n• Mini Assignment: User Registration & Dynamic User List application`,
    summary: 'Completed controlled forms and useEffect lifecycle.'
  },
  {
    date: '08-10-2026',
    title: 'REST API Integration & Data Handling',
    topics: `REST API Integration & Data Handling\n\nTopics Covered:\n• REST API Operations in React (GET, POST, PUT/PATCH, DELETE)\n• Async/Await Syntax with Fetch API / Axios\n• UI State Management: Loading, Error, and Empty States\n• Real-Time Client-Side Search & Multi-Criteria Filtering`,
    tasks: `Assigned Tasks:\n• Connect React application to REST API endpoints\n• Manage async data fetching with loading spinners & error alerts\n• Implement live search and category filter\n• Practical Assignment: Complete React User Management Application with CRUD`,
    summary: 'Completed REST API CRUD integration.'
  },
  {
    date: '09-10-2026',
    title: 'Context API, Custom Hooks & Final Capstone',
    topics: `Context API, Custom Hooks & Final Capstone\n\nTopics Covered:\n• Context API (createContext, Provider, useContext) & Global State\n• Sharing Global Data without Prop Drilling & Context vs Props comparison\n• Custom Hooks: Creation, use- Prefix Rules, Reusable Business Logic (e.g. useFetch)\n• Complete Weekly React Revision & Production Project Architecture`,
    tasks: `Assigned Tasks:\n• Create Context for global application data & theme/auth session\n• Build reusable Custom Hook (e.g. useFetch) & refactor repeated logic\n• Revise all React concepts: Components, JSX, Props, State, useEffect, APIs\n• Final Practical Assignment: Complete React Mini Application combining all weekly topics`,
    summary: 'Completed Context API global state and custom hooks for capstone mini application.'
  },
  {
    date: '14-10-2026',
    title: 'Performance Optimization & React Rendering',
    topics: `Performance Optimization & React Rendering\n\nTopics Covered:\n• React rendering and re-rendering mechanisms\n• Understanding component re-render behavior & referential equality\n• React.memo, useMemo & useCallback optimizations\n• Lazy loading with React.lazy & Suspense fallback UI\n• Large-list rendering challenges & performance profiling`,
    tasks: `Assigned Tasks:\n• Identify which components re-render when state changes\n• Apply React.memo and useCallback on large list items\n• Practice useMemo for expensive calculations\n• Implement lazy loading with Suspense for routes\n• Mini Assignment: Employee Analytics Dashboard Optimization`,
    summary: 'Completed performance profiling, React.memo, and useCallback optimizations.'
  },
  {
    date: '16-10-2026',
    title: 'Advanced State Management & Custom Hook Patterns',
    topics: `Advanced State Management & Custom Hook Patterns\n\nTopics Covered:\n• useReducer for complex multi-action state transitions\n• Reducer pattern vs useState architecture comparison\n• Custom hook abstraction for data fetching, debounce & form validation\n• Global error boundary patterns & clean component separation`,
    tasks: `Assigned Tasks:\n• Refactor complex form state from useState to useReducer\n• Build custom useDebounce hook for search input\n• Implement global toast notification provider using Context + Reducer\n• Practical Assignment: Advanced Task Management Board with drag/drop state`,
    summary: 'Completed useReducer state machine and custom hook abstraction.'
  },
  {
    date: '26-10-2026',
    title: 'Production React Architecture & Full-Stack Integration',
    topics: `Production React Architecture & Full-Stack Integration\n\nTopics Covered:\n• Production folder structure & feature-sliced design\n• Environment variables & secure API client configuration\n• JWT authentication flow & protected route wrappers\n• Full end-to-end testing & build optimization with Vite`,
    tasks: `Assigned Tasks:\n• Set up production project structure with TypeScript\n• Implement auth guard with JWT token handling\n• Connect frontend to backend API endpoints\n• Build production bundle & verify bundle size analysis`,
    summary: 'Completed production architecture setup and auth route guards.'
  },
  {
    date: '28-10-2026',
    title: 'Full Application Testing, Polish & Deployment',
    topics: `Full Application Testing, Polish & Deployment\n\nTopics Covered:\n• Unit and component testing with Vitest / React Testing Library\n• Cross-browser responsive design testing & accessibility (a11y)\n• Error logging, monitoring, and production deployment preparation\n• Technical mentoring revision & daily status report consolidation`,
    tasks: `Assigned Tasks:\n• Write component test cases for critical user journeys\n• Verify responsive layout across mobile, tablet, and desktop\n• Push final clean repository to GitHub\n• Submit consolidated daily status report with full evaluation remarks`,
    summary: 'Completed component testing, responsive polish, and final code push.'
  },
  {
    date: '03-11-2026',
    title: 'Props, State & Component Communication',
    topics: `Props, State & Component Communication\n\nTopics Covered:\n• Props, State & useState Hook\n• Parent-Child Component Data Flow & Callback Communication\n• Multi-Level Component Hierarchy & Passing Functions as Props\n• Conditional Rendering (Ternary, &&, if-else)`,
    tasks: `Assigned Tasks:\n• Implement parent-to-child data flow using Props\n• Send data from child to parent using callback functions\n• Manage component state using useState hook\n• Mini Assignment: Interactive Product Management UI (List, Details, Add, Edit, Delete)\n• Mandatory: Code push to GitHub and daily status submission before 6:00 PM`,
    summary: 'Completed Props, State management, and component communication.'
  }
];

function buildWorksheet(sheet, cfg, batchNum, traineesList) {
  sheet.views = [{ showGridLines: true }];
  sheet.columns = [
    { width: 8 },   // A: SNo
    { width: 26 },  // B: Name
    { width: 32 },  // C: Pending Topics
    { width: 34 },  // D: Completed Topics
    { width: 16 },  // E: Task Assign
    { width: 22 },  // F: Doubts
    { width: 36 },  // G: Discussion Summary
    { width: 18 },  // H: GitHub Push Status
    { width: 36 },  // I: Email Review Status
    { width: 18 },  // J: Standup Participation
    { width: 14 },  // K: Standup Rating
    { width: 26 },  // L: Standup Remarks
    { width: 34 },  // M: Self-Project Status
  ];

  // Row 1 spacer
  sheet.getRow(1).height = 14;

  // Row 2 Banner
  sheet.mergeCells('C2:M2');
  const banner = sheet.getCell('C2');
  banner.value = `BATCH ${batchNum} - DAILY ONE-ON-ONE CONNECT TRACKER`;
  banner.font = { name: 'Aptos Narrow', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  banner.alignment = { horizontal: 'center', vertical: 'middle' };
  banner.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: batchNum === 4 ? 'FF4A044E' : 'FF0E3A5F' },
  };
  sheet.getRow(2).height = 32;

  // Row 3 to 12 Today Topics (C3:M12)
  sheet.mergeCells('C3:M12');
  const topicsCell = sheet.getCell('C3');
  topicsCell.value = `Today Topics\n\n${cfg.topics}`;
  topicsCell.font = { name: 'Aptos Narrow', size: 10 };
  topicsCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  topicsCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: batchNum === 4 ? 'FFF5F3FF' : 'FFF0FDF4' },
  };
  topicsCell.border = {
    top: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    left: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    bottom: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    right: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
  };

  // Row 3 to 12 Today Tasks (B3:B12)
  sheet.mergeCells('B3:B12');
  const tasksCell = sheet.getCell('B3');
  tasksCell.value = `Today Tasks\n\n${cfg.tasks}`;
  tasksCell.font = { name: 'Aptos Narrow', size: 10 };
  tasksCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  tasksCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: batchNum === 4 ? 'FFF5F3FF' : 'FFF0FDF4' },
  };
  tasksCell.border = {
    top: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    left: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    bottom: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
    right: { style: 'thin', color: { argb: batchNum === 4 ? 'FFDDD6FE' : 'FFBBF7D0' } },
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
  const headerBg = batchNum === 4 ? 'FF6B21A8' : 'FF107C41';

  for (let c = 1; c <= 13; c++) {
    const cell = r13.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
    cell.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  }

  // Trainee Rows
  traineesList.forEach((traineeName, idx) => {
    const rowNum = 14 + idx;
    const row = sheet.getRow(rowNum);

    // Determine if trainee sent mail on this date
    // User instruction: "and also if u didnt get mail from any traineee from any batch jst put not received the mail or else ur wish which msg u want to display"
    let pendingTopics = 'N/A';
    let completedTopics = 'Yes';
    let taskAssign = 'Yes';
    let doubts = 'No Blockers Reported';
    let discussionSummary = cfg.summary;
    let githubPush = 'Yes';
    let emailReview = 'Reviewed';
    let standupPart = 'Conducted';
    let standupRating = 'Good';
    let standupRemarks = 'Active in session.';
    let selfProject = 'N/A';

    // Batch 4 specific attendance: on 27-10/28-10, Snehith and Sruthi had not submitted
    if (batchNum === 4) {
      if (traineeName === 'Snehith Reddy Challa' || traineeName === 'Sruthi Badavath') {
        pendingTopics = 'Not received the mail';
        completedTopics = 'No - Not received the mail';
        doubts = 'N/A';
        discussionSummary = 'Not received the mail';
        githubPush = 'No';
        emailReview = 'Not received the mail';
        standupPart = 'Not Conducted';
        standupRating = 'N/A';
        standupRemarks = 'No stand-up call was conducted today.';
      }
    }

    // Special projects for Batch 3
    if (batchNum === 3) {
      if (traineeName === 'Althaf Syed') {
        selfProject = 'Sunray Hospital website: continued responsive UI improvements.';
      } else if (traineeName === 'Chandra Shekar K') {
        selfProject = 'Employee Management System: role-based access & dashboard reports.';
      }
    }

    // 03-11-2026 specific live audit results
    if (cfg.date === '03-11-2026') {
      if (batchNum === 3) {
        if (traineeName === 'Chandra Shekar K') {
          githubPush = 'Yes';
          completedTopics = 'Yes - Completed Props, State & useState Hook with parent-child data flow';
          discussionSummary = 'Committed practical task to GitHub repo Mini-Project: "03-11-2026" (18:26 IST). Code verified on GitHub.';
          emailReview = 'Reviewed. Code verified on GitHub (Mini-Project: 03-11-2026).';
        } else {
          githubPush = 'Pending';
          completedTopics = 'In Progress - Props and State management exercises';
          discussionSummary = 'Practicing parent-child data flow and useState toggles. Code push pending for 03-11-2026.';
          emailReview = 'Action Required: Missing daily GitHub push for 03-11-2026.';
          pendingTopics = 'Pending evening GitHub push (Day 2 Props & State)';
        }
      } else if (batchNum === 4) {
        if (traineeName === 'Jose Amala Kishor') {
          githubPush = 'Yes';
          completedTopics = 'Yes - Completed Props, State & useState Hook with parent-child data flow';
          discussionSummary = 'Committed practical task to GitHub repo NYB_DailyTask: "React practice", "modified" (17:17 IST). Code verified on GitHub.';
          emailReview = 'Reviewed. Code verified on GitHub (NYB_DailyTask: 2 commits).';
        } else if (traineeName === 'Snehith Reddy Challa' || traineeName === 'Sruthi Badavath') {
          githubPush = 'No';
          completedTopics = 'No - Not received the mail';
          discussionSummary = 'Not received the mail';
          emailReview = 'Not received the mail';
          pendingTopics = 'Not received the mail';
        } else {
          githubPush = 'Pending';
          completedTopics = 'In Progress - Props, State & component communication';
          discussionSummary = 'Practicing parent-child communication and useState toggles. Code push pending for 03-11-2026.';
          emailReview = 'Action Required: Missing daily GitHub push for 03-11-2026.';
          pendingTopics = 'Pending evening GitHub push (Day 2 Props & State)';
        }
      }
    }

    row.values = [
      idx + 1,
      traineeName,
      pendingTopics,
      completedTopics,
      taskAssign,
      doubts,
      discussionSummary,
      githubPush,
      emailReview,
      standupPart,
      standupRating,
      standupRemarks,
      selfProject,
    ];
    row.height = 24;

    const isEven = idx % 2 === 1;
    const zebraBg = isEven
      ? (batchNum === 4 ? 'FFFAF5FF' : 'FFF9FAFB')
      : 'FFFFFFFF';

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 9.5 };
      cell.alignment = {
        horizontal: c === 1 || c === 5 || c === 8 || c === 10 || c === 11 ? 'center' : 'left',
        vertical: 'middle',
        wrapText: true,
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: zebraBg } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      // Highlight "Not received the mail" in soft red/amber
      if (String(cell.value || '').includes('Not received the mail')) {
        cell.font = { name: 'Aptos Narrow', size: 9.5, color: { argb: 'FFB91C1C' }, bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
      }
    }
  });
}

async function generateWorkbooks() {
  console.log('Generating Batch 3 Workbook (6 Trainees)...');
  const wb3 = new ExcelJS.Workbook();
  wb3.creator = 'NavayuvaBharat INFOTECH';
  OCT_SHEETS_CONFIG.forEach((cfg) => {
    const sheet = wb3.addWorksheet(cfg.date);
    buildWorksheet(sheet, cfg, 3, BATCH_3_TRAINEES);
  });
  await wb3.xlsx.writeFile(B3_PATH);
  console.log('✓ Batch 3 written:', B3_PATH);
  try {
    await wb3.xlsx.writeFile(DOWNLOADS_B3_PATH);
    console.log('✓ Batch 3 mirrored to Downloads:', DOWNLOADS_B3_PATH);
  } catch (e) {
    console.warn('Note: Downloads B3 file is open in Excel; updated project root copy.');
  }

  console.log('Generating Batch 4 Workbook (7 Trainees)...');
  const wb4 = new ExcelJS.Workbook();
  wb4.creator = 'NavayuvaBharat INFOTECH';
  OCT_SHEETS_CONFIG.forEach((cfg) => {
    const sheet = wb4.addWorksheet(cfg.date);
    buildWorksheet(sheet, cfg, 4, BATCH_4_TRAINEES);
  });
  await wb4.xlsx.writeFile(B4_PATH);
  console.log('✓ Batch 4 written:', B4_PATH);
  try {
    await wb4.xlsx.writeFile(DOWNLOADS_B4_PATH);
    console.log('✓ Batch 4 mirrored to Downloads:', DOWNLOADS_B4_PATH);
  } catch (e) {
    console.warn('Note: Downloads B4 file is open in Excel; updated project root copy.');
  }
}

generateWorkbooks().catch(console.error);
