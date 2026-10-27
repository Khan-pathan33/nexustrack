import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Meeting } from '@/models/Meeting';
import { store, genId } from '@/lib/mock-data';
import { sendEmail } from '@/lib/mailer';

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const meetings = await Meeting.find().sort({ date: 1, time: 1 }).lean();
        return NextResponse.json({ meetings, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('Meetings GET error, falling back to local:', err);
  }
  return NextResponse.json({ meetings: store.meetings, source: 'local' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, id, status } = body;

  if (action === 'updateStatus') {
    if (isMongoConfigured()) {
      await connectToDatabase();
      const meeting = await Meeting.findByIdAndUpdate(id, { status }, { new: true });
      return NextResponse.json({ meeting, source: 'mongodb' });
    }
    const m = store.meetings.find(m => m._id === id);
    if (m) m.status = status;
    return NextResponse.json({ meeting: m, source: 'local' });
  }

  const { title, date, time, duration, attendees, location, notes, actionItems } = body;
  
  // Send email notification (non-blocking)
  sendEmail({
    to: process.env.EMAIL_USER || '',
    subject: `New Meeting Scheduled: ${title}`,
    text: `A new meeting "${title}" has been scheduled for ${date} at ${time}. Location: ${location}.`
  });

  if (isMongoConfigured()) {
    await connectToDatabase();
    const meeting = await Meeting.create({ title, date, time, duration, attendees, location, notes, actionItems });
    return NextResponse.json({ meeting, source: 'mongodb' }, { status: 201 });
  }
  const newMeeting = { _id: genId(), title: title || 'New Meeting', date: date || '', time: time || '09:00', duration: duration || 30, attendees: attendees || [], location: location || 'Online', status: 'scheduled' as const, notes: notes || '', actionItems: actionItems || [] };
  store.meetings.unshift(newMeeting);
  return NextResponse.json({ meeting: newMeeting, source: 'local' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (isMongoConfigured()) {
    await connectToDatabase();
    await Meeting.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  }
  store.meetings = store.meetings.filter(m => m._id !== id);
  return NextResponse.json({ success: true, source: 'local' });
}
