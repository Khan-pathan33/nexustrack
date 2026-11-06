const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'components', 'DailyTrackerView.tsx');
let code = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. Prepare Batch 3 Presets for 05-11-2026 and 06-11-2026
const b3Additions = `  "05-11-2026": {
    "id": "05-11-2026",
    "name": "05-11-2026 (Day 4 - Advanced JS & OOP)",
    "topicsTitle": "📌 Day 4 (Thursday 05-11-2026) – Advanced JavaScript & OOP Concepts",
    "topicsList": [
      "Scope chain, lexical environment, closures, higher-order functions & callbacks",
      "Function composition, currying, and 'this' keyword binding (call, apply, bind)",
      "Object-Oriented JavaScript: Classes, constructors, inheritance, extends, super, getters & setters",
      "Prototypes and prototype chaining; encapsulation and polymorphism",
      "Modern JavaScript: ES Modules, iterators, generators, Symbols, Sets, Maps, WeakMap, WeakSet"
    ],
    "tasksTitle": "📋 Assigned Tasks & Employee Management System Implementation",
    "tasksList": [
      "Implement practical examples for closures, function borrowing (call/apply/bind), and class inheritance",
      "Implement prototype methods and custom Set/Map utilities",
      "Employee Management System: Add employee registration, listing, editing, deletion, search & filter",
      "Mandatory: Push code to GitHub repository and submit daily status report before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Althaf Syed",
        "pendingTopics": "Pending: Clean code refactoring and debounced search in Employee Management System.",
        "completedTopics": "Yes - Scope chain, closures, call/apply/bind, and ES6 classes.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed Advanced JS concepts. Guided on function borrowing and class inheritance hierarchy.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete coverage; add debounced search evidence.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "Sunray Hospital website"
      },
      {
        "sNo": 2,
        "name": "Bala Krishna Parimi",
        "pendingTopics": "Pending: Prototype inheritance practical tasks.",
        "completedTopics": "Partial - Completed closures and basic class syntax.",
        "taskAssign": "Yes",
        "doubts": "Clarification needed on prototype chaining vs ES6 class extends.",
        "discussionSummary": "Clarified prototype chain lookup and super constructor calling.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete pending prototype tasks and push to GitHub.",
        "standupParticipation": "Participated",
        "standupRating": "Average",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good morning team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 3,
        "name": "Chandra Shekar K",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - Completed closures, function binding, OOP classes, prototypes, and Sets/Maps.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed advanced JavaScript concepts and Employee Management System payroll module.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Strong coverage across all topics and assignments.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "Employee Management System (Payroll Module added)"
      },
      {
        "sNo": 4,
        "name": "Girish C",
        "pendingTopics": "Pending: Full day's syllabus and practical tasks due to absence.",
        "completedTopics": "Absent - No submission received",
        "taskAssign": "Yes",
        "doubts": "Unreachable / Away",
        "discussionSummary": "Absent today. Morning absence warning dispatched to Teams channel.",
        "githubPushStatus": "No",
        "emailReviewStatus": "Absent - No daily report submitted.",
        "standupParticipation": "Absent",
        "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning message detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 5,
        "name": "Sana Sulthana",
        "pendingTopics": "Pending: Debouncing and throttling implementation in search input.",
        "completedTopics": "Yes - Closures, call/apply/bind, and class inheritance.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed OOP concepts and ES modules. Guided on debounced input handling.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Solid progress; complete debouncing module.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:02 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6,
        "name": "Tejaswar Rao",
        "pendingTopics": "Pending: Prototype method overriding.",
        "completedTopics": "Yes - Completed closures, call/apply/bind, and classes.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed OOP concepts and function composition.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Detailed status report submitted.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "N/A"
      }
    ]
  },
  "06-11-2026": {
    "id": "06-11-2026",
    "name": "06-11-2026 (Today - Advanced Array Methods)",
    "topicsTitle": "📌 Day 5 (Friday 06-11-2026) – Advanced Array Methods, Functional Programming & Modern JS",
    "topicsList": [
      "Advanced Array Methods: map(), filter(), reduce(), find(), some(), and every()",
      "flat() and flatMap()",
      "Functional Programming Concepts: Pure and Impure Functions, Immutability",
      "Higher-Order Functions and Callback Functions",
      "Rest and Spread Operators",
      "Map, Set, WeakMap, and WeakSet",
      "Iterators and Generators",
      "ES Modules: Import and Export"
    ],
    "tasksTitle": "📋 Assigned Tasks & Student Data Analytics Mini Assignment",
    "tasksList": [
      "Practice advanced array methods with real-world datasets",
      "Solve problems using map, filter, and reduce",
      "Understand functional programming principles; implement pure functions & immutability",
      "Create and use higher-order functions; practice Rest and Spread operators",
      "Implement Map and Set for managing unique data; understand iterators & generators",
      "Mini Assignment: Create a Student Data Analytics application that uses advanced array methods to calculate results, filter records, identify top performers, and generate summary reports",
      "Mandatory: Push code to GitHub repository and submit daily status report before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Althaf Syed",
        "pendingTopics": "Pending: Student Data Analytics mini assignment reduce() calculations.",
        "completedTopics": "In Progress - map(), filter(), reduce(), pure functions, immutability, and Higher-Order Functions.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Working on advanced array transformations and Student Data Analytics mini assignment.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Awaiting evening submission (cutoff 6:00 PM).",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "Sunray Hospital website"
      },
      {
        "sNo": 2,
        "name": "Bala Krishna Parimi",
        "pendingTopics": "Pending: flatMap() and generator functions.",
        "completedTopics": "In Progress - map(), filter(), find(), pure functions, and Rest/Spread operators.",
        "taskAssign": "Yes",
        "doubts": "Needs clarification on reduce accumulator initialization.",
        "discussionSummary": "Guided on reduce accumulator syntax and array grouping techniques.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated",
        "standupRating": "Average",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good morning team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 3,
        "name": "Chandra Shekar K",
        "pendingTopics": "N/A",
        "completedTopics": "In Progress - Advanced array methods, functional programming, Student Data Analytics application.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Implementing Student Data Analytics summary reports and top performer filtering.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "Employee Management System"
      },
      {
        "sNo": 4,
        "name": "Girish C",
        "pendingTopics": "Pending: Full day's syllabus and practical tasks due to absence.",
        "completedTopics": "Absent - No morning punch",
        "taskAssign": "Yes",
        "doubts": "Unreachable / Away",
        "discussionSummary": "Absent today. 9:00 AM absence alert dispatched to Microsoft Teams.",
        "githubPushStatus": "No",
        "emailReviewStatus": "Absent - No login detected.",
        "standupParticipation": "Absent",
        "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 5,
        "name": "Sana Sulthana",
        "pendingTopics": "Pending: Student Data Analytics UI summary table.",
        "completedTopics": "In Progress - map(), filter(), reduce(), higher-order functions, and Set/Map.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed pure functions and immutability. Building Student Data Analytics records filter.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:02 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6,
        "name": "Tejaswar Rao",
        "pendingTopics": "Pending: Student Data Analytics export module.",
        "completedTopics": "In Progress - map(), filter(), reduce(), pure functions, and ES Modules.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed higher-order functions and functional composition for analytics summary.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 09:00 AM via Teams ('Good Morning Team').",
        "selfProjectStatus": "N/A"
      }
    ]
  }`;

