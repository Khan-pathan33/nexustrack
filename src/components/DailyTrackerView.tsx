'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  AlertTriangle, BookOpen, Bot, Check, CheckCircle, CheckCircle2,
  ChevronLeft, ChevronRight, Copy, Download, ExternalLink, File,
  FileSpreadsheet, Folder, FolderOpen, Mail, Paperclip, Plus,
  RotateCcw, Save, Send, Shield, ShieldCheck, Sparkles, Trash,
  Trash2, X, Zap, Bell, GitBranch, Clock
} from 'lucide-react';
import ExportPdfButton from '@/components/ExportPdfButton';
import { useToast } from '@/components/Toast';
import * as XLSX from 'xlsx';
import WeeklyScheduleView from '@/components/WeeklyScheduleView';
import { WEEKLY_TASK_ALLOCATION_EMAIL_TEXT } from '@/lib/weekly-curriculum';
import CredentialsSettingsModal from '@/components/CredentialsSettingsModal';
import TLDailyReportModal from '@/components/TLDailyReportModal';
import type { BatchTraineeRow } from '@/lib/generate-batch-report';
import MissingTraineesModal from '@/components/MissingTraineesModal';
import GithubCommitValidatorModal from '@/components/GithubCommitValidatorModal';
import TraineeAbsenceNoticeModal from '@/components/TraineeAbsenceNoticeModal';



export interface DailyTrackerData {
  _id: string;
  date: string;
  name: string;
  pendingTopics: string;
  completedTopicsStatus: string;
  completedTopicsDetails: string;
  taskAssign: string;
  doubts: string;
  discussionSummary: string;
  githubPushStatus: string;
  emailReviewStatus: string;
  standupParticipation: string;
  standupRating: string;
  standupRemarks: string;
  selfProjectStatus: string;
  performanceScore: number;
  scoreReasoning: string;
}

// ── DAILY TRACKER TAB ──
const EMAIL_PRESETS = [
  {
    id: 'sana',
    title: 'Sana Sulthana (Standard Report)',
    senderName: 'Sana Sulthana',
    senderEmail: 'sana.sulthana@nybinfotech.com',
    content: `Hi Nafisa and Prasanna mam,
Good Morning,
Please find below the task summary for today:

Technology
Web Development
Planned Tasks (Today)
1.HTML:
Study and practice CSS Positions: Static, Relative, Absolute, Fixed, and Sticky.
Study and practice CSS z-index .
Study and practice float and clear.
Study and practice Flexbox.
Understand Flex Container and Flex Items.
Practice flex-direction, justify-content, align-items, and align-content.
Practice the order property.
Study and practice CSS Grid.
Understand Grid Container, Grid Columns, and Grid Rows.
Practice Grid gap and Grid Areas.
Study and practice the fr unit, repeat(), and minmax().
Study and practice Responsive Design.
Practice Media Queries, Mobile-First Design, and Breakpoints.
Understand Responsive Images and Responsive Layouts.

Completed Tasks (Today)
1.HTML:
Studied and practiced CSS Positions: Static, Relative, Absolute, Fixed, and Sticky.
Studied and practiced z-index.
Studied and practiced float and clear.
Studied and practiced Flexbox and Flex Container.
Practiced flex-direction, justify-content, align-items, and align-content.
Practiced the order property in Flexbox.
Studied and practiced CSS Grid.
Practiced Grid Container, Grid Columns, and Grid Rows.
Practiced Grid gap and Grid Areas.
Studied and practiced the fr unit.
Practiced repeat() for creating multiple grid columns.
Practiced minmax() for creating flexible and responsive grid layouts.
Studied and practiced Responsive Design.
Practiced Media Queries and Breakpoints.
Studied Mobile-First Design.
Practiced Responsive Layouts for different screen sizes.

Pending Tasks(Today)
1.HTML:
Alignment, Create layouts using Flexbox., Create layouts using CSS Grid., Practice different CSS positioning methods., Implement overlapping elements using z-index.

Planned Tasks (Next Day)
1.HTML:
CSS Selectors, Pseudo-Classes, CSS Specificity

Challenges / Blockers if any
N/A

I have attached the work progress files for your reference.
Thanks & Regards,
Sana Sulthana`,
  },
  {
    id: 'altaf',
    title: 'Althaf Syed (Sunray Hospital Mini Project & Dashboard)',
    senderName: 'Althaf Syed',
    senderEmail: 'althaf.syed@nybinfotech.com',
    content: `Hi Mentors,
Please find below my daily task summary for today:

Technology: Web Development
Planned Tasks (Today):
1.HTML & CSS:
- Flexbox Container, directions, alignment, wrapping, and order.
- CSS Grid Container, rows/columns, repeat(), fr, minmax(), Grid Areas.
- Assigned Flexbox and CSS Grid layout exercises.
- Create responsive dashboard layout (Header, Sidebar, Cards, Main Content, Table, Footer).
- Continue work on Sunray Hospital Mini Project UI.

Completed Tasks (Today):
1.CSS:
- Completed Flexbox and Grid concepts, navigation cards, Grid multi-column and area layouts.
- Practiced repeat(), fr, minmax(), and Flexbox vs Grid comparison.
- Worked on Sunray Hospital website: refined spacing, alignment, buttons, cards, typography, hover effects, and responsive hero/nav.

Pending Tasks (Today):
N/A

Planned Tasks (Next Day):
- Responsive Design, Media Queries, Mobile-First Design.

Challenges / Blockers if any:
N/A

I have attached the work progress files for your reference.
Thanks & Regards,
Althaf Syed`,
  },
  {
    id: 'chandra',
    title: 'Chandra Shekar K (All Tasks Complete - EMS Mini Project)',
    senderName: 'Chandra Shekar K',
    senderEmail: 'chandra.shekar@nybinfotech.com',
    content: `Good Evening,
Please find below my daily task summary for today:

Technology: Web Development
Planned Tasks (Today):
- Review Flexbox & CSS Grid topics.
- Create multi-column layouts and responsive navigation.
- Implement responsive dashboard layout containing Header, Sidebar, Cards, Main Content, Table, and Footer.
- Employee Management System (EMS) functional pages.

Completed Tasks (Today):
- Completed all Flexbox and Grid concepts and assigned layout tasks.
- Implemented full responsive dashboard with header, sidebar, cards, main content, and table.
- Practiced repeat(), fr, minmax(), and Compare Flexbox and Grid.
- Employee Management System: worked on functionality for seasonal pages.

Pending Tasks (Today):
N/A

Planned Tasks (Next Day):
- Responsive typography, clamp(), and CSS Animations.

Challenges / Blockers if any:
N/A

Attached zip file containing dashboard and layout exercises.
Thanks & Regards,
Chandra Shekar K`,
  },
  {
    id: 'girish',
    title: 'Girish C (Missing Dashboard Practical in Zip Submission)',
    senderName: 'Girish C',
    senderEmail: 'girish.c@nybinfotech.com',
    content: `Hi Mentors,
Please find below the task summary for today:

Technology: Web Development
Planned Tasks:
- Study Flex Container, alignment, sizing, repeat(), fr, minmax(), areas, nested Grid.
- Create responsive dashboard practical.

Completed Tasks:
- Studied Flexbox and CSS Grid topics.
- Understood flex container and grid-template-columns.
- Practiced repeat(), fr, and mailto queries.

Pending Tasks:
- Responsive dashboard layout practical.

Challenges / Blockers:
- Need guidance on nested grid auto-fit alignment.

Thanks & Regards,
Girish C`,
  },
];

const SHAREPOINT_BATCH_3_TRAINEES: BatchTraineeRow[] = [
      {
        sNo: 1,
        name: 'Althaf Syed',
        pendingTopics: 'Pending: React Profile Page mini assignment was not reported as completed.',
        completedTopics: 'Partial - Completed React setup, project structure, functional/reusable components, JSX syntax and rules, expressions, Fragments, Strict Mode, rendering, and function calls. Profile Page remains unconfirmed.',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed all React fundamentals and assigned exercises. The required Profile Page mini assignment was not reported. Also continued Sunray Hospital UI improvements.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Add the Mini Assignment status explicitly and correct the missing parenthesis in “Planned Tasks (Today).”',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation; complete or confirm the React Profile Page.',
        selfProjectStatus: 'Sunray Hospital website: continued UI, typography, hover-effect, and responsive-design improvements.',
      },
      {
        sNo: 2,
        name: 'Bala Krishna Parimi',
        pendingTopics: 'Pending: JSX syntax practice, valid/invalid JSX identification, JavaScript expressions in JSX, Fragments, Strict Mode, reusable components, and the React Profile Page mini assignment.',
        completedTopics: 'Partial - Completed React introduction, purpose, features, project structure/setup, components, functional components, JSX concepts/rules, Fragments, Strict Mode, rendering components, and calling functions. Assigned practice and Profile Page remain pending.',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed the planned React fundamentals and JSX topic study. The email explicitly lists several assigned exercises as pending and does not report the required React Profile Page.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Avoid listing JSX, Fragments, and Strict Mode as both completed and pending; distinguish conceptual study from implementation and add the Profile Page status.',
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
        discussionSummary: 'Completed React fundamentals, project setup, JSX, Fragments, Strict Mode, reusable components, assigned tasks, and the React Profile Page. Also fixed Reports page functionality and implemented role-based login in the Employee Management System.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Complete coverage; keep the Mini Project separate from today’s React assignment and use “role-based” consistently.',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation and full completion of the required scope.',
        selfProjectStatus: 'Employee Management System: fixed Reports page functionality and implemented role-based login.',
      },
      {
        sNo: 4,
        name: 'Chevva Vinay Kumar',
        pendingTopics: 'N/A',
        completedTopics: 'Yes',
        taskAssign: 'Yes',
        doubts: 'Resolved - email sending was delayed by a corrupted attachment; the file was deleted and re-uploaded.',
        discussionSummary: 'Completed React project setup with Vite, project structure, functional components, JSX syntax and rules, JavaScript expressions, Fragments, Strict Mode, reusable components, and the required Profile Page with Header, Profile, Skills, Education, and Footer. Also revised prior HTML/CSS layout concepts.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Complete React scope; correct “harmed file” to “corrupted file,” “Java script” to “JavaScript,” and keep prior HTML/CSS revision separate from today’s React assignment.',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation and full completion of the required React scope.',
        selfProjectStatus: 'N/A',
      },
      {
        sNo: 5,
        name: 'Girish C',
        pendingTopics: 'Pending: assigned React project exercises and Profile Page mini assignment were not reported as completed.',
        completedTopics: 'Partial - Completed React introduction, features, project structure/setup, functional components, JSX and rules, valid/invalid JSX, Fragments, Strict Mode, rendering, and function calls. Practical implementations remain unconfirmed.',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed the planned React topic study but did not report the assigned tasks or Profile Page mini assignment.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Add separate Assigned Tasks and Mini Assignment sections with explicit completion evidence.',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation; complete or confirm the assigned exercises and Profile Page.',
        selfProjectStatus: 'N/A',
      },
      {
        sNo: 6,
        name: 'Jayakrishna Madicharla',
        pendingTopics: 'Pending: React Profile Page mini assignment was not reported as completed.',
        completedTopics: 'Partial - Completed React project creation and structure, reusable functional components, JSX rules and expressions, Fragments, and Strict Mode. Profile Page remains unconfirmed.',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Created a React project using Vite and practiced project structure, functional components, JSX, expressions, Fragments, and Strict Mode. The required Profile Page was not reported.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. “No Pending Task” conflicts with the missing Profile Page mini assignment; report it explicitly.',
        standupParticipation: 'Participated',
        standupRating: 'Average',
        standupRemarks: 'Stand-up participation was average; complete or confirm the React Profile Page.',
        selfProjectStatus: 'N/A',
      },
      {
        sNo: 7,
        name: 'Sana Sulthana',
        pendingTopics: 'N/A',
        completedTopics: 'Yes',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed React setup, project structure, functional components, JSX rules, Fragments, Strict Mode, and the required React Profile Page using Header, Profile, Skills, Education, and Footer components.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Complete coverage; enter “N/A” under Pending Tasks instead of leaving it blank and correct “mial” to “mail.”',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation and full completion of the required scope.',
        selfProjectStatus: 'N/A',
      },
      {
        sNo: 8,
        name: 'Tejeswar Rao',
        pendingTopics: 'N/A',
        completedTopics: 'Yes',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed React functional components, JSX, expressions and functions, array rendering with map() and keys, reusable components, Fragments, composition, and the React Profile Page with CSS styling.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed. Complete and well structured; correct “mial” to “mail,” “froim” to “from,” and the name spelling to “Tejeswar Rao.”',
        standupParticipation: 'Participated',
        standupRating: 'Good',
        standupRemarks: 'Good stand-up participation and full completion of the required scope.',
        selfProjectStatus: 'N/A',
      },
  ];

