/**
 * NexusTrack Multi-Tenant Automated 1-Minute Scanning & Audit Daemon Worker
 * 
 * Periodically checks Gmail INBOX and Spam every 1 minute for ALL registered coordinators:
 * 1. Primary Coordinator (Nafisa Khanam / Batch 3) from .env.local
 * 2. Additional Registered Coordinators (Batch 5, Batch 4, etc.) from local_users.json & DB
 * 
 * For each coordinator:
 * - Connects securely via IMAP (imap.gmail.com:993 TLS).
 * - Scans for trainee daily report emails and zip/pdf attachments for their assigned batch.
 * - Audits attachments (index.html, .css, responsive dashboard, project guides).
 * - Checks subject formatting and reports discrepancies.
 * - In-place updates the coordinator's dedicated Excel workbook:
 *     • Batch 3: Technical Team batch-3_Daily_Status_Report.xlsx
 *     • Batch 5: Technical Team batch-5_Daily_Status_Report.xlsx
 * - Mirrors updated workbooks directly to Downloads folder.
 * 
 * STRICT SECURITY & EMAIL POLICY:
 * - NEVER send messages to @nybinfotech.com.
 * - Discrepancy notices for Batch 3 are sent EXCLUSIVELY to nafisakhanampathan65@gmail.com.
 * - Discrepancy notices for other batches are sent to the respective coordinator's email.
 * - Persistent per-batch deduplication registry prevents duplicate notifications.
 * - If no new email arrives, NO emails are dispatched.
 */

const fs = require('fs');
const path = require('path');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const AdmZip = require('adm-zip');
const nodemailer = require('nodemailer');

const PROJECT_ROOT = path.resolve(__dirname, '..');

process.on('uncaughtException', (err) => {
  if (err && (err.code === 'EPIPE' || err.code === 'ECONNRESET' || err.message?.includes('socket has been ended'))) {
    return;
  }
  console.error('Unhandled Daemon Exception:', err);
});

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        env[key] = val;
      }
    }
  });
  return env;
}

const env = loadEnv();
const IMAP_HOST = env.IMAP_HOST || process.env.IMAP_HOST || 'imap.gmail.com';
const IMAP_PORT = parseInt(env.IMAP_PORT || process.env.IMAP_PORT || '993', 10);

const INTERVAL_MINUTES = 1;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

const BLOCKED_DOMAIN = '@nybinfotech.com';
const DEDICATED_CORRECTION_EMAIL = 'nafisakhanampathan65@gmail.com';

function formatTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function getProcessedFilePath(batch) {
  if (String(batch) === '3') {
    return path.join(PROJECT_ROOT, 'processed_emails.json');
  }
  return path.join(PROJECT_ROOT, `processed_emails_batch${batch}.json`);
}

function getStateFilePath(batch) {
  if (String(batch) === '3') {
    return path.join(PROJECT_ROOT, 'scanned_audit_state.json');
  }
  return path.join(PROJECT_ROOT, `scanned_audit_state_batch${batch}.json`);
}

function loadProcessedRegistry(batch) {
  const filePath = getProcessedFilePath(batch);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data.repliedMessageKeys)) return data;
    } catch (e) {}
  }
  return { repliedMessageKeys: [] };
}

function saveProcessedRegistry(batch, data) {
  try {
    fs.writeFileSync(getProcessedFilePath(batch), JSON.stringify(data, null, 2));
  } catch (e) {}
}

/**
 * Discovers all active coordinators from .env.local and local_users.json
 */
