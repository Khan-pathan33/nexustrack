import { NextRequest, NextResponse } from 'next/server';

// Stored batches in memory / local state
let customBatches = [
  {
    id: '3',
    name: 'Batch 3 — Core Frontend & React',
    track: 'HTML, CSS Grid/Flexbox, JavaScript, React 19',
    traineeCount: 6,
    status: 'In Progress',
    startDate: '2025-12-01',
    lead: 'Pathan Nafisa Khanam',
  },
  {
    id: '4',
    name: 'Batch 4 — Web Development Foundation',
    track: 'Modern Web, HTML5 Semantics, Responsive UI',
    traineeCount: 7,
    status: 'In Progress',
    startDate: '2026-01-15',
    lead: 'Pathan Nafisa Khanam',
  },
  {
    id: '5',
    name: 'Batch 5 — Full Stack & Cloud Integration',
    track: 'Next.js 16, TypeScript, MongoDB, Cloud Workflows',
    traineeCount: 4,
    status: 'Upcoming',
    startDate: '2026-11-15',
    lead: 'Pathan Nafisa Khanam',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    batches: customBatches,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, track, startDate, lead } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'Batch ID and Name are required' }, { status: 400 });
    }

    const newBatch = {
      id: String(id),
      name: String(name),
      track: track || 'Full Stack Web Engineering',
      traineeCount: 0,
      status: 'Active',
      startDate: startDate || new Date().toISOString().split('T')[0],
      lead: lead || 'Pathan Nafisa Khanam',
    };

    // If exists, update; else add
    const existingIndex = customBatches.findIndex(b => b.id === newBatch.id);
    if (existingIndex >= 0) {
      customBatches[existingIndex] = { ...customBatches[existingIndex], ...newBatch };
    } else {
      customBatches.push(newBatch);
    }

    return NextResponse.json({
      success: true,
      batch: newBatch,
      batches: customBatches,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create batch' }, { status: 500 });
  }
}
