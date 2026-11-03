// Nava Yuva Bharati Infotech (NYB Infotech)
// Technical Team Batch-3: 5-Day React Curriculum & Task Allocation (Every Friday Evening / Monday Morning)
// And Daily Team Lead (TL) Consolidated Status Templates

export interface DayCurriculum {
  dayNumber: number;
  dayTitle: string;
  daySubtitle: string;
  theme: string;
  topicsCovered: {
    category: string;
    items: string[];
  }[];
  assignedTasks: string[];
  practicalTask?: {
    title: string;
    description: string;
    components: string[];
  };
  finalAssignment?: {
    title: string;
    description: string;
    components: string[];
    requirements: string[];
  };
  expectedOutcome: string;
}

export const WEEKLY_CURRICULUM: DayCurriculum[] = [
  {
    dayNumber: 1,
    dayTitle: 'Day 1 – Monday (05-10-2026)',
    daySubtitle: 'React Fundamentals & JSX',
    theme: 'React Architecture, Functional Components, JSX Rules & Fragments',
    topicsCovered: [
      {
        category: 'Introduction to React',
        items: [
          'Introduction to React',
          'Why React is used',
          'React Features',
          'React Project Structure',
          'React Application Setup',
        ],
      },
      {
        category: 'Components & JSX',
        items: [
          'Components',
          'Functional Components',
          'JSX (JavaScript XML)',
          'JSX Rules',
          'Valid and Invalid JSX',
          'Fragments (<></>)',
          'Strict Mode',
          'Rendering Components',
          'Calling Functions in Components',
        ],
      },
    ],
    assignedTasks: [
      'Create a React project from scratch.',
      'Understand the complete React project structure.',
      'Create multiple functional components.',
      'Practice JSX syntax.',
      'Identify valid and invalid JSX.',
      'Practice using JavaScript expressions inside JSX.',
      'Use Fragments where required.',
      'Understand Strict Mode.',
      'Create reusable basic components.',
    ],
    practicalTask: {
      title: 'Mini Assignment: React Profile Page',
      description:
        'Create a simple React Profile Page using multiple modular and reusable functional components.',
      components: [
        'Header (branding, navigation links)',
        'Profile (photo, bio, designation, contact info)',
        'Skills (badge tags, tech stack listing)',
        'Education (timeline/cards of academic background)',
        'Footer (social links, copyright)',
      ],
    },
    expectedOutcome:
      'Trainees can setup a React project from scratch, master JSX syntax rules, build reusable functional components, and understand Strict Mode and component rendering.',
  },
  {
    dayNumber: 2,
    dayTitle: 'Day 2 – Tuesday (06-10-2026)',
    daySubtitle: 'Props, State & Component Communication',
    theme: 'useState, Parent-Child Data Flow & Conditional Rendering',
    topicsCovered: [
      {
        category: 'Props & State Fundamentals',
        items: [
          'Props (Properties)',
          'State in React',
          'useState Hook',
          'Parent and Child Components',
          'Sending Data from Parent to Child (Props)',
          'Sending Data from Child to Parent (Callbacks)',
        ],
      },
      {
        category: 'Component Architecture',
        items: [
          'Component Hierarchy',
          'Passing Functions as Props',
          'Sharing Data Between Components',
          'Conditional Rendering (Ternary, &&, if-else)',
        ],
      },
    ],
    assignedTasks: [
      'Create parent and child components.',
      'Pass different types of data using Props.',
      'Pass functions from Parent to Child.',
      'Send data from Child to Parent using callback functions.',
      'Create multiple levels of component hierarchy.',
      'Practice State using useState.',
      'Update state based on user interaction.',
      'Implement conditional rendering.',
    ],
    practicalTask: {
      title: 'Mini Assignment: Product Management UI',
      description:
        'Create an interactive Product Management UI with complete CRUD state management and conditional display.',
      components: [
        'Product List (grid/table of products with prices and stock)',
        'Product Details (expanded card modal or view)',
        'Add Product (controlled form with validation)',
        'Edit Product (in-place state updates)',
        'Delete Product (state removal with confirmation)',
        'Conditional display of product information (out of stock, sale badge)',
      ],
    },
    expectedOutcome:
      'Trainees master data passing via Props, two-way parent-child communication via callbacks, state mutation with useState, and conditional UI rendering.',
  },
  {
    dayNumber: 3,
    dayTitle: 'Day 3 – Wednesday (07-10-2026)',
    daySubtitle: 'Lists, Forms, Events & useEffect',
    theme: 'Controlled Forms, Validation, map() Keys & Component Lifecycle with useEffect',
    topicsCovered: [
      {
        category: 'Event & Form Handling',
        items: [
          'Event Handling (onClick, onChange, onSubmit, onKeyDown)',
          'Form Handling',
          'Controlled Components',
          'Input Handling',
          'Dynamic Forms',
        ],
      },
      {
        category: 'List Rendering & Lifecycle Hooks',
        items: [
          'List Rendering',
          'map() function in JSX',
          'Keys in Lists & Reconciliation',
          'Conditional Rendering',
          'useEffect Hook',
          'Component Lifecycle Concept (Mount, Update, Unmount)',
          'Dependency Array ([ ], [deps], no deps)',
        ],
      },
    ],
    assignedTasks: [
      'Handle click, change, submit, and keyboard events.',
      'Create controlled form components.',
      'Handle multiple form fields dynamically.',
      'Render arrays using map().',
      'Understand and use proper keys.',
      'Implement conditional UI rendering.',
      'Practice useEffect.',
      'Understand when useEffect executes.',
      'Practice different dependency-array scenarios.',
      'Combine useState and useEffect.',
    ],
    practicalTask: {
      title: 'Mini Assignment: User Registration and User List Application',
      description:
        'Create a User Registration and dynamic User List application with live form validation, dynamic list rendering, and lifecycle triggers.',
      components: [
        'Registration Form (controlled inputs with state)',
        'Form Validation (real-time error messages & disable submit)',
        'Dynamic User List (rendered via map() with unique keys)',
        'Edit User (populate form and update list)',
        'Delete User (filter state by ID)',
        'Conditional Rendering (empty state, success toasts)',
        'useEffect (auto-save to localStorage or console log lifecycle triggers)',
      ],
    },
    expectedOutcome:
      'Trainees can handle complex forms with controlled components and validation, render dynamic arrays with unique keys, and master useEffect with dependency arrays.',
  },
  {
    dayNumber: 4,
    dayTitle: 'Day 4 – Thursday (08-10-2026)',
    daySubtitle: 'API Integration & React Data Handling',
    theme: 'HTTP Operations (Fetch/Axios), Async/Await, Loading/Error States, Search & Filtering',
    topicsCovered: [
      {
        category: 'API Operations in React',
        items: [
          'API Calls in React',
          'Fetch API / Axios',
          'GET Request (reading data)',
          'POST Request (creating data)',
          'PUT/PATCH Request (updating data)',
          'DELETE Request (removing data)',
          'Async/Await Syntax',
        ],
      },
      {
        category: 'Data States & Client Filtering',
        items: [
          'Loading State (spinners, skeletons)',
          'Error State (user alerts, fallback UI)',
          'Empty State (no records found)',
          'API Response Handling',
          'Dynamic Rendering',
          'Search and Filtering',
        ],
      },
    ],
    assignedTasks: [
      'Integrate a public API with React.',
      'Fetch and display API data.',
      'Implement loading indicators.',
      'Handle API errors.',
      'Handle empty API responses.',
      'Implement search functionality.',
      'Implement filtering.',
      'Practice POST, PUT/PATCH, and DELETE operations.',
      'Separate API logic from UI components.',
      'Reuse API functions wherever possible.',
    ],
    practicalTask: {
      title: 'Practical Assignment: React User Management Application',
      description:
        'Create a full-featured React User Management Application integrated with a real REST API.',
      components: [
        'User List (cards/table populated from public API)',
        'Search (live filter by name or email)',
        'Filter (filter by role, status, or department)',
        'Add User (POST request with form modal)',
        'Edit User (PUT/PATCH request with populated form)',
        'Delete User (DELETE request with confirmation)',
        'Loading State (loading spinner while awaiting network)',
        'Error Handling (banner alerts for network/server errors)',
        'API Integration (clean service layer separation)',
      ],
    },
    expectedOutcome:
      'Trainees can connect React applications to REST APIs, manage loading/error/empty UI states cleanly, implement search and filter, and modularize API service logic.',
  },
  {
    dayNumber: 5,
    dayTitle: 'Day 5 – Friday (09-10-2026)',
    daySubtitle: 'Context API, Custom Hooks & Complete Practical Revision',
    theme: 'Global State with Context API, Custom Hooks & Full Capstone Build',
    topicsCovered: [
      {
        category: 'Context API (Global State)',
        items: [
          'Context API',
          'Creating Context (createContext)',
          'Provider Component',
          'Consumer Component',
          'useContext Hook',
          'Sharing Global Data without Prop Drilling',
          'Context vs Props Architectural Comparison',
        ],
      },
      {
        category: 'Custom Hooks',
        items: [
          'What are Custom Hooks?',
          'Creating Custom Hooks (use- prefix rules)',
          'Reusing Logic across components',
          'Custom Hook with API Calls (e.g., useFetch)',
        ],
      },
      {
        category: 'Complete React Revision',
        items: [
          'Components & JSX Rules',
          'Props & State Management',
          'useState & useEffect Lifecycle',
          'Event Handling & Controlled Forms',
          'List Rendering & Keys',
          'API Calls & Async Data',
          'Conditional Rendering',
        ],
      },
    ],
    assignedTasks: [
      'Create a Context for global application data.',
      'Share data between components using Context API.',
      'Compare Context API with Props.',
      'Create at least one reusable Custom Hook.',
      'Create a Custom Hook for API data fetching.',
      'Refactor repeated logic into reusable components/hooks.',
      'Revise all React concepts covered during the week.',
    ],
    finalAssignment: {
      title: 'Final Practical Assignment: Complete React Mini Application',
      description:
        'Create a complete React mini application that combines all concepts covered throughout the week into a unified, production-ready project.',
      components: [
        'Multiple Reusable Components (Header, Sidebar, Cards, Forms, Modals)',
        'Props & State Management (useState)',
        'Parent/Child Communication via callback functions',
        'Forms with complete Validation',
        'List Rendering with proper keys',
        'Conditional Rendering (Tabs, Auth, States)',
        'useEffect for lifecycle management',
        'API Integration (Full CRUD with fetch/axios)',
        'Search and Filter functionality',
        'Loading State & Error Handling',
        'Context API for global theme / user session data',
        'At least One Custom Hook (e.g. useFetch, useForm, or useDebounce)',
      ],
      requirements: [
        'Create React applications independently without relying on copy-pasting',
        'Build reusable functional components with clean hierarchy',
        'Understand and apply Props and State correctly',
        'Handle parent-child communication',
        'Manage forms and user interactions with validation',
        'Render dynamic lists with unique keys',
        'Use useState and useEffect correctly with proper dependency management',
        'Integrate APIs into React applications',
        'Handle loading and error states cleanly',
        'Use Context API for shared application data',
        'Create and use Custom Hooks',
        'Structure a React application in a clean, modular, and reusable manner',
      ],
    },
    expectedOutcome:
      'By the end of the 5-day schedule, team members should be able to create React applications independently, build reusable functional components, understand Props and State, handle parent-child communication, manage forms and user interactions, render dynamic lists, use useState and useEffect correctly, integrate APIs into React applications, handle loading and error states, use Context API for shared application data, create and use Custom Hooks, and structure a React application in a clean and reusable manner.',
  },
];

