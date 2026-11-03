import { NextRequest, NextResponse } from 'next/server';
import { generateAbsenceNoticeText, markAbsenceNoticeSent } from '@/lib/attendance-store';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      traineeId,
      traineeName = 'Trainee',
      traineeEmail = '',
      batch = '3',
      date = new Date().toISOString().split('T')[0],
      customNotice = '',
      sendDirectEmail = false,
      recipientOverride = '',
    } = body;

    const firstName = traineeName.trim().split(' ')[0] || traineeName;
    const defaultBody = generateAbsenceNoticeText(firstName);
    const finalBodyText = customNotice.trim() || defaultBody;

    const subject = `⚠️ Clarification Required: Daily Login & Absence Notice (${date}) — ${traineeName}`;

    let emailSent = false;
    let emailStatus = 'Draft ready';

    if (sendDirectEmail) {
      const targetTo = recipientOverride || traineeEmail || process.env.EMAIL_USER || '';
      if (targetTo) {
        const result = await sendEmail({
          to: targetTo,
          subject,
          text: finalBodyText,
        });
        emailSent = result.success;
        emailStatus = result.success
          ? `Sent warning email to ${targetTo}`
          : (typeof result.error === 'string' ? result.error : 'Send failed');
      }
    }

    if (traineeId) {
      markAbsenceNoticeSent(traineeId, date, batch);
    }

    // Build Web Compose and mailto links
    const mailtoUrl = `mailto:${encodeURIComponent(traineeEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(finalBodyText)}`;

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      traineeEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalBodyText)}`;

    const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(
      traineeEmail
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalBodyText)}`;

    // Build standard MIME .eml draft
    const emlContent = [
      'X-Unsent: 1',
      `To: ${traineeEmail || 'trainee@nybinfotech.com'}`,
      `From: ${process.env.EMAIL_USER || 'tl@nybinfotech.com'}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      finalBodyText,
    ].join('\r\n');

    return NextResponse.json({
      success: true,
      traineeName,
      traineeEmail,
      subject,
      body: finalBodyText,
      mailtoUrl,
      gmailWebUrl,
      outlookWebUrl,
      emlContent,
      emailSent,
      emailStatus,
    });
  } catch (error: any) {
    console.error('Error in /api/attendance/draft-notice:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate absence notice' },
      { status: 500 }
    );
  }
}
