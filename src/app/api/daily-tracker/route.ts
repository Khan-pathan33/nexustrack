import { NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DailyTracker } from '@/models/DailyTracker';

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const trackers = await DailyTracker.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ trackers, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('DailyTracker GET error, falling back to local:', err);
  }
  
  // Return mock data matching the Excel sheet provided by the user
  const mockTrackers = [
    {
      _id: '1', date: new Date().toLocaleDateString(), name: 'Althaf Syed',
      pendingTopics: 'Pending: final responsive company website was not reported as completed.',
      completedTopicsStatus: 'Partial', completedTopicsDetails: 'Completed Flexbox, Grid, positioning, z-index...',
      taskAssign: 'Yes', doubts: 'No Blockers Reported',
      discussionSummary: 'Completed all assigned CSS layout and responsive-design exercises.',
      githubPushStatus: 'Yes', emailReviewStatus: 'Reviewed. Add the Final Practical...',
      standupParticipation: 'Not Conducted', standupRating: 'N/A', standupRemarks: 'No stand-up call was conducted today.',
      selfProjectStatus: 'Sunray Hospital website: improved styling...'
    },
    {
      _id: '2', date: new Date().toLocaleDateString(), name: 'Bala Krishna Parimi',
      pendingTopics: 'On Leave', completedTopicsStatus: 'On Leave', completedTopicsDetails: '',
      taskAssign: 'On Leave', doubts: 'On Leave', discussionSummary: 'On Leave',
      githubPushStatus: 'On Leave', emailReviewStatus: 'On Leave',
      standupParticipation: 'Not Conducted', standupRating: 'N/A', standupRemarks: 'No stand-up call was conducted today.',
      selfProjectStatus: 'On Leave'
    },
    {
      _id: '3', date: new Date().toLocaleDateString(), name: 'Sana Sulthana',
      pendingTopics: 'Pending: alignment exercises, remaining assigned layout tasks...',
      completedTopicsStatus: 'Partial', completedTopicsDetails: 'Completed CSS positions, z-index, Float/Clear, Flexbox...',
      taskAssign: 'Yes', doubts: 'No Blockers Reported',
      discussionSummary: 'Completed the main CSS layout and responsive-design topics.',
      githubPushStatus: 'Yes', emailReviewStatus: 'Reviewed. Keep the Pending Tasks list complete by including the final website; use “CSS” rather than “HTML” for today’s module.',
      standupParticipation: 'Not Conducted', standupRating: 'N/A', standupRemarks: 'No stand-up call was conducted today.',
      selfProjectStatus: 'N/A'
    }
  ];
  return NextResponse.json({ trackers: mockTrackers, source: 'local' });
}

export async function POST(req: Request) {
  if (!isMongoConfigured()) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  await connectToDatabase();
  const body = await req.json();
  const newTracker = await DailyTracker.create(body);
  return NextResponse.json({ success: true, tracker: newTracker }, { status: 201 });
}
