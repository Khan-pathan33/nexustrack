import ExcelJS from 'exceljs';

export interface BatchTraineeRow {
  sNo: number;
  name: string;
  pendingTopics: string;
  completedTopics: string;
  taskAssign: string;
  doubts: string;
  discussionSummary: string;
  githubPushStatus: string;
  emailReviewStatus: string;
  standupParticipation: string;
  standupRating: string;
  standupRemarks: string;
  selfProjectStatus: string;
}

export const DEFAULT_BATCH_TRAINEES: string[] = [
  'Althaf Syed',
  'Bala Krishna Parimi',
  'Chandra Shekar K',
  'Girish C',
  'Sana Sulthana',
  'Tejaswar Rao',
];

export const BATCH_3_TRAINEES: string[] = [
  'Althaf Syed',
  'Bala Krishna Parimi',
  'Chandra Shekar K',
  'Girish C',
  'Sana Sulthana',
  'Tejaswar Rao',
];

export const BATCH_4_TRAINEES: string[] = [
  'Adinarayana Meesala',
  'Adithya Ram',
  'Jose Amala Kishor',
  'Snehith Reddy Challa',
  'Sruthi Badavath',
  'Nikhil Kumar Kurapati',
  'Ramesh Kumar A',
];

export const DEFAULT_REACT_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    sNo: 1,
    name: 'Althaf Syed',
    pendingTopics: 'Pending: React Profile Page mini assignment was not reported as completed.',
    completedTopics:
      'Partial - Completed React setup, project structure, functional/reusable components, JSX syntax and rules, expressions, Fragments, Strict Mode, rendering, and function calls. Profile Page remains unconfirmed.',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed all React fundamentals and assigned exercises. The required Profile Page mini assignment was not reported. Also continued Sunray Hospital UI improvements.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”',
    standupParticipation: 'Participated',
    standupRating: 'Good',
    standupRemarks: 'Good stand-up participation; complete or confirm the React Profile Page.',
    selfProjectStatus:
      'Sunray Hospital website: continued UI, typography, hover-effect, and responsive-design improvements.',
  },
  {
    sNo: 2,
    name: 'Bala Krishna Parimi',
    pendingTopics:
      'Pending: JSX syntax practice, valid/invalid JSX identification, JavaScript expressions in JSX, Fragments, Strict Mode, reusable components, and the React Profile Page mini assignment.',
    completedTopics:
      'Partial - Completed React introduction, purpose, features, project structure/setup, components, functional components, JSX concepts/rules, Fragments, Strict Mode, rendering components, and calling functions. Assigned practice and Profile Page remain pending.',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed the planned React fundamentals and JSX topic study. The email explicitly lists several assigned exercises as pending and does not report the required React Profile Page.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Avoid listing JSX, Fragments, and Strict Mode as both completed and pending; distinguish conceptual study from implementation and add the Profile Page status.',
    standupParticipation: 'Participated',
    standupRating: 'Average',
    standupRemarks: 'Stand-up participation was average; complete the pending React exercises and Profile Page.',
    selfProjectStatus: 'N/A',
  },
  {
    sNo: 3,
    name: 'Chandra Shekar K',
    pendingTopics: 'N/A',
    completedTopics: 'Yes',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed React fundamentals, project setup, JSX, Fragments, Strict Mode, reusable components, assigned tasks, and the React Profile Page. Also fixed Reports page functionality and implemented role-based login in the Employee Management System.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Complete coverage; keep the Mini Project separate from today’s React assignment and use “role-based” consistently.',
    standupParticipation: 'Participated',
    standupRating: 'Good',
    standupRemarks: 'Good stand-up participation and full completion of the required scope.',
    selfProjectStatus:
      'Employee Management System: fixed Reports page functionality and implemented role-based login.',
  },
  
  {
    sNo: 4, name: 'Girish C',
    pendingTopics:
      'Pending: assigned React project exercises and Profile Page mini assignment were not reported as completed.',
    completedTopics:
      'Partial - Completed React introduction, features, project structure/setup, functional components, JSX and rules, valid/invalid JSX, Fragments, Strict Mode, rendering, and function calls. Practical implementations remain unconfirmed.',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed the planned React topic study but did not report the assigned tasks or Profile Page mini assignment.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.',
    standupParticipation: 'Participated',
    standupRating: 'Good',
    standupRemarks: 'Good stand-up participation; complete or confirm the assigned exercises and Profile Page.',
    selfProjectStatus: 'N/A',
  },
  
  {
    sNo: 5, name: 'Sana Sulthana',
    pendingTopics: 'N/A',
    completedTopics: 'Yes',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed React setup, project structure, functional components, JSX rules, Fragments, Strict Mode, and the required React Profile Page using Header, Profile, Skills, Education, and Footer components.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Complete coverage; enter “N/A” under Pending Tasks instead of leaving it blank and correct “mial” to “mail.”',
    standupParticipation: 'Participated',
    standupRating: 'Good',
    standupRemarks: 'Good stand-up participation and full completion of the required scope.',
    selfProjectStatus: 'N/A',
  },
  {
    sNo: 6, name: 'Tejaswar Rao',
    pendingTopics: 'N/A',
    completedTopics: 'Yes',
    taskAssign: 'Yes',
    doubts: 'No Blockers Reported',
    discussionSummary:
      'Completed React functional components, JSX, expressions and functions, array rendering with map() and keys, reusable components, Fragments, composition, and the React Profile Page with CSS styling.',
    githubPushStatus: 'Yes',
    emailReviewStatus:
      'Reviewed. Complete and well structured; correct “mial” to “mail,” “froim” to “from,” and the name spelling to “Tejaswar Rao.”',
    standupParticipation: 'Participated',
    standupRating: 'Good',
    standupRemarks: 'Good stand-up participation and full completion of the required scope.',
    selfProjectStatus: 'N/A',
  },
];

