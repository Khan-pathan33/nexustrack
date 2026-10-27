import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Mail } from '@/models/Mail';
import { store, genId } from '@/lib/mock-data';

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn && conn.connection.readyState === 1) {
        const mails = await Mail.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ mails, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('Mails GET error, falling back to local:', err);
  }
  return NextResponse.json({ mails: store.mails, source: 'local' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, id, status } = body;

  if (action === 'updateStatus') {
    if (isMongoConfigured()) {
      await connectToDatabase();
      const mail = await Mail.findByIdAndUpdate(id, { status }, { new: true });
      return NextResponse.json({ mail, source: 'mongodb' });
    }
    const m = store.mails.find(m => m._id === id);
    if (m) m.status = status as typeof m.status;
    return NextResponse.json({ mail: m, source: 'local' });
  }

  const { subject, from, to, date, priority, category, notes } = body;
  if (isMongoConfigured()) {
    await connectToDatabase();
    const mail = await Mail.create({ subject, from, to, date, priority, status: 'pending', category, notes });
    return NextResponse.json({ mail, source: 'mongodb' }, { status: 201 });
  }
  const newMail = { _id: genId(), subject: subject || 'No Subject', from: from || '', to: to || '', date: date || new Date().toISOString().split('T')[0], priority: (priority || 'medium') as 'high'|'medium'|'low', status: 'pending' as const, category: category || 'General', notes: notes || '' };
  store.mails.unshift(newMail);
  return NextResponse.json({ mail: newMail, source: 'local' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (isMongoConfigured()) {
    await connectToDatabase();
    await Mail.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  }
  store.mails = store.mails.filter(m => m._id !== id);
  return NextResponse.json({ success: true, source: 'local' });
}