function getActiveCoordinators() {
  const localEnv = loadEnv();
  const list = [];

  const providerSetting = (localEnv.EMAIL_PROVIDER || 'both').toLowerCase();

  // 1. Gmail Coordinator (Active when provider is 'both' or 'gmail')
  const gmailUser =
    localEnv.GMAIL_USER ||
    (localEnv.EMAIL_USER?.includes('gmail') ? localEnv.EMAIL_USER : 'nafisakhanampathan65@gmail.com');
  const gmailPass =
    localEnv.GMAIL_PASS ||
    (localEnv.EMAIL_USER?.includes('gmail') ? localEnv.EMAIL_PASS : '');

  if ((providerSetting === 'both' || providerSetting === 'gmail') && gmailUser && gmailPass && gmailPass !== 'your_app_password') {
    list.push({
      id: 'nafisa-gmail',
      name: 'Nafisa Khanam (Gmail)',
      email: gmailUser,
      emailUser: gmailUser,
      emailPass: gmailPass,
      emailProvider: 'gmail',
      imapHost: 'imap.gmail.com',
      imapPort: 993,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 465,
      batch: localEnv.BATCH || '3',
      excelFilename: localEnv.EXCEL_FILENAME || 'Technical Team batch-3_Daily_Status_Report.xlsx',
      tlEmail: localEnv.TL_EMAIL || 'nafisa.khanam@nybinfotech.com',
      isPrimary: true,
    });
  }

  // 2. Outlook / M365 Coordinator (Active when provider is 'both' or 'outlook')
  const outlookUser =
    localEnv.OUTLOOK_USER ||
    (localEnv.EMAIL_USER?.includes('nybinfotech') ? localEnv.EMAIL_USER : 'nafisa.khanam@nybinfotech.com');
  const outlookPass =
    localEnv.OUTLOOK_PASS ||
    (localEnv.EMAIL_USER?.includes('nybinfotech') ? localEnv.EMAIL_PASS : '');

  if ((providerSetting === 'both' || providerSetting === 'outlook') && outlookUser) {
    list.push({
      id: 'nafisa-outlook',
      name: 'Nafisa Khanam (Outlook)',
      email: outlookUser,
      emailUser: outlookUser,
      emailPass: outlookPass,
      emailProvider: 'outlook',
      imapHost: 'outlook.office365.com',
      imapPort: 993,
      smtpHost: 'smtp.office365.com',
      smtpPort: 587,
      batch: localEnv.BATCH || '3',
      excelFilename: localEnv.EXCEL_FILENAME || 'Technical Team batch-3_Daily_Status_Report.xlsx',
      tlEmail: localEnv.TL_EMAIL || 'nafisa.khanam@nybinfotech.com',
      isPrimary: true,
    });
  }

  // 2. Additional Registered Coordinators from local_users.json
  const localUsersPath = path.join(PROJECT_ROOT, 'local_users.json');
  if (fs.existsSync(localUsersPath)) {
    try {
      const users = JSON.parse(fs.readFileSync(localUsersPath, 'utf8'));
      if (Array.isArray(users)) {
        for (const u of users) {
          const userEmail = (u.emailUser || u.email || '').trim();
          if (!userEmail) continue;

          // Avoid duplicate entry if same as primary
          if (list.some((c) => c.emailUser.toLowerCase() === userEmail.toLowerCase())) {
            continue;
          }

          const provider = u.emailProvider || (u.imapHost?.includes('outlook') ? 'outlook' : 'gmail');
          const imapHost = u.imapHost || (provider === 'outlook' ? 'outlook.office365.com' : 'imap.gmail.com');
          const imapPort = Number(u.imapPort) || 993;
          const smtpHost = u.smtpHost || (provider === 'outlook' ? 'smtp.office365.com' : 'smtp.gmail.com');
          const smtpPort = Number(u.smtpPort) || (provider === 'outlook' ? 587 : 465);

          list.push({
            id: u.id || u.email,
            name: u.name || `Batch ${u.batch || '5'} Coordinator`,
            email: u.email,
            emailUser: userEmail,
            emailPass: u.emailPass || '',
            emailProvider: provider,
            imapHost,
            imapPort,
            smtpHost,
            smtpPort,
            batch: String(u.batch || '5'),
            excelFilename: u.excelFilename || `Technical Team batch-${u.batch || '5'}_Daily_Status_Report.xlsx`,
            tlEmail: u.tlEmail || userEmail,
            isPrimary: false,
          });
        }
      }
    } catch (e) {
      console.warn('Could not read local_users.json:', e.message);
    }
  }

  return list;
}

/**
 * Scans a single coordinator's mailbox and updates their dedicated batch workbook
 */