export const DEFAULT_OCT01_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "Pending: Responsive dashboard practical review.",
    "completedTopics": "Yes - Completed Flexbox and Grid concepts, layout exercises.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Clean CSS layout and dashboard structure.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good participation.",
    "selfProjectStatus": "Sunray Hospital website"
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: required responsive dashboard layout and advanced Grid layouts were not reported.",
    "completedTopics": "Partial - Completed basic Flexbox and HTML/CSS form structures. JavaScript practical incomplete.",
    "taskAssign": "Yes",
    "doubts": "Needs clarification on Grid layout placement and JavaScript syntax.",
    "discussionSummary": "Practiced basic HTML forms and CSS box model. Guided on Flexbox container properties and CSS Grid column sizing.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Ensure all assigned layout tasks and responsive dashboard practical are submitted.",
    "standupParticipation": "Participated",
    "standupRating": "Average",
    "standupRemarks": "Needs hands-on practice.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes - Completed all Flexbox and Grid concepts and assigned layout tasks.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and full responsive dashboard with header, sidebar, cards, main content, and table.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete coverage; keep EMS project separate from CSS layouts.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Consistent high performer.",
    "selfProjectStatus": "Employee Management System: worked on functionality for seasonal pages."
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes - Completed Flexbox container properties, alignment, CSS Grid columns, and responsive dashboard layout.",
    "taskAssign": "Yes",
    "doubts": "Resolved - email sending was delayed by a corrupted attachment; the file was deleted and re-uploaded.",
    "discussionSummary": "Completed Flexbox container properties, alignment, CSS Grid columns, and responsive dashboard layout with header, sidebar, cards, main content, and table.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Solid implementation; correct “harmed file” to “corrupted file.”",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Solid implementation.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: Responsive dashboard layout practical.",
    "completedTopics": "Partial - Studied Flexbox and CSS Grid topics. Practiced repeat(), fr, and nested Grid.",
    "taskAssign": "Yes",
    "doubts": "Need guidance on nested grid auto-fit alignment.",
    "discussionSummary": "Studied Flexbox and CSS Grid topics. Understood flex container and grid-template-columns. Practiced repeat(), fr, minmax(). Responsive dashboard practical pending.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Add responsive dashboard layout practical with cards and table.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good progress.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "Pending: Complete responsive dashboard practical.",
    "completedTopics": "Partial - Completed Flexbox and basic Grid exercises.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Flexbox and basic Grid exercises. Practiced flex containers and column sizing. Working on dashboard layout.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Submit the responsive dashboard practical.",
    "standupParticipation": "Participated",
    "standupRating": "Average",
    "standupRemarks": "Working on completion.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "N/A",
    "completedTopics": "Yes - Completed all Flexbox and Grid concepts, layout exercises, cards, and full responsive dashboard layout.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed full responsive dashboard layout with Header, Sidebar, Cards, Main Content, Table, and Footer using Flexbox and CSS Grid.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Top-tier CSS layout implementation.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Top performer.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes - Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete and well structured; use \"CSS\" rather than \"HTML\" as Completed Tasks heading.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Clean code.",
    "selfProjectStatus": "N/A"
  }
];

export const DEFAULT_OCT05_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "Pending: React Profile Page mini assignment was not reported as completed.",
    "completedTopics": "Partial - Completed React setup, project structure, functional/reusable components, JSX syntax and rules, expressions, Fragments, Strict Mode, rendering, and function calls. Profile Page remains unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all React fundamentals and assigned exercises. The required Profile Page mini assignment was not reported. Also continued Sunray Hospital UI improvements.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation; complete or confirm the React Profile Page.",
    "selfProjectStatus": "Sunray Hospital website: continued UI, typography, hover-effect, and responsive-design improvements."
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: JSX syntax practice, valid/invalid JSX identification, JavaScript expressions in JSX, Fragments, Strict Mode, reusable components, and the React Profile Page mini assignment.",
    "completedTopics": "Partial - Completed React introduction, purpose, features, project structure/setup, components, functional components, JSX concepts/rules, Fragments, Strict Mode, rendering components, and calling functions. Assigned practice and Profile Page remain pending.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed the planned React fundamentals and JSX topic study. The email explicitly lists several assigned exercises as pending and does not report the required React Profile Page.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Avoid listing JSX, Fragments, and Strict Mode as both completed and pending; distinguish conceptual study from implementation and add the Profile Page status.",
    "standupParticipation": "Participated",
    "standupRating": "Average",
    "standupRemarks": "Stand-up participation was average; complete the pending React exercises and Profile Page.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed React fundamentals, project setup, JSX, Fragments, Strict Mode, reusable components, assigned tasks, and the React Profile Page. Also fixed Reports page functionality and implemented role-based login in the Employee Management System.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete coverage; keep the Mini Project separate from today’s React assignment and use “role-based” consistently.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
    "selfProjectStatus": "Employee Management System: fixed Reports page functionality and implemented role-based login."
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "Resolved - email sending was delayed by a corrupted attachment; the file was deleted and re-uploaded.",
    "discussionSummary": "Completed React project setup with Vite, project structure, functional components, JSX syntax and rules, JavaScript expressions, Fragments, Strict Mode, reusable components, and the required Profile Page with Header, Profile, Skills, Education, and Footer. Also revised prior HTML/CSS layout concepts.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete React scope; correct “harmed file” to “corrupted file,” “Java script” to “JavaScript,” and keep prior HTML/CSS revision separate from today’s React assignment.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation and full completion of the required React scope.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: assigned React project exercises and Profile Page mini assignment were not reported as completed.",
    "completedTopics": "Partial - Completed React introduction, features, project structure/setup, functional components, JSX and rules, valid/invalid JSX, Fragments, Strict Mode, rendering, and function calls. Practical implementations remain unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed the planned React topic study but did not report the assigned tasks or Profile Page mini assignment.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation; complete or confirm the assigned exercises and Profile Page.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "Pending: React Profile Page mini assignment was not reported as completed.",
    "completedTopics": "Partial - Completed React project creation and structure, reusable functional components, JSX rules and expressions, Fragments, and Strict Mode. Profile Page remains unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Created a React project using Vite and practiced project structure, functional components, JSX, expressions, Fragments, and Strict Mode. The required Profile Page was not reported.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. “No Pending Task” conflicts with the missing Profile Page mini assignment; report it explicitly.",
    "standupParticipation": "Participated",
    "standupRating": "Average",
    "standupRemarks": "Stand-up participation was average; complete or confirm the React Profile Page.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed React setup, project structure, functional components, JSX rules, Fragments, Strict Mode, and the required React Profile Page using Header, Profile, Skills, Education, and Footer components.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete coverage; enter “N/A” under Pending Tasks instead of leaving it blank and correct “mial” to “mail.”",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed React functional components, JSX, expressions and functions, array rendering with map() and keys, reusable components, Fragments, composition, and the React Profile Page with CSS styling.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete and well structured; correct “mial” to “mail,” “froim” to “from,” and the name spelling to “Tejaswar Rao.”",
    "standupParticipation": "Participated",
    "standupRating": "Good",
    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
    "selfProjectStatus": "N/A"
  }
];

