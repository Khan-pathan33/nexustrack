import { NextResponse } from 'next/server';
import { performLiveMailboxScanAndAudit } from '@/lib/imap-scanner';
import { auth } from '@/lib/auth';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import User from '@/models/User';

import { findUserByEmail } from '@/lib/user-store';

export const maxDuration = 180; // 3 minutes timeout for IMAP scanning and workbook generation

async function getScanOptionsFromSession() {
  try {
    const session = await auth();
    if (session?.user?.email) {
      const user = await findUserByEmail(session.user.email);
      if (user) {
        return {
          emailUser: user.emailUser || user.email,
          emailPass: user.emailPass || (user.email.includes('nafisa') ? process.env.EMAIL_PASS : undefined),
          emailProvider: user.emailProvider || ((process.env.EMAIL_PROVIDER as any) || 'both'),
          gmailUser: user.gmailUser || process.env.GMAIL_USER || 'nafisakhanampathan65@gmail.com',
          gmailPass: user.gmailPass || process.env.GMAIL_PASS || process.env.EMAIL_PASS || '',
          outlookUser: user.outlookUser || process.env.OUTLOOK_USER || 'nafisa.khanam@nybinfotech.com',
          outlookPass: user.outlookPass || process.env.OUTLOOK_PASS || '',
          imapHost: user.imapHost || (user.emailProvider === 'outlook' ? 'outlook.office365.com' : 'imap.gmail.com'),
          imapPort: user.imapPort || 993,
          smtpHost: user.smtpHost || (user.emailProvider === 'outlook' ? 'smtp.office365.com' : 'smtp.gmail.com'),
          smtpPort: user.smtpPort || (user.emailProvider === 'outlook' ? 587 : 465),
          batch: user.batch || '3',
          excelFilename: user.excelFilename,
          tlEmail: user.tlEmail,
        };
      }
    }
  } catch (err) {
    console.warn('Could not retrieve user session for mailbox scan:', err);
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const scanOptions: any = (await getScanOptionsFromSession()) || {};
    if (body.provider) {
      scanOptions.emailProvider = body.provider;
    }
    const result = await performLiveMailboxScanAndAudit(scanOptions);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Scan & Audit Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to scan and audit mailbox',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const providerParam = searchParams.get('provider');
    const scanOptions: any = (await getScanOptionsFromSession()) || {};
    if (providerParam) {
      scanOptions.emailProvider = providerParam;
    }
    const result = await performLiveMailboxScanAndAudit(scanOptions);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Scan & Audit GET Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve scan and audit status',
      },
      { status: 500 }
    );
  }
}
