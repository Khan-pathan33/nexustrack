import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const statePath = path.join(process.cwd(), 'scanned_audit_state.json');
    if (!fs.existsSync(statePath)) {
      return NextResponse.json({
        success: true,
        lastAuditedAt: null,
        notifications: [],
      });
    }

    const raw = fs.readFileSync(statePath, 'utf8');
    const data = JSON.parse(raw);
    const submissions = Array.isArray(data.auditedSubmissions) ? data.auditedSubmissions : [];

    // Map submissions to user-friendly notification cards
    const notifications = submissions.map((sub: any, idx: number) => {
      const scannedDate = sub.scannedAt ? new Date(sub.scannedAt) : new Date();
      const timeStr = scannedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = sub.submissionDate || scannedDate.toLocaleDateString();

      return {
        id: `notif_${idx}_${sub.trainee}_${sub.submissionDate}`,
        trainee: sub.trainee || 'Unknown Trainee',
        batch: sub.batch || '3',
        submissionDate: dateStr,
        time: timeStr,
        subject: sub.subject || 'Daily Status Report',
        hasZip: !!sub.hasZip,
        zipFilename: sub.zipFilename || '',
        mistakesFound: sub.mistakesFound || [],
        reviewStatus: sub.reviewStatus || 'Reviewed',
        performanceScore: sub.performanceScore || 85,
        type: sub.mistakesFound && sub.mistakesFound.length > 0 ? 'warning' : 'success',
        excelUpdated: true,
        excelSheetName: dateStr,
      };
    });

    // Sort most recent first
    notifications.reverse();

    return NextResponse.json({
      success: true,
      lastAuditedAt: data.lastAuditedAt,
      draftMode: true,
      savedDrafts: data.savedDrafts || [],
      notifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch notifications',
        notifications: [],
      },
      { status: 500 }
    );
  }
}