// Full raw markdown of the 5-day React task allocation for 1-click clipboard copying or email dispatch
export const WEEKLY_TASK_ALLOCATION_EMAIL_TEXT = `Hi Team,

Please find the below 5-day React task allocation for this week (Monday 05-10-2026 to Friday 09-10-2026).
The focus is on strengthening practical React skills through component architecture, state management, hooks, API integration, and complete application implementation.

Day 1 (Monday 05-10-2026) - React Fundamentals & JSX
Topics Covered
Introduction to React
Why React is used
React Features
React Project Structure
React Application Setup
Components
Functional Components
JSX
JSX Rules
Valid and Invalid JSX
Fragments
Strict Mode
Rendering Components
Calling Functions in Components

Assigned Tasks
Create a React project from scratch.
Understand the complete React project structure.
Create multiple functional components.
Practice JSX syntax.
Identify valid and invalid JSX.
Practice using JavaScript expressions inside JSX.
Use Fragments where required.
Understand Strict Mode.
Create reusable basic components.

Mini Assignment
Create a simple React Profile Page using multiple reusable components such as:
Header
Profile
Skills
Education
Footer

Day 2 (Tuesday 06-10-2026) - Props, State & Component Communication
Topics Covered
Props
State
useState
Parent and Child Components
Sending Data from Parent to Child
Sending Data from Child to Parent
Component Hierarchy
Passing Functions as Props
Sharing Data Between Components
Conditional Rendering

Assigned Tasks
Create parent and child components.
Pass different types of data using Props.
Pass functions from Parent to Child.
Send data from Child to Parent using callback functions.
Create multiple levels of component hierarchy.
Practice State using useState.
Update state based on user interaction.
Implement conditional rendering.

Mini Assignment
Create a Product Management UI with:
Product List
Product Details
Add Product
Edit Product
Delete Product
Conditional display of product information

Day 3 (Wednesday 07-10-2026) - Lists, Forms, Events & useEffect
Topics Covered
Event Handling
Form Handling
Controlled Components
Input Handling
Dynamic Forms
List Rendering
map()
Keys
Conditional Rendering
useEffect
Component Lifecycle Concept
Dependency Array

Assigned Tasks
Handle click, change, submit, and keyboard events.
Create controlled form components.
Handle multiple form fields dynamically.
Render arrays using map().
Understand and use proper keys.
Implement conditional UI rendering.
Practice useEffect.
Understand when useEffect executes.
Practice different dependency-array scenarios.
Combine useState and useEffect.

Mini Assignment
Create a User Registration and User List application with:
Registration Form
Form Validation
Dynamic User List
Edit User
Delete User
Conditional Rendering
useEffect

Day 4 (Thursday 08-10-2026) - API Integration & React Data Handling
Topics Covered
API Calls in React
Fetch API / Axios
GET Request
POST Request
PUT/PATCH Request
DELETE Request
Async/Await
Loading State
Error State
Empty State
API Response Handling
Dynamic Rendering
Search and Filtering

Assigned Tasks
Integrate a public API with React.
Fetch and display API data.
Implement loading indicators.
Handle API errors.
Handle empty API responses.
Implement search functionality.
Implement filtering.
Practice POST, PUT/PATCH, and DELETE operations.
Separate API logic from UI components.
Reuse API functions wherever possible.

Practical Assignment
Create a React User Management Application containing:
User List
Search
Filter
Add User
Edit User
Delete User
Loading State
Error Handling
API Integration

Day 5 (Friday 09-10-2026) - Context API, Custom Hooks & Complete Practical Revision
Topics Covered
Context API
Creating Context
Provider
Consumer
useContext
Sharing Global Data
Context vs Props
Custom Hooks
What are Custom Hooks?
Creating Custom Hooks
Reusing Logic
Custom Hook with API Calls
Additional Revision
Components
JSX
Props
State
useState
useEffect
Event Handling
Forms
List Rendering
API Calls
Conditional Rendering

Assigned Tasks
Create a Context for global application data.
Share data between components using Context API.
Compare Context API with Props.
Create at least one reusable Custom Hook.
Create a Custom Hook for API data fetching.
Refactor repeated logic into reusable components/hooks.
Revise all React concepts covered during the week.

Final Practical Assignment
Create a complete React mini application that combines the concepts covered throughout the week.
The application should include:
Multiple Reusable Components
Props
State Management
Parent/Child Communication
Forms
Form Validation
List Rendering
Conditional Rendering
useEffect
API Integration
Search and Filter
Loading State
Error Handling
Context API
At least One Custom Hook

Expected Outcome
By the end of the 5-day schedule, team members should be able to:
Create React applications independently.
Build reusable functional components.
Understand Props and State.
Handle parent-child communication.
Manage forms and user interactions.
Render dynamic lists.
Use useState and useEffect correctly.
Integrate APIs into React applications.
Handle loading and error states.
Use Context API for shared application data.
Create and use Custom Hooks.
Structure a React application in a clean and reusable manner.

Ensure that the team focuses on practical implementation and understanding the code execution flow, rather than only following tutorials or copying existing solutions.

Best regards,
Pathan Nafisa Khanam
Technical Mentorship Team (Batch-3)
Nava Yuva Bharati Infotech`;

