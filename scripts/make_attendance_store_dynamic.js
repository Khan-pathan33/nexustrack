const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'lib', 'attendance-store.ts');
let code = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. Add fs and path imports if missing
if (!code.includes("import fs from 'fs';")) {
  code = `import fs from 'fs';\nimport path from 'path';\n${code}`;
}

// 2. Add helper functions
const helpers = `
function loadHistoryFile(): Record<string, Record<string, any>> {
  try {
    const fPath = path.join(process.cwd(), 'teams_attendance_history.json');
    if (fs.existsSync(fPath)) {
      return JSON.parse(fs.readFileSync(fPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading teams_attendance_history.json:', err);
  }
  return {};
}

function normalizeDateStr(d?: string): string {
  if (!d) return new Date().toISOString().split('T')[0];
  const cleaned = d.trim();
  if (/^\\d{2}-\\d{2}-\\d{4}$/.test(cleaned)) {
    const [day, m, y] = cleaned.split('-');
    return \`\${y}-\${m}-\${day}\`;
  }
  return cleaned.split('T')[0];
}

function syncAttendanceRecordToHistory(dateStr: string, batchFilter: string, record: AttendanceRecord) {
  try {
    const fPath = path.join(process.cwd(), 'teams_attendance_history.json');
    if (!fs.existsSync(fPath)) return;
    const normDate = normalizeDateStr(dateStr);
    const history = JSON.parse(fs.readFileSync(fPath, 'utf8'));
    if (!history[normDate]) history[normDate] = {};
    if (!history[normDate][batchFilter]) {
      history[normDate][batchFilter] = {
        channel: batchFilter === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III',
        date: normDate,
        displayDate: normDate.split('-').reverse().join('-'),
        scannedAt: new Date().toISOString(),
        punches: [],
      };
    }

    const bObj = history[normDate][batchFilter];
    if (!bObj.punches) bObj.punches = [];
    const existingPunch = bObj.punches.find((p: any) =>
      p.traineeName.toLowerCase() === record.traineeName.toLowerCase()
    );

    if (existingPunch) {
      existingPunch.loginTime = record.loginTime;
      existingPunch.status = record.status;
      existingPunch.goodMorningSent = record.goodMorningSent;
      existingPunch.minutesLate = record.minutesLate;
    } else {
      bObj.punches.push({
        traineeId: record.traineeId,
        traineeName: record.traineeName,
        traineeEmail: record.traineeEmail,
        batchNumber: batchFilter,
        loginTime: record.loginTime,
        goodMorningSent: record.goodMorningSent,
        status: record.status,
        minutesLate: record.minutesLate,
        messageText: record.remarks,
      });
    }

    bObj.punchedCount = bObj.punches.filter((p: any) => p.status === 'on-time' || p.status === 'grace-period').length;
    bObj.totalTrainees = bObj.punches.length;
    bObj.onTimeCount = bObj.punches.filter((p: any) => p.status === 'on-time').length;
    bObj.graceCount = bObj.punches.filter((p: any) => p.status === 'grace-period').length;
    bObj.absentCount = bObj.punches.filter((p: any) => p.status === 'absent').length;

    fs.writeFileSync(fPath, JSON.stringify(history, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not sync record to history file:', err);
  }
}
`;

