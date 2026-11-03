import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DailyTracker } from '@/models/DailyTracker';
import {
  createBatchDailyStatusWorkbook,
  BatchTraineeRow,
  DEFAULT_BATCH_TRAINEES,
  DEFAULT_REACT_TRAINEE_ROWS,
  DEFAULT_OCT05_TRAINEE_ROWS,
} from '@/lib/generate-batch-report';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateQuery = searchParams.get('date') || '08-10-2026';

    const batchParam = searchParams.get('batch') || '3';
    const fs = await import('fs');
    const path = await import('path');
    const realFilePath = path.join(process.cwd(), `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`);

    if (fs.existsSync(realFilePath)) {
      const fileBuffer = fs.readFileSync(realFilePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
        },
      });
    }

    let trackersData: any[] = [];

    if (isMongoConfigured()) {
      try {
        const conn = await connectToDatabase();
        if (conn && conn.connection.readyState === 1) {
          trackersData = await DailyTracker.find().sort({ createdAt: -1 }).lean();
        }
      } catch (err) {
        console.warn('MongoDB query failed in export-excel, using default batch list:', err);
      }
    }

    // Default template matching authentic October 8-trainee batch
    const baseRows: BatchTraineeRow[] =
      dateQuery === '05-10-2026'
        ? [...DEFAULT_OCT05_TRAINEE_ROWS]
        : [...DEFAULT_REACT_TRAINEE_ROWS];

    // If there are dynamically ingested records from email (e.g., from Pathan or newcomers), merge or append them
    let nextSNo = 12;
    const finalRows = [...baseRows];

    trackersData.forEach((t) => {
      const existingIdx = finalRows.findIndex(
        (r) => r.name.toLowerCase() === (t.name || '').toLowerCase()
      );
      if (existingIdx !== -1) {
        // Update existing trainee with real email submission data
        finalRows[existingIdx].pendingTopics = t.pendingTopics || finalRows[existingIdx].pendingTopics;
        finalRows[existingIdx].completedTopics =
          `${t.completedTopicsStatus || 'Partial'} - ${t.completedTopicsDetails || ''}`;
        finalRows[existingIdx].taskAssign = t.taskAssign || 'Yes';
        finalRows[existingIdx].doubts = t.doubts || 'No Blockers Reported';
        finalRows[existingIdx].discussionSummary = t.discussionSummary || finalRows[existingIdx].discussionSummary;
        finalRows[existingIdx].githubPushStatus = t.githubPushStatus || 'Yes';
        finalRows[existingIdx].emailReviewStatus = t.emailReviewStatus || finalRows[existingIdx].emailReviewStatus;
        finalRows[existingIdx].selfProjectStatus = t.selfProjectStatus || finalRows[existingIdx].selfProjectStatus;
      } else if (t.name && !DEFAULT_BATCH_TRAINEES.includes(t.name)) {
        // New trainee submission
        finalRows.push({
          sNo: nextSNo++,
          name: t.name,
          pendingTopics: t.pendingTopics || 'N/A',
          completedTopics: `${t.completedTopicsStatus || 'Partial'} - ${t.completedTopicsDetails || ''}`,
          taskAssign: t.taskAssign || 'Yes',
          doubts: t.doubts || 'No Blockers Reported',
          discussionSummary: t.discussionSummary || '',
          githubPushStatus: t.githubPushStatus || 'Yes',
          emailReviewStatus: t.emailReviewStatus || 'Reviewed',
          standupParticipation: t.standupParticipation || 'Not Conducted',
          standupRating: t.standupRating || 'N/A',
          standupRemarks: t.standupRemarks || 'No stand-up call was conducted today.',
          selfProjectStatus: t.selfProjectStatus || 'N/A',
        });
      }
    });

    const workbook = await createBatchDailyStatusWorkbook(dateQuery, finalRows, undefined, undefined, batchParam);
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error generating Technical Team batch report:', error);
    return NextResponse.json({ error: 'Failed to generate Excel report' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const dateQuery = body.date || '28-10-2026';
    const batchParam = body.batch || '3';
    const rows: BatchTraineeRow[] = body.rows && Array.isArray(body.rows) && body.rows.length > 0 ? body.rows : [];

    const fs = await import('fs');
    const path = await import('path');
    const ExcelJS = (await import('exceljs')).default;
    const realFilePath = path.join(process.cwd(), `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`);
    const downloadsPath = path.join('C:', 'Users', 'Nafisa Khanam', 'Downloads', `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`);

    if (rows.length > 0) {
      if (fs.existsSync(realFilePath)) {
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(realFilePath);
          let sheet = workbook.getWorksheet(dateQuery);

          if (sheet) {
            rows.forEach((r, idx) => {
              const rowNum = 13 + (idx + 1);
              const row = sheet.getRow(rowNum);
              row.getCell(1).value = r.sNo || idx + 1;
              row.getCell(2).value = r.name;
              row.getCell(3).value = r.pendingTopics || 'N/A';
              row.getCell(4).value = r.completedTopics || 'Yes';
              row.getCell(5).value = r.taskAssign || 'Yes';
              row.getCell(6).value = r.doubts || 'No Blockers Reported';
              row.getCell(7).value = r.discussionSummary || '';
              row.getCell(8).value = r.githubPushStatus || 'Yes';
              row.getCell(9).value = r.emailReviewStatus || 'Reviewed';
              row.getCell(10).value = r.standupParticipation || 'Conducted';
              row.getCell(11).value = r.standupRating || 'Good';
              row.getCell(12).value = r.standupRemarks || 'Active participation.';
              row.getCell(13).value = r.selfProjectStatus || 'N/A';
            });
          } else {
            const newWb = await createBatchDailyStatusWorkbook(dateQuery, rows, undefined, undefined, batchParam);
            const newSheet = newWb.getWorksheet(dateQuery);
            if (newSheet) {
              const added = workbook.addWorksheet(dateQuery);
              newSheet.eachRow((row, rowNumber) => {
                const addedRow = added.getRow(rowNumber);
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                  addedRow.getCell(colNumber).value = cell.value;
                  addedRow.getCell(colNumber).style = Object.assign({}, cell.style);
                });
                addedRow.height = row.height;
              });
            }
          }

          await workbook.xlsx.writeFile(realFilePath);
          if (fs.existsSync(path.dirname(downloadsPath))) {
            try { await workbook.xlsx.writeFile(downloadsPath); } catch {}
          }

          const buffer = await workbook.xlsx.writeBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
            },
          });
        } catch (e: any) {
          console.warn('Could not update real workbook in-place, falling back to new workbook:', e.message);
        }
      }

      const workbook = await createBatchDailyStatusWorkbook(dateQuery, rows, undefined, undefined, batchParam);
      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
        },
      });
    }

    // If no custom rows passed, forward to standard GET logic
    return GET(req);
  } catch (error) {
    console.error('Error in export-excel POST:', error);
    return NextResponse.json({ error: 'Failed to generate custom Excel report' }, { status: 500 });
  }
}

