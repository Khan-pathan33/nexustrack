import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { store, genId } from '@/lib/mock-data';

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const projects = await Project.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ projects, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('Projects GET error, falling back to local:', err);
  }
  return NextResponse.json({ projects: store.projects, source: 'local' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, id, progress, milestoneIndex, completed } = body;

  if (action === 'updateProgress') {
    if (isMongoConfigured()) {
      await connectToDatabase();
      const project = await Project.findByIdAndUpdate(id, { progress }, { new: true });
      return NextResponse.json({ project, source: 'mongodb' });
    }
    const p = store.projects.find(p => p._id === id);
    if (p) p.progress = progress;
    return NextResponse.json({ project: p, source: 'local' });
  }

  if (action === 'toggleMilestone') {
    if (isMongoConfigured()) {
      await connectToDatabase();
      const project = await Project.findById(id);
      if (project && project.milestones[milestoneIndex]) {
        project.milestones[milestoneIndex].completed = completed;
        // Auto-compute progress from milestones
        const done = project.milestones.filter((m: {completed: boolean}) => m.completed).length;
        project.progress = Math.round((done / project.milestones.length) * 100);
        await project.save();
      }
      return NextResponse.json({ project, source: 'mongodb' });
    }
    const p = store.projects.find(p => p._id === id);
    if (p && p.milestones[milestoneIndex]) {
      p.milestones[milestoneIndex].completed = completed;
      const done = p.milestones.filter(m => m.completed).length;
      p.progress = Math.round((done / p.milestones.length) * 100);
    }
    return NextResponse.json({ project: p, source: 'local' });
  }

  const { name, description, status, deadline, team, priority, color, milestones } = body;
  if (isMongoConfigured()) {
    await connectToDatabase();
    const project = await Project.create({ name, description, status, progress: 0, deadline, team, priority, color, milestones: (milestones || []).map((t: string) => ({ title: t, completed: false })) });
    return NextResponse.json({ project, source: 'mongodb' }, { status: 201 });
  }
  const newProject = { _id: genId(), name: name || 'New Project', description: description || '', status: (status || 'planning') as 'planning', progress: 0, deadline: deadline || '', team: team || [], priority: (priority || 'medium') as 'medium', color: color || '#7c3aed', milestones: (milestones || []).map((t: string) => ({ title: t, completed: false })) };
  store.projects.unshift(newProject);
  return NextResponse.json({ project: newProject, source: 'local' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (isMongoConfigured()) {
    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  }
  store.projects = store.projects.filter(p => p._id !== id);
  return NextResponse.json({ success: true, source: 'local' });
}