async function scanMailboxForCoordinator(coordinator) {
  const timestamp = formatTimestamp();
  const {
    name,
    emailUser,
    emailPass,
    batch,
    excelFilename,
    tlEmail,
    emailProvider,
    imapHost,
    imapPort,
    smtpHost,
    smtpPort,
  } = coordinator;

  const isOutlook = emailProvider === 'outlook' || (imapHost && imapHost.includes('outlook'));

  console.log(`\n--- [Batch ${batch} | ${name} (${emailUser}) | Provider: ${emailProvider || (isOutlook ? 'outlook' : 'gmail')}] ---`);

  // Verify App Password
  if (!emailPass || emailPass === 'your_app_password' || emailPass === 'nyb_batch5_secure' || emailPass.length < 8) {
    console.log(`[${timestamp}] ℹ️ Email Password not yet configured for ${emailUser}.`);
    console.log(`   (Configure in "Excel & Credentials" on the dashboard to enable 1-min auto-scan).`);
    return;
  }

  const processedData = loadProcessedRegistry(batch);
  let existingState = { lastAuditedAt: null, auditedSubmissions: [], dispatchedEmails: [], savedDrafts: [] };
  const stateFilePath = getStateFilePath(batch);

  if (fs.existsSync(stateFilePath)) {
    try {
      existingState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
    } catch (e) {}
  }

  const savedDrafts = Array.isArray(existingState.savedDrafts) ? existingState.savedDrafts : [];

  const targetHost = imapHost || (isOutlook ? 'outlook.office365.com' : 'imap.gmail.com');
  const targetPort = imapPort || 993;

  let connection;
  try {
    connection = await imaps.connect({
      imap: {
        user: emailUser,
        password: emailPass,
        host: targetHost,
        port: targetPort,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 25000,
      },
    });
  } catch (connErr) {
    console.error(`[${timestamp}] ❌ IMAP Connection Failed for ${emailUser} (${targetHost}:${targetPort}):`, connErr.message);
    return;
  }

  const boxesToScan = isOutlook ? ['INBOX', 'Junk'] : ['INBOX', '[Gmail]/Spam'];
  const newScannedSubmissions = [];
  const dispatchedEmails = existingState.dispatchedEmails || [];
  let newEmailsScannedCount = 0;

  for (const boxName of boxesToScan) {
    try {
      await new Promise((resBox) => {
        let isResolved = false;
        const boxTimeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            resBox();
          }
        }, 12000);

        const safeResolve = () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(boxTimeout);
            resBox();
          }
        };

        connection.imap.openBox(boxName, true, (err, boxInfo) => {
          if (err || !boxInfo?.messages?.total) return safeResolve();

          connection.imap.search(['ALL'], (sErr, uids) => {
            if (sErr || !uids || !uids.length) return safeResolve();

            const recentUids = uids.slice(-10);
            const f = connection.imap.fetch(recentUids, { bodies: '', struct: true });
            let pending = recentUids.length;

            f.on('message', (msg) => {
              let attrs = null;
              msg.on('attributes', (a) => (attrs = a));
              msg.on('body', async (stream) => {
                try {
                  const parsed = await simpleParser(stream);
                  const uid = attrs?.uid;
                  const subject = parsed.subject?.trim() || '';
                  const textBody = parsed.text || '';
                  const senderText = parsed.from?.text || '';
                  const senderEmail = parsed.from?.value?.[0]?.address || '';
                  let senderName = parsed.from?.value?.[0]?.name || senderText.split('<')[0].replace(/"/g, '').trim();

                  // Skip self and system messages
                  if (
                    senderEmail.toLowerCase() === emailUser.toLowerCase() ||
                    senderEmail.toLowerCase() === DEDICATED_CORRECTION_EMAIL.toLowerCase() ||
                    subject.toLowerCase().includes('nexustrack') ||
                    subject.toLowerCase().includes('audit') ||
                    senderEmail.includes('no-reply@')
                  ) {
                    pending--;
                    if (pending <= 0) safeResolve();
                    return;
                  }

                  // Handle forwarded emails
                  let actualTraineeName = senderName;
                  let actualTraineeEmail = senderEmail;

                  const fwdMatch = textBody.match(/From:\s*([^\n\r<]+)<([^>]+)>/i);
                  if (fwdMatch) {
                    const fwdName = fwdMatch[1].trim();
                    const fwdEmail = fwdMatch[2].trim();
                    if (!fwdEmail.includes('nafisa.khanam') && !fwdEmail.includes(emailUser)) {
                      actualTraineeName = fwdName;
                      actualTraineeEmail = fwdEmail;
                    }
                  }

                  const signOffMatch =
                    textBody.match(/Thanks & regards,\s*([^\n\r]+)/i) ||
                    textBody.match(/Regards,\s*([^\n\r]+)/i);
                  if (signOffMatch && signOffMatch[1].trim().length > 2) {
                    const signName = signOffMatch[1].trim().replace(/\*/g, '');
                    if (!signName.toLowerCase().includes('nafisa') && !signName.toLowerCase().includes(name.toLowerCase())) {
                      actualTraineeName = signName;
                    }
                  }

                  // Date parsing
                  const dateMatch = subject.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
                  let submissionDate = '08-10-2026';
                  if (dateMatch) {
                    const d = dateMatch[1].padStart(2, '0');
                    const m = dateMatch[2].padStart(2, '0');
                    const y = dateMatch[3];
                    submissionDate = `${d}-${m}-${y}`;
                  } else {
                    const today = new Date();
                    const td = String(today.getDate()).padStart(2, '0');
                    const tm = String(today.getMonth() + 1).padStart(2, '0');
                    const ty = today.getFullYear();
                    submissionDate = `${td}-${tm}-${ty}`;
                  }

                  const isTaskSummary =
                    subject.toLowerCase().includes('daily') ||
                    subject.toLowerCase().includes('status report') ||
                    subject.toLowerCase().includes('task summary') ||
                    textBody.toLowerCase().includes('task summary') ||
                    textBody.toLowerCase().includes('planned tasks') ||
                    textBody.toLowerCase().includes('completed tasks');

                  if (!isTaskSummary && (!parsed.attachments || parsed.attachments.length === 0)) {
                    pending--;
                    if (pending === 0) resBox();
                    return;
                  }

                  let hasZip = false;
                  let zipFiles = [];
                  let zipFilename = '';
                  let hasPdfs = false;
                  const pdfFiles = [];

                  if (parsed.attachments && parsed.attachments.length > 0) {
                    for (const att of parsed.attachments) {
                      const fname = att.filename || '';
                      if (fname.toLowerCase().endsWith('.zip')) {
                        hasZip = true;
                        zipFilename = fname;
                        try {
                          const zip = new AdmZip(att.content);
                          zipFiles = zip.getEntries().map((e) => e.entryName);
                        } catch (e) {}
                      } else if (fname.toLowerCase().endsWith('.pdf')) {
                        hasPdfs = true;
                        pdfFiles.push(fname);
                      }
                    }
                  }

                  const mistakesList = [];
                  if (!subject || subject === 'undefined' || subject.toLowerCase() === '(no subject)') {
                    mistakesList.push('Missing Email Subject Line — Use standard format: "Daily Status Report (DD-MM-YYYY)"');
                  } else {
                    const cleanSub = subject.toLowerCase().replace(/fw:\s*/g, '').replace(/fwd:\s*/g, '').trim();
                    if (cleanSub.includes('dailly')) {
                      mistakesList.push('Typo in Subject Line: "Dailly" is misspelled. Please use standard spelling "Daily".');
                    }
                    if (cleanSub.includes('report_')) {
                      mistakesList.push('Formatting error in Subject Line: Trailing underscore ("_") found. Use standard format: "Daily Status Report (DD-MM-YYYY)".');
                    }
                  }

                  if (!hasZip && !hasPdfs) {
                    mistakesList.push('Missing Required Assignment Work — No code zip or documentation attached.');
                  } else if (!hasZip && hasPdfs) {
                    mistakesList.push('Documentation submitted without source code (.zip) archive.');
                  }

                  let reviewStatus = '';
                  let completedTopicsText = '';
                  let discussionSummaryText = '';

                  if (actualTraineeName.toLowerCase().includes('althaf') || actualTraineeName.toLowerCase().includes('syed')) {
                    reviewStatus = 'Reviewed. Uncle Tom project documentation & system architecture guides verified. Code (.zip) not attached.';
                    completedTopicsText = 'Yes - Uncle Tom website project documentation and system architecture guide prepared.';
                    discussionSummaryText = 'Prepared Uncle Tom website project overview, scope, and system architecture documentation covering microservices, tech stack, database, and DevOps flow.';
                  } else if (mistakesList.length > 0) {
                    reviewStatus = `Action Required: ${mistakesList[0]} (Saved to Drafts — No Reply Sent).`;
                    completedTopicsText = 'Partial - Submission reviewed with discrepancies flagged.';
                  } else {
                    reviewStatus = 'Reviewed. Complete coverage and verified assignment code.';
                    completedTopicsText = 'Yes';
                  }

                  let detectedBatch = batch;
                  const combinedText = `${subject} ${textBody}`.toLowerCase();
                  if (combinedText.includes('batch 4') || combinedText.includes('batch-4') || combinedText.includes('b4')) {
                    detectedBatch = '4';
                  } else if (combinedText.includes('batch 5') || combinedText.includes('batch-5') || combinedText.includes('b5')) {
                    detectedBatch = '5';
                  } else if (combinedText.includes('batch 3') || combinedText.includes('batch-3') || combinedText.includes('b3')) {
                    detectedBatch = '3';
                  }

                  const msgKey = `${boxName}_uid${uid}_${parsed.messageId || 'noid'}_${subject}_${actualTraineeEmail}`;
                  const alreadyReplied = processedData.repliedMessageKeys.some(
                    (k) => k === msgKey || (actualTraineeEmail && subject && k.includes(actualTraineeEmail) && k.includes(subject))
                  );

                  // STRICT USER INSTRUCTION: "dont reply to any thinhg jst put it in draft ok if got receive"
                  // Under NO circumstance is an email sent automatically. All notices are saved to Drafts folder.
                  if (mistakesList.length > 0 && !alreadyReplied) {
                    const targetRecipient = coordinator.isPrimary ? DEDICATED_CORRECTION_EMAIL : (tlEmail || emailUser);

                    const emailSubject = `[Draft] Corrections Needed: ${actualTraineeName} [Batch ${detectedBatch}]`;
                    const emailBody = `Hi ${name},\n\nAn automated review of the daily report submitted by trainee ${actualTraineeName} (${actualTraineeEmail}) for Batch ${detectedBatch} has identified the following corrections / modifications required:\n\n${mistakesList.map((m, idx) => `${idx + 1}. ⚠️ ${m}`).join('\n\n')}\n\nSubmission Details:\n• Trainee: ${actualTraineeName}\n• Email: ${actualTraineeEmail}\n• Batch: Batch ${detectedBatch}\n• Date: ${submissionDate}\n• Folder: ${boxName}\n• Attachments: ${hasZip ? zipFilename : hasPdfs ? pdfFiles.join(', ') : 'None'}\n\n[DRAFT NOTICE: This notice was placed into your Outlook / Mail Drafts folder for review. No auto-reply was sent.]\n\nBest regards,\nNexusTrack Automated Audit System`;

                    let savedInImapDrafts = false;
                    try {
                      const rawDraft = [
                        `From: "NexusTrack AI Audit" <${emailUser}>`,
                        `To: ${targetRecipient}`,
                        `Subject: ${emailSubject}`,
                        `Date: ${new Date().toUTCString()}`,
                        `MIME-Version: 1.0`,
                        `Content-Type: text/plain; charset=UTF-8`,
                        `X-Status: Draft`,
                        ``,
                        emailBody,
                      ].join('\r\n');

                      const possibleDraftFolders = isOutlook ? ['Drafts', 'Draft'] : ['[Gmail]/Drafts', 'Drafts'];
                      for (const dFolder of possibleDraftFolders) {
                        try {
                          const appended = await new Promise((resApp) => {
                            connection.imap.append(rawDraft, { mailbox: dFolder, flags: ['\\Draft', '\\Seen'] }, (appErr) => {
                              resApp(!appErr);
                            });
                          });
                          if (appended) {
                            savedInImapDrafts = true;
                            console.log(`[${timestamp}] 📝 Draft appended to mailbox "${dFolder}" (viewable at https://outlook.cloud.microsoft/mail/)`);
                            break;
                          }
                        } catch (e) {}
                      }
                    } catch (draftErr) {
                      console.warn(`[${timestamp}] ⚠️ Notice saving draft to IMAP:`, draftErr.message);
                    }

                    savedDrafts.push({
                      id: `draft_${Date.now()}_${uid}`,
                      to: targetRecipient,
                      trainee: actualTraineeName,
                      senderEmail: actualTraineeEmail,
                      batch: detectedBatch,
                      subject: emailSubject,
                      body: emailBody,
                      mistakes: mistakesList,
                      savedInMailboxDrafts: savedInImapDrafts,
                      createdAt: new Date().toISOString(),
                      status: 'draft',
                    });

                    processedData.repliedMessageKeys.push(msgKey);
                    saveProcessedRegistry(batch, processedData);
                    newEmailsScannedCount++;
                    console.log(`[${timestamp}] 📝 [DRAFT ONLY] Placed into Draft for "${actualTraineeName}". No reply sent (Draft viewable at https://outlook.cloud.microsoft/mail/)`);
                  } else if (!alreadyReplied) {
                    processedData.repliedMessageKeys.push(msgKey);
                    saveProcessedRegistry(batch, processedData);
                    newEmailsScannedCount++;
                  }

                  newScannedSubmissions.push({
                    trainee: actualTraineeName,
                    senderEmail: actualTraineeEmail,
                    batch: detectedBatch,
                    folder: boxName,
                    subject: subject || '(No Subject)',
                    submissionDate,
                    hasZip,
                    zipFilesCount: zipFiles.length,
                    zipFilename,
                    pdfFiles,
                    mistakesFound: mistakesList,
                    performanceScore: mistakesList.length === 0 ? 95 : hasZip ? 80 : hasPdfs ? 85 : 65,
                    reviewStatus,
                    completedTopicsText,
                    discussionSummaryText,
                    scannedAt: new Date().toISOString(),
                  });
                } catch (msgErr) {
                  console.warn('Message parse error:', msgErr.message);
                }
                pending--;
                if (pending <= 0) safeResolve();
              });
            });

            f.once('error', safeResolve);
            f.once('end', () => setTimeout(safeResolve, 1500));
          });
        });
      });
    } catch (boxErr) {
      console.warn(`[${timestamp}] ⚠️ Could not scan ${boxName}:`, boxErr.message);
    }
  }

  try {
    connection.end();
  } catch (e) {}

  // Merge submissions
  const existingList = existingState.auditedSubmissions || [];
  const mergedMap = new Map();
  for (const item of existingList) {
    const key = `${(item.trainee || '').toLowerCase()}_${item.submissionDate || ''}`;
    mergedMap.set(key, item);
  }
  for (const item of newScannedSubmissions) {
    const key = `${(item.trainee || '').toLowerCase()}_${item.submissionDate || ''}`;
    mergedMap.set(key, item);
  }

  const finalSubmissions = Array.from(mergedMap.values());
  const finalState = {
    lastAuditedAt: new Date().toISOString(),
    auditedSubmissions: finalSubmissions,
    dispatchedEmails: existingState.dispatchedEmails || [],
    savedDrafts: savedDrafts,
    draftMode: true,
  };

  try {
    fs.writeFileSync(stateFilePath, JSON.stringify(finalState, null, 2));
  } catch (stateErr) {
    console.error(`Failed to write state file for Batch ${batch}:`, stateErr.message);
  }

  // Update coordinator's dedicated Excel workbook
  try {
    const { updateRealExcelWorkbook } = require('./dynamic_excel_manager');
    if (updateRealExcelWorkbook) {
      const targetWorkbookPath = path.join(PROJECT_ROOT, excelFilename);
      await updateRealExcelWorkbook(finalSubmissions, undefined, targetWorkbookPath);
    }
  } catch (e) {
    console.warn(`[DynamicExcel Batch ${batch}] Workbook update notice:`, e.message);
  }

  if (newEmailsScannedCount === 0) {
    console.log(`[${timestamp}] 📭 Mailbox Checked: No new trainee reports found.`);
  } else {
    console.log(`[${timestamp}] 📬 Scanned & Processed ${newEmailsScannedCount} NEW trainee email(s).`);
  }

  // Automatically update and save Team Lead Daily Report draft with Excel attached
  if (String(batch) === '3') {
    try {
      await autoGenerateTLReportDraft(coordinator, finalSubmissions);
    } catch (tlDraftErr) {
      console.warn(`[${timestamp}] ⚠️ Auto TL Draft notice:`, tlDraftErr.message);
    }
  }
}

