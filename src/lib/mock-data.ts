// NexusTrack — In-memory seed data for Batch-3 Trainees, Assessments, Projects & Repos
// Populated directly from authentic Batch-3 Excel workbooks (Batch-3_Assessment-1_Result_16-06-2026.xlsx and Technical Team batch-3_Daily_Status_Report.xlsx)

export interface MeetingData {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  actionItems: string[];
}

export interface MailData {
  _id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'replied' | 'archived' | 'follow-up';
  category: string;
  notes: string;
}

export interface TraineeData {
  _id: string;
  name: string;
  email: string;
  department: string;
  skills: string[];
  overallScore: number;
  status: 'active' | 'completed' | 'on-leave';
  avatar: string;
  joinedDate: string;
}

export interface AssessmentData {
  _id: string;
  traineeId: string;
  traineeName: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  feedback: string;
  grade: string;
}

export interface MilestoneData { title: string; completed: boolean; }

export interface ProjectData {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'on-hold';
  progress: number;
  deadline: string;
  team: string[];
  milestones: MilestoneData[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  color: string;
}

export interface GithubRepoData {
  _id: string;
  username: string;
  repoName: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  lastUpdated: string;
  isPrivate: boolean;
  defaultBranch: string;
}

function genId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockMeetings: MeetingData[] = [
  {
    _id: genId(),
    title: 'Batch-3 Daily 1-on-1 Connect & Progress Sync',
    date: today,
    time: '11:00',
    duration: 45,
    attendees: ['Pathan Nafisa Khanam', 'Altaf Syed', 'Bala Krishna Parimi', 'Chandra Shekar K', 'Girish C', 'Jayakrishna Madisetty', 'Tejaswar Rao'],
    location: '1-on-1 Technical Desk / Google Meet',
    status: 'completed',
    notes: 'Reviewed today’s topics, practical dashboard layout implementations, code review remarks, and doubts.',
    actionItems: ['Verify dashboard zip submissions', 'Follow up with Altaf on Surya Hospital project separation'],
  },
  {
    _id: genId(),
    title: 'Batch-3 Daily Technical Standup Call',
    date: today,
    time: '17:30',
    duration: 30,
    attendees: ['Pathan Nafisa Khanam', 'Batch-3 Trainees'],
    location: 'Google Meet',
    status: 'scheduled',
    notes: 'Check GitHub commit pushes, resolve CSS/React layout blockers, and confirm daily email submissions before 6:00 PM.',
    actionItems: ['Check code pushed to GitHub', 'Collect daily status reports'],
  },
  {
    _id: genId(),
    title: 'Weekly 5-Day React Curriculum Planning & Task Allocation',
    date: tomorrow,
    time: '16:00',
    duration: 60,
    attendees: ['Pathan Nafisa Khanam', 'Mentorship Team', 'Batch-3 Trainees'],
    location: 'Conference Room 1 / Online',
    status: 'scheduled',
    notes: 'Plan and allocate upcoming 5-Day React Core Curriculum: React Fundamentals, JSX, Props & State, Hooks, and Mini Capstone Profile Page.',
    actionItems: ['Draft 5-day React allocation email', 'Prepare starter practical codesandbox'],
  },
  {
    _id: genId(),
    title: 'Self-Project Review: Surya Hospital & Employee Management System',
    date: yesterday,
    time: '14:30',
    duration: 30,
    attendees: ['Pathan Nafisa Khanam', 'Altaf Syed', 'Chandra Shekar K'],
    location: 'Lab Desk 3',
    status: 'completed',
    notes: 'Reviewed Surya Hospital UI alignment and Employee Management System seasonal pages. Advised keeping them distinct from daily assigned practical modules.',
    actionItems: ['Separate GitHub branches', 'Ensure separate status reporting'],
  },
];

export const mockMails: MailData[] = [
  {
    _id: genId(),
    subject: 'Daily Status & Zip Submission — Flexbox & CSS Grid',
    from: 'pathan.nafisakhanam@gmail.com',
    to: 'nafisakhanampathan65@gmail.com',
    date: today,
    priority: 'high',
    status: 'replied',
    category: 'Training',
    notes: 'Scanned zip file (13 files). Auto-feedback sent regarding missing subject line and responsive dashboard practical section.',
  },
  {
    _id: genId(),
    subject: 'Daily Status Report — Altaf Syed (29-09-2026)',
    from: 'altaf.syed@nybinfotech.com',
    to: 'nafisakhanampathan65@gmail.com',
    date: today,
    priority: 'medium',
    status: 'replied',
    category: 'Training',
    notes: 'Completed Flexbox & Grid concepts. Advised to keep Surya Hospital Mini Project separate from assigned CSS work.',
  },
  {
    _id: genId(),
    subject: 'Day 2 CSS Grid & Responsive Dashboard Submission — Chandra Shekar K',
    from: 'chandra.shekar@nybinfotech.com',
    to: 'nafisakhanampathan65@gmail.com',
    date: today,
    priority: 'medium',
    status: 'replied',
    category: 'Training',
    notes: 'Completed all topics, assigned tasks, and responsive dashboard. Minor note: change "Compare" to "Compared".',
  },
  {
    _id: genId(),
    subject: '5-Day React Core Task Allocation for Next Week',
    from: 'nafisakhanampathan65@gmail.com',
    to: 'team.batch3@nybinfotech.com',
    date: yesterday,
    priority: 'high',
    status: 'archived',
    category: 'Technical',
    notes: 'Weekly allocation: Day 1 React Fundamentals & JSX, Day 2 Props & State, Day 3 Hooks & Lifecycle, Day 4 Events & Forms, Day 5 Component Architecture & Capstone.',
  },
  {
    _id: genId(),
    subject: 'Correction Feedback: Missing Dashboard Layout in Zip',
    from: 'nafisakhanampathan65@gmail.com',
    to: 'pathan.nafisakhanam@gmail.com',
    date: today,
    priority: 'high',
    status: 'replied',
    category: 'Training',
    notes: 'Automated mail sent instructing trainee to include the practical dashboard layout and re-submit.',
  },
];

// ── 11 Authentic Batch-3 Trainees from Official Excel Records ──
const tSana = 'b3_trainee_sana';
const tAlthaf = 'b3_trainee_althaf';
const tVinay = 'b3_trainee_vinay';
const tSusmitha = 'b3_trainee_susmitha';
const tGirish = 'b3_trainee_girish';
const tTejaswar = 'b3_trainee_tejaswar';
const tChandra = 'b3_trainee_chandra';
const tMounika = 'b3_trainee_mounika';
const tKamalakar = 'b3_trainee_kamalakar';
const tBala = 'b3_trainee_bala';
const tJaya = 'b3_trainee_jaya';

export const mockTrainees: TraineeData[] = [
  {
    _id: tSana,
    name: 'Sana Sulthana',
    email: 'sana.sulthana@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5', 'CSS3', 'DOM Manipulation', 'JavaScript Sets', 'Date Handling'],
    overallScore: 58, // 29/50 in Assessment-1
    status: 'active',
    avatar: '👩‍💻',
    joinedDate: '2025-12-01',
  },
  {
    _id: tAlthaf,
    name: 'Althaf Syed',
    email: 'althaf.syed@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Forms', 'CSS Grid', 'Flexbox', 'Array Operations', 'Surya Hospital UI'],
    overallScore: 50, // 25/50 in Assessment-1
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2025-12-10',
  },
  {
    _id: tVinay,
    name: 'Chevva Vinay Kumar',
    email: 'vinay.kumar@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Semantics', 'CSS Flexbox', 'JavaScript Arrays', 'Form Validations'],
    overallScore: 50, // 25/50 in Assessment-1
    status: 'completed',
    avatar: '🧑‍💻',
    joinedDate: '2026-01-01',
  },
  {
    _id: tSusmitha,
    name: 'Susmitha Samudrala',
    email: 'susmitha.samudrala@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Fieldset', 'CSS Styling', 'Array Operations', 'Duplicate Detection'],
    overallScore: 42, // 21/50 in Assessment-1
    status: 'completed',
    avatar: '👩‍💻',
    joinedDate: '2025-12-21',
  },
  {
    _id: tGirish,
    name: 'Girish C',
    email: 'girish.c@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5', 'CSS Grid', 'Flexbox', 'Media Queries', 'Array Manipulation'],
    overallScore: 40, // 20/50 in Assessment-1
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2025-12-29',
  },
  {
    _id: tTejaswar,
    name: 'Tejaswar Rao',
    email: 'tejaswar.rao@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Semantics', 'CSS Grid', 'Grade Calculator', 'DOM Logic', 'Responsive Design'],
    overallScore: 40, // 20/50 in Assessment-1
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2025-11-18',
  },
  {
    _id: tChandra,
    name: 'Chandra Shekar K',
    email: 'chandra.shekar@nybinfotech.com',
    department: 'Batch 3 Full Stack',
    skills: ['HTML5', 'CSS Grid', 'Employee Management System', 'JavaScript Arrays'],
    overallScore: 34, // 17/50 in Assessment-1
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2025-12-14',
  },
  {
    _id: tMounika,
    name: 'Mounika Katirevula',
    email: 'mounika.katirevula@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Forms', 'CSS Layouts', 'Resume Layout', 'JavaScript Basics'],
    overallScore: 20, // 10/50 in Assessment-1
    status: 'completed',
    avatar: '👩‍💻',
    joinedDate: '2026-01-08',
  },
  {
    _id: tKamalakar,
    name: 'Kamalakar Vanama',
    email: 'kamalakar.vanama@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5', 'Forms & Tables', 'CSS Basics', 'JavaScript Syntax'],
    overallScore: 16, // 8/50 in Assessment-1
    status: 'completed',
    avatar: '👨‍💻',
    joinedDate: '2025-12-22',
  },
  {
    _id: tBala,
    name: 'Bala Krishna Parimi',
    email: 'bala.krishna@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5', 'CSS Selectors', 'Flexbox', 'JavaScript Fundamentals'],
    overallScore: 14, // 7/50 in Assessment-1
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2025-12-15',
  },
  {
    _id: tJaya,
    name: 'Jayakrishna Madicharla',
    email: 'jayakrishna.m@nybinfotech.com',
    department: 'Batch 3 Frontend',
    skills: ['HTML5 Forms', 'CSS Grid Areas', 'Nested Grid', 'Flexbox'],
    overallScore: 8, // 4/50 in Assessment-1
    status: 'completed',
    avatar: '👨‍💻',
    joinedDate: '2025-12-15',
  },
  // ── Batch 4 Active Trainees ──
  {
    _id: 'b4_trainee_adinarayana',
    name: 'Adinarayana Meesala',
    email: 'adinarayana.meesala@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5', 'CSS Grid', 'Flexbox', 'Responsive Design', 'JavaScript'],
    overallScore: 48,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_adithya',
    name: 'Adithya Ram',
    email: 'adithya.ram@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5 Semantics', 'CSS3', 'JavaScript Functions', 'DOM Events'],
    overallScore: 45,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_jose',
    name: 'Jose Amala Kishor',
    email: 'jose.amala@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5', 'CSS Flexbox', 'JavaScript Arrays', 'Git & GitHub'],
    overallScore: 44,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_snehith',
    name: 'Snehith Reddy Challa',
    email: 'snehith.reddy@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5 Forms', 'CSS Grid', 'JavaScript ES6', 'DOM API'],
    overallScore: 42,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_sruthi',
    name: 'Sruthi Badavath',
    email: 'sruthi.badavath@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5', 'CSS Layouts', 'Responsive UI', 'JavaScript Basics'],
    overallScore: 46,
    status: 'active',
    avatar: '👩‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_nikhil',
    name: 'Nikhil Kumar Kurapati',
    email: 'nikhil.kumar@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5 Semantics', 'CSS Styling', 'JavaScript Logic', 'Web Forms'],
    overallScore: 40,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
  {
    _id: 'b4_trainee_ramesh',
    name: 'Ramesh Kumar A',
    email: 'ramesh.kumar@nybinfotech.com',
    department: 'Batch 4 Web Dev',
    skills: ['HTML5', 'CSS Flexbox & Grid', 'JavaScript Arrays', 'Object Modeling'],
    overallScore: 43,
    status: 'active',
    avatar: '👨‍💻',
    joinedDate: '2026-01-15',
  },
];

