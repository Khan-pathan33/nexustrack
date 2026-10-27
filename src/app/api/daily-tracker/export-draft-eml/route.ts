import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateTLReportHTML, DEFAULT_TL_RECIPIENTS } from '@/lib/weekly-curriculum';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || '21-10-2026';
    const batchParam = searchParams.get('batch') || '3';

    const excelPath = path.join(
      process.cwd(),
      `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`
    );

    let excelBuffer: Buffer;
    if (fs.existsSync(excelPath)) {
      excelBuffer = fs.readFileSync(excelPath);
    } else {
      excelBuffer = Buffer.from('');
    }

    const htmlContent = generateTLReportHTML({
      batchNumber: batchParam,
      date: dateParam,
      senderEmail: 'nafisa.khanam@nybinfotech.com',
    });

    const boundary = `----=_Part_${Date.now()}`;
    const emlContent = [
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
      '',
      `--${boundary}`,
      `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
      '',
      excelBuffer.toString('base64'),
      '',
      `--${boundary}--`,
      '',
    ].join('\r\n');

    return new NextResponse(emlContent, {
      status: 200,
      headers: {
        'Content-Type': 'message/rfc822',
        'Content-Disposition': `attachment; filename="Status_Report_${dateParam}.eml"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
