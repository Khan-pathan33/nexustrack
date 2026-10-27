import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export function cleanTraineeName(name: string): string {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function updateRealExcelWorkbookInPlace(
  auditedSubmissions: any[] = [],
  targetDateStr?: string,
  workbookPath?: string
): Promise<boolean> {
  const rootDir = process.cwd();
  const targetPath = workbookPath || path.join(rootDir, 'Technical Team batch-3_Daily_Status_Report.xlsx');
  const downloadsPath = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', 'Technical Team batch-3_Daily_Status_Report.xlsx');

  if (!fs.existsSync(targetPath)) {
    return false;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(targetPath);

  const targetDate = targetDateStr || (workbook.worksheets.length > 0 ? workbook.worksheets[workbook.worksheets.length - 1].name : '09-10-2026');
  let sheet = workbook.getWorksheet(targetDate);

  if (!sheet) {
    const latestSheet = workbook.worksheets[workbook.worksheets.length - 1];
    if (latestSheet) {
      sheet = workbook.addWorksheet(targetDate);
      latestSheet.eachRow((row, rowNumber) => {
        const newRow = sheet!.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;
          newCell.style = Object.assign({}, cell.style);
        });
        newRow.height = row.height;
      });

      // Clear evaluation status cells for new day (columns 3 to 13)
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 5) {
          for (let c = 3; c <= 13; c++) {
            row.getCell(c).value = '';
          }
        }
      });
    }
  }

  if (sheet && auditedSubmissions && auditedSubmissions.length > 0) {
    auditedSubmissions.forEach((sub) => {
      const subTrainee = sub.trainee || '';
      const cleanSub = cleanTraineeName(subTrainee);
      if (!cleanSub) return;

      const tokens = subTrainee.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);

      sheet!.eachRow((row, rowNumber) => {
        if (rowNumber < 5) return;
        const nameCell = row.getCell(2).value;
        const traineeInSheet = typeof nameCell === 'object' && nameCell !== null && 'text' in nameCell
          ? (nameCell as any).text
          : String(nameCell || '');
        const cleanRowName = cleanTraineeName(traineeInSheet);
        if (!cleanRowName) return;

        const matchTokens = tokens.filter((t: string) => traineeInSheet.toLowerCase().includes(t)).length;
        const isMatch = matchTokens >= 2 || cleanRowName.includes(cleanSub) || cleanSub.includes(cleanRowName);

        if (isMatch) {
          if (sub.pendingTopicsText) row.getCell(3).value = sub.pendingTopicsText;
          if (sub.completedTopicsText) row.getCell(4).value = sub.completedTopicsText;
          if (sub.taskAssign) row.getCell(5).value = sub.taskAssign;
          if (sub.doubts) row.getCell(6).value = sub.doubts;
          if (sub.discussionSummaryText) row.getCell(7).value = sub.discussionSummaryText;
          if (sub.githubPushStatus) row.getCell(8).value = sub.githubPushStatus;
          if (sub.reviewStatus) row.getCell(9).value = sub.reviewStatus;
        }
      });
    });
  }

  await workbook.xlsx.writeFile(targetPath);

  if (targetPath !== downloadsPath && fs.existsSync(path.dirname(downloadsPath))) {
    try {
      await workbook.xlsx.writeFile(downloadsPath);
    } catch (e) {}
  }

  return true;
}
