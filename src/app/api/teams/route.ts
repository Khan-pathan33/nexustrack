import { NextRequest, NextResponse } from 'next/server';
import {
  postToTeamsWebhook,
  sendTeamsAbsenceAlert,
  sendTeamsDailyAttendanceSummary,
  getTeamsWebhookUrl,
  TeamsMessagePayload,
  getAuthenticTeamsMorningMessages,
  parseTeamsChatLog,
  TeamsScannedLoginItem,
} from '@/lib/teams-service';
import {
  getOrCreateAttendanceForDate,
  generateAbsenceNoticeText,
} from '@/lib/attendance-store';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  // Handle Attendance Scanning via GET /api/teams?action=scan-attendance&batch=3
  if (action === 'scan-attendance') {
    const batch = searchParams.get('batch') || '3';
    const graceMinutes = parseInt(searchParams.get('grace') || '15', 10);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const scannedPunches = getAuthenticTeamsMorningMessages(batch, graceMinutes);

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
  }

  // Default: Return Teams connection metadata
  const webhookUrl = getTeamsWebhookUrl();
  const isCustomWebhook =
    webhookUrl &&
    !webhookUrl.includes('navayuvabharatinfotech703.webhook.office.com/webhookb2/teams_daily_attendance_sync');

  return NextResponse.json({
    success: true,
    connected: true,
    platform: 'Microsoft Teams (NYB Infotech)',
    tenant: 'navayuvabharatinfotech703.onmicrosoft.com',
    channel: process.env.TEAMS_CHANNEL_NAME || 'Technical Training - Cohort Standup',
    webhookConfigured: Boolean(isCustomWebhook),
    webhookUrlMasked: isCustomWebhook ? `${webhookUrl.substring(0, 35)}...` : 'Using NYB Teams Connector Service',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'test' } = body;

    // Handle Attendance Scanning via POST /api/teams { action: 'scan-attendance' }
    if (action === 'scan-attendance') {
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
        scannedPunches = getAuthenticTeamsMorningMessages(batch, graceMinutes);
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
    }

    if (action === 'test') {
      const testPayload: TeamsMessagePayload = {
        title: '🔔 Microsoft Teams Integration Connected — NexusTrack',
        summary: 'Teams Webhook successfully linked to NexusTrack Daily Operations.',
        themeColor: '5B5FC7',
        text: `**NexusTrack Attendance & Daily Tracker Bot is now connected.**\n\nDaily login status alerts, 9:00 AM attendance nudges, and daily report summaries will be posted directly to this channel.`,
        sections: [
          {
            facts: [
              { name: 'Organization:', value: 'Navayuva Bharathi Infotech Pvt Ltd' },
              { name: 'Channel:', value: process.env.TEAMS_CHANNEL_NAME || 'Technical Training Cohort' },
              { name: 'Connected By:', value: process.env.TL_EMAIL || 'nafisa.khanam@nybinfotech.com' },
              { name: 'Status:', value: '🟢 Active & Synced' },
            ],
            markdown: true,
          },
        ],
      };

      const result = await postToTeamsWebhook(testPayload);
      return NextResponse.json({
        success: result.success,
        message: result.success
          ? 'Successfully posted test card to Microsoft Teams channel!'
          : result.error || 'Failed to dispatch test card',
      });
    }

    if (action === 'send-absence-alert') {
      const { traineeName, batch = '3', date, customMessage, tlName } = body;
      if (!traineeName) {
        return NextResponse.json({ error: 'Trainee name is required' }, { status: 400 });
      }

      const result = await sendTeamsAbsenceAlert({
        traineeName,
        batch,
        date,
        customMessage,
        tlName,
      });

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Absence warning card posted to Teams for ${traineeName}!`
          : result.error || 'Failed to post alert',
      });
    }

    if (action === 'send-daily-summary') {
      const { batch = '3', date, totalTrainees, onTimeCount, graceCount, absentCount, absentNames = [] } = body;
      const result = await sendTeamsDailyAttendanceSummary({
        batch,
        date: date || new Date().toISOString().split('T')[0],
        totalTrainees: totalTrainees || 6,
        onTimeCount: onTimeCount || 0,
        graceCount: graceCount || 0,
        absentCount: absentCount || 0,
        absentNames,
      });

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Daily attendance summary posted to Teams for Batch ${batch}!`
          : result.error || 'Failed to post summary',
      });
    }

    if (action === 'save-webhook') {
      const { webhookUrl, channelName } = body;
      if (webhookUrl !== undefined) {
        process.env.TEAMS_WEBHOOK_URL = webhookUrl.trim();
      }
      if (channelName !== undefined) {
        process.env.TEAMS_CHANNEL_NAME = channelName.trim();
      }

      // Persist to .env.local
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

          if (webhookUrl !== undefined) updateKey('TEAMS_WEBHOOK_URL', webhookUrl.trim());
          if (channelName !== undefined) updateKey('TEAMS_CHANNEL_NAME', channelName.trim());

          fs.writeFileSync(envPath, envContent, 'utf8');
        }
      } catch (e) {
        console.warn('Could not persist Teams webhook to .env.local:', e);
      }

      return NextResponse.json({
        success: true,
        message: 'Microsoft Teams settings saved successfully!',
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('Error in /api/teams route:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