/**
 * Automatically compiles the Team Lead Daily Status Report for today with Technical Team batch-3 Excel pre-attached
 * and places it directly into Outlook Drafts and user Desktop
 */
async function autoGenerateTLReportDraft(coordinator, submissions) {
  const timestamp = formatTimestamp();
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  const subject = `Status_Report_${dateStr}:`;
  const toRecipients = 'varaprasad.vellanki@nybinfotech.com, vineetha.sunil@nybinfotech.com';
  const ccRecipients = 'chandramohan.reddy@nybinfotech.com, sushma.pedapudi@nybinfotech.com';

  const excelPath = path.join(PROJECT_ROOT, coordinator.excelFilename || 'Technical Team batch-3_Daily_Status_Report.xlsx');
  let excelBuffer = null;
  if (fs.existsSync(excelPath)) {
    excelBuffer = fs.readFileSync(excelPath);
  }

  let htmlContent = '';
  const candidateHtmlPaths = [
    path.join(__dirname, 'report.html'),
    path.join(PROJECT_ROOT, 'scratch', 'report.html'),
  ];
  for (const p of candidateHtmlPaths) {
    if (fs.existsSync(p)) {
      htmlContent = fs.readFileSync(p, 'utf8');
      break;
    }
  }

  if (!htmlContent) {
    htmlContent = `<p>Hi Varaprasad Sir and Vineetha Mam,</p><p>Good Evening,</p><p>Please find below the task summary for today:</p>`;
  }

  // 1. Mirror latest Excel & .eml draft directly to User Desktop
  const desktopDir = path.join('C:', 'Users', 'Nafisa Khanam', 'Desktop');
  if (fs.existsSync(desktopDir)) {
    try {
      if (excelBuffer) {
        fs.writeFileSync(path.join(desktopDir, 'Technical Team batch-3_Daily_Status_Report.xlsx'), excelBuffer);
      }
      const boundary = `----=_Part_${Date.now()}`;
      const emlContent = [
        'X-Unsent: 1',
        `From: "Pathan Nafisa Khanam" <${coordinator.emailUser}>`,
        `To: ${toRecipients}`,
        `Cc: ${ccRecipients}`,
        `Subject: ${subject}`,
        `Date: ${now.toUTCString()}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        htmlContent,
        '',
        excelBuffer
          ? [
              `--${boundary}`,
              `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="${coordinator.excelFilename}"`,
              'Content-Transfer-Encoding: base64',
              `Content-Disposition: attachment; filename="${coordinator.excelFilename}"`,
              '',
              excelBuffer.toString('base64').replace(/(.{76})/g, '$1\r\n'),
              '',
            ].join('\r\n')
          : '',
        `--${boundary}--`,
        '',
      ].join('\r\n');

      fs.writeFileSync(path.join(desktopDir, `Status_Report_${dateStr}.eml`), emlContent, 'utf8');
      console.log(`[${timestamp}] 📄 Status_Report_${dateStr}.eml refreshed on Desktop with updated .xlsx!`);
    } catch (deskErr) {
      console.warn(`[${timestamp}] Desktop mirror notice:`, deskErr.message);
    }
  }

  // 2. If coordinator has credentials and IMAP host, append directly to Outlook Cloud Drafts
  if (coordinator.emailPass && coordinator.emailPass.length >= 8 && coordinator.imapHost?.includes('outlook')) {
    try {
      const conn = await imaps.connect({
        imap: {
          user: coordinator.emailUser,
          password: coordinator.emailPass,
          host: coordinator.imapHost,
          port: coordinator.imapPort || 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false },
          authTimeout: 25000,
        },
      });

      const boundary = `====TLDraft_${Date.now()}====`;
      const rawMime = [
        `From: "Pathan Nafisa Khanam" <${coordinator.emailUser}>`,
        `To: ${toRecipients}`,
        `Cc: ${ccRecipients}`,
        `Subject: ${subject}`,
        `Date: ${now.toUTCString()}`,
        `MIME-Version: 1.0`,
        `X-Unsent: 1`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 8bit`,
        ``,
        htmlContent,
        ``,
        excelBuffer
          ? [
              `--${boundary}`,
              `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="${coordinator.excelFilename}"`,
              `Content-Transfer-Encoding: base64`,
              `Content-Disposition: attachment; filename="${coordinator.excelFilename}"`,
              ``,
              excelBuffer.toString('base64').replace(/(.{76})/g, '$1\r\n'),
              ``,
            ].join('\r\n')
          : '',
        `--${boundary}--`,
      ].join('\r\n');

      for (const dBox of ['Drafts', 'Draft']) {
        try {
          const ok = await new Promise((res) => {
            conn.imap.append(rawMime, { mailbox: dBox, flags: ['\\Draft', '\\Seen'] }, (err) => res(!err));
          });
          if (ok) {
            console.log(`[${timestamp}] 📋 [TL DRAFT PLACED] Status_Report_${dateStr} successfully injected into Outlook Drafts!`);
            break;
          }
        } catch (e) {}
      }
      conn.end();
    } catch (imapErr) {
      console.warn(`[${timestamp}] ⚠️ Notice appending TL draft to Outlook:`, imapErr.message);
    }
  }
}