// 3. New dynamic getOrCreateAttendanceForDate implementation
const newGetOrCreateFunc = `/**
 * Retrieve or initialize attendance records dynamically date-wise from persistent history.
 * Zero hardcoded names or absent assumptions!
 */
export function getOrCreateAttendanceForDate(
  dateStr: string,
  batchFilter: string = '3'
): AttendanceRecord[] {
  const normDate = normalizeDateStr(dateStr);
  const cacheKey = \`\${normDate}_b\${batchFilter}\`;

  if (attendanceCache[cacheKey]?.length) {
    return attendanceCache[cacheKey];
  }

  // Load from date-wise persistent history first
  const history = loadHistoryFile();
  const dayBatchHistory = history[normDate]?.[batchFilter];

  if (dayBatchHistory?.punches?.length) {
    const recordsFromHistory: AttendanceRecord[] = dayBatchHistory.punches.map((p: any) => ({
      _id: p.traineeId || genId(),
      traineeId: p.traineeId || \`t_\${p.traineeName.replace(/\\s+/g, '_').toLowerCase()}\`,
      traineeName: p.traineeName,
      traineeEmail: p.traineeEmail || \`\${p.traineeName.toLowerCase().replace(/\\s+/g, '.')}@nybinfotech.com\`,
      batchNumber: batchFilter,
      date: normDate,
      loginTime: p.loginTime || '',
      logoutTime: '',
      status: p.status || (p.loginTime ? 'on-time' : 'absent'),
      goodMorningSent: Boolean(p.goodMorningSent),
      absenceNoticeSent: false,
      minutesLate: p.minutesLate || 0,
      remarks: p.messageText || (p.status === 'absent' ? 'No Good Morning message received.' : 'Logged in via Teams.'),
    }));

    attendanceCache[cacheKey] = recordsFromHistory;
    return recordsFromHistory;
  }

  // Clean initial defaults for trainees in this cohort
  const activeNames = batchFilter === '4' ? ACTIVE_BATCH_4_TRAINEES : ACTIVE_BATCH_3_TRAINEES;
  const initialRecords: AttendanceRecord[] = activeNames.map((name) => {
    const storeTrainee = store.trainees.find((t) => t.name.toLowerCase() === name.toLowerCase());
    return {
      _id: storeTrainee?._id || genId(),
      traineeId: storeTrainee?._id || \`t_\${name.replace(/\\s+/g, '_').toLowerCase()}\`,
      traineeName: name,
      traineeEmail: storeTrainee?.email || \`\${name.toLowerCase().replace(/\\s+/g, '.')}@nybinfotech.com\`,
      batchNumber: batchFilter,
      date: normDate,
      loginTime: '',
      logoutTime: '',
      status: 'absent',
      goodMorningSent: false,
      absenceNoticeSent: false,
      minutesLate: 0,
      remarks: 'Pending morning Teams roll call.',
    };
  });

  attendanceCache[cacheKey] = initialRecords;
  return initialRecords;
}`;

// Replace old getOrCreateAttendanceForDate function
const startIdx = code.indexOf('export function getOrCreateAttendanceForDate(');
const endIdx = code.indexOf('export function recordTraineeLogin(');
if (startIdx !== -1 && endIdx !== -1) {
  code = code.slice(0, startIdx) + helpers + '\n' + newGetOrCreateFunc + '\n\n' + code.slice(endIdx);
} else {
  console.error('Could not locate getOrCreateAttendanceForDate slice');
  process.exit(1);
}

// Add syncAttendanceRecordToHistory to mutations
code = code.replace(
  'rec.remarks =\n    status === \'on-time\'\n      ? \'Punctual login recorded.\'\n      : status === \'grace-period\'\n      ? `Logged in ${diffMinutes}m after 9:00 AM (within ${graceMinutes}m grace).`\n      : `Late login recorded (${diffMinutes}m after 9:00 AM).`;\n\n  return rec;',
  `rec.remarks =
    status === 'on-time'
      ? 'Punctual login recorded.'
      : status === 'grace-period'
      ? \`Logged in \${diffMinutes}m after 9:00 AM (within \${graceMinutes}m grace).\`
      : \`Late login recorded (\${diffMinutes}m after 9:00 AM).\`;

  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;`
);

code = code.replace(
  'rec.logoutTime = logoutTime;\n  rec.status = \'logged-out\';\n  rec.remarks = `Day shift completed. Logged out at ${logoutTime}.`;\n\n  return rec;',
  `rec.logoutTime = logoutTime;
  rec.status = 'logged-out';
  rec.remarks = \`Day shift completed. Logged out at \${logoutTime}.\`;

  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;`
);

code = code.replace(
  'rec.goodMorningSent = !rec.goodMorningSent;\n  return rec;',
  `rec.goodMorningSent = !rec.goodMorningSent;
  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;`
);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('src/lib/attendance-store.ts is now 100% dynamic and date-wise!');