// Official Team Lead (TL) Daily Status Email Recipients & Metadata
export const DEFAULT_TL_RECIPIENTS = {
  to: ['varaprasad.vellanki@nybinfotech.com', 'vineetha.sunil@nybinfotech.com'],
  cc: ['chandramohan.reddy@nybinfotech.com', 'sushma.pedapudi@nybinfotech.com'],
  toDisplay: 'Varaprasad Vellanki; Vineetha Sunil',
  ccDisplay: 'Chandra Mohan Reddy; Sushma Pedapudi',
};

// Exact structured TL report data from Nafisa's official Outlook Sent Items
export interface TLReportData {
  batchNumber: string | number;
  date: string;
  greeting?: string;
  technology: string;
  plannedTasksToday: string[];
  completedTasksToday: string[];
  pendingTasksToday: string;
  plannedTasksNextDay: string[];
  challenges: string;
  senderName: string;
  senderRole: string;
  senderEmail: string;
  senderLinkedIn: string;
  companyName: string;
  companyTagline: string;
}

export const DEFAULT_TL_REPORT_DATA: TLReportData = {
  batchNumber: '3',
  date: '21-10-2026',
  greeting: 'Hi Varaprasad Sir and Vineetha Mam,\n\nGood Evening,\n\nPlease find below the task summary for today:',
  technology: 'Web Development',
  plannedTasksToday: [
    'Connect with all Batch-3 trainees individually through one-on-one discussions.',
    "Review today's React topics covering React fundamentals, project setup using Vite, project structure, functional components, JSX, JSX rules, JavaScript expressions, fragments, Strict Mode, component rendering, and reusable components.",
    'Review Props, Props destructuring, parent-child component relationships, component hierarchy, State, useState, state updates, and functional state updates.',
    'Review event handling, including onClick, onChange, onSubmit, event objects, conditional rendering, list rendering using map(), and keys.',
    'Review form handling concepts, including controlled components, multiple form fields, and form validation.',
    'Review assigned tasks involving Vite project creation, project structure understanding, reusable functional components, JSX practice, Props implementation, parent-child component relationships, and the difference between Props and State.',
    'Verify the implementation of useState, functional state updates, click/change/submit events, conditional rendering, dynamic lists, controlled forms, and form validation.',
    'Review the Student Management UI mini assignment requirements, including Student List, Student Details, Add Student Form, Edit Student, Delete Student, Search, conditional rendering, form validation, and reusable components.',
    "Verify completion of today's React topics, assigned tasks, and the Student Management UI mini assignment based on the trainees' reported implementation evidence.",
    'Review trainee implementations and identify completed, partially completed, and pending tasks.',
    'Verify GitHub repository updates and code push status.',
    'Review daily email submissions and provide feedback on incomplete or inconsistent progress reports.',
    'Collect information regarding completed topics, pending topics, doubts, assigned task status, GitHub push status, and self-project progress.',
    'Conduct the daily standup call with Batch-3 trainees.',
  ],
  completedTasksToday: [
    "Reviewed today's React curriculum covering React fundamentals, Vite project setup, project structure, functional components, JSX, reusable components, Props, State, event handling, conditional rendering, list rendering, controlled forms, and validation.",
    'Conducted individual progress reviews for Batch-3 trainees based on their reported topic completion, assigned tasks, practical implementations, and email submissions.',
    'Reviewed trainee progress on reusable components, Props, parent-child relationships, useState, event handling, dynamic list rendering, controlled forms, and form validation.',
    'Reviewed the Student Management UI mini assignment requirements, including student listing, student details, adding, editing, deleting, searching, conditional rendering, form validation, and reusable components.',
    'Reviewed GitHub push status and daily email submissions for the trainees.',
    'Reviewed self-project progress separately from the assigned Student Management UI mini assignment. Chandra Shekar K reported progress on the Employee Management self-project, including the holiday list, dashboard-view fixes, and department color coding. Check In and Check Out button fixes remain pending.',
    'No daily standup call was conducted today.',
  ],
  pendingTasksToday: 'N/A',
  plannedTasksNextDay: [
    'Connect with Batch 3 technical group',
    'Conduct the daily standup call with Batch-3 trainees.',
    'Conduct one-on-one discussions with Batch-3 trainees.',
    'Follow up with trainees who have pending React implementations and Student Management UI mini assignments.',
    'Verify completion of Props, State, event handling, conditional rendering, dynamic lists, controlled forms, and form validation through practical implementation evidence.',
    'Review updated GitHub repositories and daily email submissions.',
  ],
  challenges: 'N/A',
  senderName: 'Pathan Nafisa Khanam',
  senderRole: 'Junior Developer',
  senderEmail: 'nafisa.khanam@nybinfotech.com',
  senderLinkedIn: 'https://www.linkedin.com/in/pathan-nafisa-khanam',
  companyName: 'NavayuvaBharat INFOTECH',
  companyTagline: 'WHERE IT MEETS INGENUITY',
};

