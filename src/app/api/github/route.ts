import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { GithubRepo } from '@/models/GithubRepo';
import { store, genId } from '@/lib/mock-data';

async function fetchGithubRepo(username: string, repoName: string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'NexusTrack-App' },
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      username: data.owner?.login || username,
      repoName: data.name,
      url: data.html_url,
      description: data.description || '',
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
      language: data.language || 'Unknown',
      lastUpdated: data.pushed_at || new Date().toISOString(),
      isPrivate: data.private || false,
      defaultBranch: data.default_branch || 'main',
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const repos = await GithubRepo.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ repos, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('GitHub GET error, falling back to local:', err);
  }
  return NextResponse.json({ repos: store.githubRepos, source: 'local' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, username, repoName, id } = body;

  if (action === 'refresh') {
    // Fetch fresh data from GitHub API
    const repoData = await fetchGithubRepo(username, repoName);
    if (!repoData) return NextResponse.json({ error: 'Failed to fetch from GitHub API' }, { status: 502 });

    if (isMongoConfigured()) {
      await connectToDatabase();
      const repo = await GithubRepo.findByIdAndUpdate(id, repoData, { new: true });
      return NextResponse.json({ repo, source: 'mongodb' });
    }
    const repo = store.githubRepos.find(r => r._id === id);
    if (repo) Object.assign(repo, repoData);
    return NextResponse.json({ repo, source: 'local' });
  }

  // Add new repo — try to fetch from GitHub API
  const liveData = await fetchGithubRepo(username, repoName);
  const repoPayload = liveData || {
    username, repoName, url: `https://github.com/${username}/${repoName}`,
    description: '', stars: 0, forks: 0, openIssues: 0,
    language: 'Unknown', lastUpdated: new Date().toISOString(),
    isPrivate: false, defaultBranch: 'main',
  };

  if (isMongoConfigured()) {
    await connectToDatabase();
    const repo = await GithubRepo.create(repoPayload);
    return NextResponse.json({ repo, source: 'mongodb' }, { status: 201 });
  }
  const newRepo = { _id: genId(), ...repoPayload };
  store.githubRepos.push(newRepo);
  return NextResponse.json({ repo: newRepo, source: 'local' }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (isMongoConfigured()) {
    await connectToDatabase();
    await GithubRepo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  }
  store.githubRepos = store.githubRepos.filter(r => r._id !== id);
  return NextResponse.json({ success: true, source: 'local' });
}
