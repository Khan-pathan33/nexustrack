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
export function getOrCreateAttendanceForDate(
  dateStr: string,
  batchFilter: string = '3'
): AttendanceRecord[] {
  const cacheKey = `${dateStr}_b${batchFilter}`;

  if (attendanceCache[cacheKey]) {
    // Invalidate stale cache if trainee count doesn't match the respective active batch cohort
    const expectedCount =
      batchFilter === '3'
        ? ACTIVE_BATCH_3_TRAINEES.length
        : batchFilter === '4'
        ? ACTIVE_BATCH_4_TRAINEES.length
        : 0;

    const isStale =
      attendanceCache[cacheKey].some(r => r.traineeName === 'Sana Sulthana' && r.status === 'on-leave') ||
      (expectedCount > 0 && attendanceCache[cacheKey].length !== expectedCount);

    if (isStale) {
      delete attendanceCache[cacheKey];
    }
  }

  if (!attendanceCache[cacheKey]) {
    // Collect all trainees for this cohort from in-memory store
    const cohortTrainees = store.trainees.filter(t => {
      if (batchFilter === 'all') return true;
      if (batchFilter === '3') {
        return ACTIVE_BATCH_3_TRAINEES.includes(t.name);
      }
      if (batchFilter === '4') {
        return ACTIVE_BATCH_4_TRAINEES.includes(t.name) || t.department?.includes('Batch 4');
      }
      return t.department?.includes(`Batch ${batchFilter}`);
    });

    // Provide authentic initial data with realistic morning punch timestamps
    const initialRecords: AttendanceRecord[] = cohortTrainees.map((t, idx) => {
      if (batchFilter === '4') {
        // Specific realistic attendance scenario for Batch 4 (Nikhil and Ramesh away)
        if (t.name === 'Nikhil Kumar Kurapati' || t.name === 'Ramesh Kumar A') {
          return {
            _id: genId(),
            traineeId: t._id,
            traineeName: t.name,
            traineeEmail: t.email,
            batchNumber: '4',
            date: dateStr,
            loginTime: '',
            logoutTime: '',
            status: 'absent',
            goodMorningSent: false,
            absenceNoticeSent: false,
            minutesLate: 0,
            remarks: 'Pending login verification.',
          };
        } else if (idx === 2 || idx === 3) {
          return {
            _id: genId(),
            traineeId: t._id,
            traineeName: t.name,
            traineeEmail: t.email,
            batchNumber: '4',
            date: dateStr,
            loginTime: `09:0${5 + (idx - 2) * 3} AM`,
            logoutTime: '',
            status: 'grace-period',
            goodMorningSent: true,
            absenceNoticeSent: false,
            minutesLate: 5 + (idx - 2) * 3,
            remarks: 'Logged in within grace period.',
          };
        } else {
          return {
            _id: genId(),
            traineeId: t._id,
            traineeName: t.name,
            traineeEmail: t.email,
            batchNumber: '4',
            date: dateStr,
            loginTime: `08:5${2 + (idx % 2) * 4} AM`,
            logoutTime: '',
            status: 'on-time',
            goodMorningSent: true,
            absenceNoticeSent: false,
            minutesLate: 0,
            remarks: 'Logged in before 9:00 AM.',
          };
        }
      }

      // Default Batch 3 logic
      if (idx === 0 || idx === 1) {
        // On Time (08:52 AM, 08:55 AM)
        return {
          _id: genId(),
          traineeId: t._id,
          traineeName: t.name,
          traineeEmail: t.email,
          batchNumber: batchFilter,
          date: dateStr,
          loginTime: `08:5${2 + idx * 3} AM`,
          logoutTime: '',
          status: 'on-time',
          goodMorningSent: true,
          absenceNoticeSent: false,
          minutesLate: 0,
          remarks: 'Logged in before 9:00 AM.',
        };
      } else if (idx === 2 || idx === 3) {
        // Grace period (09:05 AM, 09:08 AM)
        return {
          _id: genId(),
          traineeId: t._id,
          traineeName: t.name,
          traineeEmail: t.email,
          batchNumber: batchFilter,
          date: dateStr,
          loginTime: `09:0${5 + (idx - 2) * 3} AM`,
          logoutTime: '',
          status: 'grace-period',
          goodMorningSent: true,
          absenceNoticeSent: false,
          minutesLate: 5 + (idx - 2) * 3,
          remarks: 'Logged in within grace period.',
        };
      } else {
        // Absent / Pending Login (e.g. Sana Sulthana, Tejaswar Rao)
        return {
          _id: genId(),
          traineeId: t._id,
          traineeName: t.name,
          traineeEmail: t.email,
          batchNumber: batchFilter,
          date: dateStr,
          loginTime: '',
          logoutTime: '',
          status: 'absent',
          goodMorningSent: false,
          absenceNoticeSent: false,
          minutesLate: 0,
          remarks: 'Pending login verification.',
        };
      }
    });

    attendanceCache[cacheKey] = initialRecords;
  }

  return attendanceCache[cacheKey];
}

/**
 * Record Trainee Login
 */
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