/**
 * Builds dynamic TL status report data based on the specific Curriculum Day (Day 1-5)
 * and the actual trainee rows / working submissions for that date.
 */
export function buildDynamicTLReport(params: {
  date?: string;
  batchNumber?: string | number;
  dayNumber?: number;
  rows?: any[];
  senderEmail?: string;
}): TLReportData {
  const batch = String(params.batchNumber || '3');
  const dateStr = params.date || '28-10-2026';
  const rows = params.rows || [];
  const isBoth = batch === 'both' || batch === '3 & 4';

  // Determine day number (1 to 5)
  let dayNum = params.dayNumber || 1;
  if (!params.dayNumber) {
    if (dateStr.includes('05-10') || dateStr.includes('12-10') || dateStr.includes('19-10') || dateStr.includes('26-10')) {
      dayNum = 1;
    } else if (dateStr.includes('06-10') || dateStr.includes('13-10') || dateStr.includes('20-10') || dateStr.includes('27-10')) {
      dayNum = 2;
    } else if (dateStr.includes('07-10') || dateStr.includes('14-10') || dateStr.includes('21-10') || dateStr.includes('28-10')) {
      dayNum = 3;
    } else if (dateStr.includes('08-10') || dateStr.includes('15-10') || dateStr.includes('22-10') || dateStr.includes('29-10')) {
      dayNum = 4;
    } else if (dateStr.includes('09-10') || dateStr.includes('16-10') || dateStr.includes('23-10') || dateStr.includes('30-10')) {
      dayNum = 5;
    }
  }

  const curDay = WEEKLY_CURRICULUM.find((d) => d.dayNumber === dayNum) || WEEKLY_CURRICULUM[0];
  const nextDayNum = dayNum < 5 ? dayNum + 1 : 1;
  const nextDay = WEEKLY_CURRICULUM.find((d) => d.dayNumber === nextDayNum) || WEEKLY_CURRICULUM[1];

  const targetBatchLabel = isBoth ? 'Batch-3 & Batch-4' : `Batch-${batch}`;

  // 1. Planned Tasks based on today's curriculum
  const plannedTasks: string[] = [
    `Connect with all ${targetBatchLabel} trainees individually through one-on-one discussions.`,
    `Review today's React topics covering ${curDay.theme}.`,
    ...curDay.assignedTasks.slice(0, 8),
    curDay.practicalTask ? `Review the ${curDay.practicalTask.title} requirements.` : `Review assigned practical implementation requirements.`,
    `Verify GitHub repository updates and code push status.`,
    `Review daily email submissions and provide feedback on incomplete or inconsistent progress reports.`,
    `Conduct the daily standup call with ${targetBatchLabel} trainees.`,
  ];

  // 2. Completed Tasks based on trainees' working and submissions
  const completedTasks: string[] = [
    `Reviewed today's React curriculum covering ${curDay.theme}.`,
    `Conducted individual progress reviews for ${targetBatchLabel} trainees based on their reported topic completion, assigned tasks, practical implementations, and email submissions.`,
    `Reviewed trainee progress on reusable components, state handling, and practical exercises.`,
    curDay.practicalTask ? `Reviewed the ${curDay.practicalTask.title} implementations.` : `Reviewed trainee practical implementations.`,
    `Reviewed GitHub push status and daily email submissions for the trainees.`,
  ];

  // Check self-project mentions in actual rows
  const selfProjects = rows
    .filter((r) => r.selfProjectStatus && r.selfProjectStatus !== 'N/A')
    .map((r) => `${r.name} reported progress on ${r.selfProjectStatus}`);
  if (selfProjects.length > 0) {
    completedTasks.push(`Reviewed self-project progress separately from the assigned mini assignments: ${selfProjects.slice(0, 2).join('; ')}.`);
  } else {
    completedTasks.push(`Reviewed self-project progress separately from the assigned React mini assignments.`);
  }

  completedTasks.push(`No daily standup call was conducted today.`);

  // 3. Pending Tasks based on trainee rows
  const pendingTrainees = rows
    .filter((r) => r.pendingTopics && r.pendingTopics !== 'N/A' && !r.pendingTopics.toLowerCase().includes('none'))
    .map((r) => `${r.name}: ${r.pendingTopics}`);

  const pendingText = pendingTrainees.length > 0 ? pendingTrainees.slice(0, 3).join('; ') : 'N/A';

  // 4. Planned Tasks Next Day
  const nextDayTasks: string[] = [
    `Connect with ${targetBatchLabel} technical group`,
    `Conduct the daily standup call with ${targetBatchLabel} trainees.`,
    `Conduct one-on-one discussions with ${targetBatchLabel} trainees.`,
    `Review next day's React curriculum (${nextDay.daySubtitle}) covering ${nextDay.theme}.`,
    `Follow up with trainees who have pending React implementations and assignments.`,
    `Review updated GitHub repositories and daily email submissions.`,
  ];

  return {
    ...DEFAULT_TL_REPORT_DATA,
    batchNumber: batch,
    date: dateStr,
    plannedTasksToday: plannedTasks,
    completedTasksToday: completedTasks,
    pendingTasksToday: pendingText,
    plannedTasksNextDay: nextDayTasks,
    senderEmail: params.senderEmail || DEFAULT_TL_REPORT_DATA.senderEmail,
  };
}