export const DEFAULT_OCT06_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "Pending: Product Management UI mini assignment was not reported as completed.",
    "completedTopics": "Partial - Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, function props, shared data, conditional rendering, and assigned exercises. Product Management UI remains unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all React communication topics and assigned exercises, but did not report the Product Management UI mini assignment. Also continued Sunray Hospital UI improvements.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "Sunray Hospital website: continued UI and responsive-design improvements."
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: assigned implementations and Product Management UI mini assignment were not reported as completed.",
    "completedTopics": "Partial - Completed conceptual practice for Props, State, useState, parent/child components, communication, hierarchy, function props, shared data, and conditional rendering. Practical tasks remain pending.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed the planned topic study, but the email explicitly lists most assigned tasks as pending and does not report the Product Management UI.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Avoid listing communication concepts as practiced while repeating their implementations as pending; clearly separate study from completed code.",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, conditional rendering, all assigned tasks, and the Product Management UI. Also fixed Admin/Manager role functionality and added Employee settings/dashboard pages.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete coverage; keep the Employee Management System work separate and correct “dashboard paged” to “dashboard page.”",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "Employee Management System: fixed Admin/Manager role functionality and added Employee settings and dashboard pages."
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all component communication topics and tasks, including Props, callbacks, useState, hierarchy, conditional rendering, and the Product Management UI with list, details, add, edit, delete, and conditional display.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete React scope; correct “Usestate” to “useState,” “conditional rerendering” to “conditional rendering,” and keep prior CSS revision separate.",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: assigned component exercises and Product Management UI mini assignment were not reported as completed.",
    "completedTopics": "Partial - Completed Props, State, useState, parent/child components, communication, hierarchy, passing functions, shared data, and conditional rendering topics. Practical implementations remain unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed the planned React topic study but did not report the assigned tasks or Product Management UI.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "Pending: Product Management UI mini assignment was not reported as completed.",
    "completedTopics": "Partial - Completed parent/child components, Props, function props, callback communication, multi-level hierarchy, useState, interaction-based updates, shared data, and conditional rendering. Product Management UI remains unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed all listed communication concepts and assigned exercises, but did not report the required Product Management UI.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. “No Pending Task” conflicts with the omitted Product Management UI; report the mini assignment explicitly.",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "Pending: Edit Product functionality and complete conditional product-information display were not reported.",
    "completedTopics": "Partial - Completed Props, State, useState, parent/child and callback communication, hierarchy, conditional rendering, and a Product Management UI with display, add, view, and delete. Edit functionality remains unconfirmed.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed React communication concepts and created a Product Management UI for displaying, adding, viewing details, and deleting products. Edit Product and full conditional display were not reported.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Enter specific pending items instead of leaving the section blank; include Edit Product and conditional display evidence.",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, shared data, conditional rendering, and the Product Management application with add, view, edit, update, and delete functionality.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete and well structured; correct the name spelling to “Tejaswar Rao.”",
    "standupParticipation": "Not Conducted",
    "standupRating": "N/A",
    "standupRemarks": "No stand-up call was conducted today.",
    "selfProjectStatus": "N/A"
  }
];

export const DEFAULT_OCT07_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed controlled forms, event handling, dynamic list rendering with map() and keys, and useEffect lifecycle triggers. User Registration mini assignment completed.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Ensure all form validation edge cases are handled.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Active in session.",
    "selfProjectStatus": "Sunray Hospital website"
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: Complete form validation and lifecycle cleanup.",
    "completedTopics": "Partial - Controlled components and map() practiced; form validation in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed conceptual study for forms, list rendering, and useEffect. Practicing dynamic user list implementation.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Practice hands-on form validation and dependency array rules.",
    "standupParticipation": "Conducted",
    "standupRating": "Average",
    "standupRemarks": "Needs hands-on practice.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed controlled forms, validation, map() rendering with keys, and useEffect auto-save. User Registration & List app completed.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Excellent code structure and lifecycle management.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Consistent high performer.",
    "selfProjectStatus": "Employee Management System"
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed event handling, dynamic form fields, list rendering with proper keys, and useEffect lifecycle. Pushed to GitHub.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Clean form state handling.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Solid implementation.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: User Registration mini assignment code submission.",
    "completedTopics": "Partial - Completed forms and lists; useEffect practice in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed form controls, input handling, and map() rendering. User List application verification pending.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Submit completed User Registration code.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Good progress.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "Pending: Complete User Registration and User List app.",
    "completedTopics": "Partial - Event handling completed; User Registration app pending.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed controlled components and map() list rendering. Practicing useEffect dependency arrays.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Focus on finishing User Registration app.",
    "standupParticipation": "Conducted",
    "standupRating": "Average",
    "standupRemarks": "Guidance provided on state updates.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed event handling, controlled form with real-time validation, dynamic user list rendering with keys, and useEffect auto-save.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Outstanding form validation and proper component composition.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Top performer.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed full User Registration and User List application with input validation, edit/delete user actions, dynamic keys, and useEffect.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete and well structured; clean lifecycle implementation.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Very clean code.",
    "selfProjectStatus": "N/A"
  }
];

export const DEFAULT_OCT08_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed REST API integration using fetch/axios, async/await, loading spinners, and error alerts. User Management Application built with search and filter.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete API integration and clean service layer.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Good API integration.",
    "selfProjectStatus": "Sunray Hospital website improvements."
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: Complete POST/PUT/DELETE API operations.",
    "completedTopics": "Partial - GET requests and search filter completed; CRUD mutations in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed GET requests and dynamic rendering. Practicing POST, PUT, DELETE operations and loading skeleton states.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Practice hands-on API mutations and error boundary handling.",
    "standupParticipation": "Conducted",
    "standupRating": "Average",
    "standupRemarks": "Needs hands-on practice with async calls.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed full CRUD REST API integration (GET, POST, PUT, DELETE) with async/await, loading/error states, search, filter, and modular service layer.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Production grade REST API integration.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Consistent high performer.",
    "selfProjectStatus": "Employee Management System"
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed React API calls with Axios, loading spinners, error banners, search, and department filter. Code pushed to GitHub.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Clean API service separation.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Solid implementation.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: React User Management practical assignment submission.",
    "completedTopics": "Partial - GET API fetching completed; search filter in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Fetched and displayed API data with loading state. Implementing real-time search filter and error handling.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Submit completed User Management API application code.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Good progress.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "Pending: Implement PUT and DELETE API endpoints.",
    "completedTopics": "Partial - GET request and display completed; edit/delete pending.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Practiced fetch API and async/await with loading indicators. User Management app pending full CRUD integration.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Connect edit and delete operations to the REST API.",
    "standupParticipation": "Conducted",
    "standupRating": "Average",
    "standupRemarks": "Guidance provided on async/await.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed complete React User Management Application integrated with REST API: live search, role filtering, modal add user, edit, delete, and loading states.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Outstanding REST API integration and error handling.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Top performer.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed full React User Management app: API integration with Axios, async/await, live search, department filter, modal CRUD forms, and clean error states.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Flawless API architecture and modular service functions.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Very clean code.",
    "selfProjectStatus": "N/A"
  }
];