// ── 11 Authentic Assessment-1 Results from Batch-3_Assessment-1_Result_16-06-2026.xlsx ──
export const mockAssessments: AssessmentData[] = [
  {
    _id: genId(),
    traineeId: tSana,
    traineeName: 'Sana Sulthana',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 29,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 7/10. Excellent duplicate logic using Set and correct output formatting. Efficient approach. Excellent DOM manipulation with event listener and UI updates. Good date handling using Date object.',
    grade: 'A',
  },
  {
    _id: genId(),
    traineeId: tAlthaf,
    traineeName: 'Althaf Syed',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 25,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 6/10. Fieldset and legend used correctly in student form. Mandatory validations applied. Array operations completed correctly with proper output. Employee object created cleanly.',
    grade: 'B+',
  },
  {
    _id: genId(),
    traineeId: tVinay,
    traineeName: 'Chevva Vinay Kumar',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 25,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 6/10. Strong form design and semantic structure. Array manipulation executed cleanly. Resume layout properly structured with tables and semantic tags.',
    grade: 'B+',
  },
  {
    _id: genId(),
    traineeId: tSusmitha,
    traineeName: 'Susmitha Samudrala',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 21,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 6/10. Excellent form structure with fieldset and proper validation. Correct array operations using push, unshift, and pop. Good logic for duplicate detection.',
    grade: 'B',
  },
  {
    _id: genId(),
    traineeId: tGirish,
    traineeName: 'Girish C',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 20,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 5/10. Good form structure and clean layout. Company information page implemented with services and iframe. Good array manipulation logic.',
    grade: 'B',
  },
  {
    _id: genId(),
    traineeId: tTejaswar,
    traineeName: 'Tejaswar Rao',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 20,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 4/10. Excellent form implementation with proper fieldset usage, validation, radio grouping, and dropdown. Clean and well-structured code. Correct grade calculator logic.',
    grade: 'B',
  },
  {
    _id: genId(),
    traineeId: tChandra,
    traineeName: 'Chandra Shekar K',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 17,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 5/10. Good semantic structure. Student form and company page implemented cleanly. Practiced core JavaScript array handling.',
    grade: 'C',
  },
  {
    _id: genId(),
    traineeId: tMounika,
    traineeName: 'Mounika Katirevula',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 10,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 3/10. Completed basic student form and resume structure. Requires more practice on JavaScript logic, conditionals, and DOM manipulation.',
    grade: 'D',
  },
  {
    _id: genId(),
    traineeId: tKamalakar,
    traineeName: 'Kamalakar Vanama',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 8,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 2/10. Basic HTML form and resume sections created. JavaScript sections incomplete. Advised to focus on JS variables, operators, and loops.',
    grade: 'D',
  },
  {
    _id: genId(),
    traineeId: tBala,
    traineeName: 'Bala Krishna Parimi',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 7,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 2/10. Basic HTML layout attempted. Need thorough revision of JavaScript syntax, functions, and array methods.',
    grade: 'F',
  },
  {
    _id: genId(),
    traineeId: tJaya,
    traineeName: 'Jayakrishna Madicharla',
    title: 'Batch-3 Assessment 1: HTML & JavaScript Fundamentals',
    subject: 'HTML5 Forms & JavaScript Logic',
    score: 4,
    maxScore: 50,
    date: '2026-06-16',
    feedback: 'Questions Attempted: 1/10. Student form fields created. JavaScript practical questions unattempted. Scheduled for 1-on-1 revision.',
    grade: 'F',
  },
];