// 2. Prepare Batch 4 Presets for 05-11-2026 and 06-11-2026
const b4Additions = `  "05-11-2026": {
    "id": "05-11-2026",
    "name": "05-11-2026 (Day 4 - React State & Hooks)",
    "topicsTitle": "📌 Day 4 (Thursday 05-11-2026) – React Hooks, State Management & Forms (Batch 4)",
    "topicsList": [
      "useState Hook: Primitive vs Object state, state updates, immutability",
      "useEffect Hook: Component lifecycle, dependency array, cleanup functions",
      "Controlled Components & Form Validation (Text, Select, Checkbox, Radio)",
      "Props Drilling vs State Uplifting",
      "Mini Project: Interactive Task Tracker with filtering and status tags"
    ],
    "tasksTitle": "📋 Assigned Tasks & Interactive Dashboard Practical",
    "tasksList": [
      "Build dynamic task management module with useState and useEffect",
      "Implement multi-input form with validation and error state",
      "Mandatory: Push code to GitHub and submit status report before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1, "name": "Adinarayana Meesala",
        "pendingTopics": "Pending: Form validation edge cases.",
        "completedTopics": "Yes - useState, useEffect, controlled forms.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed form handling and state uplifting.",
        "githubPushStatus": "Yes", "emailReviewStatus": "Reviewed.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:51 AM via Teams ('Good morning ma’am').",
        "selfProjectStatus": "Healthcare Management System"
      },
      {
        "sNo": 2, "name": "Adithya Ram",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - All React hooks and state practical tasks.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Solid implementation of custom hook filters.",
        "githubPushStatus": "Yes", "emailReviewStatus": "Reviewed.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:55 AM via Teams ('Good morning everyone!').",
        "selfProjectStatus": "E-Commerce Frontend"
      },
      {
        "sNo": 3, "name": "Jose Amala Kishor",
        "pendingTopics": "Pending: useEffect cleanup for intervals.",
        "completedTopics": "Partial - Completed useState and basic forms.",
        "taskAssign": "Yes", "doubts": "Clarification on useEffect unmounting.",
        "discussionSummary": "Guided on memory leaks and cleanup returns.",
        "githubPushStatus": "Yes", "emailReviewStatus": "Reviewed.",
        "standupParticipation": "Participated", "standupRating": "Average",
        "standupRemarks": "🟡 Logged in at 09:04 AM via Teams (Grace Period).",
        "selfProjectStatus": "Portfolio Project"
      },
      {
        "sNo": 4, "name": "Snehith Reddy Challa",
        "pendingTopics": "Pending: Error banner styling.",
        "completedTopics": "Yes - React hooks and controlled inputs.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed state uplifting between siblings.",
        "githubPushStatus": "Yes", "emailReviewStatus": "Reviewed.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟡 Logged in at 09:07 AM via Teams (Grace Period).",
        "selfProjectStatus": "Blog Application"
      },
      {
        "sNo": 5, "name": "Sruthi Badavath",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - All assigned tasks completed.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Completed task tracker dashboard.",
        "githubPushStatus": "Yes", "emailReviewStatus": "Reviewed.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:58 AM via Teams ('Good morning team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6, "name": "Nikhil Kumar Kurapati",
        "pendingTopics": "Pending: Entire day syllabus due to absence.",
        "completedTopics": "Absent", "taskAssign": "Yes", "doubts": "Away / Unreachable",
        "discussionSummary": "Absent. Absence notification dispatched to Teams.",
        "githubPushStatus": "No", "emailReviewStatus": "Absent",
        "standupParticipation": "Absent", "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 7, "name": "Ramesh Kumar A",
        "pendingTopics": "Pending: Entire day syllabus due to absence.",
        "completedTopics": "Absent", "taskAssign": "Yes", "doubts": "Away / Unreachable",
        "discussionSummary": "Absent. Absence notification dispatched to Teams.",
        "githubPushStatus": "No", "emailReviewStatus": "Absent",
        "standupParticipation": "Absent", "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      }
    ]
  },
  "06-11-2026": {
    "id": "06-11-2026",
    "name": "06-11-2026 (Today - React API & Capstone)",
    "topicsTitle": "📌 Day 5 (Friday 06-11-2026) – React API Integration, Context API & Capstone (Batch 4)",
    "topicsList": [
      "Context API & useContext: Global state management without prop drilling",
      "API Integration with Fetch / Axios & Async/Await",
      "Loading states, Error Boundaries & optimistic UI updates",
      "React Router DOM: Dynamic routes, useNavigate, useParams",
      "Capstone Project: Full Responsive Student & Course Management Dashboard"
    ],
    "tasksTitle": "📋 Assigned Tasks & Capstone Dashboard Mini Assignment",
    "tasksList": [
      "Implement Context Provider for theme and user authentication",
      "Integrate mock API endpoints for trainee data with error and loading spinners",
      "Capstone Mini Assignment: Course Management System with student enrollment & search",
      "Mandatory: Push code to GitHub repository and submit daily status report before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1, "name": "Adinarayana Meesala",
        "pendingTopics": "Pending: Capstone enrollment filter.",
        "completedTopics": "In Progress - Context API and Async/Await fetch calls.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Building Context provider for student enrollment dashboard.",
        "githubPushStatus": "Pending", "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:51 AM via Teams ('Good morning ma’am').",
        "selfProjectStatus": "Healthcare Management System"
      },
      {
        "sNo": 2, "name": "Adithya Ram",
        "pendingTopics": "N/A",
        "completedTopics": "In Progress - Full React Router and global Context API implementation.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Implementing protected routes and capstone summary charts.",
        "githubPushStatus": "Pending", "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:55 AM via Teams ('Good morning everyone!').",
        "selfProjectStatus": "E-Commerce Frontend"
      },
      {
        "sNo": 3, "name": "Jose Amala Kishor",
        "pendingTopics": "Pending: API error handling UI.",
        "completedTopics": "In Progress - Fetch data integration and loading spinners.",
        "taskAssign": "Yes", "doubts": "Needs help with Axios error interceptors.",
        "discussionSummary": "Guided on try/catch blocks for async API calls.",
        "githubPushStatus": "Pending", "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated", "standupRating": "Average",
        "standupRemarks": "🟡 Logged in at 09:04 AM via Teams (Grace Period).",
        "selfProjectStatus": "Portfolio Project"
      },
      {
        "sNo": 4, "name": "Snehith Reddy Challa",
        "pendingTopics": "Pending: Responsive mobile nav for capstone.",
        "completedTopics": "In Progress - Context API and custom hooks for student data.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Reviewed global state and modular component styling.",
        "githubPushStatus": "Pending", "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟡 Logged in at 09:07 AM via Teams (Grace Period).",
        "selfProjectStatus": "Blog Application"
      },
      {
        "sNo": 5, "name": "Sruthi Badavath",
        "pendingTopics": "N/A",
        "completedTopics": "In Progress - React API integration and dynamic search filter.",
        "taskAssign": "Yes", "doubts": "No Blockers Reported",
        "discussionSummary": "Completed student data table with dynamic search.",
        "githubPushStatus": "Pending", "emailReviewStatus": "Awaiting evening submission.",
        "standupParticipation": "Participated", "standupRating": "Good",
        "standupRemarks": "🟢 Logged in at 08:58 AM via Teams ('Good morning team').",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6, "name": "Nikhil Kumar Kurapati",
        "pendingTopics": "Pending: Entire day syllabus due to absence.",
        "completedTopics": "Absent", "taskAssign": "Yes", "doubts": "Away / Unreachable",
        "discussionSummary": "Absent. Absence notification dispatched to Teams.",
        "githubPushStatus": "No", "emailReviewStatus": "Absent",
        "standupParticipation": "Absent", "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 7, "name": "Ramesh Kumar A",
        "pendingTopics": "Pending: Entire day syllabus due to absence.",
        "completedTopics": "Absent", "taskAssign": "Yes", "doubts": "Away / Unreachable",
        "discussionSummary": "Absent. Absence notification dispatched to Teams.",
        "githubPushStatus": "No", "emailReviewStatus": "Absent",
        "standupParticipation": "Absent", "standupRating": "N/A",
        "standupRemarks": "❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.",
        "selfProjectStatus": "N/A"
      }
    ]
  }`;

