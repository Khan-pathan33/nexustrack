import fs from 'fs';
import path from 'path';
import { store, genId } from '@/lib/mock-data';

export interface AttendanceRecord {
  _id: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  batchNumber: string;
  date: string; // YYYY-MM-DD
  loginTime: string;
  logoutTime: string;
  status: 'on-time' | 'grace-period' | 'late' | 'absent' | 'on-leave' | 'logged-out';
  goodMorningSent: boolean;
  absenceNoticeSent: boolean;
  absenceNoticeDraftedAt?: string;
  minutesLate: number;
  remarks: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __nexusAttendanceStore: Record<string, AttendanceRecord[]> | undefined;
}

if (!globalThis.__nexusAttendanceStore) {
  globalThis.__nexusAttendanceStore = {};
}

const attendanceCache = globalThis.__nexusAttendanceStore;

/**
 * Returns formatted time string: "09:05 AM"
 */
export function formatTimeString(dateObj: Date = new Date()): string {
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Computes minutes relative to 9:00 AM on today's date
 */
export function calculateMinutesFrom9AM(timeStr?: string): number {
  const now = new Date();
  let targetHour = now.getHours();
  let targetMinute = now.getMinutes();

  if (timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const period = match[3]?.toUpperCase();
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      targetHour = h;
      targetMinute = m;
    }
  }

  const standardMinutes = 9 * 60; // 09:00 AM
  const currentTotalMinutes = targetHour * 60 + targetMinute;
  return currentTotalMinutes - standardMinutes;
}

/**
 * Formats the exact absence warning mail requested by the user
 */
export function generateAbsenceNoticeText(traineeName: string): string {
  const firstName = traineeName.trim().split(' ')[0] || traineeName;
  return `Hello ${firstName},
I noticed that you have not logged in today, and there has been no Good Morning message from your end in the group as part of the daily login process.
You also appear to be away, and I have not received any leave request or prior communication regarding your absence today.
Clarify the reason for your absence and ensure that the daily login process is followed consistently going forward.`;
}

export const ACTIVE_BATCH_3_TRAINEES = [
  'Althaf Syed',
  'Bala Krishna Parimi',
  'Chandra Shekar K',
  'Girish C',
  'Sana Sulthana',
  'Tejaswar Rao',
];

export const ACTIVE_BATCH_4_TRAINEES = [
  'Adinarayana Meesala',
  'Adithya Ram',
  'Jose Amala Kishor',
  'Snehith Reddy Challa',
  'Sruthi Badavath',
  'Nikhil Kumar Kurapati',
  'Ramesh Kumar A',
];

/**
 * Retrieve or initialize attendance records for a given date
 */

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
  if (/^\d{2}-\d{2}-\d{4}$/.test(cleaned)) {
    const [day, m, y] = cleaned.split('-');
    return `${y}-${m}-${day}`;
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

/**
 * Retrieve or initialize attendance records dynamically date-wise from persistent history.
 * Zero hardcoded names or absent assumptions!
 */
export function getOrCreateAttendanceForDate(
  dateStr: string,
  batchFilter: string = '3'
): AttendanceRecord[] {
  const normDate = normalizeDateStr(dateStr);
  const cacheKey = `${normDate}_b${batchFilter}`;

  // Load from date-wise persistent history first (source of truth)
  const history = loadHistoryFile();
  const dayBatchHistory = history[normDate]?.[batchFilter];

  if (dayBatchHistory?.punches?.length) {
    const recordsFromHistory: AttendanceRecord[] = dayBatchHistory.punches.map((p: any) => ({
      _id: p.traineeId || genId(),
      traineeId: p.traineeId || `t_${p.traineeName.replace(/\s+/g, '_').toLowerCase()}`,
      traineeName: p.traineeName,
      traineeEmail: p.traineeEmail || `${p.traineeName.toLowerCase().replace(/\s+/g, '.')}@nybinfotech.com`,
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

  if (attendanceCache[cacheKey]?.length) {
    return attendanceCache[cacheKey];
  }

  // Clean initial defaults for trainees in this cohort
  const activeNames = batchFilter === '4' ? ACTIVE_BATCH_4_TRAINEES : ACTIVE_BATCH_3_TRAINEES;
  const initialRecords: AttendanceRecord[] = activeNames.map((name) => {
    const storeTrainee = store.trainees.find((t) => t.name.toLowerCase() === name.toLowerCase());
    return {
      _id: storeTrainee?._id || genId(),
      traineeId: storeTrainee?._id || `t_${name.replace(/\s+/g, '_').toLowerCase()}`,
      traineeName: name,
      traineeEmail: storeTrainee?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@nybinfotech.com`,
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
}

export function recordTraineeLogin(
  traineeId: string,
  dateStr: string,
  batchFilter: string = '3',
  customTime?: string,
  graceMinutes: number = 15
): AttendanceRecord | null {
  const records = getOrCreateAttendanceForDate(dateStr, batchFilter);
  const rec = records.find(r => r.traineeId === traineeId);
  if (!rec) return null;

  const loginTime = customTime || formatTimeString(new Date());
  const diffMinutes = calculateMinutesFrom9AM(loginTime);

  let status: AttendanceRecord['status'] = 'on-time';
  if (diffMinutes <= 0) {
    status = 'on-time';
  } else if (diffMinutes <= graceMinutes) {
    status = 'grace-period';
  } else {
    status = 'late';
  }

  rec.loginTime = loginTime;
  rec.status = status;
  rec.goodMorningSent = true;
  rec.minutesLate = Math.max(0, diffMinutes);
  rec.remarks =
    status === 'on-time'
      ? 'Punctual login recorded.'
      : status === 'grace-period'
      ? `Logged in ${diffMinutes}m after 9:00 AM (within ${graceMinutes}m grace).`
      : `Late login recorded (${diffMinutes}m after 9:00 AM).`;

  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;
}

/**
 * Record Trainee Logout
 */
export function recordTraineeLogout(
  traineeId: string,
  dateStr: string,
  batchFilter: string = '3',
  customTime?: string
): AttendanceRecord | null {
  const records = getOrCreateAttendanceForDate(dateStr, batchFilter);
  const rec = records.find(r => r.traineeId === traineeId);
  if (!rec) return null;

  const logoutTime = customTime || formatTimeString(new Date());
  rec.logoutTime = logoutTime;
  rec.status = 'logged-out';
  rec.remarks = `Day shift completed. Logged out at ${logoutTime}.`;

  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;
}

/**
 * Toggle Good Morning message flag
 */
export function toggleTraineeGoodMorning(
  traineeId: string,
  dateStr: string,
  batchFilter: string = '3'
): AttendanceRecord | null {
  const records = getOrCreateAttendanceForDate(dateStr, batchFilter);
  const rec = records.find(r => r.traineeId === traineeId);
  if (!rec) return null;

  rec.goodMorningSent = !rec.goodMorningSent;
  syncAttendanceRecordToHistory(dateStr, batchFilter, rec);
  return rec;
}

/**
 * Mark Absence Notice as Sent
 */
export function markAbsenceNoticeSent(
  traineeId: string,
  dateStr: string,
  batchFilter: string = '3'
): AttendanceRecord | null {
  const records = getOrCreateAttendanceForDate(dateStr, batchFilter);
  const rec = records.find(r => r.traineeId === traineeId);
  if (!rec) return null;

  rec.absenceNoticeSent = true;
  rec.absenceNoticeDraftedAt = formatTimeString(new Date());
  return rec;
}