export const DEFAULT_OCT09_TRAINEE_ROWS: BatchTraineeRow[] = [
  {
    "sNo": 1,
    "name": "Althaf Syed",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Context API setup for global state and built custom useFetch hook. Final Capstone Mini Application completed with components, state, APIs, and Context.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Complete weekly syllabus mastered.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Active participation.",
    "selfProjectStatus": "Sunray Hospital website"
  },
  {
    "sNo": 2,
    "name": "Bala Krishna Parimi",
    "pendingTopics": "Pending: Finalize Custom Hook and capstone app integration.",
    "completedTopics": "Partial - Context API completed; custom hook capstone integration in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Practiced Context API and state sharing. Building custom useFetch hook and revising full weekly React curriculum.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Consolidate custom hooks with Context.",
    "standupParticipation": "Conducted",
    "standupRating": "Average",
    "standupRemarks": "Needs hands-on practice.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 3,
    "name": "Chandra Shekar K",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Context API, multiple custom hooks (useFetch, useForm), and complete React Capstone mini application combining all 5 days of curriculum.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Outstanding production-ready capstone application.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Consistent high performer.",
    "selfProjectStatus": "Employee Management System"
  },
  {
    "sNo": 4,
    "name": "Chevva Vinay Kumar",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed global state management with Context, custom useFetch hook, and full React Mini App with clean modular architecture.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Solid component hierarchy and state design.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Solid implementation.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 5,
    "name": "Girish C",
    "pendingTopics": "Pending: Capstone mini app verification.",
    "completedTopics": "Partial - Context API completed; capstone app submission in progress.",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Practiced Provider/Consumer and useContext. Building custom hook and revising weekly topics for capstone submission.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Submit completed capstone mini application code.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Good progress.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 6,
    "name": "Jayakrishna Madicharla",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed Context API practice and custom hooks. Integrating full CRUD API and Context into final React mini application.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Proper weekly revision and code structure.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Proper code structure.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 7,
    "name": "Sana Sulthana",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed complete React Mini Application combining reusable components, Props, State, controlled forms, useEffect, REST API CRUD, Context API, and custom hooks.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Top tier capstone project with production-grade quality.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Top performer.",
    "selfProjectStatus": "N/A"
  },
  {
    "sNo": 8,
    "name": "Tejaswar Rao",
    "pendingTopics": "N/A",
    "completedTopics": "Yes",
    "taskAssign": "Yes",
    "doubts": "No Blockers Reported",
    "discussionSummary": "Completed full React Capstone application: modular architecture, Context API global theme/auth, custom useFetch/useForm hooks, full REST API CRUD, and error handling.",
    "githubPushStatus": "Yes",
    "emailReviewStatus": "Reviewed. Flawless capstone implementation across all weekly topics.",
    "standupParticipation": "Conducted",
    "standupRating": "Good",
    "standupRemarks": "Very clean code.",
    "selfProjectStatus": "N/A"
  }
];
export const TODAY_TOPICS_TEXT = `React Fundamentals & JSX

Topics Covered:
- Introduction to React
- Why React is used
- React Features
- React Project Structure
- React Application Setup
- Components
- Functional Components
- JSX
- JSX Rules
- Valid and Invalid JSX
- Fragments
- Strict Mode
- Rendering Components
- Calling Functions in Components`;

export const TODAY_TASKS_TEXT = `Assigned Tasks:
- Create a React project from scratch.
- Understand the complete React project structure.
- Create multiple functional components.
- Practice JSX syntax.
- Identify valid and invalid JSX.
- Practice using JavaScript expressions inside JSX.
- Use Fragments where required.
- Understand Strict Mode.
- Create reusable basic components.

Mini Assignment:
Create a simple React Profile Page using:
- Header
- Profile
- Skills
- Education
- Footer`;

export async function createBatchDailyStatusWorkbook(
  dateStr: string,
  traineeRows: BatchTraineeRow[],
  topicsText = TODAY_TOPICS_TEXT,
  tasksText = TODAY_TASKS_TEXT,
  batchNumber: string | number = '3'
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'NexusTrack AI Operations';
  workbook.lastModifiedBy = 'NexusTrack';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet(dateStr, {
    views: [{ showGridLines: true }],
  });

  // Set column widths
  sheet.columns = [
    { width: 8 },   // A: S No / Today Topics
    { width: 24 },  // B: Name / Today Tasks
    { width: 34 },  // C: Pending Topics
    { width: 34 },  // D: Completed Topics
    { width: 16 },  // E: Task Assign
    { width: 22 },  // F: Doubts
    { width: 36 },  // G: Discussion Summary
    { width: 18 },  // H: GitHub Push
    { width: 36 },  // I: Email Review Status
    { width: 18 },  // J: Standup Participation
    { width: 14 },  // K: Standup Rating
    { width: 24 },  // L: Standup Remarks
    { width: 34 },  // M: Self-Project Status
  ];

  // ── ROW 2: TOP BANNER ──
  sheet.mergeCells('C2:M2');
  const banner = sheet.getCell('C2');
  banner.value = `BATCH ${batchNumber} - DAILY ONE-ON-ONE CONNECT TRACKER`;
  banner.font = { name: 'Aptos Narrow', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  banner.alignment = { horizontal: 'center', vertical: 'middle' };
  banner.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: String(batchNumber) === '4' ? 'FF581C87' : 'FF0F4C81' }, // Purple for Batch 4, Navy for Batch 3
  };
  sheet.getRow(2).height = 28;

  // ── ROWS 3-12: TOP TOPICS & TASKS CARDS ──
  sheet.mergeCells('A3:A12');
  const topicsCell = sheet.getCell('A3');
  topicsCell.value = `Today Topics\n\n${topicsText}`;
  topicsCell.font = { name: 'Aptos Narrow', size: 10, bold: false };
  topicsCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  topicsCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F4F8' },
  };
  topicsCell.border = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } },
  };

  sheet.mergeCells('B3:B12');
  const tasksCell = sheet.getCell('B3');
  tasksCell.value = `Today Tasks\n\n${tasksText}`;
  tasksCell.font = { name: 'Aptos Narrow', size: 10, bold: false };
  tasksCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  tasksCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F4F8' },
  };
  tasksCell.border = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } },
  };

  // Border outline for remaining empty grid in rows 3-12
  for (let r = 3; r <= 12; r++) {
    sheet.getRow(r).height = 20;
  }

  // ── ROW 13: TABLE HEADERS ──
  const headers = [
    'S No',
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

  const headerRow = sheet.getRow(13);
  headerRow.height = 28;

  headers.forEach((h, idx) => {
    const colNumber = idx + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = h;
    cell.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E79' }, // Navy blue header
    };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F3B66' } },
      bottom: { style: 'medium', color: { argb: 'FF0F3B66' } },
      left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    };
  });

  // ── ROWS 14+: TRAINEE DATA ──
  let currentRowNum = 14;

  traineeRows.forEach((t) => {
    const row = sheet.getRow(currentRowNum);
    row.height = 42; // generous height for wrapped notes

    row.getCell(1).value = t.sNo;
    row.getCell(2).value = t.name;
    row.getCell(3).value = t.pendingTopics;
    row.getCell(4).value = t.completedTopics;
    row.getCell(5).value = t.taskAssign;
    row.getCell(6).value = t.doubts;
    row.getCell(7).value = t.discussionSummary;
    row.getCell(8).value = t.githubPushStatus;
    row.getCell(9).value = t.emailReviewStatus;
    row.getCell(10).value = t.standupParticipation;
    row.getCell(11).value = t.standupRating;
    row.getCell(12).value = t.standupRemarks;
    row.getCell(13).value = t.selfProjectStatus;

    // Apply styles to each cell
    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 9.5 };
      cell.alignment = {
        vertical: 'top',
        horizontal: c === 1 || c === 5 || c === 8 || c === 11 ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };

      // Slight highlight for "Action Required" or "On Leave"
      if (t.taskAssign === 'On Leave' || t.completedTopics === 'On Leave') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' },
        };
      }
    }

    currentRowNum++;
  });

  // ── FOOTER NOTE ──
  const noteRowNum = currentRowNum;
  sheet.mergeCells(`A${noteRowNum}:M${noteRowNum}`);
  const noteCell = sheet.getCell(`A${noteRowNum}`);
  noteCell.value =
    "Note: In Completed Topics (Yes/No), mark Yes only when today's topics, assigned tasks, and practical assignment are completed. If only some topics/tasks are completed, write Partial - Completed: followed by completed items. Self-Project Status is for projects done apart from the assigned practical work; otherwise enter N/A.";
  noteCell.font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: 'FF4A5568' } };
  noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  noteCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFF2CC' }, // Soft yellow
  };
  noteCell.border = {
    top: { style: 'thin', color: { argb: 'FFD6B656' } },
    bottom: { style: 'thin', color: { argb: 'FFD6B656' } },
    left: { style: 'thin', color: { argb: 'FFD6B656' } },
    right: { style: 'thin', color: { argb: 'FFD6B656' } },
  };
  sheet.getRow(noteRowNum).height = 26;

  return workbook;
}