// 1. Insert into BATCH_3_SHEET_PRESETS
const b3Target = `    ]\n  }\n};\n\nexport const BATCH_4_SHEET_PRESETS`;
if (!code.includes(b3Target)) {
  console.error('Could not find b3Target');
  process.exit(1);
}
code = code.replace(
  b3Target,
  `    ]\n  },\n${b3Additions}\n};\n\nexport const BATCH_4_SHEET_PRESETS`
);

// 2. Insert into BATCH_4_SHEET_PRESETS
const b4Target = `    ]\n  }\n};\n\nexport default function DailyTrackerView`;
if (!code.includes(b4Target)) {
  console.error('Could not find b4Target');
  process.exit(1);
}
code = code.replace(
  b4Target,
  `    ]\n  },\n${b4Additions}\n};\n\nexport default function DailyTrackerView`
);

// 3. Default selectedSheetDate to '06-11-2026'
code = code.replace(
  `const [selectedSheetDate, setSelectedSheetDate] = useState('26-10-2026');`,
  `const [selectedSheetDate, setSelectedSheetDate] = useState('06-11-2026');`
);

// 4. Default initialDate in handleSwitchBatch to '06-11-2026'
code = code.replace(
  `const initialDate = '26-10-2026';`,
  `const initialDate = '06-11-2026';`
);

