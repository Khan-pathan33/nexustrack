import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateTLReportHTML, DEFAULT_TL_RECIPIENTS } from '@/lib/weekly-curriculum';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || '28-10-2026';
    const batchParam = searchParams.get('batch') || '3';
    const isBothBatches = batchParam === 'both' || batchParam === '3 & 4';

    const attachments: { filename: string; buffer: Buffer }[] = [];

    if (isBothBatches) {
      const b3Path = path.join(process.cwd(), 'Technical Team batch-3_Daily_Status_Report.xlsx');
      const b4Path = path.join(process.cwd(), 'Technical Team batch-4_Daily_Status_Report.xlsx');
      if (fs.existsSync(b3Path)) {
        attachments.push({ filename: 'Technical Team batch-3_Daily_Status_Report.xlsx', buffer: fs.readFileSync(b3Path) });
      }
      if (fs.existsSync(b4Path)) {
        attachments.push({ filename: 'Technical Team batch-4_Daily_Status_Report.xlsx', buffer: fs.readFileSync(b4Path) });
      }
    } else {
      const excelPath = path.join(
        process.cwd(),
        `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`
      );
      if (fs.existsSync(excelPath)) {
        attachments.push({
          filename: `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`,
          buffer: fs.readFileSync(excelPath),
        });
      }
    }

    const htmlContent = generateTLReportHTML({
      batchNumber: batchParam,
      date: dateParam,
      senderEmail: 'nafisa.khanam@nybinfotech.com',
    });

    const boundary = `----=_Part_${Date.now()}`;
    const emlParts = [
      'X-Unsent: 1',
      'From: "Pathan Nafisa Khanam" <nafisa.khanam@nybinfotech.com>',
      `To: ${DEFAULT_TL_RECIPIENTS.to.join(', ')}`,
      `Cc: ${DEFAULT_TL_RECIPIENTS.cc.join(', ')}`,
      `Subject: Status_Report_${dateParam}:`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      htmlContent,
    ];

    for (const att of attachments) {
      emlParts.push(
        '',
        `--${boundary}`,
        `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="${att.filename}"`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${att.filename}"`,
        '',
        att.buffer.toString('base64')
      );
    }

    emlParts.push('', `--${boundary}--`, '');

    return new NextResponse(emlParts.join('\r\n'), {
      status: 200,
      headers: {
        'Content-Type': 'message/rfc822',
        'Content-Disposition': `attachment; filename="Status_Report_${dateParam}_Batch_${batchParam}.eml"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