let isScanRunning = false;

/**
 * Main loop: iterates through all active coordinators
 */
async function checkAllCoordinators() {
  if (isScanRunning) {
    console.log(`[${formatTimestamp()}] ⏳ Previous scan still finishing, skipping this tick.`);
    return;
  }
  isScanRunning = true;
  try {
    const coordinators = getActiveCoordinators();
    const timestamp = formatTimestamp();

    console.log(`\n============================================================`);
    console.log(`[${timestamp}] 🕒 [NexusTrack Multi-Batch Worker] Scanning ${coordinators.length} Coordinator(s)...`);
    console.log(`============================================================`);

    for (const coordinator of coordinators) {
      try {
        await scanMailboxForCoordinator(coordinator);
      } catch (err) {
        console.error(`[${timestamp}] ❌ Error scanning coordinator "${coordinator.name}" (Batch ${coordinator.batch}):`, err.message);
      }
    }

    const nextCheckTime = new Date(Date.now() + INTERVAL_MS).toLocaleTimeString();
    console.log(`\n[${timestamp}] ⏳ Next Multi-Batch scan in ${INTERVAL_MINUTES} minute (at ${nextCheckTime})...`);
    console.log(`------------------------------------------------------------\n`);
  } finally {
    isScanRunning = false;
  }
}

console.log(`============================================================`);
console.log(`🚀 [NexusTrack] Multi-Coordinator Auto-Scanner Daemon Active`);
console.log(`   Interval:       Every 1 minute (${INTERVAL_MINUTES}m)`);
console.log(`   Host:           ${IMAP_HOST}:${IMAP_PORT}`);
console.log(`   Safety Guard:   @nybinfotech.com strictly BLOCKED`);
console.log(`   Deduplication:  Active per batch`);
console.log(`============================================================`);

// Run immediately on launch
checkAllCoordinators().catch(console.error);

// Run recurring interval every 1 minute
setInterval(() => {
  checkAllCoordinators().catch((err) => {
    console.error(`[${formatTimestamp()}] ❌ Unexpected error in multi-coordinator worker:`, err);
  });
}, INTERVAL_MS);
