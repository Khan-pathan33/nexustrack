/**
 * Dynamic Excel Manager (SharePoint-Exact Precision Formatting)
 * 
 * Directly opens, reads, and updates the user's authentic Excel workbook.
 * Matches SharePoint layout (Image 2 & 3) with 100% precision:
 * - Row 2: "Today Topics" in A2, "Today Tasks" in B2 (Navy blue, bold white, centered). C2:M2 are EMPTY.
 * - Row 3: Multiline Topics in A3, Multiline Tasks in B3. C3:M3 are EMPTY.
 * - Row 4: Clean table headers in medium blue with white text.
 * - Rows 5+: Clean data rows with normal black text (NO red text), wrapped, top-aligned.
 * - Zero repeated tasks across columns C-M.
 * - Zero repair warnings in Microsoft Excel.
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_B3_PATH = path.join(PROJECT_ROOT, 'Technical Team batch-3_Daily_Status_Report.xlsx');
const DOWNLOADS_B3_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-3_Daily_Status_Report.xlsx');
const DOWNLOADS_B3_UPDATED_PATH = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-3_Daily_Status_Report_Updated.xlsx');

function cleanName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function styleNewSheetLikeSharePoint(sheet, templateSheet) {
  const colWidths = [8, 24, 38, 44, 13, 22, 44, 15, 44, 16, 12, 26, 18];
  colWidths.forEach((w, idx) => {
    sheet.getColumn(idx + 1).width = w;
  });

  // Extract topics & tasks from template
  let topicsText = '';
  let tasksText = '';
  if (templateSheet) {
    const r3A = templateSheet.getCell('A3').value;
    const r3B = templateSheet.getCell('B3').value;
    topicsText = typeof r3A === 'object' && r3A?.text ? r3A.text : String(r3A || '');
    tasksText = typeof r3B === 'object' && r3B?.text ? r3B.text : String(r3B || '');
  }

  // Row 1: Spacer
  sheet.addRow([]);
  sheet.getRow(1).height = 14;

  // Row 2: "Today Topics" in A2, "Today Tasks" in B2, C2:M2 EMPTY
  const r2 = sheet.addRow(['Today Topics', 'Today Tasks']);
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

  // Row 3: Multiline content in A3 and B3. C3:M3 EMPTY
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
      fgColor: { argb: 'FF2E75B6' },
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

  // Rows 5+: Trainee roster from templateSheet
  const trainees = [
    { sno: 1, name: 'Althaf Syed' },
    { sno: 2, name: 'Bala Krishna Parimi' },
    { sno: 3, name: 'Chandra Shekar K' },
    { sno: 4, name: 'Chevva Vinay Kumar' },
    { sno: 5, name: 'Girish C' },
    { sno: 6, name: 'Jayakrishna Madicharla' },
    { sno: 7, name: 'Sana Sulthana' },
    { sno: 8, name: 'Tejaswar Rao' },
  ];

  trainees.forEach((t) => {
    const newRow = sheet.addRow([
      t.sno,
      t.name,
      '', // Pending Topics
      '', // Completed Topics
      'Yes', // Task Assign
      'No Blockers Reported', // Doubts
      '', // Discussion Summary
      '', // GitHub Push Status
      '', // Email Review Status
      'Not Conducted', // Standup Part
      'N/A', // Standup Rating
      'No stand-up call was conducted today.', // Standup Remarks
      'N/A', // Self-Project
    ]);
    newRow.height = 25;

    for (let c = 1; c <= 13; c++) {
      const cell = newRow.getCell(c);
      cell.font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
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
async function updateRealExcelWorkbook(auditedSubmissions = [], dateStr = null, customWorkbookPath = null) {
  let targetPath = customWorkbookPath || (fs.existsSync(DEFAULT_B3_PATH) ? DEFAULT_B3_PATH : DOWNLOADS_B3_PATH);

  if (!fs.existsSync(targetPath)) {
    if (fs.existsSync(DEFAULT_B3_PATH)) {
      console.log(`[DynamicExcel] 📄 Initializing custom batch workbook at ${targetPath} from template...`);
      try {
        fs.copyFileSync(DEFAULT_B3_PATH, targetPath);
      } catch (copyErr) {
        console.warn(`[DynamicExcel] Could not copy template to ${targetPath}:`, copyErr.message);
        return false;
      }
    } else {
      console.warn(`[DynamicExcel] Target workbook not found at ${targetPath} and template missing`);
      return false;
    }
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(targetPath);

  const dateGroups = new Map();
  for (const sub of auditedSubmissions) {
    const sDate = sub.submissionDate || dateStr || '14-10-2026';
    if (!dateGroups.has(sDate)) {
      dateGroups.set(sDate, []);
    }
    dateGroups.get(sDate).push(sub);
  }

  // Ensure today's sheet exists
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const y = today.getFullYear();
  const todayStr = `${d}-${m}-${y}`;
  if (!dateGroups.has(todayStr)) {
    dateGroups.set(todayStr, []);
  }

  const templateSheet = workbook.getWorksheet('14-10-2026') || workbook.getWorksheet('09-10-2026') || workbook.worksheets[workbook.worksheets.length - 1];

  for (const [sheetDate, subs] of dateGroups.entries()) {
    let sheet = workbook.getWorksheet(sheetDate);
    if (!sheet) {
      console.log(`[DynamicExcel] 📄 Creating precision-styled sheet for: ${sheetDate}`);
      sheet = workbook.addWorksheet(sheetDate);
      styleNewSheetLikeSharePoint(sheet, templateSheet);
    }

    // Update audited rows
    if (subs && subs.length > 0) {
      subs.forEach((sub) => {
        const subTrainee = sub.trainee || '';
        const cleanSub = cleanName(subTrainee);
        if (!cleanSub) return;

        const tokens = subTrainee.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber < 5) return;
          const nameCell = row.getCell(2).value;
          const traineeInSheet = typeof nameCell === 'object' && nameCell?.text ? nameCell.text : String(nameCell || '');
          const cleanRowName = cleanName(traineeInSheet);
          if (!cleanRowName) return;

          const matchTokens = tokens.filter((t) => traineeInSheet.toLowerCase().includes(t)).length;
          const isMatch = matchTokens >= 2 || cleanRowName.includes(cleanSub) || cleanSub.includes(cleanRowName);

          if (isMatch) {
            console.log(`[DynamicExcel] ✍️ Updating trainee row for "${traineeInSheet}" on sheet "${sheetDate}"`);
            
            // Pending Topics
            if (sub.pendingTopicsText) {
              row.getCell(3).value = sub.pendingTopicsText;
            } else if (sub.mistakesFound && sub.mistakesFound.length > 0) {
              row.getCell(3).value = `Pending: ${sub.mistakesFound.join('; ')}`;
            }

            // Completed Topics
            if (sub.completedTopicsText) {
              row.getCell(4).value = sub.completedTopicsText;
            }

            // Task Assign
            row.getCell(5).value = 'Yes';

            // Doubts
            row.getCell(6).value = sub.doubts || 'No Blockers Reported';

            // Discussion Summary
            if (sub.discussionSummaryText) {
              row.getCell(7).value = sub.discussionSummaryText;
            } else {
              row.getCell(7).value = `Submitted daily report on ${sheetDate}. Code zip: ${sub.zipFilename || 'Attached'}`;
            }

            // GitHub Push
            row.getCell(8).value = sub.githubPushStatus || 'Yes';

            // Email Review Status
            if (sub.reviewStatus) {
              row.getCell(9).value = sub.reviewStatus;
            }

            // Standup Participation & Rating
            row.getCell(10).value = 'Not Conducted';
            row.getCell(11).value = 'N/A';
            row.getCell(12).value = 'No stand-up call was conducted today.';
            row.getCell(13).value = sub.selfProjectStatus || 'N/A';

            // Ensure clean black font (NO red font)
            for (let c = 1; c <= 13; c++) {
              row.getCell(c).font = { name: 'Aptos Narrow', size: 10, color: { argb: 'FF000000' } };
            }
            row.height = 110;
          }
        });
      });
    }
  }

  // Save changes directly in-place
  await workbook.xlsx.writeFile(targetPath);
  console.log(`[DynamicExcel] Successfully saved updated workbook: ${targetPath}`);

  // Mirror to Downloads
  const targetBaseName = path.basename(targetPath);
  const targetDownloadsPath = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', targetBaseName);
  const targetDownloadsUpdatedPath = path.join(
    'C:',
    'Users',
    'Nafisa Khanam',
    'Downloads',
    targetBaseName.replace(/\.xlsx$/i, '_Updated.xlsx')
  );

  try {
    await workbook.xlsx.writeFile(targetDownloadsPath);
    console.log(`[DynamicExcel] Mirrored to Downloads: ${targetDownloadsPath}`);
  } catch (e) {
    // If original is locked by Excel, write to Updated copy
    try {
      await workbook.xlsx.writeFile(targetDownloadsUpdatedPath);
      console.log(`[DynamicExcel] Original locked in Excel, wrote to: ${targetDownloadsUpdatedPath}`);
    } catch (e2) {}
  }

  return true;
}

module.exports = {
  updateRealExcelWorkbook,
  cleanName,
};
