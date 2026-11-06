const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'DailyTrackerView.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add state and effect
const stateToAdd = `  const [teamsDaySummary, setTeamsDaySummary] = useState<any | null>(null);

  useEffect(() => {
    if (selectedSheetDate && selectedSheetDate !== 'weekly-task-allocation') {
      fetch(\`/api/teams?action=scan-attendance&batch=\${selectedBatch}&date=\${selectedSheetDate}\`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setTeamsDaySummary(data);
          }
        })
        .catch(() => {});
    }
  }, [selectedSheetDate, selectedBatch]);`;

if (!content.includes('setTeamsDaySummary')) {
  const anchor = /const tabsScrollRef = useRef<HTMLDivElement>\(null\);/;
  if (anchor.test(content)) {
    content = content.replace(anchor, `const tabsScrollRef = useRef<HTMLDivElement>(null);\n${stateToAdd}`);
    console.log('1. Added teamsDaySummary state & effect');
  } else {
    console.error('Failed to find anchor for teamsDaySummary state');
  }
}

// 2. Add Teams roll call banner in the spreadsheet view
const bannerToAdd = `
        {/* Teams Morning Roll Call & Good Morning Status for Active Sheet Date */}
        {teamsDaySummary && (
          <div
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, rgba(91, 95, 199, 0.12), rgba(15, 23, 42, 0.75))',
              borderBottom: '1px solid rgba(91, 95, 199, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: '#5B5FC7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <MessageSquare size={13} />
                </div>
                <strong style={{ fontSize: 13, color: '#38bdf8' }}>
                  {selectedBatch === '4' ? 'NYB Technical Group - IV' : 'NYB Technical Group - III'}
                </strong>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  ({teamsDaySummary.displayDate || selectedSheetDate}):
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: teamsDaySummary.absentCount > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: teamsDaySummary.absentCount > 0 ? '#fbbf24' : '#34d399',
                    fontWeight: 700,
                  }}
                >
                  {teamsDaySummary.punchedCount}/{teamsDaySummary.totalTrainees} Logged In
                </span>
              </div>

              {/* Trainee Good Morning Quick Badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {teamsDaySummary.scannedPunches?.map((p: any, idx: number) => {
                  const isAbsent = p.status === 'absent';
                  return (
                    <span
                      key={idx}
                      title={\`\${p.traineeName}: "\${p.messageText}" (\${p.loginTime || 'Absent'})\`}
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: isAbsent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                        border: isAbsent ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
                        color: isAbsent ? '#fca5a5' : '#86efac',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowTeamsModal(true)}
                    >
                      <span>{isAbsent ? '🔴' : '🟢'}</span>
                      <strong style={{ fontWeight: 600 }}>{p.traineeName.split(' ')[0]}</strong>
                      <span style={{ opacity: 0.85, fontSize: 10 }}>({p.loginTime ? p.loginTime.replace(' AM', '') : 'No GM'})</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTeamsModal(true)}
              style={{
                background: 'rgba(91, 95, 199, 0.2)',
                border: '1px solid rgba(91, 95, 199, 0.45)',
                color: '#c7d2fe',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
              title="Inspect Good Morning messages and roll call in Microsoft Teams modal"
            >
              <span>View Full Teams Feed</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}`;

if (!content.includes('Teams Morning Roll Call & Good Morning Status')) {
  // Find where the top header banner ends:
  // </button>\s*</div>\s*({\/\*\s*Header Cards:)
  const bannerAnchor = /(<\/button>\s*<\/div>\s*)({\/\*\s*Header Cards)/;
  if (bannerAnchor.test(content)) {
    content = content.replace(bannerAnchor, `$1${bannerToAdd}\n\n        $2`);
    console.log('2. Added Teams Morning Roll Call Banner to spreadsheet view');
  } else {
    console.error('Failed to find anchor for Teams banner');
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated DailyTrackerView.tsx');

