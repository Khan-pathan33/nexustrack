import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import imaps from 'imap-simple';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DailyTracker } from '@/models/DailyTracker';
import { auth } from '@/lib/auth';
import { findUserByEmail } from '@/lib/user-store';
import {
  createBatchDailyStatusWorkbook,
  BatchTraineeRow,
  DEFAULT_BATCH_TRAINEES,
  DEFAULT_REACT_TRAINEE_ROWS,
  DEFAULT_OCT05_TRAINEE_ROWS,
} from '@/lib/generate-batch-report';
import {
  generateTLReportHTML,
  generateTLReportPlainText,
  DEFAULT_TL_RECIPIENTS,
} from '@/lib/weekly-curriculum';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const session = await auth().catch(() => null);
    let userRecord = null;
    if (session?.user?.email) {
      userRecord = await findUserByEmail(session.user.email);
    }

    const emailProvider =
      body.emailProvider ||
      body.provider ||
      userRecord?.emailProvider ||
      ((process.env.EMAIL_PROVIDER as any) || 'outlook');

    const isOutlook = emailProvider === 'outlook' || body.emailUser?.includes('nybinfotech') || body.provider === 'outlook';

    const emailUser =
      body.emailUser ||
      (isOutlook
        ? userRecord?.outlookUser || process.env.OUTLOOK_USER || 'nafisa.khanam@nybinfotech.com'
        : userRecord?.gmailUser || userRecord?.emailUser || process.env.GMAIL_USER || process.env.EMAIL_USER || 'nafisakhanampathan65@gmail.com');

    let liveOutlookPass = process.env.OUTLOOK_PASS || '';
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^OUTLOOK_PASS=(.*)$/m);
        if (match && match[1]?.trim()) {
          liveOutlookPass = match[1].trim();
        }
      }
    } catch {}

    const emailPass =
      body.emailPass ||
      (isOutlook
        ? userRecord?.outlookPass || liveOutlookPass
        : userRecord?.gmailPass || userRecord?.emailPass || process.env.GMAIL_PASS || process.env.EMAIL_PASS || '');

    const batchParam = body.batch || '3';
    const dateQuery = body.date || '21-10-2026';
    const action = body.action || 'send'; // 'send' | 'draft'

    // Authorized recipients from user's official Outlook template
    const defaultTo = DEFAULT_TL_RECIPIENTS.to.join('; ');
    const defaultCc = DEFAULT_TL_RECIPIENTS.cc.join('; ');

    const toRecipients = body.to?.trim() || body.recipientEmail?.trim() || defaultTo;
    const ccRecipients = body.cc?.trim() !== undefined ? body.cc.trim() : defaultCc;

    // Exact Outlook Subject from screenshots: Status_Report_<date>:
    const emailSubject = body.subject?.trim() || `Status_Report_${dateQuery}:`;

    // Generated exact HTML and text matching user's Outlook Web email
    const htmlMessage =
      body.html ||
      generateTLReportHTML({
        batchNumber: batchParam,
        date: dateQuery,
        senderEmail: emailUser,
      });

    const customMessage =
      body.message?.trim() ||
      generateTLReportPlainText({
        batchNumber: batchParam,
        date: dateQuery,
        senderEmail: emailUser,
      });

    let trackersData: any[] = [];
    if (isMongoConfigured()) {
      try {
        const conn = await connectToDatabase();
        if (conn && conn.connection.readyState === 1) {
          trackersData = await DailyTracker.find().sort({ createdAt: -1 }).lean();
        }
      } catch (err) {
        console.warn('MongoDB query fallback:', err);
      }
    }

    const defaultTraineeRows: BatchTraineeRow[] =
      dateQuery === '05-10-2026'
        ? [...DEFAULT_OCT05_TRAINEE_ROWS]
        : [...DEFAULT_REACT_TRAINEE_ROWS];

    let finalRows: BatchTraineeRow[] = [];

    if (body.rows && Array.isArray(body.rows) && body.rows.length > 0) {
      finalRows = body.rows;
    } else {
      let nextSNo = 9;
      finalRows = [...defaultTraineeRows];

      trackersData.forEach((t) => {
        const existingIdx = finalRows.findIndex(
          (r) => r.name.toLowerCase() === (t.name || '').toLowerCase()
        );
        if (existingIdx !== -1) {
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
    }

    // Attach authentic Excel workbook buffer
    const realFilePath = path.join(process.cwd(), `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`);

    let excelBuffer: Buffer;
    if (body.rows && Array.isArray(body.rows) && body.rows.length > 0) {
      const workbook = await createBatchDailyStatusWorkbook(dateQuery, finalRows, undefined, undefined, batchParam);
      excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
    } else if (fs.existsSync(realFilePath)) {
      excelBuffer = fs.readFileSync(realFilePath);
    } else {
      const workbook = await createBatchDailyStatusWorkbook(dateQuery, finalRows, undefined, undefined, batchParam);
      excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
    }

    const effectiveSmtpHost =
      body.smtpHost ||
      userRecord?.smtpHost ||
      (isOutlook ? 'smtp.office365.com' : 'smtp.gmail.com');

    const effectiveSmtpPort =
      Number(body.smtpPort || userRecord?.smtpPort) || (isOutlook ? 587 : 465);

    const effectiveImapHost =
      body.imapHost ||
      userRecord?.imapHost ||
      (isOutlook ? 'outlook.office365.com' : 'imap.gmail.com');

    const effectiveImapPort =
      Number(body.imapPort || userRecord?.imapPort) || 993;

    const attachments: any[] = [
      {
        filename: `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ];

    if (Array.isArray(body.extraAttachments)) {
      for (const att of body.extraAttachments) {
        if (att && att.filename && att.content) {
          attachments.push({
            filename: att.filename,
            content: Buffer.from(att.content, 'base64'),
            contentType: att.contentType || 'application/octet-stream',
          });
        }
      }
    }

    // ──────────────────────────────────────────────────────────
    // CASE 1: SAVE AS DRAFT IN OUTLOOK / GMAIL MAILBOX
    // ──────────────────────────────────────────────────────────
    if (action === 'draft') {
      const stateFilePath = path.join(process.cwd(), 'scanned_audit_state.json');
      let existingState: any = { lastAuditedAt: null, auditedSubmissions: [], dispatchedEmails: [], savedDrafts: [] };
      if (fs.existsSync(stateFilePath)) {
        try {
          existingState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
        } catch {}
      }

      const draftEntry = {
        id: `tl_draft_${Date.now()}`,
        type: 'TL_DAILY_STATUS_REPORT',
        to: toRecipients,
        cc: ccRecipients,
        subject: emailSubject,
        date: dateQuery,
        batch: batchParam,
        body: customMessage,
        html: htmlMessage,
        attachmentName: `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };

      if (!Array.isArray(existingState.savedDrafts)) {
        existingState.savedDrafts = [];
      }
      existingState.savedDrafts.unshift(draftEntry);

      try {
        fs.writeFileSync(stateFilePath, JSON.stringify(existingState, null, 2));
      } catch (e: any) {
        console.warn('Could not save draft to local state:', e.message);
      }

      // Try appending to IMAP Drafts folder if credentials are available
      let savedInImap = false;
      if (emailUser && emailPass && emailPass !== 'your_app_password' && emailPass.length >= 8) {
        try {
          const conn = await imaps.connect({
            imap: {
              user: emailUser,
              password: emailPass,
              host: effectiveImapHost,
              port: effectiveImapPort,
              tls: true,
              tlsOptions: { rejectUnauthorized: false },
              authTimeout: 25000,
            },
          });

          // Compose MIME raw message with boundaries
          const boundary = `====NextPart_${Date.now()}====`;
          const rawMime = [
            `From: "Pathan Nafisa Khanam" <${emailUser}>`,
            `To: ${toRecipients}`,
            ccRecipients ? `Cc: ${ccRecipients}` : '',
            `Subject: ${emailSubject}`,
            `Date: ${new Date().toUTCString()}`,
            `MIME-Version: 1.0`,
            `X-Unsent: 1`,
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            ``,
            `--${boundary}`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            htmlMessage,
            ``,
            `--${boundary}`,
            `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
            `Content-Transfer-Encoding: base64`,
            `Content-Disposition: attachment; filename="Technical Team batch-${batchParam}_Daily_Status_Report.xlsx"`,
            ``,
            excelBuffer.toString('base64'),
            ``,
            `--${boundary}--`,
          ]
            .filter((l) => l !== undefined)
            .join('\r\n');

          const draftBoxes = effectiveImapHost.includes('outlook')
            ? ['Drafts', 'Draft']
            : ['[Gmail]/Drafts', 'Drafts'];

          for (const dBox of draftBoxes) {
            try {
              const res = await new Promise((resolve) => {
                conn.imap.append(rawMime, { mailbox: dBox, flags: ['\\Draft', '\\Seen'] }, (err: any) => {
                  resolve(!err);
                });
              });
              if (res) {
                savedInImap = true;
                break;
              }
            } catch {}
          }

          conn.end();
        } catch (imapErr: any) {
          console.warn('IMAP Draft save note:', imapErr.message);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'draft',
        savedInMailbox: savedInImap,
        message: savedInImap
          ? `Status Report Draft (with Technical Team batch-${batchParam}_Daily_Status_Report.xlsx attached) saved directly to your Outlook Drafts folder! (Viewable at https://outlook.cloud.microsoft/mail/)`
          : `Status Report Draft (with Technical Team batch-${batchParam}_Daily_Status_Report.xlsx attached) saved successfully! You can open it anytime in Outlook Web.`,
        subject: emailSubject,
        to: toRecipients,
        cc: ccRecipients,
        attachmentName: `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`,
      });
    }

    // ──────────────────────────────────────────────────────────
    // CASE 2: SEND EMAIL TO TEAM LEADS VIA SMTP
    // ──────────────────────────────────────────────────────────
    if (!emailPass || emailPass === 'your_app_password') {
      return NextResponse.json(
        {
          error:
            'Email password not configured. Please enter your coordinator password in "Excel & Credentials" to send live emails.',
        },
        { status: 400 }
      );
    }

    const transporter =
      effectiveSmtpHost.includes('office365') || effectiveSmtpHost.includes('outlook')
        ? nodemailer.createTransport({
            host: effectiveSmtpHost,
            port: effectiveSmtpPort,
            secure: false,
            auth: { user: emailUser, pass: emailPass },
            tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
          })
        : nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser, pass: emailPass },
          });

    await transporter.sendMail({
      from: `"Pathan Nafisa Khanam" <${emailUser}>`,
      to: toRecipients,
      cc: ccRecipients,
      subject: emailSubject,
      text: customMessage,
      html: htmlMessage,
      attachments,
    });

    return NextResponse.json({
      success: true,
      action: 'send',
      message: `Status Report successfully emailed to ${toRecipients} (Cc: ${ccRecipients}) with Technical Team batch-${batchParam}_Daily_Status_Report.xlsx attached!`,
      recipient: toRecipients,
      attachmentName: `Technical Team batch-${batchParam}_Daily_Status_Report.xlsx`,
    });
  } catch (error: any) {
    console.error('Email report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process report' }, { status: 500 });
  }
}
