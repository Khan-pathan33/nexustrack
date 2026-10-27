const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const EXCEL_PATH = path.join(PROJECT_ROOT, 'Technical Team batch-3_Daily_Status_Report.xlsx');
const DESKTOP_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Desktop');

async function syncDay1Data() {
  console.log('1. Loading workbook:', EXCEL_PATH);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);

  const sheetName = '26-10-2026';
  let ws = wb.getWorksheet(sheetName);
  if (!ws) {
    ws = wb.addWorksheet(sheetName);
  }

  // Set column widths
  const colWidths = [8, 24, 38, 44, 13, 22, 44, 15, 44, 16, 12, 26, 28];
  colWidths.forEach((w, idx) => {
    ws.getColumn(idx + 1).width = w;
  });

  // Row 1 spacer
  ws.getRow(1).height = 14;

  // Row 2: "Today Topics" in A2, "Today Tasks" in B2
  const r2 = ws.getRow(2);
  r2.values = ['Today Topics', 'Today Tasks'];
  r2.height = 24;
  for (let c = 1; c <= 13; c++) {
    const cell = r2.getCell(c);
    if (c === 1 || c === 2) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' },
      };
      cell.font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.value = null;
    }
  }

  // Row 3: Multiline Topics in A3, Multiline Tasks in B3
  const day1Topics = `React Fundamentals & JSX

Topics Covered
• Introduction to React
• Why React is used
• React Features
• React Project Structure
• React Application Setup (Vite)
• Components & Functional Components
• JSX (JavaScript XML) Syntax & Rules
• Valid and Invalid JSX
• Fragments (<></>) & Strict Mode
• Rendering Components & Calling Functions`;

  const day1Tasks = `Assigned Tasks
• Create a React project from scratch using Vite.
• Understand the complete React project structure.
• Create multiple functional components.
• Practice JSX syntax & expressions.
• Identify valid and invalid JSX.
• Use Fragments where required.
• Understand Strict Mode.
• Create reusable basic components.

Mini Assignment: React Profile Page
• Create a simple React Profile Page using reusable functional components:
  - Header (branding, nav links)
  - Profile (photo, bio, contact info)
  - Skills (tech stack listing)
  - Education (academic timeline)
  - Footer (social links, copyright)`;

  const r3 = ws.getRow(3);
  r3.values = [day1Topics, day1Tasks];
  r3.height = 260;
  for (let c = 1; c <= 13; c++) {
    const cell = r3.getCell(c);
    if (c === 1 || c === 2) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' },
      };
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    } else {
      cell.value = null;
    }
  }

  // Row 4: Table Headers
  const r4 = ws.getRow(4);
  r4.values = [
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
  r4.height = 28;
  for (let c = 1; c <= 13; c++) {
    const cell = r4.getCell(c);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2F5597' },
    };
    cell.font = { name: 'Aptos Narrow', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    };
  }

  // Trainee rows for Day 1
  const day1Rows = [
    {
      sNo: 1,
      name: 'Althaf Syed',
      pendingTopics: 'Pending: React Profile Page mini assignment review.',
      completedTopics: 'Yes - Completed React setup, project structure, functional components, JSX syntax, rules, and Fragments.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React fundamentals and assigned exercises. Guided on reusable functional components and React Profile Page structure.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Complete React fundamentals; add Profile Page components.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Good stand-up participation.',
      selfProjectStatus: 'Sunray Hospital website',
    },
    {
      sNo: 2,
      name: 'Bala Krishna Parimi',
      pendingTopics: 'Pending: JSX expressions practice and React Profile Page mini assignment.',
      completedTopics: 'Partial - Completed React setup, functional components, and basic JSX concepts.',
      taskAssign: 'Yes',
      doubts: 'Needs clarification on JSX syntax rules and Expressions.',
      discussionSummary: 'Guided on JSX syntax rules, Expressions inside JSX, and component hierarchy.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Practice JSX expressions and submit Profile Page mini assignment.',
      standupParticipation: 'Participated',
      standupRating: 'Average',
      standupRemarks: 'Needs hands-on practice.',
      selfProjectStatus: 'N/A',
    },
    {
      sNo: 3,
      name: 'Chandra Shekar K',
      pendingTopics: 'N/A',
      completedTopics: 'Yes - Completed all React fundamentals, functional components, JSX rules, and Profile Page.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React fundamentals, Vite setup, JSX, Fragments, Strict Mode, and React Profile Page. Also continued Employee Management System.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Solid implementation across all fundamentals and components.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Consistent high performer.',
      selfProjectStatus: 'Employee Management System: worked on functional dashboard pages.',
    },
    {
      sNo: 4,
      name: 'Chevva Vinay Kumar',
      pendingTopics: 'N/A',
      completedTopics: 'Yes - Completed React fundamentals, functional components, JSX, and Profile Page.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React project structure, functional components, JSX syntax, and React Profile Page practical.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Clean component architecture and valid JSX.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Good progress.',
      selfProjectStatus: 'N/A',
    },
    {
      sNo: 5,
      name: 'Girish C',
      pendingTopics: 'Pending: React Profile Page mini assignment.',
      completedTopics: 'Partial - Completed React setup, project structure, functional components, and basic JSX.',
      taskAssign: 'Yes',
      doubts: 'Needs guidance on Fragments and component export/import.',
      discussionSummary: 'Practiced functional components and JSX rules. Working on Profile Page components.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Complete React Profile Page mini assignment.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Active participation.',
      selfProjectStatus: 'N/A',
    },
    {
      sNo: 6,
      name: 'Jayakrishna Madicharla',
      pendingTopics: 'Pending: Complete React Profile Page mini assignment.',
      completedTopics: 'Partial - Completed React setup, functional components, and JSX practice.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React setup and functional components. Guided on Profile Page header and card components.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Submit React Profile Page practical.',
      standupParticipation: 'Participated',
      standupRating: 'Average',
      standupRemarks: 'Working on completion.',
      selfProjectStatus: 'N/A',
    },
    {
      sNo: 7,
      name: 'Sana Sulthana',
      pendingTopics: 'N/A',
      completedTopics: 'Yes - Completed all React fundamentals, functional components, JSX rules, and Profile Page.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React fundamentals, Vite project structure, functional components, JSX expressions, Fragments, and React Profile Page.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Top-tier component structure and clean styling.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Top performer.',
      selfProjectStatus: 'N/A',
    },
    {
      sNo: 8,
      name: 'Tejaswar Rao',
      pendingTopics: 'N/A',
      completedTopics: 'Yes - Completed React fundamentals, functional components, JSX rules, and Profile Page.',
      taskAssign: 'Yes',
      doubts: 'No Blockers Reported',
      discussionSummary: 'Completed React setup, JSX practice, and basic functional components.',
      githubPushStatus: 'Yes',
      emailReviewStatus: 'Reviewed. Good progress on Day 1 syllabus.',
      standupParticipation: 'Participated',
      standupRating: 'Good',
      standupRemarks: 'Good performance.',
      selfProjectStatus: 'N/A',
    },
  ];

  day1Rows.forEach((r, idx) => {
    const rowNum = 5 + idx;
    const row = ws.getRow(rowNum);
    row.values = [
      r.sNo,
      r.name,
      r.pendingTopics,
      r.completedTopics,
      r.taskAssign,
      r.doubts,
      r.discussionSummary,
      r.githubPushStatus,
      r.emailReviewStatus,
      r.standupParticipation,
      r.standupRating,
      r.standupRemarks,
      r.selfProjectStatus,
    ];
    row.height = 42;

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
      cell.alignment = {
        vertical: 'top',
        horizontal: c === 1 || c === 4 || c === 5 || c === 8 || c === 10 || c === 11 ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    }
  });

  // Clear any leftover rows below row 12
  for (let r = 13; r <= 30; r++) {
    const leftover = ws.getRow(r);
    if (leftover) leftover.values = [];
  }

  await wb.xlsx.writeFile(EXCEL_PATH);
  console.log('2. Excel updated at:', EXCEL_PATH);

  // Copy to Desktop
  const desktopExcel = path.join(DESKTOP_PATH, 'Technical Team batch-3_Daily_Status_Report.xlsx');
  fs.copyFileSync(EXCEL_PATH, desktopExcel);
  console.log('3. Mirrored to Desktop:', desktopExcel);

  // Build Day 1 HTML Report
  const plannedTasks = [
    'Connect with all Batch-3 trainees individually through one-on-one discussions.',
    "Review today's React topics covering React Fundamentals, Vite project setup, project structure, functional components, JSX, JSX rules, JavaScript expressions, Fragments, Strict Mode, component rendering, and reusable components.",
    'Review assigned tasks involving Vite project creation, project structure understanding, reusable functional components, JSX practice, and Expressions in JSX.',
    'Review the React Profile Page mini assignment requirements, including Header, Profile, Skills, Education, and Footer functional components.',
    "Verify completion of today's React topics, assigned tasks, and the React Profile Page mini assignment based on the trainees' reported implementation evidence.",
    'Review trainee implementations and identify completed, partially completed, and pending tasks.',
    'Verify GitHub repository updates and code push status.',
    'Review daily email submissions and provide feedback on incomplete or inconsistent progress reports.',
    'Collect information regarding completed topics, pending topics, doubts, assigned task status, GitHub push status, and self-project progress.',
    'Conduct the daily standup call with Batch-3 trainees.',
  ];

  const completedTasks = [
    "Reviewed today's React curriculum covering React Fundamentals, Vite setup, project structure, functional components, JSX rules, Fragments, and reusable components.",
    'Conducted individual progress reviews for Batch-3 trainees based on their reported topic completion, assigned tasks, practical implementations, and email submissions.',
    'Reviewed trainee progress on reusable functional components, JSX syntax, and the React Profile Page mini assignment.',
    'Reviewed GitHub push status and daily email submissions for the trainees.',
    'Reviewed self-project progress separately from the assigned React mini assignment: Chandra Shekar K reported progress on Employee Management System (functional dashboard pages); Althaf Syed reported progress on Sunray Hospital website.',
    'Conducted the daily standup call with Batch-3 trainees.',
  ];

  const pendingTasks = 'Bala Krishna Parimi: JSX expressions practice and React Profile Page mini assignment; Girish C: React Profile Page mini assignment; Jayakrishna Madicharla: Complete React Profile Page mini assignment.';

  const nextDayTasks = [
    'Connect with Batch 3 technical group.',
    'Conduct the daily standup call with Batch-3 trainees.',
    'Conduct one-on-one discussions with Batch-3 trainees.',
    "Review next day's React curriculum (Props, State & Component Communication) covering useState, Parent-Child Data Flow, Props destructuring, callback functions, component hierarchy, and the Product Management UI mini assignment.",
    'Follow up with trainees who have pending React implementations and Profile Page mini assignments.',
    'Verify completion of Props, State, and component communication through practical implementation evidence.',
    'Review updated GitHub repositories and daily email submissions.',
  ];

  const renderList = (items) =>
    `<ul style="margin: 6px 0 0 20px; padding: 0; list-style-type: disc;">${items
      .map((item) => `<li style="margin-bottom: 5px; line-height: 1.5; color: #000000;">${item}</li>`)
      .join('')}</ul>`;

  const htmlContent = `Hi Varaprasad Sir and Vineetha Mam,

Good Evening,

Please find below the task summary for today:

<table style="border-collapse: collapse; width: 100%; border: 1.5px solid #000000; font-family: Calibri, Arial, sans-serif; font-size: 13px; color: #000000; margin: 16px 0 24px 0;" border="1" cellpadding="0" cellspacing="0">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #000000; padding: 8px 12px; width: 28%; text-align: center; font-weight: bold; font-size: 13px; color: #000000;">Technology</th>
      <th style="border: 1px solid #000000; padding: 8px 12px; width: 72%; text-align: center; font-weight: bold; font-size: 13px; color: #000000;">Web Development</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Planned Tasks (Today)</td>
      <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
        <strong style="color: #000000;">1.Batch-3:-</strong>
        ${renderList(plannedTasks)}
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Completed Tasks (Today)</td>
      <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
        <strong style="color: #000000;">1.Batch-3:-</strong>
        ${renderList(completedTasks)}
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #000000; padding: 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Pending Tasks (Today)</td>
      <td style="border: 1px solid #000000; padding: 12px; text-align: left; vertical-align: middle; color: #000000;">${pendingTasks}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000000; padding: 14px 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Planned Tasks (Next Day)</td>
      <td style="border: 1px solid #000000; padding: 14px 16px; vertical-align: top; text-align: left; color: #000000;">
        <strong style="color: #000000;">1.Batch-3:-</strong>
        ${renderList(nextDayTasks)}
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #000000; padding: 12px; font-weight: bold; text-align: center; vertical-align: middle; color: #000000;">Challenges / Blockers if any</td>
      <td style="border: 1px solid #000000; padding: 12px; text-align: center; vertical-align: middle; color: #000000;">N/A</td>
    </tr>
  </tbody>
</table>

I have attached the work progress files for your reference.

<div style="margin-top: 22px; font-size: 13.5px; line-height: 1.45; color: #000000; font-family: Calibri, Arial, sans-serif;">
  <div>Thanks &amp; Regards,</div>
  <div style="font-weight: bold; margin-top: 3px; color: #000000;">Pathan Nafisa Khanam</div>
  <div>Junior Developer</div>
  <div><a href="mailto:nafisa.khanam@nybinfotech.com" style="color: #0078d4; text-decoration: none;">nafisa.khanam@nybinfotech.com</a></div>
  <div><a href="https://www.linkedin.com/in/pathan-nafisa-khanam" target="_blank" style="color: #0078d4; text-decoration: underline;">LinkedIn: Pathan Nafisa Khanam</a></div>
  <div>NYBInfotech</div>
</div>

<div style="margin-top: 16px;">
  <div style="font-size: 21px; font-weight: 800; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: -0.5px; color: #1e3a8a;">
    NavayuvaBharat <span style="color: #f97316; font-size: 15px; font-weight: 800;">INFOTECH</span>
  </div>
  <div style="font-size: 9.5px; color: #64748b; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase;">
    WHERE IT MEETS INGENUITY
  </div>
</div>`;

  // Write report.html
  const reportHtmlPath = path.join(PROJECT_ROOT, 'scripts', 'report.html');
  fs.writeFileSync(reportHtmlPath, htmlContent, 'utf8');
  console.log('4. Day 1 report HTML saved to:', reportHtmlPath);

  // Write Status_Report_26-10-2026.eml on Desktop
  const excelBase64 = fs.readFileSync(desktopExcel).toString('base64');
  const boundary = `----=_Part_${Date.now()}`;
  const emlContent = [
    'X-Unsent: 1',
    'From: "Pathan Nafisa Khanam" <nafisa.khanam@nybinfotech.com>',
    'To: varaprasad.vellanki@nybinfotech.com, vineetha.sunil@nybinfotech.com',
    'Cc: chandramohan.reddy@nybinfotech.com, sushma.pedapudi@nybinfotech.com',
    'Subject: Status_Report_26-10-2026:',
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    htmlContent,
    '',
    `--${boundary}`,
    'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="Technical Team batch-3_Daily_Status_Report.xlsx"',
    'Content-Transfer-Encoding: base64',
    'Content-Disposition: attachment; filename="Technical Team batch-3_Daily_Status_Report.xlsx"',
    '',
    excelBase64,
    '',
    `--${boundary}--`,
    '',
  ].join('\r\n');

  const emlPath = path.join(DESKTOP_PATH, 'Status_Report_26-10-2026.eml');
  fs.writeFileSync(emlPath, emlContent, 'utf8');
  console.log('5. Desktop .eml draft refreshed:', emlPath);

  // Copy to Windows Clipboard (CF_HTML format)
  const psScriptPath = path.join(__dirname, 'copy_day1_clipboard.ps1');
  const psScript = `
Add-Type -AssemblyName System.Windows.Forms
$html = Get-Content -Path "${reportHtmlPath.replace(/\\/g, '\\\\')}" -Raw -Encoding UTF8

$prefix = @"
Version:0.9
StartHTML:<<<<<<<<1
EndHTML:<<<<<<<<2
StartFragment:<<<<<<<<3
EndFragment:<<<<<<<<4
<html><body>
<!--StartFragment-->
"@

$suffix = @"
<!--EndFragment-->
</body></html>
"@

$combined = $prefix + $html + $suffix
$bytes = [System.Text.Encoding]::UTF8.GetBytes($combined)
$len = $bytes.Length

$sHTML = 105
$eHTML = $len
$sFrag = [System.Text.Encoding]::UTF8.GetBytes($prefix).Length
$eFrag = $sFrag + [System.Text.Encoding]::UTF8.GetBytes($html).Length

$p1 = $sHTML.ToString("D8")
$p2 = $eHTML.ToString("D8")
$p3 = $sFrag.ToString("D8")
$p4 = $eFrag.ToString("D8")

$header = @"
Version:0.9
StartHTML:$p1
EndHTML:$p2
StartFragment:$p3
EndFragment:$p4
<html><body>
<!--StartFragment-->
"@

$fullHtmlClipboard = $header + $html + $suffix

$dataObj = New-Object System.Windows.Forms.DataObject
$dataObj.SetData([System.Windows.Forms.DataFormats]::Html, $fullHtmlClipboard)
$plainText = @"
Hi Varaprasad Sir and Vineetha Mam,

Good Evening,

Please find below the task summary for today:
Technology: Web Development
Planned Tasks (Today): Day 1 React Fundamentals & JSX
Pending Tasks (Today): Bala Krishna Parimi, Girish C, Jayakrishna Madicharla (React Profile Page mini assignment)
Planned Tasks (Next Day): Day 2 Props, State & Component Communication
Challenges / Blockers: N/A
"@
$dataObj.SetData([System.Windows.Forms.DataFormats]::UnicodeText, $plainText)
[System.Windows.Forms.Clipboard]::SetDataObject($dataObj, $true)
Write-Host "CF_HTML Clipboard populated successfully!"
`;

  fs.writeFileSync(psScriptPath, psScript, 'utf8');
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`, { stdio: 'inherit' });
    console.log('6. Windows Clipboard successfully updated with Day 1 Rich HTML table!');
  } catch (clipErr) {
    console.warn('Clipboard notice:', clipErr.message);
  }
}

syncDay1Data().catch(console.error);