export interface SheetPresetConfig {
  id: string;
  name: string;
  topicsTitle: string;
  topicsList: string[];
  tasksTitle: string;
  tasksList: string[];
  rows: BatchTraineeRow[];
}

export const BATCH_3_SHEET_PRESETS: Record<string, SheetPresetConfig> = {
  "26-10-2026": {
    "id": "26-10-2026",
    "name": "26-10-2026 (Day 1 - React Fundamentals & JSX)",
    "topicsTitle": "📌 Day 1 (Monday 26-10-2026) – React Fundamentals & JSX",
    "topicsList": [
      "Introduction to React & Why React is used",
      "React Features & Complete Project Structure (Vite Setup)",
      "React Application Setup & Functional Components",
      "JSX Syntax, Rules & Valid/Invalid JSX",
      "Fragments, Strict Mode, Rendering Components & Calling Functions"
    ],
    "tasksTitle": "📋 Assigned Tasks & Profile Page Mini Assignment",
    "tasksList": [
      "Create a React project from scratch using Vite & understand project structure",
      "Create multiple functional components & practice JSX syntax/rules",
      "Identify valid and invalid JSX, expressions in JSX & Fragments",
      "Mini Assignment: Simple React Profile Page (Header, Profile, Skills, Education, Footer)",
      "Mandatory: Push code to GitHub and submit daily status report before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Althaf Syed",
        "pendingTopics": "Pending: React Profile Page mini assignment review.",
        "completedTopics": "Yes - Completed React setup, project structure, functional components, JSX syntax, rules, and Fragments.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React fundamentals and assigned exercises. Guided on reusable functional components and React Profile Page structure.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete React fundamentals; add Profile Page components.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Good stand-up participation.",
        "selfProjectStatus": "Sunray Hospital website"
      },
      {
        "sNo": 2,
        "name": "Bala Krishna Parimi",
        "pendingTopics": "Pending: JSX expressions practice and React Profile Page mini assignment.",
        "completedTopics": "Partial - Completed React setup, functional components, and basic JSX concepts.",
        "taskAssign": "Yes",
        "doubts": "Needs clarification on JSX syntax rules and Expressions.",
        "discussionSummary": "Guided on JSX syntax rules, Expressions inside JSX, and component hierarchy.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Practice JSX expressions and submit Profile Page mini assignment.",
        "standupParticipation": "Participated",
        "standupRating": "Average",
        "standupRemarks": "Needs hands-on practice.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 3,
        "name": "Chandra Shekar K",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - Completed all React fundamentals, functional components, JSX rules, and Profile Page.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React fundamentals, Vite setup, JSX, Fragments, Strict Mode, and React Profile Page. Also continued Employee Management System.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Solid implementation across all fundamentals and components.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Consistent high performer.",
        "selfProjectStatus": "Employee Management System: worked on functional dashboard pages."
      },
      {
        "sNo": 4,
        "name": "Chevva Vinay Kumar",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - Completed React fundamentals, functional components, JSX, and Profile Page.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React project structure, functional components, JSX syntax, and React Profile Page practical.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Clean component architecture and valid JSX.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Good progress.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 5,
        "name": "Girish C",
        "pendingTopics": "Pending: React Profile Page mini assignment.",
        "completedTopics": "Partial - Completed React setup, project structure, functional components, and basic JSX.",
        "taskAssign": "Yes",
        "doubts": "Needs guidance on Fragments and component export/import.",
        "discussionSummary": "Practiced functional components and JSX rules. Working on Profile Page components.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete React Profile Page mini assignment.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Active participation.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6,
        "name": "Jayakrishna Madicharla",
        "pendingTopics": "Pending: Complete React Profile Page mini assignment.",
        "completedTopics": "Partial - Completed React setup, functional components, and JSX practice.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React setup and functional components. Guided on Profile Page header and card components.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Submit React Profile Page practical.",
        "standupParticipation": "Participated",
        "standupRating": "Average",
        "standupRemarks": "Working on completion.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 7,
        "name": "Sana Sulthana",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - Completed all React fundamentals, functional components, JSX rules, and Profile Page.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React fundamentals, Vite project structure, functional components, JSX expressions, Fragments, and React Profile Page.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Top-tier component structure and clean styling.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Top performer.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 8,
        "name": "Tejaswar Rao",
        "pendingTopics": "N/A",
        "completedTopics": "Yes - Completed React fundamentals, functional components, JSX rules, and Profile Page.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React project setup, functional components, JSX syntax, Fragments, and modular Profile Page.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Well-structured functional components and clean JSX.",
        "standupParticipation": "Participated",
        "standupRating": "Good",
        "standupRemarks": "Solid understanding.",
        "selfProjectStatus": "N/A"
      }
    ]
  },
  "01-10-2026": {
    "id": "01-10-2026",
    "name": "01-10-2026 (Thu - Flexbox & CSS Grid)",
    "topicsTitle": "📌 01-10-2026 (Thursday) – Flexbox & CSS Grid Layouts",
    "topicsList": [
      "Flexbox: Container, flex-direction, justify-content, align-items, flex-wrap, gap",
      "CSS Grid: Grid Container, Rows & Columns, grid-template-columns/rows, repeat(), fr, minmax()",
      "Grid Areas & Item Placement: Nested Grid, CSS Box Model alignment",
      "Responsive Multi-Column Navigation, Cards & Form Layouts"
    ],
    "tasksTitle": "📋 Assigned Tasks & Responsive Dashboard Practical",
    "tasksList": [
      "Assigned Tasks: 6 different layouts using Flexbox, responsive nav, cards, multi-column Grid",
      "Practical Task: Full Responsive Dashboard with Header, Sidebar, Cards, Main Content, Table, Footer",
      "Mandatory: Code push to GitHub and daily status submission before 6:00 PM"
    ],
    "rows": [
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
    ]
  },
  "05-10-2026": {
    "id": "05-10-2026",
    "name": "05-10-2026 (Day 1 - React Fundamentals & JSX)",
    "topicsTitle": "📌 Day 1 (Monday 05-10-2026) – React Fundamentals & JSX",
    "topicsList": [
      "Introduction to React & Why React is used",
      "React Features & Complete Project Structure",
      "React Application Setup & Functional Components",
      "JSX Syntax, Rules & Valid/Invalid JSX",
      "Fragments, Strict Mode, Rendering Components & Calling Functions"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Create a React project from scratch & understand project structure",
      "Create multiple functional components & practice JSX syntax/rules",
      "Identify valid and invalid JSX, expressions in JSX & Fragments",
      "Mini Assignment: Simple React Profile Page (Header, Profile, Skills, Education, Footer)"
    ],
    "rows": [
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
    ]
  },
  "06-10-2026": {
    "id": "06-10-2026",
    "name": "06-10-2026 (Day 2 - Props, State & Communication)",
    "topicsTitle": "📌 Day 2 (Tuesday 06-10-2026) – Props, State & Component Communication",
    "topicsList": [
      "Props, State, useState & Component Hierarchy",
      "Parent and Child Components & Data Transfer",
      "Sending Data from Child to Parent using Callback Functions",
      "Passing Functions as Props & Sharing Data Between Components",
      "Conditional Rendering & Interaction Updates"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Create parent and child components, pass different types of data using Props",
      "Pass functions from Parent to Child & send data using callback functions",
      "Create multiple levels of hierarchy & update state based on user interaction",
      "Mini Assignment: Product Management UI (List, Details, Add, Edit, Delete, Conditional Display)"
    ],
    "rows": [
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
    ]
  },
  "07-10-2026": {
    "id": "07-10-2026",
    "name": "07-10-2026 (Day 3 - Lists, Forms & useEffect)",
    "topicsTitle": "📌 Day 3 (Wednesday 07-10-2026) – Lists, Forms, Events & useEffect",
    "topicsList": [
      "Event Handling (onClick, onChange, onSubmit, onKeyDown) & Controlled Forms",
      "Input Handling, Dynamic Forms & Controlled Components",
      "List Rendering, map() function in JSX, Keys in Lists & Reconciliation",
      "useEffect Hook, Component Lifecycle (Mount, Update, Unmount) & Dependency Array"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Handle events & build controlled form components with validation",
      "Render dynamic arrays with map() using proper unique keys",
      "Practice useEffect with different dependency-array scenarios ([ ], [deps], no deps)",
      "Mini Assignment: User Registration and Dynamic User List Application"
    ],
    "rows": [
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
    ]
  },
  "08-10-2026": {
    "id": "08-10-2026",
    "name": "08-10-2026 (Day 4 - API Integration & REST CRUD)",
    "topicsTitle": "📌 Day 4 (Thursday 08-10-2026 - Today) – API Integration & React Data Handling",
    "topicsList": [
      "API Calls in React with Fetch API / Axios & Async/Await Syntax",
      "REST Operations: GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Remove)",
      "UI Data States: Loading State (spinners), Error State (alerts), Empty State",
      "Client-side Dynamic Rendering, Search & Filtering Capabilities"
    ],
    "tasksTitle": "📋 Assigned Tasks & Practical Assignment",
    "tasksList": [
      "Integrate public REST API with React, fetch and display records",
      "Implement loading spinners, error alerts, and empty states cleanly",
      "Implement real-time search, filtering & modular API service layer",
      "Practical Assignment: React User Management Application (CRUD with REST API)"
    ],
    "rows": [
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
    ]
  },
  "09-10-2026": {
    "id": "09-10-2026",
    "name": "09-10-2026 (Day 5 - Context API & Capstone)",
    "topicsTitle": "📌 Day 5 (Friday 09-10-2026) – Context API, Custom Hooks & Final Capstone",
    "topicsList": [
      "Context API (createContext, Provider, useContext) & Global State",
      "Sharing Global Data without Prop Drilling & Context vs Props comparison",
      "Custom Hooks: Creation, use- Prefix Rules, Reusable Business Logic (e.g. useFetch)",
      "Complete Weekly React Revision & Production Project Architecture"
    ],
    "tasksTitle": "📋 Assigned Tasks & Final Assignment",
    "tasksList": [
      "Create Context for global application data & theme/auth session",
      "Build reusable Custom Hook (e.g. useFetch) & refactor repeated logic",
      "Revise all React concepts: Components, JSX, Props, State, useEffect, APIs",
      "Final Practical Assignment: Complete React Mini Application combining all weekly topics"
    ],
    "rows": [
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
    ]
  },
  "14-10-2026": {
    "id": "14-10-2026",
    "name": "14-10-2026 (Tue - Advanced Hooks & State)",
    "topicsTitle": "📌 14-10-2026 (Tuesday) – Advanced React Hooks & Complex State Management",
    "topicsList": [
      "Advanced useState & functional state updates",
      "useReducer Hook for complex multi-action state transitions",
      "Custom hook creation and business logic separation",
      "Side-effect synchronization with useEffect dependency arrays"
    ],
    "tasksTitle": "📋 Assigned Tasks & Reducer Practical",
    "tasksList": [
      "Refactor stateful form logic to useReducer pattern",
      "Implement multi-step workflow with action dispatching",
      "Submission of daily code zip before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Althaf Syed",
        "pendingTopics": "Code (.zip) not attached.",
        "completedTopics": "Yes - Uncle Tom website project documentation and system architecture guide prepared.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Prepared Uncle Tom website project overview, scope, and system architecture documentation covering microservices, tech stack, database, and DevOps flow.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Uncle Tom project documentation & system architecture guides verified. Code (.zip) not attached.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "Uncle Tom Website Architecture"
      },
      {
        "sNo": 2,
        "name": "Bala Krishna Parimi",
        "pendingTopics": "Pending: Typo in Subject Line: \"Dailly\" is misspelled.",
        "completedTopics": "Partial - Completed React advanced hooks and reducer practice.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Practiced useReducer and custom hook separation. Code zip attached and reviewed.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Correct subject line spelling in future submissions.",
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
        "discussionSummary": "Completed advanced useReducer and custom hook patterns with clean code archive.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete coverage and verified assignment code.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "Employee Management System"
      },
      {
        "sNo": 4,
        "name": "Chevva Vinay Kumar",
        "pendingTopics": "N/A",
        "completedTopics": "Yes",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Implemented reducer workflow and modular state management.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Clean implementation.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 5,
        "name": "Girish C",
        "pendingTopics": "N/A",
        "completedTopics": "Yes",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Practiced useReducer hook and complex state transitions.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Code zip verified.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6,
        "name": "Jayakrishna Madicharla",
        "pendingTopics": "Pending: Missing Email Subject Line.",
        "completedTopics": "Partial - Completed state exercises.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed assigned state and reducer tasks. Subject line omitted in email submission.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Action Required: Missing Email Subject Line.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 7,
        "name": "Sana Sulthana",
        "pendingTopics": "N/A",
        "completedTopics": "Yes",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed advanced state management and custom hook logic.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Clean architecture.",
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
        "discussionSummary": "Completed useReducer and custom hook abstraction with tests.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Verified submission.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      }
    ]
  },
  "16-10-2026": {
    "id": "16-10-2026",
    "name": "16-10-2026 (Today - Performance & Optimization)",
    "topicsTitle": "📌 16-10-2026 (Friday) – Performance Optimization & React Rendering",
    "topicsList": [
      "React rendering and re-rendering mechanisms",
      "Component memoization with React.memo",
      "useMemo & useCallback for referential equality and caching",
      "Code splitting with React.lazy and Suspense fallback UI",
      "Performance profiling with React Developer Tools"
    ],
    "tasksTitle": "📋 Assigned Tasks & Production Optimization",
    "tasksList": [
      "Profile rendering bottlenecks in capstone application",
      "Implement React.memo and useCallback on large list items",
      "Configure lazy loading for routes and heavy widgets",
      "Daily status submission before 6:00 PM"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Althaf Syed",
        "pendingTopics": "Code (.zip) not attached.",
        "completedTopics": "Yes - Uncle Tom website project documentation and system architecture guide prepared.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Prepared Uncle Tom website project overview, scope, and system architecture documentation covering microservices, tech stack, database, and DevOps flow.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Uncle Tom project documentation & system architecture guides verified. Code (.zip) not attached.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "Uncle Tom Website Architecture"
      },
      {
        "sNo": 2,
        "name": "Bala Krishna Parimi",
        "pendingTopics": "Pending: Typo in Subject Line: \"Dailly\" is misspelled.",
        "completedTopics": "Partial - Submission reviewed with discrepancies flagged.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React rendering and optimization exercises. Typo in subject flagged for correction.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Action Required: Typo in Subject Line: \"Dailly\" is misspelled. Please use standard spelling \"Daily\". Reported to Nafisa Khanam.",
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
        "discussionSummary": "Completed React.memo, useMemo, and useCallback optimization exercises with full clean code zip attached.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed. Complete coverage and verified assignment code.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "Employee Management System"
      },
      {
        "sNo": 4,
        "name": "Chevva Vinay Kumar",
        "pendingTopics": "Awaiting today's report submission.",
        "completedTopics": "In Progress - Performance optimization syllabus.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Working on React.memo and useCallback optimizations. Scheduled for evening submission.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Pending evening email submission.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 5,
        "name": "Girish C",
        "pendingTopics": "Awaiting today's report submission.",
        "completedTopics": "In Progress - Performance optimization syllabus.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Working on React.memo and useCallback optimizations. Scheduled for evening submission.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Pending evening email submission.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 6,
        "name": "Jayakrishna Madicharla",
        "pendingTopics": "Pending: Missing Email Subject Line.",
        "completedTopics": "Partial - Submission reviewed with discrepancies flagged.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Submitted daily performance exercises. Missing standard email subject line flagged for correction.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Action Required: Missing Email Subject Line — Use standard format: \"Daily Status Report (DD-MM-YYYY)\" Reported to Nafisa Khanam.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 7,
        "name": "Sana Sulthana",
        "pendingTopics": "Pending: Formatting error in Subject Line: Trailing underscore (\"_\").",
        "completedTopics": "Partial - Submission reviewed with discrepancies flagged.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed React.memo and code splitting exercises. Subject line trailing underscore flagged for correction.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Action Required: Formatting error in Subject Line: Trailing underscore (\"_\") found. Use standard format: \"Daily Status Report (DD-MM-YYYY)\". Reported to Nafisa Khanam.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      },
      {
        "sNo": 8,
        "name": "Tejaswar Rao",
        "pendingTopics": "Awaiting today's report submission.",
        "completedTopics": "In Progress - Performance optimization syllabus.",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Working on React.memo and useCallback optimizations. Scheduled for evening submission.",
        "githubPushStatus": "Pending",
        "emailReviewStatus": "Pending evening email submission.",
        "standupParticipation": "Not Conducted",
        "standupRating": "N/A",
        "standupRemarks": "No stand-up call was conducted today.",
        "selfProjectStatus": "N/A"
      }
    ]
  }
};

