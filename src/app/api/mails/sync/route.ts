import { NextResponse } from 'next/server';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import AdmZip from 'adm-zip';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Mail } from '@/models/Mail';
import { Project } from '@/models/Project';
import { store, genId } from '@/lib/mock-data';

export async function POST() {
  try {
    let mongoConnected = false;
    if (isMongoConfigured()) {
      try {
        const conn = await connectToDatabase();
        if (conn) mongoConnected = true;
      } catch (err) {
        console.warn('MongoDB connection unavailable for mail sync, using local store:', err);
      }
    }

    const config = {
      imap: {
        user: process.env.EMAIL_USER as string,
        password: process.env.EMAIL_PASS as string,
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: parseInt(process.env.IMAP_PORT || '993'),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 15000,
      }
    };

    if (!config.imap.user || !config.imap.password || config.imap.password === 'your_app_password') {
      return NextResponse.json({ message: 'IMAP credentials not configured properly in .env.local' }, { status: 400 });
    }

    const connection = await imaps.connect(config);
    const syncedMails: any[] = [];
    const boxesToScan = ['INBOX', '[Gmail]/Spam'];

    for (const boxName of boxesToScan) {
      try {
        await connection.openBox(boxName);
      } catch (boxErr) {
        console.warn(`Could not open mailbox ${boxName}:`, boxErr);
        continue;
      }

      // Search all messages in this box (take the most recent 15)
      const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], struct: true, markSeen: false };
      let messages: any[] = [];

      try {
        // Try searching unseen first
        const unseenMsgs = await connection.search(['UNSEEN'], fetchOptions);
        if (unseenMsgs && unseenMsgs.length > 0) {
          messages = unseenMsgs;
        } else {
          // If no unseen messages, fetch recent messages from the box
          const allMsgs = await connection.search(['ALL'], fetchOptions);
          messages = allMsgs.slice(-15);
        }
      } catch (searchErr) {
        console.warn(`Search error in ${boxName}:`, searchErr);
        continue;
      }

      for (const item of messages) {
        try {
          const all = item.parts.find((part: { which: string; body?: unknown }) => part.which === '');
          const id = item.attributes.uid;
          const idHeader = 'Imap-Id: ' + id + '\r\n';

          const parsed = await simpleParser(idHeader + (all?.body || ''));

          const fromText = parsed.from?.text || 'Unknown Sender';
          const toText = Array.isArray(parsed.to)
            ? parsed.to.map((t: { text?: string }) => t.text || '').join(', ')
            : parsed.to?.text || config.imap.user;
          const subjectText = parsed.subject?.trim() || '(No Subject — Daily Trainee Report)';
          const mailDate = parsed.date ? parsed.date.toISOString() : new Date().toISOString();

          // Check for duplicates
          if (mongoConnected) {
            const exists = await Mail.findOne({ from: fromText, date: mailDate });
            if (exists) continue;
          } else {
            const exists = store.mails.some(m => m.from === fromText && m.date === mailDate);
            if (exists) continue;
          }

          let zipContents = '';

          // Process zip attachments (e.g. Flexbox,grid_29-09-2026.zip)
          if (parsed.attachments && parsed.attachments.length > 0) {
            for (const attachment of parsed.attachments) {
              if (attachment.filename && attachment.filename.endsWith('.zip')) {
                try {
                  const zip = new AdmZip(attachment.content);
                  const zipEntries = zip.getEntries();

                  zipContents += `[Extracted ${attachment.filename} (${zipEntries.length} files)]:\n`;
                  zipEntries.slice(0, 10).forEach((zipEntry) => {
                    zipContents += `- ${zipEntry.entryName}\n`;
                  });
                  if (zipEntries.length > 10) {
                    zipContents += `... and ${zipEntries.length - 10} more files.\n`;
                  }
                } catch {
                  zipContents += `[Failed to inspect ${attachment.filename}]\n`;
                }
              }
            }
          }

          const isSpamFolder = boxName.includes('Spam');
          const category = zipContents ? 'zip-upload' : (isSpamFolder ? 'inbox-spam-recovered' : 'inbox');
          const bodyText = (parsed.text || 'No body text content.') + (zipContents ? '\n\n' + zipContents : '');

          // --- AUTO-PARSER FOR DAILY TASK SUMMARIES ---
          const parsedText = parsed.text || '';
          if (parsedText.toLowerCase().includes('task summary for today') || parsedText.toLowerCase().includes('planned tasks')) {
            try {
              const nameMatch = parsedText.match(/Thanks & Regards,\s*([^\n]+)/i) || parsedText.match(/Regards,\s*([^\n]+)/i);
              const traineeName = nameMatch ? nameMatch[1].trim() : (parsed.from?.value?.[0]?.name || fromText.split('<')[0].trim());

              const completedSection = parsedText.match(/Completed Tasks[\s\S]*?(?:Pending Tasks|Challenges|Planned Tasks)/i);
              const newMilestones: { title: string; completed: boolean }[] = [];

              if (completedSection) {
                const lines = completedSection[0]
                  .split('\n')
                  .map((l: string) => l.trim().replace(/^[-*•\d.]\s*/, ''))
                  .filter((l: string) => l.length > 3 && !l.toLowerCase().includes('completed tasks'));
                lines.slice(0, 8).forEach((l: string) => newMilestones.push({ title: l, completed: true }));
              }

              if (newMilestones.length > 0) {
                if (mongoConnected) {
                  await Project.findOneAndUpdate(
                    { name: `Status Report: ${traineeName}` },
                    {
                      name: `Status Report: ${traineeName}`,
                      description: `Auto-updated from trainee email update (${boxName})`,
                      status: 'active',
                      progress: 75,
                      team: [traineeName],
                      $push: { milestones: { $each: newMilestones } },
                      color: '#10b981'
                    },
                    { upsert: true }
                  );
                } else {
                  const existingProj = store.projects.find(p => p.name.includes(traineeName));
                  if (existingProj) {
                    existingProj.milestones.push(...newMilestones);
                    existingProj.progress = 80;
                  } else {
                    store.projects.push({
                      _id: genId(),
                      name: `Status Report: ${traineeName}`,
                      description: 'Auto-updated from daily trainee email',
                      status: 'active',
                      progress: 75,
                      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                      team: [traineeName],
                      milestones: newMilestones,
                      priority: 'high',
                      color: '#10b981'
                    });
                  }
                }
              }
            } catch (err) {
              console.warn("Failed to auto-parse tasks from email", err);
            }
          }

          // Save Mail entry
          if (mongoConnected) {
            const mailEntry = await Mail.create({
              subject: subjectText,
              from: fromText,
              to: toText,
              date: mailDate,
              priority: isSpamFolder ? 'high' : 'medium',
              status: 'pending',
              category,
              notes: bodyText
            });
            syncedMails.push(mailEntry);
          } else {
            const localMail = {
              _id: genId(),
              subject: subjectText,
              from: fromText,
              to: toText,
              date: mailDate,
              priority: (isSpamFolder ? 'high' : 'medium') as 'high' | 'medium' | 'low',
              status: 'pending' as const,
              category,
              notes: bodyText
            };
            store.mails.unshift(localMail);
            syncedMails.push(localMail);
          }
        } catch (itemErr) {
          console.warn('Error parsing message item:', itemErr);
        }
      }
    }

    connection.end();

    return NextResponse.json({
      message: 'Sync complete',
      newMails: syncedMails.length,
      syncedMails: syncedMails.map(m => ({ subject: m.subject, from: m.from, date: m.date }))
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('IMAP Sync Error:', error);
    return NextResponse.json({ message: 'Failed to sync emails', error: errorMsg }, { status: 500 });
  }
}