export const mockProjects: ProjectData[] = [
  {
    _id: genId(),
    name: 'Batch 3 Responsive Dashboard (Flexbox & CSS Grid)',
    description: 'Mandatory practical assignment to build a complete responsive admin dashboard with Header, Sidebar, Metric Cards, Main Content, Table/List, and Footer.',
    status: 'active',
    progress: 85,
    deadline: tomorrow,
    team: ['Chandra Shekar K', 'Tejaswar Rao', 'Althaf Syed', 'Jayakrishna Madisetty', 'Girish C'],
    priority: 'critical',
    color: '#0f4c81',
    milestones: [
      { title: 'Header & Sidebar Flex/Grid Layout', completed: true },
      { title: 'Responsive Metric Cards Grid', completed: true },
      { title: 'Main Content & Data Table', completed: true },
      { title: 'Media Queries & Mobile Breakpoints', completed: false },
    ],
  },
  {
    _id: genId(),
    name: 'Surya Hospital UI Mini Project',
    description: 'Healthcare website UI: refined spacing, alignment, buttons, cards, typography, hover effects, and responsive hero/navigation (Trainee self-project).',
    status: 'active',
    progress: 75,
    deadline: nextWeek,
    team: ['Althaf Syed'],
    priority: 'high',
    color: '#0891b2',
    milestones: [
      { title: 'Hero Section & Nav Architecture', completed: true },
      { title: 'Doctor Cards & Service Grid', completed: true },
      { title: 'Appointment Booking Form Styling', completed: false },
    ],
  },
  {
    _id: genId(),
    name: 'Employee Management System (EMS)',
    description: 'Internal employee management portal with seasonal themes and functional pages (Trainee self-project).',
    status: 'active',
    progress: 70,
    deadline: nextWeek,
    team: ['Chandra Shekar K'],
    priority: 'high',
    color: '#059669',
    milestones: [
      { title: 'Semantic HTML Structure', completed: true },
      { title: 'Seasonal UI Pages & Component Styling', completed: true },
      { title: 'Table Pagination & Form Verification', completed: false },
    ],
  },
  {
    _id: genId(),
    name: '5-Day React Core Curriculum & Hands-on Labs',
    description: 'Master React Fundamentals, Functional Components, JSX, Props, State, Component Communication, and Mini Capstone Profile Page.',
    status: 'active',
    progress: 40,
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    team: ['All Batch 3 Trainees'],
    priority: 'critical',
    color: '#61dafb',
    milestones: [
      { title: 'Day 1: React Fundamentals, Setup & JSX Profile Page', completed: true },
      { title: 'Day 2: Props, State & Component Communication', completed: true },
      { title: 'Day 3: Lists, Keys, Conditional Rendering & Lifting State', completed: false },
      { title: 'Day 4: Forms, Controlled Components & Side Effects (useEffect)', completed: false },
      { title: 'Day 5: Component Architecture, Custom Hooks & Mini Capstone', completed: false },
    ],
  },
];

