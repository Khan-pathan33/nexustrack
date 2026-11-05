const trainees = [
  // Batch 3
  { name: 'Althaf Syed', batch: '3', user: 'MahammadAlthaf2002', repo: 'NYBINFOTECH-1', url: 'https://github.com/MahammadAlthaf2002' },
  { name: 'Bala Krishna Parimi', batch: '3', user: 'Balakrishna3142', repo: 'NYB', url: 'https://github.com/Balakrishna3142' },
  { name: 'Chandra Shekar K', batch: '3', user: 'kammarichandra', repo: 'Daily-status-update', url: 'https://github.com/kammarichandra' },
  { name: 'Girish C', batch: '3', user: 'GirishNYBinfotech', repo: 'NYB_INFOTECH', url: 'https://github.com/GirishNYBinfotech' },
  { name: 'Sana Sulthana', batch: '3', user: 'SanaSulthana2325', repo: 'NYB', url: 'https://github.com/SanaSulthana2325' },
  { name: 'Tejaswar Rao', batch: '3', user: 'Teja1911', repo: 'NYB', url: 'https://github.com/Teja1911' },

  // Batch 4
  { name: 'Jose Amala Kishor', batch: '4', user: 'JoseAmalaKishor007', repo: 'NYB_DailyTask', url: 'https://github.com/JoseAmalaKishor007/NYB_DailyTask' },
  { name: 'Nikhil Kumar Kurapati', batch: '4', user: 'nikhil3454', repo: 'NYB_Infotech_FrontEnd', url: 'https://github.com/nikhil3454/NYB_Infotech_FrontEnd' },
  { name: 'Ramesh Kumar A', batch: '4', user: 'Ramesh-kumar109', repo: 'NYB_daliy_task', url: 'https://github.com/Ramesh-kumar109/NYB_daliy_task' },
  { name: 'Adithya Ram', batch: '4', user: 'AdithyaRamDarisi', repo: 'React2', url: 'https://github.com/AdithyaRamDarisi/React2' },
  { name: 'Adinarayana Meesala', batch: '4', user: 'adinarayanameesala6304', repo: 'Daily_Basis_React', url: 'https://github.com/adinarayanameesala6304' },
  { name: 'Snehith Reddy Challa', batch: '4', user: 'SnehithReddy', repo: 'NYB', url: 'https://github.com/SnehithReddy' },
  { name: 'Sruthi Badavath', batch: '4', user: 'sruthibadavath', repo: 'NYB', url: 'https://github.com/sruthibadavath' },
];

async function inspectTrainee(t) {
  try {
    // 1. Get user repos
    const reposRes = await fetch(`https://api.github.com/users/${t.user}/repos?sort=updated&per_page=5`, {
      headers: { 'User-Agent': 'NexusTrack-Inspector', 'Accept': 'application/vnd.github.v3+json' }
    });
    const repos = reposRes.ok ? await reposRes.json() : [];

    // 2. Get public events
    const eventsRes = await fetch(`https://api.github.com/users/${t.user}/events/public?per_page=5`, {
      headers: { 'User-Agent': 'NexusTrack-Inspector', 'Accept': 'application/vnd.github.v3+json' }
    });
    const events = eventsRes.ok ? await eventsRes.json() : [];

    const pushes = Array.isArray(events) ? events.filter(e => e.type === 'PushEvent') : [];
    const latestPush = pushes[0];

    return {
      name: t.name,
      batch: t.batch,
      user: t.user,
      repoCount: Array.isArray(repos) ? repos.length : 0,
      recentRepos: Array.isArray(repos) ? repos.slice(0, 3).map(r => r.name) : [],
      latestPushDate: latestPush?.created_at || 'None',
      latestCommitMessage: latestPush?.payload?.commits?.[0]?.message || 'N/A',
      latestRepoPushed: latestPush?.repo?.name || 'N/A',
    };
  } catch (err) {
    return { name: t.name, batch: t.batch, user: t.user, error: err.message };
  }
}

async function main() {
  console.log('Inspecting GitHub activity for all trainees...');
  const results = [];
  for (const t of trainees) {
    const res = await inspectTrainee(t);
    results.push(res);
  }
  console.log(JSON.stringify(results, null, 2));
}

main();