export function addBatchSheetToWorkbook(
  workbook: ExcelJS.Workbook,
  sheetConfig: {
    name: string;
    topics: string;
    tasks: string;
    rows: BatchTraineeRow[];
  },
  batchNumber: string | number = '3'
) {
  const sheet = workbook.addWorksheet(sheetConfig.name, {
    views: [{ showGridLines: true }],
  });

  sheet.columns = [
    { width: 8 },   // A: S No / Today Topics
    { width: 24 },  // B: Name / Today Tasks
    { width: 34 },  // C: Pending Topics
    { width: 34 },  // D: Completed Topics
    { width: 16 },  // E: Task Assign
    { width: 22 },  // F: Doubts
    { width: 36 },  // G: Discussion Summary
    { width: 18 },  // H: GitHub Push
    { width: 36 },  // I: Email Review Status
    { width: 18 },  // J: Standup Participation
    { width: 14 },  // K: Standup Rating
    { width: 24 },  // L: Standup Remarks
    { width: 34 },  // M: Self-Project Status
  ];

  // Row 2: Banner
  sheet.mergeCells('C2:M2');
  const banner = sheet.getCell('C2');
  banner.value = `${sheetConfig.name}      BATCH ${batchNumber} – DAILY ONE-ON-ONE CONNECT TRACKER`;
  banner.font = { name: 'Aptos Narrow', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  banner.alignment = { horizontal: 'center', vertical: 'middle' };
  banner.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: String(batchNumber) === '4' ? 'FF581C87' : 'FF0F4C81' },
  };
  sheet.getRow(2).height = 28;

  // Rows 3-12: Topics and Tasks cards
  sheet.mergeCells('A3:A12');
  const topicsCell = sheet.getCell('A3');
  topicsCell.value = `Today Topics\n\n${sheetConfig.topics}`;
  topicsCell.font = { name: 'Aptos Narrow', size: 9.5 };
  topicsCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  topicsCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
  topicsCell.border = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } },
  };

  sheet.mergeCells('B3:B12');
  const tasksCell = sheet.getCell('B3');
  tasksCell.value = `Today Tasks\n\n${sheetConfig.tasks}`;
  tasksCell.font = { name: 'Aptos Narrow', size: 9.5 };
  tasksCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  tasksCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
  tasksCell.border = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } },
  };

  for (let r = 3; r <= 12; r++) {
    sheet.getRow(r).height = 20;
  }

  // Row 13: Headers
  const headers = [
    'S No',
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

  const headerRow = sheet.getRow(13);
  headerRow.height = 28;
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F3B66' } },
      bottom: { style: 'medium', color: { argb: 'FF0F3B66' } },
      left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    };
  });

  // Rows 14+: Trainees
  let currentRowNum = 14;
  sheetConfig.rows.forEach((t) => {
    const row = sheet.getRow(currentRowNum);
    row.height = 42;
    row.getCell(1).value = t.sNo;
    row.getCell(2).value = t.name;
    row.getCell(3).value = t.pendingTopics;
    row.getCell(4).value = t.completedTopics;
    row.getCell(5).value = t.taskAssign;
    row.getCell(6).value = t.doubts;
    row.getCell(7).value = t.discussionSummary;
    row.getCell(8).value = t.githubPushStatus;
    row.getCell(9).value = t.emailReviewStatus;
    row.getCell(10).value = t.standupParticipation;
    row.getCell(11).value = t.standupRating;
    row.getCell(12).value = t.standupRemarks;
    row.getCell(13).value = t.selfProjectStatus;

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 9.5 };
      cell.alignment = {
        vertical: 'top',
        horizontal: c === 1 || c === 5 || c === 8 || c === 11 ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    }
    currentRowNum++;
  });

  // Footer Note
  sheet.mergeCells(`A${currentRowNum}:M${currentRowNum}`);
  const noteCell = sheet.getCell(`A${currentRowNum}`);
  noteCell.value =
    "Note: In Completed Topics (Yes/No), mark Yes only when today's topics, assigned tasks, and practical assignment are completed. If only some topics/tasks are completed, write Partial - Completed: followed by completed items. Self-Project Status is for projects done apart from the assigned practical work; otherwise enter N/A.";
  noteCell.font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: 'FF4A5568' } };
  noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  noteCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
  noteCell.border = {
    top: { style: 'thin', color: { argb: 'FFD6B656' } },
    bottom: { style: 'thin', color: { argb: 'FFD6B656' } },
    left: { style: 'thin', color: { argb: 'FFD6B656' } },
    right: { style: 'thin', color: { argb: 'FFD6B656' } },
  };
  sheet.getRow(currentRowNum).height = 26;
}

