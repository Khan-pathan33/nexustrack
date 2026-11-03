import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Attendance } from '@/models/Attendance';
import {
  getOrCreateAttendanceForDate,
  recordTraineeLogin,
  recordTraineeLogout,
  toggleTraineeGoodMorning,
  markAbsenceNoticeSent,
  calculateMinutesFrom9AM,
} from '@/lib/attendance-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const todayStr = new Date().toISOString().split('T')[0];
    const dateParam = searchParams.get('date') || todayStr;
    const batchParam = searchParams.get('batch') || '3';
    const graceParam = parseInt(searchParams.get('grace') || '15', 10);

    let records: any[] = [];

    if (isMongoConfigured()) {
      try {
        await connectToDatabase();
        const dbRecords = await Attendance.find({
          date: dateParam,
          batchNumber: batchParam,
        }).lean();
        if (dbRecords && dbRecords.length > 0) {
          records = dbRecords;
        }
      } catch (err) {
        console.warn('Attendance MongoDB lookup failed, falling back to local:', err);
      }
    }

    if (records.length === 0) {
      records = getOrCreateAttendanceForDate(dateParam, batchParam);
    }

    // Compute live punctuality & absence stats
    const currentMinutesFrom9AM = calculateMinutesFrom9AM();
    const isPastGrace = currentMinutesFrom9AM > graceParam;

    const stats = {
      total: records.length,
      onTime: records.filter(r => r.status === 'on-time').length,
      gracePeriod: records.filter(r => r.status === 'grace-period').length,
      late: records.filter(r => r.status === 'late').length,
      absent: records.filter(r => r.status === 'absent').length,
      onLeave: records.filter(r => r.status === 'on-leave').length,
      loggedOut: records.filter(r => r.status === 'logged-out').length,
      // Missing trainees: status absent or no loginTime, after grace period
      missingPastGrace: records.filter(
        r => (!r.loginTime || r.status === 'absent') && r.status !== 'on-leave'
      ).length,
      currentMinutesFrom9AM,
      isPastGrace,
      graceMinutes: graceParam,
    };

    return NextResponse.json({
      success: true,
      date: dateParam,
      batch: batchParam,
      stats,
      records,
    });
  } catch (error: any) {
    console.error('Error in GET /api/attendance:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      traineeId,
      date = new Date().toISOString().split('T')[0],
      batch = '3',
      customTime,
      graceMinutes = 15,
    } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let updatedRecord = null;

    if (action === 'login') {
      if (!traineeId) return NextResponse.json({ error: 'traineeId required' }, { status: 400 });
      updatedRecord = recordTraineeLogin(traineeId, date, batch, customTime, graceMinutes);

      if (isMongoConfigured() && updatedRecord) {
        try {
          await connectToDatabase();
          await Attendance.findOneAndUpdate(
            { traineeId, date },
            {
              loginTime: updatedRecord.loginTime,
              status: updatedRecord.status,
              goodMorningSent: true,
              minutesLate: updatedRecord.minutesLate,
              remarks: updatedRecord.remarks,
            },
            { upsert: true, new: true }
          );
        } catch {}
      }
    } else if (action === 'logout') {
      if (!traineeId) return NextResponse.json({ error: 'traineeId required' }, { status: 400 });
      updatedRecord = recordTraineeLogout(traineeId, date, batch, customTime);

      if (isMongoConfigured() && updatedRecord) {
        try {
          await connectToDatabase();
          await Attendance.findOneAndUpdate(
            { traineeId, date },
            {
              logoutTime: updatedRecord.logoutTime,
              status: updatedRecord.status,
              remarks: updatedRecord.remarks,
            },
            { upsert: true, new: true }
          );
        } catch {}
      }
    } else if (action === 'toggle-gm') {
      if (!traineeId) return NextResponse.json({ error: 'traineeId required' }, { status: 400 });
      updatedRecord = toggleTraineeGoodMorning(traineeId, date, batch);

      if (isMongoConfigured() && updatedRecord) {
        try {
          await connectToDatabase();
          await Attendance.findOneAndUpdate(
            { traineeId, date },
            { goodMorningSent: updatedRecord.goodMorningSent },
            { new: true }
          );
        } catch {}
      }
    } else if (action === 'mark-notice-sent') {
      if (!traineeId) return NextResponse.json({ error: 'traineeId required' }, { status: 400 });
      updatedRecord = markAbsenceNoticeSent(traineeId, date, batch);

      if (isMongoConfigured() && updatedRecord) {
        try {
          await connectToDatabase();
          await Attendance.findOneAndUpdate(
            { traineeId, date },
            {
              absenceNoticeSent: true,
              absenceNoticeDraftedAt: updatedRecord.absenceNoticeDraftedAt,
            },
            { new: true }
          );
        } catch {}
      }
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      record: updatedRecord,
    });
  } catch (error: any) {
    console.error('Error in POST /api/attendance:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update attendance' }, { status: 500 });
  }
}
