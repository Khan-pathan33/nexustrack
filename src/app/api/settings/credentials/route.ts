import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/lib/auth';
import { findUserByEmail, updateUserByEmail } from '@/lib/user-store';

export async function GET() {
  try {
    const session = await auth();
    let userRecord = null;

    if (session?.user?.email) {
      userRecord = await findUserByEmail(session.user.email);
    }

    if (userRecord) {
      const emailPass = userRecord.emailPass || (userRecord.email.includes('nafisa') ? process.env.EMAIL_PASS || '' : '');
      const batch = userRecord.batch || '3';
      const excelFilename = userRecord.excelFilename || `Technical Team batch-${batch}_Daily_Status_Report.xlsx`;

      const provider = userRecord.emailProvider || process.env.EMAIL_PROVIDER || 'both';
      const imapHost = userRecord.imapHost || (provider === 'outlook' ? 'outlook.office365.com' : 'imap.gmail.com');
      const imapPort = userRecord.imapPort || 993;
      const smtpHost = userRecord.smtpHost || (provider === 'outlook' ? 'smtp.office365.com' : 'smtp.gmail.com');
      const smtpPort = userRecord.smtpPort || (provider === 'outlook' ? 587 : 465);

      const gmailUser = userRecord.gmailUser || process.env.GMAIL_USER || 'nafisakhanampathan65@gmail.com';
      const gmailPass = userRecord.gmailPass || process.env.GMAIL_PASS || process.env.EMAIL_PASS || '';
      const outlookUser = userRecord.outlookUser || process.env.OUTLOOK_USER || 'nafisa.khanam@nybinfotech.com';
      const outlookPass = userRecord.outlookPass || process.env.OUTLOOK_PASS || '';

      return NextResponse.json({
        success: true,
        source: 'user_profile',
        credentials: {
          emailUser: userRecord.emailUser || userRecord.email,
          emailPass: emailPass,
          hasEmailPass: Boolean(emailPass && emailPass !== 'your_app_password'),
          emailProvider: provider,
          gmailUser,
          gmailPass,
          outlookUser,
          outlookPass,
          imapHost,
          imapPort,
          smtpHost,
          smtpPort,
          excelPassword: userRecord.excelPassword || process.env.EXCEL_PASSWORD || '',
          hasExcelPassword: Boolean(userRecord.excelPassword),
          tlEmail: userRecord.tlEmail || 'nafisa.khanam@nybinfotech.com',
          sharepointUrl: userRecord.sharepointUrl || '',
          batch: batch,
          excelFilename: excelFilename,
          teamsWebhookUrl: userRecord.teamsWebhookUrl || process.env.TEAMS_WEBHOOK_URL || '',
          teamsChannelName: userRecord.teamsChannelName || process.env.TEAMS_CHANNEL_NAME || 'Technical Training - Cohort Standup',
          hasCompletedOnboarding: Boolean(userRecord.hasCompletedOnboarding),
        },
      });
    }

    // Fallback to process.env for demo/admin or offline mode
    const emailUser = process.env.EMAIL_USER || 'nafisa.khanam@nybinfotech.com';
    const emailPass = process.env.EMAIL_PASS || '';
    const envProvider = (process.env.EMAIL_PROVIDER as any) || 'both';
    const gmailUser = process.env.GMAIL_USER || 'nafisakhanampathan65@gmail.com';
    const gmailPass = process.env.GMAIL_PASS || process.env.EMAIL_PASS || '';
    const outlookUser = process.env.OUTLOOK_USER || 'nafisa.khanam@nybinfotech.com';
    const outlookPass = process.env.OUTLOOK_PASS || '';
    const imapHostEnv = process.env.IMAP_HOST || (envProvider === 'outlook' ? 'outlook.office365.com' : 'imap.gmail.com');
    const excelPassword = process.env.EXCEL_PASSWORD || '';
    const tlEmail = process.env.TL_EMAIL || 'nafisa.khanam@nybinfotech.com';
    const sharepointUrl =
      process.env.SHAREPOINT_EXCEL_URL ||
      'https://navayuvabharatinfotech703-my.sharepoint.com/:x:/g/personal/pathan_nafisakhanam_nybinfotech_com/Technical_Team_batch-3_Daily_Status_Report';

    return NextResponse.json({
      success: true,
      source: 'environment',
      credentials: {
        emailUser,
        emailPass,
        hasEmailPass: Boolean(emailPass && emailPass !== 'your_app_password'),
        emailProvider: envProvider,
        gmailUser,
        gmailPass,
        outlookUser,
        outlookPass,
        imapHost: imapHostEnv,
        imapPort: parseInt(process.env.IMAP_PORT || '993', 10),
        smtpHost: envProvider === 'outlook' ? 'smtp.office365.com' : 'smtp.gmail.com',
        smtpPort: envProvider === 'outlook' ? 587 : 465,
        excelPassword,
        hasExcelPassword: Boolean(excelPassword),
        tlEmail,
        sharepointUrl,
        batch: '3',
        excelFilename: 'Technical Team batch-3_Daily_Status_Report.xlsx',
        teamsWebhookUrl: process.env.TEAMS_WEBHOOK_URL || '',
        teamsChannelName: process.env.TEAMS_CHANNEL_NAME || 'Technical Training - Cohort Standup',
        hasCompletedOnboarding: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to get credentials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const {
      emailUser,
      emailPass,
      emailProvider,
      gmailUser,
      gmailPass,
      outlookUser,
      outlookPass,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort,
      excelPassword,
      tlEmail,
      sharepointUrl,
      batch,
      excelFilename,
      teamsWebhookUrl,
      teamsChannelName,
    } = body;

    const userEmail = session?.user?.email?.toLowerCase().trim();

    // 1. If user is authenticated, persist to user store (MongoDB + local fallback)
    if (userEmail) {
      const updateFields: any = {
        hasCompletedOnboarding: true,
      };
      if (emailUser !== undefined) updateFields.emailUser = emailUser.trim();
      if (emailPass !== undefined) updateFields.emailPass = emailPass.trim();
      if (emailProvider !== undefined) updateFields.emailProvider = emailProvider;
      if (gmailUser !== undefined) updateFields.gmailUser = gmailUser.trim();
      if (gmailPass !== undefined) updateFields.gmailPass = gmailPass.trim();
      if (outlookUser !== undefined) updateFields.outlookUser = outlookUser.trim();
      if (outlookPass !== undefined) updateFields.outlookPass = outlookPass.trim();
      if (imapHost !== undefined) updateFields.imapHost = imapHost.trim();
      if (imapPort !== undefined) updateFields.imapPort = Number(imapPort);
      if (smtpHost !== undefined) updateFields.smtpHost = smtpHost.trim();
      if (smtpPort !== undefined) updateFields.smtpPort = Number(smtpPort);
      if (excelPassword !== undefined) updateFields.excelPassword = excelPassword;
      if (tlEmail !== undefined) updateFields.tlEmail = tlEmail.trim();
      if (sharepointUrl !== undefined) updateFields.sharepointUrl = sharepointUrl.trim();
      if (teamsWebhookUrl !== undefined) updateFields.teamsWebhookUrl = teamsWebhookUrl.trim();
      if (teamsChannelName !== undefined) updateFields.teamsChannelName = teamsChannelName.trim();
      if (batch !== undefined) {
        const cleanBatch = String(batch).replace(/batch/gi, '').trim();
        updateFields.batch = cleanBatch;
        updateFields.excelFilename = excelFilename || `Technical Team batch-${cleanBatch}_Daily_Status_Report.xlsx`;
      } else if (excelFilename !== undefined) {
        updateFields.excelFilename = excelFilename;
      }

      await updateUserByEmail(userEmail, updateFields);
    }

    // 2. If it's Nafisa, Admin, or root environment, also update process.env & .env.local
    const isNafisaOrAdmin = !userEmail || userEmail.includes('nafisa') || userEmail.includes('admin');
    if (isNafisaOrAdmin) {
      if (emailUser !== undefined) process.env.EMAIL_USER = emailUser;
      if (emailPass !== undefined) process.env.EMAIL_PASS = emailPass;
      if (emailProvider !== undefined) process.env.EMAIL_PROVIDER = emailProvider;
      if (gmailUser !== undefined) process.env.GMAIL_USER = gmailUser;
      if (gmailPass !== undefined) process.env.GMAIL_PASS = gmailPass;
      if (outlookUser !== undefined) process.env.OUTLOOK_USER = outlookUser;
      if (outlookPass !== undefined) process.env.OUTLOOK_PASS = outlookPass;
      if (imapHost !== undefined) process.env.IMAP_HOST = imapHost;
      if (imapPort !== undefined) process.env.IMAP_PORT = String(imapPort);
      if (smtpHost !== undefined) process.env.SMTP_HOST = smtpHost;
      if (smtpPort !== undefined) process.env.SMTP_PORT = String(smtpPort);
      if (excelPassword !== undefined) process.env.EXCEL_PASSWORD = excelPassword;
      if (tlEmail !== undefined) process.env.TL_EMAIL = tlEmail;
      if (sharepointUrl !== undefined) process.env.SHAREPOINT_EXCEL_URL = sharepointUrl;
      if (teamsWebhookUrl !== undefined) process.env.TEAMS_WEBHOOK_URL = teamsWebhookUrl;
      if (teamsChannelName !== undefined) process.env.TEAMS_CHANNEL_NAME = teamsChannelName;

      try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');

          const updateKey = (key: string, value: string) => {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(envContent)) {
              envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
              envContent += `\n${key}=${value}`;
            }
          };

          if (emailUser !== undefined) updateKey('EMAIL_USER', emailUser);
          if (emailPass !== undefined) updateKey('EMAIL_PASS', emailPass);
          if (emailProvider !== undefined) updateKey('EMAIL_PROVIDER', emailProvider);
          if (gmailUser !== undefined) updateKey('GMAIL_USER', gmailUser);
          if (gmailPass !== undefined) updateKey('GMAIL_PASS', gmailPass);
          if (outlookUser !== undefined) updateKey('OUTLOOK_USER', outlookUser);
          if (outlookPass !== undefined) updateKey('OUTLOOK_PASS', outlookPass);
          if (imapHost !== undefined) updateKey('IMAP_HOST', imapHost);
          if (imapPort !== undefined) updateKey('IMAP_PORT', String(imapPort));
          if (smtpHost !== undefined) updateKey('SMTP_HOST', smtpHost);
          if (smtpPort !== undefined) updateKey('SMTP_PORT', String(smtpPort));
          if (excelPassword !== undefined) updateKey('EXCEL_PASSWORD', excelPassword);
          if (tlEmail !== undefined) updateKey('TL_EMAIL', tlEmail);
          if (sharepointUrl !== undefined) updateKey('SHAREPOINT_EXCEL_URL', sharepointUrl);
          if (teamsWebhookUrl !== undefined) updateKey('TEAMS_WEBHOOK_URL', teamsWebhookUrl);
          if (teamsChannelName !== undefined) updateKey('TEAMS_CHANNEL_NAME', teamsChannelName);

          fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
        }
      } catch (fsErr) {
        console.warn('Could not write to .env.local file directly:', fsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Coordinator credentials & batch configuration saved successfully!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update credentials' }, { status: 500 });
  }
}
