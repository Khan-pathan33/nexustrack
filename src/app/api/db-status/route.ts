import { NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { store } from '@/lib/mock-data';

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      status: 'local',
      message: 'Using in-memory Local Storage — data resets on server restart.',
      hint: 'Add MONGODB_URI to .env.local to enable persistent MongoDB storage.',
      counts: {
        meetings: store.meetings.length,
        mails: store.mails.length,
        trainees: store.trainees.length,
        assessments: store.assessments.length,
        projects: store.projects.length,
        githubRepos: store.githubRepos.length,
      }
    });
  }
  try {
    const conn = await connectToDatabase();
    if (conn) {
      return NextResponse.json({
        status: 'mongodb',
        message: 'Connected to MongoDB Atlas — data persists across restarts.',
        readyState: conn.connection.readyState
      });
    }
  } catch (err) {
    console.warn('DB status error:', err);
  }

  return NextResponse.json({
    status: 'local',
    message: 'Running in Local Storage mode (Atlas pending IP whitelist).',
    hint: 'Whitelist your IP in MongoDB Atlas to enable persistent cloud storage.',
    counts: {
      meetings: store.meetings.length,
      mails: store.mails.length,
      trainees: store.trainees.length,
      assessments: store.assessments.length,
      projects: store.projects.length,
      githubRepos: store.githubRepos.length,
    }
  });
}