export const BATCH_4_SHEET_PRESETS: Record<string, SheetPresetConfig> = {
  "01-10-2026": {
    "id": "01-10-2026",
    "name": "01-10-2026 (Batch 4 - Flexbox & Grid)",
    "topicsTitle": "📌 01-10-2026 (Thursday) – Flexbox & CSS Grid Layouts (Batch 4)",
    "topicsList": [
      "Flexbox: Container, flex-direction, justify-content, align-items, flex-wrap, gap",
      "CSS Grid: Grid Container, Rows & Columns, grid-template-columns/rows, repeat(), fr, minmax()",
      "Grid Areas & Item Placement: Nested Grid, CSS Box Model alignment",
      "Responsive Multi-Column Navigation, Cards & Form Layouts"
    ],
    "tasksTitle": "📋 Assigned Tasks & Responsive Dashboard Practical",
    "tasksList": [
      "Assigned Tasks: 6 different layouts using Flexbox, responsive nav, cards, multi-column Grid",
      "Practical Task: Full Responsive Dashboard with Header, Sidebar, Cards, Main Content, Table, Footer",
      "Mandatory: Code push to GitHub and daily status submission before 6:00 PM"
    ],
    "rows": [
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
  },
  "05-10-2026": {
    "id": "05-10-2026",
    "name": "05-10-2026 (Day 1 - Batch 4 React Fundamentals)",
    "topicsTitle": "📌 Day 1 (Monday 05-10-2026) – React Fundamentals & JSX (Batch 4)",
    "topicsList": [
      "Introduction to React & Why React is used",
      "React Features & Complete Project Structure",
      "React Application Setup & Functional Components",
      "JSX Syntax, Rules & Valid/Invalid JSX",
      "Fragments, Strict Mode, Rendering Components & Calling Functions"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Create a React project from scratch & understand project structure",
      "Create multiple functional components & practice JSX syntax/rules",
      "Identify valid and invalid JSX, expressions in JSX & Fragments",
      "Mini Assignment: Simple React Profile Page (Header, Profile, Skills, Education, Footer)"
    ],
    "rows": [
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
  },
  "06-10-2026": {
    "id": "06-10-2026",
    "name": "06-10-2026 (Day 2 - Batch 4 Props & State)",
    "topicsTitle": "📌 Day 2 (Tuesday 06-10-2026) – Props, State & Component Communication (Batch 4)",
    "topicsList": [
      "Props, State, useState & Component Hierarchy",
      "Parent and Child Components & Data Transfer",
      "Sending Data from Child to Parent using Callback Functions",
      "Passing Functions as Props & Sharing Data Between Components",
      "Conditional Rendering & Interaction Updates"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Create parent and child components, pass different types of data using Props",
      "Pass functions from Parent to Child & send data using callback functions",
      "Create multiple levels of hierarchy & update state based on user interaction",
      "Mini Assignment: Product Management UI (List, Details, Add, Edit, Delete, Conditional Display)"
    ],
    "rows": [
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
  },
  "07-10-2026": {
    "id": "07-10-2026",
    "name": "07-10-2026 (Day 3 - Batch 4 Lists & Forms)",
    "topicsTitle": "📌 Day 3 (Wednesday 07-10-2026) – Lists, Forms & useEffect (Batch 4)",
    "topicsList": [
      "Event Handling (onClick, onChange, onSubmit, onKeyDown) & Controlled Forms",
      "Input Handling, Dynamic Forms & Controlled Components",
      "List Rendering, map() function in JSX, Keys in Lists & Reconciliation",
      "useEffect Hook, Component Lifecycle (Mount, Update, Unmount) & Dependency Array"
    ],
    "tasksTitle": "📋 Assigned Tasks & Mini Assignment",
    "tasksList": [
      "Handle events & build controlled form components with validation",
      "Render dynamic arrays with map() using proper unique keys",
      "Practice useEffect with different dependency-array scenarios ([ ], [deps], no deps)",
      "Mini Assignment: User Registration and Dynamic User List Application"
    ],
    "rows": [
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
  },
  "08-10-2026": {
    "id": "08-10-2026",
    "name": "08-10-2026 (Day 4 - Batch 4 API Integration)",
    "topicsTitle": "📌 Day 4 (Thursday 08-10-2026 - Today) – API Integration & React Data Handling (Batch 4)",
    "topicsList": [
      "API Calls in React with Fetch API / Axios & Async/Await Syntax",
      "REST Operations: GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Remove)",
      "UI Data States: Loading State (spinners), Error State (alerts), Empty State",
      "Client-side Dynamic Rendering, Search & Filtering Capabilities"
    ],
    "tasksTitle": "📋 Assigned Tasks & Practical Assignment",
    "tasksList": [
      "Integrate public REST API with React, fetch and display records",
      "Implement loading spinners, error alerts, and empty states cleanly",
      "Implement real-time search, filtering & modular API service layer",
      "Practical Assignment: React User Management Application (CRUD with REST API)"
    ],
    "rows": [
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
  },
  "09-10-2026": {
    "id": "09-10-2026",
    "name": "09-10-2026 (Day 5 - Batch 4 Context API & Capstone)",
    "topicsTitle": "📌 Day 5 (Friday 09-10-2026) – Context API, Custom Hooks & Final Capstone (Batch 4)",
    "topicsList": [
      "Context API (createContext, Provider, useContext) & Global State",
      "Sharing Global Data without Prop Drilling & Context vs Props comparison",
      "Custom Hooks: Creation, use- Prefix Rules, Reusable Business Logic (e.g. useFetch)",
      "Complete Weekly React Revision & Production Project Architecture"
    ],
    "tasksTitle": "📋 Assigned Tasks & Final Assignment",
    "tasksList": [
      "Create Context for global application data & theme/auth session",
      "Build reusable Custom Hook (e.g. useFetch) & refactor repeated logic",
      "Revise all React concepts: Components, JSX, Props, State, useEffect, APIs",
      "Final Practical Assignment: Complete React Mini Application combining all weekly topics"
    ],
    "rows": [
      {
        "sNo": 1,
        "name": "Trainee 1 (Batch 4)",
        "pendingTopics": "N/A",
        "completedTopics": "Yes",
        "taskAssign": "Yes",
        "doubts": "No Blockers Reported",
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
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
        "discussionSummary": "Completed Context API global state and custom hooks for capstone mini application.",
        "githubPushStatus": "Yes",
        "emailReviewStatus": "Reviewed",
        "standupParticipation": "Conducted",
        "standupRating": "Good",
        "standupRemarks": "Active in session.",
        "selfProjectStatus": "N/A"
      }
    ]
  }
};

export default function DailyTrackerView({ trackers = [], onRefresh }: { trackers?: DailyTrackerData[]; onRefresh?: () => void }) {
  const { success: toastSuccess, error: toastError, info: toastInfo, ai: toastAi } = useToast();

  const [selectedBatch, setSelectedBatch] = useState<string>('3');
  const [showWeeklyCurriculum, setShowWeeklyCurriculum] = useState(false);
  const [selectedSheetDate, setSelectedSheetDate] = useState('26-10-2026');
  const [userProfile, setUserProfile] = useState<{
    batch?: string;
    emailUser?: string;
    emailProvider?: 'both' | 'gmail' | 'outlook' | 'custom';
    gmailUser?: string;
    outlookUser?: string;
  } | null>(null);
  const [selectedEmailProvider, setSelectedEmailProvider] = useState<'gmail' | 'outlook' | 'both'>('gmail');
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [selectedGhTrainee, setSelectedGhTrainee] = useState<{ username: string; repo: string } | null>(null);
  const [selectedTraineeForAttendanceNotice, setSelectedTraineeForAttendanceNotice] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);



  const activePresets = useMemo(() => {
    if (selectedBatch === '3') return BATCH_3_SHEET_PRESETS;
    if (selectedBatch === '4') return BATCH_4_SHEET_PRESETS;
    const customPresets: Record<string, any> = {};
    Object.keys(BATCH_3_SHEET_PRESETS).forEach((dateKey) => {
      const base = BATCH_3_SHEET_PRESETS[dateKey];
      customPresets[dateKey] = {
        ...base,
        name: `${dateKey} (Batch ${selectedBatch})`,
        topicsTitle: base.topicsTitle ? base.topicsTitle.replace('Batch 3', `Batch ${selectedBatch}`) : `Batch ${selectedBatch} Topics`,
        rows: base.rows.map((r: any, i: number) => ({
          ...r,
          name: `Trainee ${i + 1} (Batch ${selectedBatch})`,
        })),
      };
    });
    return customPresets;
  }, [selectedBatch]);

  useEffect(() => {
    fetch('/api/settings/credentials')
      .then((r) => r.json())
      .then((data) => {
        if (data.credentials) {
          setUserProfile(data.credentials);
          if (data.credentials.emailProvider && ['gmail', 'outlook', 'both'].includes(data.credentials.emailProvider)) {
            setSelectedEmailProvider(data.credentials.emailProvider);
          }
          if (data.credentials.batch) {
            const userBatch = String(data.credentials.batch).trim();
            setSelectedBatch(userBatch);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleProvider = (provider: 'gmail' | 'outlook' | 'both') => {
    setSelectedEmailProvider(provider);
    const label = provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook' : 'Both (Dual Sync)';
    toastInfo('Mail Mode Switched', `Active sync mode set to ${label}.`);
    fetch('/api/settings/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailProvider: provider }),
    }).catch(() => {});
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };
  const [uploadedWorkbook, setUploadedWorkbook] = useState<{
    filename: string;
    sheetNames: string[];
    sheets: Record<string, any[][]>;
  } | null>(null);

  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const sheetsMap: Record<string, any[][]> = {};
        wb.SheetNames.forEach((sName) => {
          sheetsMap[sName] = XLSX.utils.sheet_to_json(wb.Sheets[sName], { header: 1 });
        });
        setUploadedWorkbook({
          filename: file.name,
          sheetNames: wb.SheetNames,
          sheets: sheetsMap,
        });
        if (wb.SheetNames.length > 0) {
          setSelectedSheetDate(wb.SheetNames[0]);
        }
        toastSuccess(
          'Excel Workbook Loaded',
          `Parsed ${wb.SheetNames.length} sheet(s) from "${file.name}". All sheets ready to view and edit!`
        );
      } catch (err: any) {
        toastError('Failed to read Excel', err?.message || 'Invalid Excel format');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSwitchBatch = (batch: string) => {
    setSelectedBatch(batch);
    const presets = batch === '4' ? BATCH_4_SHEET_PRESETS : batch === '3' ? BATCH_3_SHEET_PRESETS : null;
    const initialDate = '26-10-2026';
    setSelectedSheetDate(initialDate);
    let rowsToSet = presets ? (presets[initialDate]?.rows || []) : [];
    if (!rowsToSet.length) {
      rowsToSet = BATCH_3_SHEET_PRESETS[initialDate]?.rows.map((r: any, i: number) => ({
        ...r,
        name: `Trainee ${i + 1} (Batch ${batch})`,
      })) || [];
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`nexus_batch${batch}_sheet_${initialDate}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) rowsToSet = parsed;
        }
      } catch (e) {}
    }
    setEditableRows(rowsToSet);
    setHasUnsavedChanges(false);
    toastSuccess(`Batch ${batch} Active`, `Switched to Batch ${batch} operations tracker.`);
  };

  const handleSelectSheet = (sheetKey: string) => {
    setSelectedSheetDate(sheetKey);
    if (sheetKey === 'weekly-task-allocation') {
      toastInfo('Weekly Allocation Active', `Viewing 5-Day React Task Allocation for Batch ${selectedBatch}.`);
      return;
    }
    const presets = activePresets;
    if (presets[sheetKey]) {
      let rowsToSet = presets[sheetKey].rows;
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(`nexus_batch${selectedBatch}_sheet_${sheetKey}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              rowsToSet = sheetKey === '05-10-2026' ? parsed.slice(0, 8).map((r: BatchTraineeRow, i: number) => ({ ...r, sNo: i + 1 })) : parsed;
            }
          }
        } catch (e) {}
      }
      setEditableRows(rowsToSet);
      setHasUnsavedChanges(false);
      toastInfo('Sheet Active', `Loaded Batch ${selectedBatch} "${presets[sheetKey].name}" sheet.`);
    } else if (uploadedWorkbook && uploadedWorkbook.sheets[sheetKey]) {
      toastSuccess('Uploaded Sheet Active', `Displaying sheet "${sheetKey}" from "${uploadedWorkbook.filename}".`);
    }
  };

  // Email with Attached Excel Modal State (Gmail / Outlook)
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('nafisakhanampathan65@gmail.com');
  const [emailSubject, setEmailSubject] = useState(
    'Technical Team Batch 3 — Daily Status Report (08-10-2026) [Attached Excel]'
  );
  const [emailMessage, setEmailMessage] = useState(
    `Hi Team,\n\nPlease find attached the official Technical Team Batch 3 Daily Status Report (.xlsx) for 08-10-2026 (Day 4 – API Integration & React Data Handling).\n\nThis workbook contains the complete trainee task breakdowns, completed vs pending items, review statuses, and code review remarks.\n\nBest regards,\nTechnical Mentorship Team\nNexusTrack Operations`
  );
  const [emailSending, setEmailSending] = useState(false);
  const [extraAttachments, setExtraAttachments] = useState<{ filename: string; content: string; size: string }[]>([]);

  // Ingestion Modal State
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [activePresetId, setActivePresetId] = useState<'sana' | 'altaf' | 'chandra' | 'girish' | 'custom'>('sana');
  const [senderName, setSenderName] = useState(EMAIL_PRESETS[0].senderName);
  const [senderEmail, setSenderEmail] = useState(EMAIL_PRESETS[0].senderEmail);
  const [emailContent, setEmailContent] = useState(EMAIL_PRESETS[0].content);
  const [syncing, setSyncing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<any | null>(null);

  // TL Daily Report Modal State (User's Exact Template)
  const [showTLReportModal, setShowTLReportModal] = useState(false);

  // Credentials & Excel Password Modal State
  const [showCredsModal, setShowCredsModal] = useState(false);

  // Mail Scanning & Auto-Audit State (1-Minute Interval, Corrections routed to nafisakhanampathan65@gmail.com)
  const [scanningMail, setScanningMail] = useState(false);
  const [scanAuditResult, setScanAuditResult] = useState<any | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [autoScanCountdown, setAutoScanCountdown] = useState(60);
  const [lastAutoScanTime, setLastAutoScanTime] = useState<string | null>(null);

  // Live Editable SharePoint Rows (Persisted per-sheet to localStorage so mentor maintains Excel in real time)
  const [editableRows, setEditableRows] = useState<BatchTraineeRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Clear old legacy keys to prevent CSS data bleeding into React sheet
        localStorage.removeItem('nexus_batch3_tracker_rows_v3');
        localStorage.removeItem('nexus_batch3_tracker_rows');
        // Clear all legacy non-October keys
        ['18-09-2026', '29-09-2026', '30-09-2026', 'Assessment-1', 'HTML-Curriculum', 'JavaScript-Curriculum'].forEach((k) => {
          localStorage.removeItem('nexus_batch3_sheet_' + k);
        });
        const saved = localStorage.getItem('nexus_batch3_sheet_26-10-2026') || localStorage.getItem('nexus_batch3_sheet_16-10-2026') || localStorage.getItem('nexus_batch3_sheet_08-10-2026');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const trimmed = parsed.slice(0, 8).map((r: BatchTraineeRow, i: number) => ({ ...r, sNo: i + 1 }));
            return trimmed;
          }
        }
      } catch (e) {
        console.warn('Could not read saved rows from localStorage:', e);
      }
    }
    return BATCH_3_SHEET_PRESETS['26-10-2026']?.rows || BATCH_3_SHEET_PRESETS['16-10-2026']?.rows || BATCH_3_SHEET_PRESETS['08-10-2026']?.rows || SHAREPOINT_BATCH_3_TRAINEES;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync incoming trackers if live email submissions arrive without wiping custom edits
  useEffect(() => {
    if (!trackers || trackers.length === 0) return;
    setEditableRows((prev) => {
      let changed = false;
      const updated = [...prev];

      trackers.forEach((t) => {
        if (!t.name) return;
        const idx = updated.findIndex((r) => r.name.toLowerCase() === t.name.toLowerCase());
        if (idx !== -1) {
          if (t.pendingTopics && updated[idx].pendingTopics === 'N/A') {
            updated[idx] = {
              ...updated[idx],
              pendingTopics: t.pendingTopics,
              completedTopics: `${t.completedTopicsStatus || 'Partial'} - ${t.completedTopicsDetails || ''}`,
              doubts: t.doubts || updated[idx].doubts,
              githubPushStatus: t.githubPushStatus || updated[idx].githubPushStatus,
              emailReviewStatus: t.emailReviewStatus || updated[idx].emailReviewStatus,
              selfProjectStatus: t.selfProjectStatus || updated[idx].selfProjectStatus,
            };
            changed = true;
          }
        }
      });
      return changed ? updated : prev;
    });
  }, [trackers]);

  const handleScanAndAudit = async (overrideProvider?: 'gmail' | 'outlook' | 'both') => {
    const provider = overrideProvider || selectedEmailProvider;
    setScanningMail(true);
    const providerLabel =
      provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook Cloud' : 'Gmail & Outlook';

    toastAi(
      `⚡ Scanning ${providerLabel}`,
      provider === 'outlook'
        ? 'Scanning nafisa.khanam@nybinfotech.com in real-time... Discrepancies saved to Drafts.'
        : provider === 'gmail'
        ? 'Scanning nafisakhanampathan65@gmail.com in real-time... Discrepancies saved to Drafts.'
        : 'Scanning both Gmail & Outlook mailboxes simultaneously in real-time... Discrepancies saved to Drafts.'
    );

    try {
      const res = await fetch('/api/mails/scan-and-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScanAuditResult(data);
        const timeDisplay = data.executionTimeMs ? `${data.executionTimeMs}ms` : 'sub-second';
        toastSuccess(
          `⚡ ${providerLabel} Synced (${timeDisplay})`,
          `Audited ${data.auditedCount || 0} submission(s) and synced Excel. Discrepancy notices safely saved in Drafts.`
        );
        onRefresh?.();
      } else {
        toastError('Audit Failed', data.error || `Failed to scan ${providerLabel}`);
      }
    } catch {
      toastError('Network Error', `Could not communicate with ${providerLabel} scan service`);
    } finally {
      setScanningMail(false);
    }
  };

  // Automated 1-Minute Recurring Mail Check (Active in Background for Selected Provider)
  useEffect(() => {
    if (!autoScanEnabled) return;
    const timer = setInterval(() => {
      setAutoScanCountdown((prev) => {
        if (prev <= 1) {
          // Defer side-effect to next tick so React state updater remains pure
          setTimeout(() => {
            handleScanAndAudit(selectedEmailProvider);
            setLastAutoScanTime(new Date().toLocaleTimeString());
          }, 0);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoScanEnabled, selectedEmailProvider]);

  const handleCellBlur = (sNo: number, field: keyof BatchTraineeRow, value: string) => {
    setEditableRows((prev) => {
      const next = prev.map((r) => (r.sNo === sNo ? { ...r, [field]: value } : r));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleQuickToggle = (sNo: number, field: 'taskAssign' | 'githubPushStatus') => {
    setEditableRows((prev) => {
      const next = prev.map((r) => {
        if (r.sNo === sNo) {
          const current = r[field];
          const nextVal = current === 'Yes' ? 'No' : current === 'No' ? 'On Leave' : 'Yes';
          return { ...r, [field]: nextVal };
        }
        return r;
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleAddRow = () => {
    setEditableRows((prev) => {
      const nextSNo = prev.length > 0 ? Math.max(...prev.map((r) => r.sNo)) + 1 : 1;
      const newRow: BatchTraineeRow = {
        sNo: nextSNo,
        name: `Trainee ${nextSNo}`,
        pendingTopics: 'N/A',
        completedTopics: 'Yes - Completed daily assigned tasks',
        taskAssign: 'Yes',
        doubts: 'No Blockers Reported',
        discussionSummary: 'Completed assigned tasks and practical exercises.',
        githubPushStatus: 'Yes',
        emailReviewStatus: 'Reviewed',
        standupParticipation: 'Conducted',
        standupRating: 'Good',
        standupRemarks: 'Active participation.',
        selfProjectStatus: 'In Progress',
      };
      const next = [...prev, newRow];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasUnsavedChanges(true);
    toastSuccess('Row Added', 'New editable trainee row added to your spreadsheet.');
  };

  const handleDeleteRow = (sNo: number) => {
    setEditableRows((prev) => {
      const filtered = prev.filter((r) => r.sNo !== sNo);
      const renumbered = filtered.map((r, i) => ({ ...r, sNo: i + 1 }));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`, JSON.stringify(renumbered));
        } catch (e) {}
      }
      return renumbered;
    });
    setHasUnsavedChanges(true);
    toastInfo('Row Removed', `Row #${sNo} removed from spreadsheet.`);
  };

  const handleSaveSheet = () => {
    if (selectedSheetDate === 'weekly-task-allocation') {
      toastInfo('Weekly Allocation', 'Weekly Task Allocation is reference curriculum and does not require row saving.');
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`, JSON.stringify(editableRows));
      } catch (e) {}
    }
    setHasUnsavedChanges(false);
    toastSuccess('Spreadsheet Saved', `Edits for Batch ${selectedBatch} sheet "${selectedSheetDate}" saved successfully.`);
  };

  const handleResetToDefault = () => {
    if (confirm(`Reset Batch ${selectedBatch} sheet "${selectedSheetDate}" to default template?`)) {
      const presets = selectedBatch === '3' ? BATCH_3_SHEET_PRESETS : BATCH_4_SHEET_PRESETS;
      const defaultRows = presets[selectedSheetDate]?.rows || SHAREPOINT_BATCH_3_TRAINEES;
      setEditableRows(defaultRows);
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(`nexus_batch${selectedBatch}_sheet_${selectedSheetDate}`);
        } catch (e) {}
      }
      setHasUnsavedChanges(false);
      toastInfo('Spreadsheet Reset', `Restored default template for Batch ${selectedBatch} "${selectedSheetDate}".`);
    }
  };

  const downloadSharepointReport = async () => {
    const exportDate = selectedSheetDate === 'weekly-task-allocation' ? (Object.keys(activePresets)[0] || '01-10-2026') : selectedSheetDate;
    try {
      toastInfo('Preparing Export', `Exporting Technical Team batch-${selectedBatch}_Daily_Status_Report.xlsx with your edits...`);
      const res = await fetch('/api/daily-tracker/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: exportDate,
          batch: selectedBatch,
          rows: editableRows,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Technical Team batch-${selectedBatch}_Daily_Status_Report.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toastSuccess('Downloaded', `Technical Team batch-${selectedBatch}_Daily_Status_Report.xlsx exported successfully!`);
      } else {
        window.location.href = `/api/daily-tracker/export-excel?date=${exportDate}&batch=${selectedBatch}`;
      }
    } catch {
      window.location.href = `/api/daily-tracker/export-excel?date=${exportDate}&batch=${selectedBatch}`;
    }
  };

  const copyForSharepoint = () => {
    if (selectedSheetDate === 'weekly-task-allocation') {
      navigator.clipboard.writeText(WEEKLY_TASK_ALLOCATION_EMAIL_TEXT);
      toastSuccess('Curriculum Copied', 'Full 5-day React curriculum copied to clipboard.');
      return;
    }
    const tsvHeaders = [
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
    ].join('\t');

    const tsvRows = editableRows
      .map((t) =>
        [
          t.sNo,
          t.name,
          t.pendingTopics || 'N/A',
          t.completedTopics || 'Yes',
          t.taskAssign || 'Yes',
          t.doubts || 'No Blockers Reported',
          t.discussionSummary || '',
          t.githubPushStatus || 'Yes',
          t.emailReviewStatus || 'Reviewed',
          t.standupParticipation || 'Not Conducted',
          t.standupRating || 'N/A',
          t.standupRemarks || 'No stand-up call was conducted today.',
          t.selfProjectStatus || 'N/A',
        ].join('\t')
      )
      .join('\n');

    navigator.clipboard.writeText(`${tsvHeaders}\n${tsvRows}`);
    toastSuccess(
      'Copied for SharePoint!',
      'Table data copied to clipboard. Click on row 13 in your SharePoint Excel Online sheet and press Ctrl + V.'
    );
  };

  const handleSendEmailWithExcel = async () => {
    if (!emailRecipient.trim()) {
      toastError('Recipient Required', 'Please enter a recipient email address.');
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch('/api/daily-tracker/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailRecipient.trim(),
          date: selectedSheetDate,
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
          rows: editableRows,
          extraAttachments: extraAttachments.map((att) => ({
            filename: att.filename,
            content: att.content,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess(
          'Email Sent with Excel Attached!',
          `Spreadsheet "Technical Team batch-3_Daily_Status_Report.xlsx" dispatched to ${emailRecipient} via Gmail SMTP.`
        );
        setShowEmailModal(false);
      } else {
        toastError('Failed to Send', data.error || 'Could not send email report.');
      }
    } catch {
      toastError('Network Error', 'Failed to communicate with email report service.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      setExtraAttachments((prev) => [
        ...prev,
        {
          filename: file.name,
          content: base64,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        },
      ]);
      toastSuccess('File Attached', `${file.name} attached to email.`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeExtraAttachment = (index: number) => {
    setExtraAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const openGmailWebWithDownload = () => {
    downloadSharepointReport();
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailMessage);
    const encodedTo = encodeURIComponent(emailRecipient);
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
      '_blank'
    );
    toastInfo(
      'Excel Downloaded & Gmail Opened',
      'The .xlsx file is in your Downloads folder. Simply drag it into your Gmail compose window!'
    );
  };

  const openOutlookWebWithDownload = () => {
    downloadSharepointReport();
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailMessage);
    const encodedTo = encodeURIComponent(emailRecipient);
    window.open(
      `https://outlook.cloud.microsoft/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
      '_blank'
    );
    toastInfo(
      'Excel Downloaded & Outlook Opened',
      'The .xlsx file is in your Downloads folder. Simply drag it into your Outlook (https://outlook.cloud.microsoft/mail/) compose window!'
    );
  };

  const applyPreset = (preset: (typeof EMAIL_PRESETS)[0]) => {
    setActivePresetId(preset.id as any);
    setSenderName(preset.senderName);
    setSenderEmail(preset.senderEmail);
    setEmailContent(preset.content);
    setAnalyzedResult(null);
  };

  const handleAISync = async () => {
    if (!emailContent.trim()) {
      toastError('Empty Content', 'Please provide or paste daily email report text.');
      return;
    }

    setSyncing(true);
    setAnalyzedResult(null);

    try {
      const res = await fetch('/api/daily-tracker/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName || 'Unknown Trainee',
          senderEmail: senderEmail || 'trainee@organization.com',
          emailContent,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAnalyzedResult(data);
        const score = data.data?.performanceScore ?? 'N/A';
        toastAi('Gemini Triage Complete', `Evaluated report for ${senderName}. Performance Score: ${score}/100`);

        if (data.autoReplyMessage) {
          toastInfo('Automated Feedback Generated', 'AI draft prepared based on detected discrepancies.');
        }

        onRefresh?.();
      } else {
        toastError('AI Evaluation Failed', data.error || 'Failed to process report with Gemini.');
      }
    } catch {
      toastError('Network Error', 'Could not communicate with Gemini evaluation endpoint.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── CLEAN PROFESSIONAL EXCEL WORKSPACE COMMAND BAR ── */}
      {/* ── STREAMLINED EXECUTIVE EXCEL WORKSPACE COMMAND BAR ── */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Row 1: Identity & Primary Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          {/* Identity Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #107c41, #0e5c30)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 10,
                boxShadow: '0 4px 14px rgba(16, 124, 65, 0.4)',
                letterSpacing: 0.5,
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={16} />
              <span style={{ fontSize: 8 }}>XLSX</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>
                  Technical Team batch-{selectedBatch}_Daily_Status_Report.xlsx
                </span>

                {/* Batch Switcher */}
                <div
                  style={{
                    display: 'inline-flex',
                    padding: 2,
                    background: 'rgba(0, 0, 0, 0.45)',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    gap: 2,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSwitchBatch('3')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: selectedBatch === '3' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
                      color: selectedBatch === '3' ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Batch 3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchBatch('4')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: selectedBatch === '4' ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : 'transparent',
                      color: selectedBatch === '4' ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Batch 4
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchBatch('5')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: selectedBatch === '5' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                      color: selectedBatch === '5' ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Batch 5
                  </button>
                  {!['3', '4', '5'].includes(selectedBatch) && (
                    <button
                      type="button"
                      onClick={() => handleSwitchBatch(selectedBatch)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      Batch {selectedBatch}
                    </button>
                  )}
                </div>

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  {editableRows.length} Trainees
                </span>

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  Active Sheet: {activePresets[selectedSheetDate]?.name || selectedSheetDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Mail Provider Selector Toggle [ 📮 Gmail | 💼 Outlook | ⚡ Both ] */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 3,
                background: 'rgba(0, 0, 0, 0.45)',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                gap: 3,
              }}
              role="group"
              aria-label="Email Provider Selection"
            >
              {/* Gmail Toggle */}
              <button
                type="button"
                onClick={() => handleToggleProvider('gmail')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 7,
                  border: selectedEmailProvider === 'gmail' ? '1px solid #ea4335' : '1px solid transparent',
                  background:
                    selectedEmailProvider === 'gmail'
                      ? 'linear-gradient(135deg, #ea4335, #c5221f)'
                      : 'transparent',
                  color: selectedEmailProvider === 'gmail' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow:
                    selectedEmailProvider === 'gmail' ? '0 2px 10px rgba(234, 67, 53, 0.4)' : 'none',
                }}
                title="Select Gmail Mode (nafisakhanampathan65@gmail.com)"
              >
                <span>📮</span>
                <span>Gmail</span>
              </button>

              {/* Outlook Toggle */}
              <button
                type="button"
                onClick={() => handleToggleProvider('outlook')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 7,
                  border: selectedEmailProvider === 'outlook' ? '1px solid #0078d4' : '1px solid transparent',
                  background:
                    selectedEmailProvider === 'outlook'
                      ? 'linear-gradient(135deg, #0078d4, #005a9e)'
                      : 'transparent',
                  color: selectedEmailProvider === 'outlook' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow:
                    selectedEmailProvider === 'outlook' ? '0 2px 10px rgba(0, 120, 212, 0.4)' : 'none',
                }}
                title="Select Outlook Cloud Mode (nafisa.khanam@nybinfotech.com)"
              >
                <span>💼</span>
                <span>Outlook</span>
              </button>

              {/* Both Toggle */}
              <button
                type="button"
                onClick={() => handleToggleProvider('both')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 7,
                  border: selectedEmailProvider === 'both' ? '1px solid #0284c7' : '1px solid transparent',
                  background:
                    selectedEmailProvider === 'both'
                      ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                      : 'transparent',
                  color: selectedEmailProvider === 'both' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow:
                    selectedEmailProvider === 'both' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none',
                }}
                title="Select Both (Dual Mailbox Sync: Gmail + Outlook)"
              >
                <span>⚡</span>
                <span>Both</span>
              </button>
            </div>

            {/* Dynamic Sync Button (Adapts strictly to the selected toggle!) */}
            <button
              type="button"
              onClick={() => handleScanAndAudit(selectedEmailProvider)}
              disabled={scanningMail}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background:
                  selectedEmailProvider === 'gmail'
                    ? 'linear-gradient(135deg, #ea4335, #b31412)'
                    : selectedEmailProvider === 'outlook'
                    ? 'linear-gradient(135deg, #0078d4, #005a9e)'
                    : 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow:
                  selectedEmailProvider === 'gmail'
                    ? '0 4px 14px rgba(234, 67, 53, 0.4)'
                    : selectedEmailProvider === 'outlook'
                    ? '0 4px 14px rgba(0, 120, 212, 0.4)'
                    : '0 4px 14px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease',
              }}
              title={
                selectedEmailProvider === 'gmail'
                  ? 'Scan Gmail (nafisakhanampathan65@gmail.com) in real-time. Discrepancies saved to Drafts.'
                  : selectedEmailProvider === 'outlook'
                  ? 'Scan Outlook Cloud (nafisa.khanam@nybinfotech.com) in real-time. Discrepancies saved to Drafts.'
                  : 'Scan Gmail and Outlook Cloud simultaneously in real-time. Discrepancies saved to Drafts.'
              }
            >
              {scanningMail ? (
                <RotateCcw size={13} className="spin" />
              ) : (
                <Sparkles size={13} />
              )}
              {scanningMail
                ? selectedEmailProvider === 'gmail'
                  ? 'Scanning Gmail...'
                  : selectedEmailProvider === 'outlook'
                  ? 'Scanning Outlook...'
                  : 'Syncing Both...'
                : selectedEmailProvider === 'gmail'
                ? 'Sync Gmail'
                : selectedEmailProvider === 'outlook'
                ? 'Sync Outlook'
                : 'Sync Both'}
            </button>

            {/* Save Changes */}
            <button
              type="button"
              onClick={handleSaveSheet}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: hasUnsavedChanges
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(30, 41, 59, 0.95)',
                border: hasUnsavedChanges
                  ? '1px solid #fbbf24'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {hasUnsavedChanges ? <Save size={13} /> : <CheckCircle2 size={13} color="#34d399" />}
              {hasUnsavedChanges ? 'Save *' : 'Saved'}
            </button>

            {/* Add Trainee */}
            <button
              type="button"
              onClick={handleAddRow}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'rgba(22, 163, 74, 0.15)',
                border: '1px solid rgba(22, 163, 74, 0.4)',
                color: '#4ade80',
                fontWeight: 700,
                padding: '7px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Plus size={13} /> Add Row
            </button>

            {/* Download .xlsx */}
            <button
              type="button"
              onClick={downloadSharepointReport}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'rgba(16, 124, 65, 0.2)',
                border: '1px solid rgba(16, 124, 65, 0.4)',
                color: '#34d399',
                fontWeight: 700,
                padding: '7px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Download Master Excel Workbook (.xlsx)"
            >
              <Download size={13} /> Export .xlsx
            </button>

            {/* Export Executive PDF Report */}
            <ExportPdfButton
              targetId="daily-tracker-printable-area"
              filename={`Technical_Team_Batch_${selectedBatch}_Report_${selectedSheetDate}`}
            />

            {/* Send Email to TL (Pre-Attached Excel) */}
            <button
              type="button"
              onClick={() => setShowTLReportModal(true)}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              }}
              title="Compose and send consolidated daily report to Team Lead with Technical Team batch Excel attached"
            >
              <Send size={13} />
              <span>Email to TL</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  fontWeight: 800,
                  letterSpacing: 0.3,
                }}
              >
                📎 .xlsx Attached
              </span>
            </button>

            {/* Nudge Missing Trainees Button */}
            <button
              type="button"
              onClick={() => setShowMissingModal(true)}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#000000',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
              title="Detect trainees who have not submitted today's report and send reminder notices"
            >
              <Bell size={13} />
              <span>Nudge Missing</span>
            </button>

            {/* GitHub Audit Button */}
            <button
              type="button"
              onClick={() =>
                setSelectedGhTrainee({
                  username: 'PathanNafisa',
                  repo: 'nexus-trainee-frontend',
                })
              }
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Audit Trainee GitHub commit activity against daily syllabus with Gemini AI"
            >
              <GitBranch size={13} />
              <span>GitHub Audit</span>
            </button>

            {/* 9:00 AM Attendance & Absence Warning Button */}
            <button
              type="button"
              onClick={() => {
                const missing = editableRows.find(
                  r => r.completedTopics !== 'Yes' && r.completedTopics !== 'Completed'
                );
                setSelectedTraineeForAttendanceNotice({
                  traineeName: missing?.name || 'Nikhil',
                  traineeEmail: (missing as any)?.email || `${(missing?.name || 'nikhil').toLowerCase().replace(/[^a-z0-9]/g, '.')}@nybinfotech.com`,
                  batchNumber: selectedBatch,
                });
              }}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Draft 9:00 AM Absence & Login Clarification Notice for trainees missing morning check-in"
            >
              <Clock size={13} />
              <span>9:00 AM Absence Notice</span>
            </button>
          </div>
        </div>

        {/* Row 2: Subtle Utility Links & Live Daemon Status */}
        <div
          style={{
            paddingTop: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12,
          }}
        >
          {/* External links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="https://navayuvabharatinfotech703-my.sharepoint.com/:x:/r/personal/nafisa_khanam_nybinfotech_com/_layouts/15/doc2.aspx?sourcedoc=%7B2d1c9793-9836-4491-a946-d850ce3d5bbc%7D&action=edit&activeCell=%2701-10-2026%27!C14"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38bdf8',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 500,
              }}
            >
              <ExternalLink size={12} /> SharePoint Online
            </a>

            <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>

            <a
              href="ms-excel:ofe|u|https://navayuvabharatinfotech703-my.sharepoint.com/:x:/r/personal/nafisa_khanam_nybinfotech_com/_layouts/15/doc2.aspx?sourcedoc=%7B2d1c9793-9836-4491-a946-d850ce3d5bbc%7D&action=edit"
              style={{
                color: '#34d399',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 500,
              }}
            >
              <FileSpreadsheet size={12} /> Open Desktop Excel
            </a>

            <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelFileUpload}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                color: '#c084fc',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
              }}
            >
              <FolderOpen size={12} /> Import Custom .xlsx
            </button>
          </div>

          {/* Right: Live Telemetry Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: autoScanEnabled ? '#34d399' : '#94a3b8',
                boxShadow: autoScanEnabled ? '0 0 8px #34d399' : 'none',
              }}
            />
            <span style={{ color: autoScanEnabled ? '#94a3b8' : '#64748b', fontSize: 11 }}>
              {autoScanEnabled
                ? `Background Mail Scanner [${selectedEmailProvider === 'gmail' ? 'Gmail' : selectedEmailProvider === 'outlook' ? 'Outlook Cloud' : 'Gmail & Outlook'}]: Active (${autoScanCountdown}s)`
                : 'Scanner: Paused'}
            </span>
            <button
              type="button"
              onClick={() => setAutoScanEnabled(!autoScanEnabled)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: 11,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              {autoScanEnabled ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* ── EMBEDDED 1-WEEK CURRICULUM ACCORDION (Directly Integrated in Daily Tracker) ── */}
      {showWeeklyCurriculum && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 14,
            padding: '20px 24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
            animation: 'fadeUp 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Weekly Task Allocation &amp; Technical Curriculum (Integrated)
                </h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  Complete 5-day React task allocation, syllabus breakdown, mini assignments, and expected outcomes.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWeeklyCurriculum(false)}
              className="btn btn-ghost btn-sm"
              style={{ color: '#94a3b8', fontSize: 12, gap: 4 }}
            >
              <X size={14} /> Close
            </button>
          </div>
          <WeeklyScheduleView
            onSelectDayForTLReport={(dayNum) => {
              const dateKeys = Object.keys(activePresets);
              if (dateKeys[dayNum - 1]) {
                handleSelectSheet(dateKeys[dayNum - 1]);
                toastInfo('Sheet Switched', `Jumped to Sheet: ${dateKeys[dayNum - 1]} for Day ${dayNum}`);
              }
            }}
          />
        </div>
      )}

      {/* ── CLEAN HORIZONTAL SHEET TABS STRIP (Smooth Left-to-Right Scrolling, Hidden Scrollbars) ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            color: '#ffffff',
            borderRadius: 10,
            width: 36,
            height: 42,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
          title="Scroll sheet tabs left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scrollable Tabs Track (No visible scrollbar, left-to-right smooth scrolling) */}
        <div
          ref={tabsScrollRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            flex: 1,
            padding: '4px 2px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {Object.keys(activePresets).map((sKey) => {
            const preset = activePresets[sKey];
            const isActive = selectedSheetDate === sKey;
            return (
              <button
                key={sKey}
                type="button"
                onClick={() => handleSelectSheet(sKey)}
                style={{
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: isActive
                    ? selectedBatch === '4'
                      ? '2px solid #c084fc'
                      : '2px solid #34d399'
                    : '1.5px solid #334155',
                  background: isActive
                    ? selectedBatch === '4'
                      ? 'linear-gradient(135deg, #7e22ce, #581c87)'
                      : 'linear-gradient(135deg, #107c41, #0f4c81)'
                    : 'rgba(30, 41, 59, 0.85)',
                  color: '#ffffff',
                  fontWeight: isActive ? 900 : 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isActive
                    ? selectedBatch === '4'
                      ? '0 6px 20px rgba(168, 85, 247, 0.45)'
                      : '0 6px 20px rgba(16, 185, 129, 0.45)'
                    : 'none',
                  transform: isActive ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title={`Switch to ${preset?.name || sKey}`}
              >
                <span style={{ fontSize: 16 }}>
                  {sKey.includes('Assessment') ? '🎓' : sKey.includes('Curriculum') ? '📚' : '📑'}
                </span>
                <span>{preset?.name || sKey}</span>
                {isActive && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: selectedBatch === '4' ? '#c084fc' : '#34d399',
                      boxShadow: selectedBatch === '4' ? '0 0 10px #c084fc' : '0 0 10px #34d399',
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Dedicated Tab: 📋 Weekly Task Allocation */}
          {(() => {
            const isWeeklyActive = selectedSheetDate === 'weekly-task-allocation';
            return (
              <button
                key="tab-weekly-task-allocation"
                type="button"
                onClick={() => handleSelectSheet('weekly-task-allocation')}
                style={{
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: isWeeklyActive
                    ? '2px solid #38bdf8'
                    : '1.5px solid rgba(56, 189, 248, 0.45)',
                  background: isWeeklyActive
                    ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                    : 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontWeight: isWeeklyActive ? 900 : 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isWeeklyActive
                    ? '0 6px 20px rgba(56, 189, 248, 0.45)'
                    : 'none',
                  transform: isWeeklyActive ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title="View full 5-day Weekly Task Allocation & curriculum right in Daily Tracker"
              >
                <span style={{ fontSize: 16 }}>📋</span>
                <span>Weekly Task Allocation</span>
                <span
                  style={{
                    fontSize: 10,
                    background: isWeeklyActive ? 'rgba(255,255,255,0.25)' : 'rgba(56, 189, 248, 0.2)',
                    color: isWeeklyActive ? '#ffffff' : '#38bdf8',
                    padding: '2px 7px',
                    borderRadius: 10,
                    fontWeight: 800,
                  }}
                >
                  Day 1–5
                </span>
                {isWeeklyActive && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#38bdf8',
                      boxShadow: '0 0 10px #38bdf8',
                    }}
                  />
                )}
              </button>
            );
          })()}

          {/* Custom Uploaded Sheets from Local PC */}
          {uploadedWorkbook &&
            uploadedWorkbook.sheetNames.map((sName) => {
              const isActive = selectedSheetDate === sName;
              return (
                <button
                  key={sName}
                  type="button"
                  onClick={() => handleSelectSheet(sName)}
                  style={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: isActive ? '2px solid #c084fc' : '1.5px solid #6b21a8',
                    background: isActive
                      ? 'linear-gradient(135deg, #7c3aed, #9333ea)'
                      : 'rgba(88, 28, 135, 0.45)',
                    color: '#ffffff',
                    fontWeight: isActive ? 900 : 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: isActive ? '0 6px 20px rgba(168, 85, 247, 0.45)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title={`Sheet from uploaded workbook: ${uploadedWorkbook.filename}`}
                >
                  <span style={{ fontSize: 16 }}>📊</span>
                  <span>[Uploaded] {sName}</span>
                  {isActive && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#c084fc',
                        boxShadow: '0 0 10px #c084fc',
                      }}
                    />
                  )}
                </button>
              );
            })}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scrollTabs('right')}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            color: '#ffffff',
            borderRadius: 10,
            width: 36,
            height: 42,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
          title="Scroll sheet tabs right"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── AUTHENTIC EMBEDDED SHAREPOINT EXCEL SPREADSHEET ── */}
      <div
        id="daily-tracker-printable-area"
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: selectedBatch === '4' ? '2px solid #581c87' : '2px solid #0f4c81',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          fontFamily: "'Aptos Narrow', 'Segoe UI', Calibri, sans-serif",
          color: '#1e293b',
        }}
      >
        {/* Top Header Banner with Copy Shortcut */}
        <div
          style={{
            background: selectedBatch === '4' ? '#581C87' : '#0F4C81',
            color: '#ffffff',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            borderBottom: selectedBatch === '4' ? '2px solid #3b0764' : '2px solid #0a3357',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: 1.1, textTransform: 'uppercase' }}>
              BATCH {selectedBatch} – DAILY ONE-ON-ONE CONNECT TRACKER
            </span>
            <span
              style={{
                fontSize: 11,
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              Sheet: {selectedSheetDate === 'weekly-task-allocation' ? '📋 Weekly Task Allocation (Day 1–5)' : (activePresets[selectedSheetDate]?.name || selectedSheetDate)}
            </span>
          </div>

          <button
            type="button"
            onClick={selectedSheetDate === 'weekly-task-allocation' ? () => {
              navigator.clipboard.writeText(WEEKLY_TASK_ALLOCATION_EMAIL_TEXT);
              toastSuccess('Curriculum Copied', 'Full 5-day React curriculum copied to clipboard.');
            } : copyForSharepoint}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
            title={selectedSheetDate === 'weekly-task-allocation' ? 'Copy full 5-day schedule to clipboard' : 'Copy rows formatted for direct Ctrl+V paste into SharePoint row 13'}
          >
            <Copy size={12} /> {selectedSheetDate === 'weekly-task-allocation' ? 'Copy 5-Day Plan' : 'Copy for SharePoint (Ctrl+V)'}
          </button>
        </div>

          {/* Header Cards: Today Topics & Today Tasks (Dynamic per Sheet) or Weekly Allocation Banner */}
          {selectedSheetDate === 'weekly-task-allocation' ? (
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                color: '#ffffff',
                borderBottom: '2px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8' }}>
                    Batch {selectedBatch} – 5-Day React Weekly Task Allocation
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Day 1 to Day 5 technical syllabus breakdown, practical tasks, mini assignments, and expected outcomes.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    const firstDate = Object.keys(activePresets)[0] || '01-10-2026';
                    handleSelectSheet(firstDate);
                  }}
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  &larr; Back to Daily Sheet
                </button>
              </div>
            </div>
          ) : activePresets[selectedSheetDate] ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
                padding: 16,
                background: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
              }}
            >
              {/* Card 1: Today Topics */}
              <div
                style={{
                  background: '#F0F4F8',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1F4E79' }}>
                    {activePresets[selectedSheetDate].topicsTitle}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSelectSheet('weekly-task-allocation')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                    title="Open full 5-day Weekly Task Allocation"
                  >
                    View Weekly Plan &rarr;
                  </button>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.5, color: '#334155' }}>
                  {activePresets[selectedSheetDate].topicsList.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Today Tasks */}
              <div
                style={{
                  background: '#F0F4F8',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1F4E79' }}>
                    {activePresets[selectedSheetDate].tasksTitle}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const tasks = activePresets[selectedSheetDate].tasksList.join('\n');
                      navigator.clipboard.writeText(tasks);
                      toastSuccess('Tasks Copied', 'Today tasks copied to clipboard for trainees');
                    }}
                    style={{
                      background: 'rgba(31, 78, 121, 0.1)',
                      border: '1px solid rgba(31, 78, 121, 0.25)',
                      borderRadius: 4,
                      color: '#1F4E79',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '2px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    title="Copy tasks for trainees"
                  >
                    <Copy size={11} /> Copy Tasks
                  </button>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.5, color: '#334155' }}>
                  {activePresets[selectedSheetDate].tasksList.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : uploadedWorkbook && uploadedWorkbook.sheets[selectedSheetDate] ? (
            <div
              style={{
                padding: '14px 20px',
                background: '#f5f3ff',
                borderBottom: '2px solid #ddd6fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong style={{ color: '#6b21a8', fontSize: 14 }}>
                  📂 Uploaded Workbook Sheet: {selectedSheetDate}
                </strong>
                <div style={{ fontSize: 12, color: '#7e22ce', marginTop: 2 }}>
                  Source File: {uploadedWorkbook.filename} &bull; Total Rows: {uploadedWorkbook.sheets[selectedSheetDate]?.length || 0}
                </div>
              </div>
            </div>
          ) : null}

          {/* Main In-Place Content (Weekly Task Allocation View OR Uploaded Sheet OR Authentic 13-Column Spreadsheet Table) */}
          <div style={{ overflowX: 'auto', maxHeight: selectedSheetDate === 'weekly-task-allocation' ? 'none' : '650px' }}>
            {selectedSheetDate === 'weekly-task-allocation' ? (
              <div style={{ padding: 20, background: '#0b132b', minHeight: 520 }}>
                <WeeklyScheduleView
                  onSelectDayForTLReport={(dayNum) => {
                    const dateKeys = Object.keys(activePresets);
                    if (dateKeys[dayNum - 1]) {
                      handleSelectSheet(dateKeys[dayNum - 1]);
                      toastInfo('Sheet Switched', `Jumped to Sheet: ${dateKeys[dayNum - 1]} for Day ${dayNum}`);
                    }
                  }}
                />
              </div>
            ) : uploadedWorkbook && uploadedWorkbook.sheets[selectedSheetDate] ? (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 12,
                  fontFamily: "'Aptos Narrow', 'Segoe UI', Calibri, sans-serif",
                }}
              >
                <thead>
                  <tr style={{ background: '#0F4C81', color: '#ffffff' }}>
                    {(uploadedWorkbook.sheets[selectedSheetDate][0] || []).map((colVal: any, colIdx: number) => (
                      <th
                        key={colIdx}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid #163654',
                          fontWeight: 700,
                          fontSize: 12,
                          textAlign: 'left',
                          position: 'sticky',
                          top: 0,
                          background: '#0F4C81',
                          zIndex: 2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {String(colVal ?? `Column ${colIdx + 1}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedWorkbook.sheets[selectedSheetDate].slice(1).map((row: any[], rowIdx: number) => (
                    <tr
                      key={rowIdx}
                      style={{
                        background: rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      {(uploadedWorkbook.sheets[selectedSheetDate][0] || []).map((_: any, cellIdx: number) => (
                        <td
                          key={cellIdx}
                          contentEditable
                          suppressContentEditableWarning
                          style={{
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            fontSize: 12,
                            color: '#1e293b',
                            verticalAlign: 'top',
                            outline: 'none',
                          }}
                        >
                          {String(row[cellIdx] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 12,
                fontFamily: "'Aptos Narrow', 'Segoe UI', Calibri, sans-serif",
              }}
            >
              <thead>
                <tr style={{ background: '#1F4E79', color: '#ffffff' }}>
                  {[
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
                    'Action',
                  ].map((col, idx) => (
                    <th
                      key={col}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #163654',
                        textAlign: idx === 0 || idx === 4 || idx === 7 || idx === 9 || idx === 10 || idx === 13 ? 'center' : 'left',
                        fontWeight: 700,
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: '#1F4E79',
                        zIndex: 2,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editableRows.map((r, i) => (
                  <tr
                    key={r.sNo}
                    style={{
                      background: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    {/* S No */}
                    <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                      {r.sNo}
                    </td>

                    {/* Name */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'name', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit name"
                    >
                      {r.name}
                    </td>

                    {/* Pending Topics */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'pendingTopics', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        color: r.pendingTopics === 'On Leave' ? '#94a3b8' : r.pendingTopics === 'N/A' ? '#166534' : '#b45309',
                        minWidth: 200,
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit pending topics"
                    >
                      {r.pendingTopics}
                    </td>

                    {/* Completed Topics */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'completedTopics', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        minWidth: 220,
                        color: '#334155',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit completed topics"
                    >
                      {r.completedTopics}
                    </td>

                    {/* Task Assign (Toggleable Badge) */}
                    <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(r.sNo, 'taskAssign')}
                        title="Click to toggle Yes / No / On Leave"
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: r.taskAssign === 'Yes' ? '#dcfce7' : r.taskAssign === 'No' ? '#fee2e2' : '#fef3c7',
                          color: r.taskAssign === 'Yes' ? '#166534' : r.taskAssign === 'No' ? '#991b1b' : '#92400e',
                        }}
                      >
                        {r.taskAssign}
                      </button>
                    </td>

                    {/* Doubts */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'doubts', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        color: r.doubts && r.doubts !== 'No Blockers Reported' && r.doubts !== 'On Leave' ? '#b45309' : '#64748b',
                        outline: 'none',
                        cursor: 'text',
                        minWidth: 160,
                      }}
                      title="Click to edit doubts"
                    >
                      {r.doubts}
                    </td>

                    {/* Discussion Summary */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'discussionSummary', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        minWidth: 240,
                        color: '#334155',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit discussion summary"
                    >
                      {r.discussionSummary}
                    </td>

                    {/* GitHub Push Status (Toggleable Badge) */}
                    <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(r.sNo, 'githubPushStatus')}
                        title="Click to toggle Yes / No / On Leave"
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: r.githubPushStatus === 'Yes' ? '#dcfce7' : r.githubPushStatus === 'No' ? '#fee2e2' : '#fef3c7',
                          color: r.githubPushStatus === 'Yes' ? '#166534' : r.githubPushStatus === 'No' ? '#991b1b' : '#92400e',
                        }}
                      >
                        {r.githubPushStatus}
                      </button>
                    </td>

                    {/* Email Review Status */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'emailReviewStatus', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        minWidth: 200,
                        color: '#334155',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit email review status"
                    >
                      {r.emailReviewStatus}
                    </td>

                    {/* Standup Participation */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'standupParticipation', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit standup participation"
                    >
                      {r.standupParticipation}
                    </td>

                    {/* Standup Rating */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'standupRating', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit standup rating"
                    >
                      {r.standupRating}
                    </td>

                    {/* Standup Remarks */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'standupRemarks', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        outline: 'none',
                        cursor: 'text',
                        minWidth: 180,
                      }}
                      title="Click to edit standup remarks"
                    >
                      {r.standupRemarks}
                    </td>

                    {/* Self-Project Status */}
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(r.sNo, 'selfProjectStatus', e.currentTarget.textContent || '')}
                      style={{
                        padding: '8px 10px',
                        border: '1px solid #e2e8f0',
                        minWidth: 160,
                        color: '#334155',
                        outline: 'none',
                        cursor: 'text',
                      }}
                      title="Click to edit self project status"
                    >
                      {r.selfProjectStatus}
                    </td>

                    {/* Action Column: Notice & Delete */}
                    <td style={{ padding: '8px 6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTraineeForAttendanceNotice({
                            traineeName: r.name,
                            traineeEmail: (r as any).email || `${r.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@nybinfotech.com`,
                            batchNumber: selectedBatch,
                          })
                        }
                        title={`Draft 9:00 AM Absence & Login Clarification Notice for ${r.name}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#f59e0b',
                          padding: 4,
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 4,
                        }}
                      >
                        <Clock size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRow(r.sNo)}
                        title={`Delete ${r.name} from spreadsheet`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          padding: 4,
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}

            {!uploadedWorkbook && selectedSheetDate !== 'weekly-task-allocation' && editableRows.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
                <FileSpreadsheet size={28} color="#0f4c81" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 14 }}>No trainee rows in spreadsheet.</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Click &ldquo;Add Trainee Row&rdquo; above to begin tracking.</div>
              </div>
            )}
          </div>

          {/* Clean Excel Grid Telemetry Footer */}
          <div
            style={{
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span>📊 <strong>{editableRows.length}</strong> Trainees</span>
              <span>&bull;</span>
              <span style={{ color: '#16a34a' }}>✓ <strong>{editableRows.filter((r) => r.githubPushStatus === 'Yes').length}</strong> Pushed GitHub</span>
              <span>&bull;</span>
              <span style={{ color: '#0284c7' }}>✓ <strong>{editableRows.filter((r) => r.taskAssign === 'Yes').length}</strong> Tasks Assigned</span>
              <span>&bull;</span>
              <span style={{ color: '#d97706' }}>⏸ <strong>{editableRows.filter((r) => r.pendingTopics === 'On Leave').length}</strong> On Leave</span>
            </div>

            <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
              💡 Real-time in-place editing &bull; click any cell or badge to update
            </div>
          </div>

          {/* Elegant Protocol Footer Bar */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 20px',
              fontSize: 12,
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <ShieldCheck size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#f1f5f9' }}>Attendance &amp; Verification Protocol:</strong> Daily standup attendance is mandatory. Verified trainee reports are evaluated and synchronized with the authentic master Excel workbook automatically.
            </div>
          </div>
        </div>

      {/* ── MODAL 1: INTERACTIVE 'TEST ANY EMAIL' INGESTION COCKPIT ── */}
      {showIngestModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 6, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'modalFadeIn 0.2s ease forwards',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !syncing) setShowIngestModal(false);
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: 780,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              border: '1px solid rgba(139, 92, 246, 0.35)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(139, 92, 246, 0.2)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--violet-light)',
                    }}
                  >
                    <Bot size={16} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>
                    Gemini 2.5 Flash Trainee Email Ingestion
                  </h3>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Paste any trainee daily update email to test Gemini&apos;s task parser, discrepancy detection, and 0-100 scoring.
                </p>
              </div>

              <button
                type="button"
                onClick={() => !syncing && setShowIngestModal(false)}
                disabled={syncing}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  borderRadius: 8,
                  padding: 6,
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Preset Selector Buttons */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, display: 'block' }}>
                Quick Test Scenarios (Click to Load Preset):
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {EMAIL_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="btn btn-sm"
                    style={{
                      fontSize: 11,
                      padding: '6px 12px',
                      background: activePresetId === p.id ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${activePresetId === p.id ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255,255,255,0.08)'}`,
                      color: activePresetId === p.id ? '#c084fc' : '#94a3b8',
                      fontWeight: activePresetId === p.id ? 700 : 500,
                    }}
                  >
                    {activePresetId === p.id && <Check size={12} />} {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Trainee Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div className="form-group">
                <label className="label">Trainee Name</label>
                <input
                  className="input"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    setActivePresetId('custom');
                  }}
                  placeholder="e.g. Sana Sulthana"
                />
              </div>
              <div className="form-group">
                <label className="label">Trainee Work Email</label>
                <input
                  className="input"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => {
                    setSenderEmail(e.target.value);
                    setActivePresetId('custom');
                  }}
                  placeholder="trainee@nybinfotech.com"
                />
              </div>
            </div>

            {/* Email Body Textarea */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="label" style={{ margin: 0 }}>Raw Daily Status Email Body</label>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emailContent.length} characters</span>
              </div>
              <textarea
                className="input"
                rows={9}
                value={emailContent}
                onChange={(e) => {
                  setEmailContent(e.target.value);
                  setActivePresetId('custom');
                }}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 12,
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
                placeholder="Paste the daily status email sent by the trainee..."
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analyzedResult ? 20 : 0 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} color="var(--violet-light)" /> Uses Gemini 2.5 Flash model
              </span>

              <button
                type="button"
                onClick={handleAISync}
                disabled={syncing}
                className="btn btn-primary"
                style={{
                  background: syncing ? 'rgba(139, 92, 246, 0.4)' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {syncing ? (
                  <>
                    <div className="spinner" style={{ width: 14, height: 14 }} /> Gemini 2.5 Evaluating...
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Run Gemini Evaluation
                  </>
                )}
              </button>
            </div>

            {/* Result Preview Panel (Appears after Gemini evaluation) */}
            {analyzedResult && analyzedResult.data && (
              <div
                style={{
                  marginTop: 20,
                  padding: 20,
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  animation: 'toastSlideIn 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        background:
                          analyzedResult.data.performanceScore >= 80
                            ? 'rgba(16,185,129,0.2)'
                            : analyzedResult.data.performanceScore >= 50
                            ? 'rgba(245,158,11,0.2)'
                            : 'rgba(225,29,72,0.2)',
                        border: `1px solid ${
                          analyzedResult.data.performanceScore >= 80
                            ? 'rgba(16,185,129,0.4)'
                            : analyzedResult.data.performanceScore >= 50
                            ? 'rgba(245,158,11,0.4)'
                            : 'rgba(225,29,72,0.4)'
                        }`,
                        color:
                          analyzedResult.data.performanceScore >= 80
                            ? '#34d399'
                            : analyzedResult.data.performanceScore >= 50
                            ? '#fbbf24'
                            : '#fb7185',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      {analyzedResult.data.performanceScore}/100
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                        {senderName} &bull; Assessment Complete
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Status: {analyzedResult.data.mistakesFound ? '⚠️ Discrepancy Found' : '✅ Verified'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: 'var(--violet-light)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    Saved to MongoDB
                  </span>
                </div>

                {/* Score Reasoning */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.3)',
                    borderLeft: '3px solid var(--violet)',
                    fontSize: 13,
                    color: '#e2e8f0',
                    marginBottom: 12,
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{analyzedResult.data.scoreReasoning}&rdquo;
                </div>

                {/* Detected Mistakes or Blockers Banner */}
                {analyzedResult.data.mistakesFound && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: 10,
                      borderRadius: 8,
                      background: 'rgba(225, 29, 72, 0.15)',
                      border: '1px solid rgba(225, 29, 72, 0.3)',
                      color: '#fca5a5',
                      fontSize: 12,
                      marginBottom: 12,
                    }}
                  >
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <strong>Discrepancy Detected by AI:</strong> {analyzedResult.data.mistakesFound}
                    </div>
                  </div>
                )}

                {/* Auto Reply Notice */}
                {analyzedResult.autoReplyMessage && (
                  <div style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 6 }}>
                    <strong>Automated Trainee Feedback Prepared:</strong>
                    <pre style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: '#cbd5e1' }}>
                      {analyzedResult.autoReplyMessage}
                    </pre>
                  </div>
                )}

                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowIngestModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Done & View in Table
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* ── MODAL 3: GMAIL & OUTLOOK EMAIL DISPATCHER WITH ATTACHED EXCEL ── */}
      {showEmailModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 6, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'modalFadeIn 0.2s ease forwards',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !emailSending) setShowEmailModal(false);
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: 760,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.2)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--emerald-light)',
                    }}
                  >
                    <Mail size={17} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>
                    Email Report with Attached Excel (.xlsx)
                  </h3>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Deliver the official SharePoint status workbook directly to Gmail or Outlook with real file attachments.
                </p>
              </div>

              <button
                type="button"
                onClick={() => !emailSending && setShowEmailModal(false)}
                disabled={emailSending}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  borderRadius: 8,
                  padding: 6,
                  cursor: emailSending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Explanatory Notice */}
            <div
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(15, 76, 129, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: 12,
                color: '#bae6fd',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Paperclip size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Attachment Capability:</strong> In web browsers, Gmail &amp; Outlook web links cannot attach local computer files. Here, NexusTrack attaches the real <code>Technical Team batch-3_Daily_Status_Report.xlsx</code> directly via Gmail SMTP!
              </div>
            </div>

            {/* Quick Recipient Presets */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
                Quick Recipient Selector:
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'My Email (Pathan Nafisa Khanam)', email: 'nafisakhanampathan65@gmail.com' },
                  { label: 'Pathan Nafisa (Gmail)', email: 'pathan.nafisakhanam@gmail.com' },
                  { label: 'Althaf Syed', email: 'althaf.syed@nybinfotech.com' },
                  { label: 'Chandra Shekar', email: 'chandra.shekar@nybinfotech.com' },
                ].map((rec) => (
                  <button
                    key={rec.email}
                    type="button"
                    onClick={() => setEmailRecipient(rec.email)}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: emailRecipient === rec.email ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${emailRecipient === rec.email ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255,255,255,0.1)'}`,
                      color: emailRecipient === rec.email ? '#34d399' : '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    + {rec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Recipient & Subject */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div className="form-group">
                <label className="label">Recipient Email Address (To:)</label>
                <input
                  className="input"
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="form-group">
                <label className="label">Subject Line</label>
                <input
                  className="input"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email Subject"
                />
              </div>
            </div>

            {/* ── ATTACHMENT CARD (GMAIL & OUTLOOK STYLE) ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="label" style={{ marginBottom: 6 }}>
                📎 Attached Documents (Ready for Dispatch)
              </label>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Primary Excel Attachment */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(16, 124, 65, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: '#107c41',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 10,
                      }}
                    >
                      XLSX
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                        Technical Team batch-3_Daily_Status_Report.xlsx
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        9.6 KB &bull; Microsoft Excel Spreadsheet &bull; Sheet: {selectedSheetDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 8,
                        background: 'rgba(16, 185, 129, 0.25)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      ✓ Attached
                    </span>
                    <button
                      type="button"
                      onClick={downloadSharepointReport}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11, padding: '3px 8px' }}
                      title="Download a copy"
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                </div>

                {/* Extra Attachments uploaded by user */}
                {extraAttachments.map((att, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Paperclip size={14} color="var(--cyan-light)" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{att.filename}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExtraAttachment(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--rose)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Remove attachment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* Attach More Files Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 4 }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--emerald-light)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px dashed rgba(16, 185, 129, 0.4)',
                      padding: '5px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Paperclip size={12} />
                    <span>+ Attach Another File (.xlsx, .zip, .pdf, .png)</span>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleCustomFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Email Body Textarea */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="label" style={{ margin: 0 }}>Message Body</label>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Preloaded with report details</span>
              </div>
              <textarea
                className="input"
                rows={6}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 12,
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 16,
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={openGmailWebWithDownload}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, gap: 5 }}
                  title="Downloads Excel and opens Gmail compose so you can drag-and-drop it"
                >
                  <span>📧 Gmail Web (+ Auto-Download)</span>
                </button>
                <button
                  type="button"
                  onClick={openOutlookWebWithDownload}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, gap: 5 }}
                  title="Downloads Excel and opens Outlook compose so you can drag-and-drop it"
                >
                  <span>✉️ Outlook Web (+ Auto-Download)</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailSending}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendEmailWithExcel}
                  disabled={emailSending}
                  className="btn btn-primary"
                  style={{
                    background: emailSending ? 'rgba(16, 185, 129, 0.4)' : 'linear-gradient(135deg, #10b981, #0f4c81)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {emailSending ? (
                    <>
                      <div className="spinner" style={{ width: 14, height: 14 }} /> Sending with Excel Attached...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Email with Excel Attached
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Lead Consolidated Daily Report Modal (Exact User Template with Attached Excel) */}
      <TLDailyReportModal
        isOpen={showTLReportModal}
        onClose={() => setShowTLReportModal(false)}
        sheetDate={selectedSheetDate}
        batchNumber={selectedBatch}
        rows={editableRows}
      />

      {/* Security Credentials & Excel Password Modal */}
      <CredentialsSettingsModal
        isOpen={showCredsModal}
        onClose={() => setShowCredsModal(false)}
      />

      {/* Missing Trainees Reminder Nudge Modal */}
      <MissingTraineesModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        batchNumber={selectedBatch}
        sheetDate={selectedSheetDate}
        allTrainees={editableRows.map(r => ({
          name: r.name,
          email: (r as any).email || `${r.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@nybinfotech.com`,
          status: r.completedTopics,
        }))}
        submittedNames={editableRows
          .filter(r => r.completedTopics === 'Yes' || r.completedTopics === 'Completed' || (r.completedTopics && r.completedTopics.length > 5))
          .map(r => r.name)}
      />

      {/* GitHub Commit Validator Modal */}
      <GithubCommitValidatorModal
        isOpen={Boolean(selectedGhTrainee)}
        onClose={() => setSelectedGhTrainee(null)}
        defaultUsername={selectedGhTrainee?.username || 'PathanNafisa'}
        defaultRepoName={selectedGhTrainee?.repo || 'nexus-trainee-frontend'}
        defaultDate={new Date().toISOString().split('T')[0]}
        syllabusTopic="CSS Flexbox, Grid, Responsive Dashboard, React Hooks"
      />

      {/* 9:00 AM Absence & Login Notice Modal */}
      <TraineeAbsenceNoticeModal
        isOpen={Boolean(selectedTraineeForAttendanceNotice)}
        onClose={() => setSelectedTraineeForAttendanceNotice(null)}
        trainee={selectedTraineeForAttendanceNotice}
        date={selectedSheetDate}
      />
    </div>
  );
}