/**
 * Generates exact Outlook-compatible HTML table matching Nafisa's Sent Items screenshots
 */
export function generateTLReportHTML(data: Partial<TLReportData> = {}): string {
  const r = { ...DEFAULT_TL_REPORT_DATA, ...data };
  const isBoth = String(r.batchNumber) === 'both' || String(r.batchNumber) === '3 & 4';
  const batchLabel = isBoth
    ? `1.Batch-3 & Batch-4:-`
    : `1.Batch-${r.batchNumber}:-`;

  const renderList = (items: string[]) =>
    `<ul style="margin: 6px 0 0 20px; padding: 0; list-style-type: disc;">${items
      .map((item) => `<li style="margin-bottom: 5px; line-height: 1.5; color: #000000;">${item}</li>`)
      .join('')}</ul>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; font-size: 13.5px; color: #000000; background-color: #ffffff; line-height: 1.5;">
  <div style="max-width: 860px; margin: 0 auto; padding: 10px 0;">
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #000000;">Hi Varaprasad Sir and Vineetha Mam,</p>
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #000000;">Good Evening,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #000000;">Please find below the task summary for today:</p>

    <table style="border-collapse: collapse; width: 100%; border: 1.5px solid #000000; font-family: Calibri, Arial, sans-serif; font-size: 13px; color: #000000; margin: 16px 0 24px 0;" border="1" cellpadding="0" cellspacing="0">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #000000; padding: 8px 12px; width: 28%; text-align: center; font-weight: bold; font-size: 13px; color: #000000;">Technology</th>
          <th style="border: 1px solid #000000; padding: 8px 12px; width: 72%; text-align: center; font-weight: bold; font-size: 13px; color: #000000;">${r.technology}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Planned Tasks (Today)</td>
          <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
            <strong style="color: #000000;">${batchLabel}</strong>
            ${renderList(r.plannedTasksToday)}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Completed Tasks (Today)</td>
          <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
            <strong style="color: #000000;">${batchLabel}</strong>
            ${renderList(r.completedTasksToday)}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Pending Tasks (Today)</td>
          <td style="border: 1px solid #000000; padding: 12px; text-align: center; vertical-align: middle; color: #000000;">${r.pendingTasksToday}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Planned Tasks (Next Day)</td>
          <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
            <strong style="color: #000000;">${batchLabel}</strong>
            ${renderList(r.plannedTasksNextDay)}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Challenges / Blockers if any</td>
          <td style="border: 1px solid #000000; padding: 12px; text-align: center; vertical-align: middle; color: #000000;">${r.challenges}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 14px; color: #000000;">I have attached the work progress files for your reference.</p>

    <div style="margin-top: 22px; font-size: 13.5px; line-height: 1.45; color: #000000;">
      <div>Thanks &amp; Regards,</div>
      <div style="font-weight: bold; margin-top: 3px; color: #000000;">${r.senderName}</div>
      <div>${r.senderRole}</div>
      <div><a href="mailto:${r.senderEmail}" style="color: #0078d4; text-decoration: none;">${r.senderEmail}</a></div>
      <div><a href="${r.senderLinkedIn}" target="_blank" style="color: #0078d4; text-decoration: underline;">LinkedIn: ${r.senderName}</a></div>
      <div>NYBInfotech</div>
    </div>

    <div style="margin-top: 16px;">
      <div style="font-size: 21px; font-weight: 800; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: -0.5px; color: #1e3a8a;">
        NavayuvaBharat <span style="color: #f97316; font-size: 15px; font-weight: 800;">INFOTECH</span>
      </div>
      <div style="font-size: 9.5px; color: #64748b; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase;">
        WHERE IT MEETS INGENUITY
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates exact Plain Text version for raw text / clipboard / fallback
 */
export function generateTLReportPlainText(data: Partial<TLReportData> = {}): string {
  const r = { ...DEFAULT_TL_REPORT_DATA, ...data };
  const isBoth = String(r.batchNumber) === 'both' || String(r.batchNumber) === '3 & 4';
  const batchLabel = isBoth
    ? `1.Batch-3 & Batch-4:-`
    : `1.Batch-${r.batchNumber}:-`;

  return `Hi Varaprasad Sir and Vineetha Mam,

Good Evening,

Please find below the task summary for today:

Technology:
${r.technology}

Planned Tasks (Today):
${batchLabel}
${r.plannedTasksToday.map((item) => `• ${item}`).join('\n')}

Completed Tasks (Today):
${batchLabel}
${r.completedTasksToday.map((item) => `• ${item}`).join('\n')}

Pending Tasks (Today):
${r.pendingTasksToday}

Planned Tasks (Next Day):
${batchLabel}
${r.plannedTasksNextDay.map((item) => `• ${item}`).join('\n')}

Challenges / Blockers if any:
${r.challenges}

I have attached the work progress files for your reference.

Thanks & Regards,
${r.senderName}
${r.senderRole}
${r.senderEmail}
LinkedIn: ${r.senderName}
NYBInfotech

NavayuvaBharat INFOTECH
WHERE IT MEETS INGENUITY`;
}

// User's exact Team Lead (TL) Daily Status Email Template
export const TL_DAILY_STATUS_EMAIL_TEMPLATE = generateTLReportPlainText();