// 5. Add handleApplyTeamsAttendance right after handleSwitchBatch definition
const switchBatchEndTarget = `toastSuccess(\`Batch \${batch} Active\`, \`Switched to Batch \${batch} operations tracker (\${rowsToSet.length} trainees).\`);\n  };`;
const applyTeamsFunc = `\n\n  const handleApplyTeamsAttendance = (punches: any[]) => {
    if (!punches || !punches.length) return;
    setEditableRows((prev) => {
      const updated = prev.map((row) => {
        const match = punches.find(
          (p: any) =>
            p.traineeName.toLowerCase().trim() === row.name.toLowerCase().trim() ||
            row.name.toLowerCase().includes(p.traineeName.toLowerCase()) ||
            p.traineeName.toLowerCase().includes(row.name.toLowerCase())
        );
        if (match) {
          if (match.status === 'absent') {
            return {
              ...row,
              standupParticipation: 'Absent',
              standupRating: 'N/A',
              standupRemarks: '❌ Absent — No Good Morning or login detected in Teams channel by 9:20 AM cutoff.',
              completedTopics: 'Absent - Topic catch-up pending',
              pendingTopics: 'Pending: Full day session due to absence',
            };
          } else {
            return {
              ...row,
              standupParticipation: 'Participated',
              standupRating: row.standupRating === 'N/A' || !row.standupRating ? 'Good' : row.standupRating,
              standupRemarks: \`🟢 Teams: Logged in at \${match.loginTime} ("\${match.messageText || 'Good Morning Team'}").\`,
            };
          }
        }
        return row;
      });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(\`nexus_batch\${selectedBatch}_sheet_\${selectedSheetDate}\`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    toastSuccess(
      'Tracker Rows Updated with Teams Attendance!',
      \`Applied 9:00 AM Teams roll call to Batch \${selectedBatch} sheet for \${selectedSheetDate}.\`
    );
  };`;

