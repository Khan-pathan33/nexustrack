import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticTeamsMorningMessages,
  parseTeamsChatLog,
  TeamsScannedLoginItem,
  sendTeamsAbsenceAlert,
} from '@/lib/teams-service';
import {
  getOrCreateAttendanceForDate,
  generateAbsenceNoticeText,
  recordTraineeLogin,
} from '@/lib/attendance-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batch = searchParams.get('batch') || '3';
    const graceMinutes = parseInt(searchParams.get('grace') || '15', 10);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const scannedPunches = getAuthenticTeamsMorningMessages(batch, date, graceMinutes);

    const onTimeCount = scannedPunches.filter((p) => p.status === 'on-time').length;
    const graceCount = scannedPunches.filter((p) => p.status === 'grace-period').length;
    const absentPunches = scannedPunches.filter((p) => p.status === 'absent');

    const missingTraineesWithNotices = absentPunches.map((t) => ({
      ...t,
      absenceNoticeSubject: `⚠️ Clarification Required: Daily Login & Absence Notice (${date}) — ${t.traineeName}`,
      absenceNoticeBody: generateAbsenceNoticeText(t.traineeName),
    }));

    return NextResponse.json({
      success: true,
      batch,
      date,
      graceMinutes,
      totalTrainees: scannedPunches.length,
      punchedCount: onTimeCount + graceCount,
      onTimeCount,
      graceCount,
      absentCount: absentPunches.length,
      scannedPunches,
      missingTrainees: missingTraineesWithNotices,
    });
  } catch (error: any) {
    console.error('Error scanning Teams attendance:', error);
    return NextResponse.json({ error: error?.message || 'Failed to scan Teams attendance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      batch = '3',
      date = new Date().toISOString().split('T')[0],
      graceMinutes = 15,
      rawChatText,
      applyToRegister = false,
      autoNotifyTeams = false,
    } = body;

    let scannedPunches: TeamsScannedLoginItem[] = [];

    if (rawChatText && rawChatText.trim().length > 10) {
      scannedPunches = parseTeamsChatLog(rawChatText, batch, graceMinutes);
    } else {
      scannedPunches = getAuthenticTeamsMorningMessages(batch, date, graceMinutes);
    }

    // If requested, apply directly to the in-memory attendance registry
    if (applyToRegister) {
      const records = getOrCreateAttendanceForDate(date, batch);
      for (const punch of scannedPunches) {
        const targetRec = records.find(
          (r) =>
            r.traineeId === punch.traineeId ||
            r.traineeName.toLowerCase().trim() === punch.traineeName.toLowerCase().trim()
        );

        if (targetRec) {
          if (punch.loginTime) {
            targetRec.loginTime = punch.loginTime;
            targetRec.status = punch.status;
            targetRec.goodMorningSent = punch.goodMorningSent;
            targetRec.minutesLate = punch.minutesLate;
            targetRec.remarks =
              punch.status === 'on-time'
                ? 'Logged in on time via Teams.'
                : punch.status === 'grace-period'
                ? `Logged in via Teams (${punch.minutesLate}m after 9:00 AM).`
                : `Logged in via Teams late (${punch.minutesLate}m).`;
          } else {
            targetRec.status = 'absent';
            targetRec.goodMorningSent = false;
            targetRec.remarks = 'Pending login verification from Teams morning roll call.';
          }
        }
      }
    }

    const onTimeCount = scannedPunches.filter((p) => p.status === 'on-time').length;
    const graceCount = scannedPunches.filter((p) => p.status === 'grace-period').length;
    const absentPunches = scannedPunches.filter((p) => p.status === 'absent');

    const missingTraineesWithNotices = absentPunches.map((t) => ({
      ...t,
      absenceNoticeSubject: `⚠️ Clarification Required: Daily Login & Absence Notice (${date}) — ${t.traineeName}`,
      absenceNoticeBody: generateAbsenceNoticeText(t.traineeName),
    }));

    // If autoNotifyTeams is requested, post absence alerts for all absent trainees to Teams
    let teamsNotifiedCount = 0;
    if (autoNotifyTeams && absentPunches.length > 0) {
      for (const absent of absentPunches) {
        await sendTeamsAbsenceAlert({
          traineeName: absent.traineeName,
          batch,
          date,
        });
        teamsNotifiedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      batch,
      date,
      graceMinutes,
      totalTrainees: scannedPunches.length,
      punchedCount: onTimeCount + graceCount,
      onTimeCount,
      graceCount,
      absentCount: absentPunches.length,
      appliedToRegister: applyToRegister,
      teamsNotifiedCount,
      scannedPunches,
      missingTrainees: missingTraineesWithNotices,
      message: `Scanned ${scannedPunches.length} trainees from Teams (${onTimeCount + graceCount} present, ${absentPunches.length} absent).`,
    });
  } catch (error: any) {
    console.error('Error processing Teams attendance scan:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process Teams scan' }, { status: 500 });
  }
}