export async function createFullMultiDateBatchWorkbook(
  batchNumber: string = '3',
  auditedSubmissions: any[] = []
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'NexusTrack AI Operations';
  workbook.lastModifiedBy = 'NexusTrack';
  workbook.created = new Date();
  workbook.modified = new Date();

  const isB4 = String(batchNumber) === '4';

  const sheetsData = [
    {
      name: '01-10-2026',
      topics: `Flexbox & CSS Grid

Topics Covered
• Flexbox: Container, flex-direction, justify-content, align-items, flex-wrap, gap
• CSS Grid: Grid Container, Rows & Columns, grid-template-columns/rows, repeat(), fr, minmax()
• Grid Areas & Item Placement: Nested Grid, CSS Box Model alignment
• Responsive Multi-Column Navigation, Cards & Form Layouts`,
      tasks: `Assigned Tasks

• 6 different layouts using Flexbox, responsive nav, card layouts, multi-column Grid
• Practice repeat(), fr, minmax() and Compare Flexbox with CSS Grid
• Practical Task: Full Responsive Dashboard with Header, Sidebar, Cards, Main Content, Table, Footer
• Mandatory: Code push to GitHub and daily status submission before 6:00 PM`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and CSS Grid layout exercises.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "Pending: Responsive dashboard practical review.",
                    "completedTopics": "Yes - Completed Flexbox and Grid concepts, layout exercises.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Clean CSS layout and dashboard structure.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good participation.",
                    "selfProjectStatus": "Sunray Hospital website"
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "Pending: required responsive dashboard layout and advanced Grid layouts were not reported.",
                    "completedTopics": "Partial - Completed basic Flexbox and HTML/CSS form structures. JavaScript practical incomplete.",
                    "taskAssign": "Yes",
                    "doubts": "Needs clarification on Grid layout placement and JavaScript syntax.",
                    "discussionSummary": "Practiced basic HTML forms and CSS box model. Guided on Flexbox container properties and CSS Grid column sizing.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Ensure all assigned layout tasks and responsive dashboard practical are submitted.",
                    "standupParticipation": "Participated",
                    "standupRating": "Average",
                    "standupRemarks": "Needs hands-on practice.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes - Completed all Flexbox and Grid concepts and assigned layout tasks.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and full responsive dashboard with header, sidebar, cards, main content, and table.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete coverage; keep EMS project separate from CSS layouts.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Consistent high performer.",
                    "selfProjectStatus": "Employee Management System: worked on functionality for seasonal pages."
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes - Completed Flexbox container properties, alignment, CSS Grid columns, and responsive dashboard layout.",
                    "taskAssign": "Yes",
                    "doubts": "Resolved - email sending was delayed by a corrupted attachment; the file was deleted and re-uploaded.",
                    "discussionSummary": "Completed Flexbox container properties, alignment, CSS Grid columns, and responsive dashboard layout with header, sidebar, cards, main content, and table.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Solid implementation; correct “harmed file” to “corrupted file.”",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Solid implementation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "Pending: Responsive dashboard layout practical.",
                    "completedTopics": "Partial - Studied Flexbox and CSS Grid topics. Practiced repeat(), fr, and nested Grid.",
                    "taskAssign": "Yes",
                    "doubts": "Need guidance on nested grid auto-fit alignment.",
                    "discussionSummary": "Studied Flexbox and CSS Grid topics. Understood flex container and grid-template-columns. Practiced repeat(), fr, minmax(). Responsive dashboard practical pending.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Add responsive dashboard layout practical with cards and table.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good progress.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "Pending: Complete responsive dashboard practical.",
                    "completedTopics": "Partial - Completed Flexbox and basic Grid exercises.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Flexbox and basic Grid exercises. Practiced flex containers and column sizing. Working on dashboard layout.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Submit the responsive dashboard practical.",
                    "standupParticipation": "Participated",
                    "standupRating": "Average",
                    "standupRemarks": "Working on completion.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes - Completed all Flexbox and Grid concepts, layout exercises, cards, and full responsive dashboard layout.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed full responsive dashboard layout with Header, Sidebar, Cards, Main Content, Table, and Footer using Flexbox and CSS Grid.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Top-tier CSS layout implementation.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Top performer.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes - Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all Flexbox and Grid concepts, assigned layout tasks, responsive navigation, cards, multi-column Grid, Grid Areas, and the required responsive dashboard.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete and well structured; use \"CSS\" rather than \"HTML\" as Completed Tasks heading.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Clean code.",
                    "selfProjectStatus": "N/A"
          }
],
    },
    {
      name: '05-10-2026',
      topics: `React Fundamentals & JSX

Topics Covered
• Introduction to React
• Why React is used
• React Features
• React Project Structure
• React Application Setup
• Components
• Functional Components
• JSX
• JSX Rules
• Valid and Invalid JSX
• Fragments
• Strict Mode
• Rendering Components
• Calling Functions in Components`,
      tasks: `Assigned Tasks

• Create a React project from scratch.
• Understand the complete React project structure.
• Create multiple functional components.
• Practice JSX syntax.
• Identify valid and invalid JSX.
• Practice using JavaScript expressions inside JSX.
• Use Fragments where required.
• Understand Strict Mode.
• Create reusable basic components.

Mini Assignment
Create a simple React Profile Page using multiple reusable components such as:
• Header
• Profile
• Skills
• Education
• Footer`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "Pending: Profile Page",
                    "completedTopics": "Partial - React fundamentals completed",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Needs hands-on practice.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React project setup and functional components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active participation.",
                    "selfProjectStatus": "N/A"
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "Pending: React Profile Page mini assignment was not reported as completed.",
                    "completedTopics": "Partial - Completed React setup, project structure, functional/reusable components, JSX syntax and rules, expressions, Fragments, Strict Mode, rendering, and function calls. Profile Page remains unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all React fundamentals and assigned exercises. The required Profile Page mini assignment was not reported. Also continued Sunray Hospital UI improvements.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation; complete or confirm the React Profile Page.",
                    "selfProjectStatus": "Sunray Hospital website: continued UI, typography, hover-effect, and responsive-design improvements."
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "Pending: JSX syntax practice, valid/invalid JSX identification, JavaScript expressions in JSX, Fragments, Strict Mode, reusable components, and the React Profile Page mini assignment.",
                    "completedTopics": "Partial - Completed React introduction, purpose, features, project structure/setup, components, functional components, JSX concepts/rules, Fragments, Strict Mode, rendering components, and calling functions. Assigned practice and Profile Page remain pending.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed the planned React fundamentals and JSX topic study. The email explicitly lists several assigned exercises as pending and does not report the required React Profile Page.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Avoid listing JSX, Fragments, and Strict Mode as both completed and pending; distinguish conceptual study from implementation and add the Profile Page status.",
                    "standupParticipation": "Participated",
                    "standupRating": "Average",
                    "standupRemarks": "Stand-up participation was average; complete the pending React exercises and Profile Page.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React fundamentals, project setup, JSX, Fragments, Strict Mode, reusable components, assigned tasks, and the React Profile Page. Also fixed Reports page functionality and implemented role-based login in the Employee Management System.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete coverage; keep the Mini Project separate from today’s React assignment and use “role-based” consistently.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
                    "selfProjectStatus": "Employee Management System: fixed Reports page functionality and implemented role-based login."
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "Resolved - email sending was delayed by a corrupted attachment; the file was deleted and re-uploaded.",
                    "discussionSummary": "Completed React project setup with Vite, project structure, functional components, JSX syntax and rules, JavaScript expressions, Fragments, Strict Mode, reusable components, and the required Profile Page with Header, Profile, Skills, Education, and Footer. Also revised prior HTML/CSS layout concepts.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete React scope; correct “harmed file” to “corrupted file,” “Java script” to “JavaScript,” and keep prior HTML/CSS revision separate from today’s React assignment.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation and full completion of the required React scope.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "Pending: assigned React project exercises and Profile Page mini assignment were not reported as completed.",
                    "completedTopics": "Partial - Completed React introduction, features, project structure/setup, functional components, JSX and rules, valid/invalid JSX, Fragments, Strict Mode, rendering, and function calls. Practical implementations remain unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed the planned React topic study but did not report the assigned tasks or Profile Page mini assignment.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation; complete or confirm the assigned exercises and Profile Page.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "Pending: React Profile Page mini assignment was not reported as completed.",
                    "completedTopics": "Partial - Completed React project creation and structure, reusable functional components, JSX rules and expressions, Fragments, and Strict Mode. Profile Page remains unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Created a React project using Vite and practiced project structure, functional components, JSX, expressions, Fragments, and Strict Mode. The required Profile Page was not reported.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. “No Pending Task” conflicts with the missing Profile Page mini assignment; report it explicitly.",
                    "standupParticipation": "Participated",
                    "standupRating": "Average",
                    "standupRemarks": "Stand-up participation was average; complete or confirm the React Profile Page.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React setup, project structure, functional components, JSX rules, Fragments, Strict Mode, and the required React Profile Page using Header, Profile, Skills, Education, and Footer components.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete coverage; enter “N/A” under Pending Tasks instead of leaving it blank and correct “mial” to “mail.”",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React functional components, JSX, expressions and functions, array rendering with map() and keys, reusable components, Fragments, composition, and the React Profile Page with CSS styling.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete and well structured; correct “mial” to “mail,” “froim” to “from,” and the name spelling to “Tejaswar Rao.”",
                    "standupParticipation": "Participated",
                    "standupRating": "Good",
                    "standupRemarks": "Good stand-up participation and full completion of the required scope.",
                    "selfProjectStatus": "N/A"
          }
],
    },
    {
      name: '06-10-2026',
      topics: `Props, State & Component Communication

Topics Covered
• Props
• State
• useState
• Parent and Child Components
• Sending Data from Parent to Child
• Sending Data from Child to Parent
• Component Hierarchy
• Passing Functions as Props
• Sharing Data Between Components
• Conditional Rendering`,
      tasks: `Assigned Tasks

• Create parent and child components.
• Pass different types of data using Props.
• Pass functions from Parent to Child.
• Send data from Child to Parent using callback functions.
• Create multiple levels of component hierarchy.
• Practice State using useState.
• Update state based on user interaction.
• Implement conditional rendering.

Mini Assignment
Create a Product Management UI with:
• Product List
• Product Details
• Add Product
• Edit Product
• Delete Product
• Conditional display of product information`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "Pending: Product UI",
                    "completedTopics": "Partial - Props and State completed",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, useState, and component hierarchy.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up conducted today.",
                    "selfProjectStatus": "N/A"
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "Pending: Product Management UI mini assignment was not reported as completed.",
                    "completedTopics": "Partial - Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, function props, shared data, conditional rendering, and assigned exercises. Product Management UI remains unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all React communication topics and assigned exercises, but did not report the Product Management UI mini assignment. Also continued Sunray Hospital UI improvements.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "Sunray Hospital website: continued UI and responsive-design improvements."
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "Pending: assigned implementations and Product Management UI mini assignment were not reported as completed.",
                    "completedTopics": "Partial - Completed conceptual practice for Props, State, useState, parent/child components, communication, hierarchy, function props, shared data, and conditional rendering. Practical tasks remain pending.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed the planned topic study, but the email explicitly lists most assigned tasks as pending and does not report the Product Management UI.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Avoid listing communication concepts as practiced while repeating their implementations as pending; clearly separate study from completed code.",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, conditional rendering, all assigned tasks, and the Product Management UI. Also fixed Admin/Manager role functionality and added Employee settings/dashboard pages.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete coverage; keep the Employee Management System work separate and correct “dashboard paged” to “dashboard page.”",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "Employee Management System: fixed Admin/Manager role functionality and added Employee settings and dashboard pages."
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all component communication topics and tasks, including Props, callbacks, useState, hierarchy, conditional rendering, and the Product Management UI with list, details, add, edit, delete, and conditional display.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete React scope; correct “Usestate” to “useState,” “conditional rerendering” to “conditional rendering,” and keep prior CSS revision separate.",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "Pending: assigned component exercises and Product Management UI mini assignment were not reported as completed.",
                    "completedTopics": "Partial - Completed Props, State, useState, parent/child components, communication, hierarchy, passing functions, shared data, and conditional rendering topics. Practical implementations remain unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed the planned React topic study but did not report the assigned tasks or Product Management UI.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "Pending: Product Management UI mini assignment was not reported as completed.",
                    "completedTopics": "Partial - Completed parent/child components, Props, function props, callback communication, multi-level hierarchy, useState, interaction-based updates, shared data, and conditional rendering. Product Management UI remains unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed all listed communication concepts and assigned exercises, but did not report the required Product Management UI.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. “No Pending Task” conflicts with the omitted Product Management UI; report the mini assignment explicitly.",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "Pending: Edit Product functionality and complete conditional product-information display were not reported.",
                    "completedTopics": "Partial - Completed Props, State, useState, parent/child and callback communication, hierarchy, conditional rendering, and a Product Management UI with display, add, view, and delete. Edit functionality remains unconfirmed.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React communication concepts and created a Product Management UI for displaying, adding, viewing details, and deleting products. Edit Product and full conditional display were not reported.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Enter specific pending items instead of leaving the section blank; include Edit Product and conditional display evidence.",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed Props, State, useState, parent/child communication, callbacks, component hierarchy, shared data, conditional rendering, and the Product Management application with add, view, edit, update, and delete functionality.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete and well structured; correct the name spelling to “Tejaswar Rao.”",
                    "standupParticipation": "Not Conducted",
                    "standupRating": "N/A",
                    "standupRemarks": "No stand-up call was conducted today.",
                    "selfProjectStatus": "N/A"
          }
],
    },
    {
      name: '07-10-2026',
      topics: `Lists, Forms, Events & useEffect

Topics Covered
• Event Handling (onClick, onChange, onSubmit, onKeyDown)
• Form Handling & Controlled Components
• Dynamic Forms & Input Handling
• List Rendering, map() function in JSX, Keys & Reconciliation
• useEffect Hook, Component Lifecycle (Mount, Update, Unmount) & Dependency Array`,
      tasks: `Assigned Tasks

• Handle events in controlled form components with validation.
• Render dynamic arrays with unique keys & conditional UI.
• Practice useEffect with dependency arrays ([ ], [deps], no deps).
• Code push to GitHub & final daily status report submission.

Mini Assignment
User Registration and Dynamic User List Application with validation & auto-save.`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "Pending: Product UI submission",
                    "completedTopics": "Partial - Props and State completed",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, form controls, and dynamic list rendering with map().",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed controlled forms, event handling, dynamic list rendering with map() and keys, and useEffect lifecycle triggers. User Registration mini assignment completed.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Ensure all form validation edge cases are handled.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "Sunray Hospital website"
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "Pending: Complete form validation and lifecycle cleanup.",
                    "completedTopics": "Partial - Controlled components and map() practiced; form validation in progress.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed conceptual study for forms, list rendering, and useEffect. Practicing dynamic user list implementation.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Practice hands-on form validation and dependency array rules.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Needs hands-on practice.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed controlled forms, validation, map() rendering with keys, and useEffect auto-save. User Registration & List app completed.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Excellent code structure and lifecycle management.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Consistent high performer.",
                    "selfProjectStatus": "Employee Management System"
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, dynamic form fields, list rendering with proper keys, and useEffect lifecycle. Pushed to GitHub.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Clean form state handling.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Solid implementation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "Pending: User Registration mini assignment code submission.",
                    "completedTopics": "Partial - Completed forms and lists; useEffect practice in progress.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed form controls, input handling, and map() rendering. User List application verification pending.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Submit completed User Registration code.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Good progress.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "Pending: Complete User Registration and User List app.",
                    "completedTopics": "Partial - Event handling completed; User Registration app pending.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed controlled components and map() list rendering. Practicing useEffect dependency arrays.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Focus on finishing User Registration app.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Guidance provided on state updates.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed event handling, controlled form with real-time validation, dynamic user list rendering with keys, and useEffect auto-save.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Outstanding form validation and proper component composition.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Top performer.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed full User Registration and User List application with input validation, edit/delete user actions, dynamic keys, and useEffect.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete and well structured; clean lifecycle implementation.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Very clean code.",
                    "selfProjectStatus": "N/A"
          }
],
    },
    {
      name: '08-10-2026',
      topics: `API Integration & React Data Handling

Topics Covered
• API Calls in React with Fetch API / Axios & Async/Await Syntax
• HTTP Methods: GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Remove)
• UI Data States: Loading State (spinners), Error State (alerts), Empty State
• Client-side Dynamic Rendering, Search & Filtering Capabilities`,
      tasks: `Assigned Tasks

• Integrate public REST API with React, fetch and display records.
• Implement loading spinners, error alerts, and empty states cleanly.
• Implement real-time search, filtering & modular API service layer.
• Code review and bug fixing.
• Code push to GitHub & final daily status report submission.

Practical Assignment
React User Management Application with full CRUD operations and REST API integration.`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using Fetch API with loading and error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Active in session.",
                    "selfProjectStatus": "N/A"
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed REST API integration using fetch/axios, async/await, loading spinners, and error alerts. User Management Application built with search and filter.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Complete API integration and clean service layer.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Good API integration.",
                    "selfProjectStatus": "Sunray Hospital website improvements."
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "Pending: Complete POST/PUT/DELETE API operations.",
                    "completedTopics": "Partial - GET requests and search filter completed; CRUD mutations in progress.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed GET requests and dynamic rendering. Practicing POST, PUT, DELETE operations and loading skeleton states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Practice hands-on API mutations and error boundary handling.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Needs hands-on practice with async calls.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed full CRUD REST API integration (GET, POST, PUT, DELETE) with async/await, loading/error states, search, filter, and modular service layer.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Production grade REST API integration.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Consistent high performer.",
                    "selfProjectStatus": "Employee Management System"
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed React API calls with Axios, loading spinners, error banners, search, and department filter. Code pushed to GitHub.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Clean API service separation.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Solid implementation.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "Pending: React User Management practical assignment submission.",
                    "completedTopics": "Partial - GET API fetching completed; search filter in progress.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Fetched and displayed API data with loading state. Implementing real-time search filter and error handling.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Submit completed User Management API application code.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Good progress.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "Pending: Implement PUT and DELETE API endpoints.",
                    "completedTopics": "Partial - GET request and display completed; edit/delete pending.",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Practiced fetch API and async/await with loading indicators. User Management app pending full CRUD integration.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Connect edit and delete operations to the REST API.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Average",
                    "standupRemarks": "Guidance provided on async/await.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed complete React User Management Application integrated with REST API: live search, role filtering, modal add user, edit, delete, and loading states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Outstanding REST API integration and error handling.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Top performer.",
                    "selfProjectStatus": "N/A"
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "N/A",
                    "completedTopics": "Yes",
                    "taskAssign": "Yes",
                    "doubts": "No Blockers Reported",
                    "discussionSummary": "Completed full React User Management app: API integration with Axios, async/await, live search, department filter, modal CRUD forms, and clean error states.",
                    "githubPushStatus": "Yes",
                    "emailReviewStatus": "Reviewed. Flawless API architecture and modular service functions.",
                    "standupParticipation": "Conducted",
                    "standupRating": "Good",
                    "standupRemarks": "Very clean code.",
                    "selfProjectStatus": "N/A"
          }
],
    },
    {
      name: '09-10-2026',
      topics: `Context API, Custom Hooks & Final Capstone

Topics Covered
• Context API (createContext, Provider, useContext) & Global State
• Sharing Global Data without Prop Drilling & Context vs Props Comparison
• Custom Hooks: Creation, use- Prefix Rules, Reusable Business Logic (e.g. useFetch)
• Complete Weekly React Revision & Production Project Architecture`,
      tasks: `Assigned Tasks

• Create Context for global application data & theme/auth session.
• Build reusable Custom Hook (e.g. useFetch) & refactor repeated logic.
• Revise all React concepts: Components, JSX, Props, State, useEffect, APIs.
• Final Practical Assignment: Complete React Mini Application combining all weekly topics.`,
      rows: isB4
        ? [
          {
                    "sNo": 1,
                    "name": "Trainee 1 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 2,
                    "name": "Trainee 2 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 3,
                    "name": "Trainee 3 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 4,
                    "name": "Trainee 4 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 5,
                    "name": "Trainee 5 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 6,
                    "name": "Trainee 6 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 7,
                    "name": "Trainee 7 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 8,
                    "name": "Trainee 8 (Batch 4)",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          }
]
        : [
          {
                    "sNo": 1,
                    "name": "Althaf Syed",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 2,
                    "name": "Bala Krishna Parimi",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 3,
                    "name": "Chandra Shekar K",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 4,
                    "name": "Chevva Vinay Kumar",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 5,
                    "name": "Girish C",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 6,
                    "name": "Jayakrishna Madicharla",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 7,
                    "name": "Sana Sulthana",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          },
          {
                    "sNo": 8,
                    "name": "Tejaswar Rao",
                    "pendingTopics": "",
                    "completedTopics": "",
                    "taskAssign": "",
                    "doubts": "",
                    "discussionSummary": "",
                    "githubPushStatus": "",
                    "emailReviewStatus": "",
                    "standupParticipation": "",
                    "standupRating": "",
                    "standupRemarks": "",
                    "selfProjectStatus": ""
          }
]
    },
  ];

  // Apply any dynamic audited submissions
  if (auditedSubmissions && auditedSubmissions.length > 0) {
    auditedSubmissions.forEach((sub: any) => {
      const sDate = sub.submissionDate || '07-10-2026';
      const targetSheet = sheetsData.find((s) => s.name === sDate);
      if (targetSheet) {
        const cleanSubName = (sub.trainee || '').toLowerCase();
        const row = targetSheet.rows.find((r) => {
          const rName = r.name.toLowerCase();
          const tokens = cleanSubName.split(/\s+/).filter((t: string) => t.length > 2);
          const matchCount = tokens.filter((t: string) => rName.includes(t)).length;
          return matchCount >= 2 || rName.includes(cleanSubName) || cleanSubName.includes(rName);
        });
        if (row) {
          row.emailReviewStatus = sub.reviewStatus || 'Reviewed';
          row.completedTopics = sub.completedTopicsText || (sub.mistakesFound?.length > 0 ? 'Partial - Discrepancies flagged' : 'Yes');
          row.taskAssign = 'Yes';
          row.doubts = sub.doubts || 'No Blockers Reported';
          row.discussionSummary = sub.discussionSummaryText || 'Submitted daily status report via email.';
          row.githubPushStatus = sub.githubPushStatus || 'Yes';
          row.standupParticipation = 'Conducted';
          row.standupRating = 'Good';
          row.standupRemarks = 'Active in session.';
          row.pendingTopics = sub.pendingTopicsText || 'N/A';
          if (sub.selfProjectStatus) {
            row.selfProjectStatus = sub.selfProjectStatus;
          }
        }
      }
    });
  }

  sheetsData.forEach((s) => {
    addBatchSheetToWorkbook(workbook, s, batchNumber);
  });

  return workbook;
}
