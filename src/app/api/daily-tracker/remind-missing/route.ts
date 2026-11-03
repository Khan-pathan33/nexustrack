import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      batchNumber = '3',
      sheetDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      missingTrainees = [],
      customMessage = '',
      sendEmailDirectly = false,
      recipientOverride = '',
    } = body;

    if (!Array.isArray(missingTrainees) || missingTrainees.length === 0) {
      return NextResponse.json(
        { error: 'No missing trainees specified' },
        { status: 400 }
      );
    }

    const traineeNames = missingTrainees.map((t: any) => typeof t === 'string' ? t : t.name).join(', ');
    const traineeEmails = missingTrainees
      .map((t: any) => typeof t === 'string' ? '' : t.email)
      .filter(Boolean);

    const subject = `⚠️ URGENT REMINDER: Daily Status Report Pending (${sheetDate}) — Batch ${batchNumber}`;

    const defaultBody = `Dear Batch ${batchNumber} Trainee,

This is a formal reminder that your Daily Status Report and GitHub code submission for today (${sheetDate}) has not yet been received or confirmed.

Please ensure the following are completed immediately before the daily cutoff:
1. Daily Status Report email submitted to the Team Lead desk.
2. Verified tasks for today's syllabus (Planned vs Completed vs Pending).
3. Code pushed to your assigned GitHub repository.
4. Any project-specific attachments (.zip or live deployment link) provided.

${customMessage ? `Special Note from Team Lead:\n"${customMessage}"\n\n` : ''}
Timely reporting is an essential component of your daily evaluation and attendance.

Regards,
Technical Mentorship Operations
Nava Yuva Bharati Infotech (NYB Infotech)
`;

    let emailSent = false;
    let emailStatus = 'Draft generated';

    // If direct sending is requested (to the coordinator/test email or designated recipients)
    if (sendEmailDirectly) {
      const targetTo = recipientOverride || process.env.EMAIL_USER || process.env.TL_EMAIL || '';
      if (targetTo) {
        const result = await sendEmail({
          to: targetTo,
          subject,
          text: defaultBody,
        });
        emailSent = result.success;
        emailStatus = result.success
          ? `Sent notification to ${targetTo}`
          : (typeof result.error === 'string' ? result.error : 'Send failed');
      }
    }

    // Generate mailto link for client-side 1-click email launch
    const mailtoRecipients = traineeEmails.join(',');
    const mailtoUrl = `mailto:${encodeURIComponent(mailtoRecipients)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(defaultBody)}`;

    return NextResponse.json({
      success: true,
      count: missingTrainees.length,
      traineeNames,
      subject,
      body: defaultBody,
      mailtoUrl,
      emailSent,
      emailStatus,
    });
  } catch (error: any) {
    console.error('Error in remind-missing route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process reminder' },
      { status: 500 }
    );
  }
}
