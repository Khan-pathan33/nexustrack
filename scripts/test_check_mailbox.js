const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
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

async function checkEmails() {
  const connection = await imaps.connect({
    imap: {
      user: env.EMAIL_USER,
      password: env.EMAIL_PASS,
      host: env.IMAP_HOST || 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 30000,
    },
  });

  const boxes = ['INBOX', '[Gmail]/Spam'];
  for (const box of boxes) {
    console.log(`\n=== Checking Box: ${box} ===`);
    await new Promise((resolve) => {
      connection.imap.openBox(box, true, (err, boxInfo) => {
        if (err || !boxInfo?.messages?.total) {
          console.log('Error opening or box empty:', err?.message);
          return resolve();
        }
        console.log(`Total messages in ${box}:`, boxInfo.messages.total);

        connection.imap.search(['ALL'], (sErr, uids) => {
          if (sErr || !uids || !uids.length) {
            console.log('No uids found:', sErr?.message);
            return resolve();
          }
          const recentUids = uids.slice(-15); // Check last 15
          const f = connection.imap.fetch(recentUids, { bodies: '', struct: true });
          const messages = [];

          f.on('message', (msg, seqno) => {
            let attrs = null;
            msg.on('attributes', (a) => (attrs = a));
            msg.on('body', async (stream) => {
              try {
                const parsed = await simpleParser(stream);
                messages.push({
                  seqno,
                  uid: attrs?.uid,
                  date: parsed.date,
                  from: parsed.from?.text,
                  fromAddress: parsed.from?.value?.[0]?.address,
                  subject: parsed.subject,
                  attachments: parsed.attachments?.map((a) => a.filename),
                  snippet: (parsed.text || '').substring(0, 150).replace(/\s+/g, ' '),
                });
              } catch (e) {}
            });
          });

          f.once('end', () => {
            setTimeout(() => {
              console.log(`Fetched ${messages.length} messages in ${box}:`);
              messages.sort((a, b) => (new Date(b.date || 0)) - (new Date(a.date || 0)));
              messages.forEach((m, idx) => {
                console.log(`\n[${idx + 1}] Date: ${m.date}`);
                console.log(`    From: ${m.from} (${m.fromAddress})`);
                console.log(`    Subject: "${m.subject}"`);
                console.log(`    Attachments:`, m.attachments || []);
                console.log(`    Snippet: ${m.snippet}`);
              });
              resolve();
            }, 3000);
          });
        });
      });
    });
  }

  connection.end();
}

checkEmails().catch((e) => console.error(e));
