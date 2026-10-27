/**
 * Diagnostic test tool for Microsoft 365 Cloud Mail (https://outlook.cloud.microsoft/mail/)
 * Connects to outlook.office365.com:993 (SSL) and inspects INBOX, Junk, and Drafts.
 * 
 * Usage:
 *   node scripts/test_check_outlook.js [email] [password]
 * If no arguments are passed, it checks environment variables.
 */

const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  });
  return env;
}

const env = loadEnv();
const args = process.argv.slice(2);
const emailUser = args[0] || env.EMAIL_USER;
const emailPass = args[1] || env.EMAIL_PASS;
const host = 'outlook.office365.com';
const port = 993;

console.log('============================================================');
console.log('📬 Microsoft 365 Cloud Mail Connection Diagnostic');
console.log('   Web Endpoint:  https://outlook.cloud.microsoft/mail/');
console.log(`   IMAP Server:   ${host}:${port} (SSL)`);
console.log(`   Account:       ${emailUser || '(Not specified)'}`);
console.log('   Policy:        DRAFT ONLY — Zero auto-replies dispatched');
console.log('============================================================\n');

if (!emailUser || !emailPass) {
  console.log('⚠️ Please provide your Microsoft 365 / Outlook credentials:');
  console.log('   Run: node scripts/test_check_outlook.js <your_email> <your_password_or_app_password>');
  console.log('   Or configure Outlook in the NexusTrack dashboard ("Excel & Credentials").\n');
  process.exit(0);
}

async function runOutlookCheck() {
  try {
    console.log(`Connecting to ${host}:${port} as ${emailUser}...`);
    const connection = await imaps.connect({
      imap: {
        user: emailUser,
        password: emailPass,
        host,
        port,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 25000,
      },
    });

    console.log(' Connected successfully to Microsoft 365 Exchange Online!\n');

    const boxesToCheck = ['INBOX', 'Junk', 'Drafts'];

    for (const box of boxesToCheck) {
      console.log(`--- Checking Outlook Folder: [${box}] ---`);
      await new Promise((resolve) => {
        connection.imap.openBox(box, true, (err, boxInfo) => {
          if (err || !boxInfo?.messages?.total) {
            console.log(`   Folder "${box}": ${err ? err.message : '0 messages / empty'}`);
            return resolve();
          }
          console.log(`   Total items in "${box}": ${boxInfo.messages.total}`);

          connection.imap.search(['ALL'], (sErr, uids) => {
            if (sErr || !uids || !uids.length) {
              return resolve();
            }

            const recentUids = uids.slice(-5);
            const f = connection.imap.fetch(recentUids, { bodies: '', struct: true });
            const list = [];

            f.on('message', (msg, seqno) => {
              let attrs = null;
              msg.on('attributes', (a) => (attrs = a));
              msg.on('body', async (stream) => {
                try {
                  const parsed = await simpleParser(stream);
                  list.push({
                    seqno,
                    date: parsed.date,
                    from: parsed.from?.text,
                    subject: parsed.subject,
                    snippet: (parsed.text || '').substring(0, 100).replace(/\s+/g, ' '),
                  });
                } catch (e) {}
              });
            });

            f.once('end', () => {
              setTimeout(() => {
                list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                list.forEach((item, i) => {
                  console.log(`   [${i + 1}] Subject: "${item.subject}"`);
                  console.log(`       From: ${item.from}`);
                  console.log(`       Date: ${item.date}`);
                });
                console.log('');
                resolve();
              }, 1500);
            });
          });
        });
      });
    }

    connection.end();
    console.log('============================================================');
    console.log(' Outlook Cloud Mail check completed successfully.');
    console.log('   All drafts viewable at https://outlook.cloud.microsoft/mail/');
    console.log('============================================================\n');
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    console.log('\n💡 Tip: For Microsoft 365 or Outlook accounts with Two-Step Verification (MFA),');
    console.log('   generate an App Password in your Microsoft Account Security portal.');
  }
}

runOutlookCheck();
