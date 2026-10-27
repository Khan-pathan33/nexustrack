import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Trainee } from '@/models/Trainee';
import { Assessment } from '@/models/Assessment';
import { store, genId } from '@/lib/mock-data';
import { sendEmail } from '@/lib/mailer';

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const trainees = await Trainee.find().sort({ createdAt: -1 }).lean();
        const assessments = await Assessment.find().sort({ date: -1 }).lean();
        return NextResponse.json({ trainees, assessments, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('Trainees GET error, falling back to local:', err);
  }
  return NextResponse.json({ trainees: store.trainees, assessments: store.assessments, source: 'local' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  if (type === 'trainee') {
    const { name, email, department, skills, avatar, joinedDate } = body;
    if (isMongoConfigured()) {
      await connectToDatabase();
      const trainee = await Trainee.create({ name, email, department, skills, avatar, joinedDate });
      return NextResponse.json({ trainee, source: 'mongodb' }, { status: 201 });
    }
    const newTrainee = { _id: genId(), name: name || 'New Trainee', email: email || '', department: department || 'General', skills: skills || [], overallScore: 0, status: 'active' as const, avatar: avatar || '👤', joinedDate: joinedDate || new Date().toISOString().split('T')[0] };
    store.trainees.push(newTrainee);
    return NextResponse.json({ trainee: newTrainee, source: 'local' }, { status: 201 });
  }

  // type === 'assessment'
  const { traineeId, traineeName, title, subject, score, maxScore, date, feedback } = body;
  const pct = Math.round((score / maxScore) * 100);
  const grade = pct >= 90 ? 'A+' : pct >= 85 ? 'A' : pct >= 80 ? 'A-' : pct >= 75 ? 'B+' : pct >= 70 ? 'B' : pct >= 65 ? 'B-' : 'C';

  // Send email notification (non-blocking)
  sendEmail({
    to: process.env.EMAIL_USER || '',
    subject: `Assessment Graded: ${traineeName}`,
    text: `Trainee ${traineeName} has been graded for ${title} (${subject}). Score: ${score}/${maxScore} (${grade}).`
  });

  if (isMongoConfigured()) {
    await connectToDatabase();
    const assessment = await Assessment.create({ traineeId, traineeName, title, subject, score, maxScore, date, feedback, grade });
    // Update trainee overall score
    const allAssessments = await Assessment.find({ traineeId });
    const avg = Math.round(allAssessments.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / allAssessments.length);
    await Trainee.findByIdAndUpdate(traineeId, { overallScore: avg });
    return NextResponse.json({ assessment, source: 'mongodb' }, { status: 201 });
  }
  const newAssessment = { _id: genId(), traineeId, traineeName, title: title || 'Assessment', subject: subject || 'General', score: score || 0, maxScore: maxScore || 100, date: date || new Date().toISOString().split('T')[0], feedback: feedback || '', grade };
  store.assessments.unshift(newAssessment);
  // Update trainee overall score in memory
  const traineeAssessments = store.assessments.filter(a => a.traineeId === traineeId);
  const avg = Math.round(traineeAssessments.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / traineeAssessments.length);
  const trainee = store.trainees.find(t => t._id === traineeId);
  if (trainee) trainee.overallScore = avg;
  return NextResponse.json({ assessment: newAssessment, source: 'local' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'assessment';
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (isMongoConfigured()) {
    await connectToDatabase();
    if (type === 'trainee') await Trainee.findByIdAndDelete(id);
    else await Assessment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  }
  if (type === 'trainee') store.trainees = store.trainees.filter(t => t._id !== id);
  else store.assessments = store.assessments.filter(a => a._id !== id);
  return NextResponse.json({ success: true, source: 'local' });
}