export const mockGithubRepos: GithubRepoData[] = [
  {
    _id: genId(),
    username: 'navayuva-infotech',
    repoName: 'batch3-react-and-css-assignments',
    url: 'https://github.com/navayuvabharatinfotech/batch3-react-and-css-assignments',
    description: 'Daily React & CSS layout tasks, Flexbox/Grid exercises, and dashboard practical submissions',
    stars: 28,
    forks: 11,
    openIssues: 2,
    language: 'TypeScript / React',
    lastUpdated: today,
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    _id: genId(),
    username: 'altafsyed-nyb',
    repoName: 'surya-hospital-management-ui',
    url: 'https://github.com/altafsyed/surya-hospital-management-ui',
    description: 'Surya Hospital UI mini-project with responsive hero, appointment forms, and doctor profile cards',
    stars: 14,
    forks: 4,
    openIssues: 1,
    language: 'CSS / HTML',
    lastUpdated: yesterday,
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    _id: genId(),
    username: 'chandrashekar-nyb',
    repoName: 'employee-management-system',
    url: 'https://github.com/chandrashekar/employee-management-system',
    description: 'Employee Management System frontend with seasonal pages and attendance views',
    stars: 19,
    forks: 6,
    openIssues: 0,
    language: 'HTML / CSS / JS',
    lastUpdated: yesterday,
    isPrivate: true,
    defaultBranch: 'main',
  },
  {
    _id: genId(),
    username: 'navayuva-infotech',
    repoName: 'batch3-daily-status-tracker',
    url: 'https://github.com/navayuvabharatinfotech/batch3-daily-status-tracker',
    description: 'Batch-3 daily 1-on-1 connect tracker, task completion status, and assessment records',
    stars: 32,
    forks: 14,
    openIssues: 1,
    language: 'TypeScript / Next.js',
    lastUpdated: today,
    isPrivate: false,
    defaultBranch: 'main',
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __nexusStore: {
    meetings: MeetingData[];
    mails: MailData[];
    trainees: TraineeData[];
    assessments: AssessmentData[];
    projects: ProjectData[];
    githubRepos: GithubRepoData[];
  } | undefined;
}

// Reset store if legacy data (fewer than 18 trainees or missing Batch 4 trainees) is detected
const isOutdatedStore =
  !globalThis.__nexusStore ||
  !globalThis.__nexusStore.trainees ||
  globalThis.__nexusStore.trainees.length < 18 ||
  !globalThis.__nexusStore.trainees.some((t) => t.name === 'Nikhil Kumar Kurapati') ||
  !globalThis.__nexusStore.trainees.some((t) => t.name === 'Adinarayana Meesala') ||
  globalThis.__nexusStore.trainees.some((t) => t.name === 'Ahmed Ali' || t.name === 'Alex Rivera' || t.name === 'Elena Rostova') ||
  globalThis.__nexusStore.trainees.some((t) => t.name === 'Sana Sulthana' && t.status !== 'active') ||
  globalThis.__nexusStore.assessments?.some((a) => a.score > 50);

if (isOutdatedStore) {
  globalThis.__nexusStore = {
    meetings: [...mockMeetings],
    mails: [...mockMails],
    trainees: [...mockTrainees],
    assessments: [...mockAssessments],
    projects: [...mockProjects],
    githubRepos: [...mockGithubRepos],
  };
}

export const store = globalThis.__nexusStore!;

export { genId, today, tomorrow };