if (!code.includes(switchBatchEndTarget)) {
  console.error('Could not find switchBatchEndTarget');
  process.exit(1);
}
code = code.replace(switchBatchEndTarget, `${switchBatchEndTarget}${applyTeamsFunc}`);

// 6. Update onAttendanceUpdated in <TeamsSetupModal>
const teamsModalTarget = `onAttendanceUpdated={onRefresh}`;
if (!code.includes(teamsModalTarget)) {
  console.error('Could not find teamsModalTarget');
  process.exit(1);
}
code = code.replace(
  teamsModalTarget,
  `onAttendanceUpdated={(punches) => { handleApplyTeamsAttendance(punches); onRefresh?.(); }}`
);

// 7. Add "Apply to Sheet" button on the Teams Roll Call bar
const rollcallBtnTarget = `<button
              type="button"
              onClick={() => setShowTeamsModal(true)}
              style={{
                background: 'rgba(91, 95, 199, 0.2)',
                border: '1px solid rgba(91, 95, 199, 0.45)',
                color: '#c7d2fe',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
              title="Inspect Good Morning messages and roll call in Microsoft Teams modal"
            >
              <span>View Full Teams Feed</span>
              <ExternalLink size={12} />
            </button>`;

if (!code.includes(rollcallBtnTarget)) {
  console.error('Could not find rollcallBtnTarget');
  process.exit(1);
}

const enhancedRollcallBtns = `<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  if (teamsDaySummary?.scannedPunches) {
                    handleApplyTeamsAttendance(teamsDaySummary.scannedPunches);
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
                title="Apply Teams login status directly to the tracker rows below"
              >
                <CheckCircle2 size={12} />
                <span>Apply to Sheet</span>
              </button>
              ${rollcallBtnTarget}
            </div>`;

code = code.replace(rollcallBtnTarget, enhancedRollcallBtns);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('DailyTrackerView.tsx updated and verified successfully!');
