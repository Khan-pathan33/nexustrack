const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'DailyTrackerView.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add MessageSquare to lucide-react import
if (!content.includes('MessageSquare')) {
  content = content.replace(
    'Trash2, X, Zap, Bell, GitBranch, Clock, Settings',
    'Trash2, X, Zap, Bell, GitBranch, Clock, Settings, MessageSquare'
  );
}

// 2. Add TeamsSetupModal import
if (!content.includes("import TeamsSetupModal from '@/components/TeamsSetupModal';")) {
  content = content.replace(
    "import TraineeAbsenceNoticeModal from '@/components/TraineeAbsenceNoticeModal';",
    "import TraineeAbsenceNoticeModal from '@/components/TraineeAbsenceNoticeModal';\nimport TeamsSetupModal from '@/components/TeamsSetupModal';"
  );
}

// 3. Add showTeamsModal state
if (!content.includes('const [showTeamsModal, setShowTeamsModal]')) {
  content = content.replace(
    'const [showCredsModal, setShowCredsModal] = useState(false);',
    'const [showCredsModal, setShowCredsModal] = useState(false);\n  const [showTeamsModal, setShowTeamsModal] = useState(false);'
  );
}

// 4. Add Teams button in the toolbar
const teamsButton = `
            {/* Microsoft Teams Attendance & Login Operations */}
            <button
              type="button"
              onClick={() => setShowTeamsModal(true)}
              className="btn btn-sm"
              style={{
                fontSize: 12,
                gap: 6,
                background: 'linear-gradient(135deg, #5B5FC7, #444791)',
                border: '1px solid rgba(165, 180, 252, 0.4)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(91, 95, 199, 0.35)',
                transition: 'all 0.2s ease',
              }}
              title="Microsoft Teams 9:00 AM Login & Absence Operations (NYB Infotech)"
            >
              <MessageSquare size={13} />
              <span>💬 Teams</span>
            </button>`;

if (!content.includes('<span>💬 Teams</span>')) {
  const targetBtnRegex = /(<span>\{scanningGithub \? 'Auditing GitHub\.\.\.' : '⚡ Audit GitHub Tasks'\}<\/span>\s*<\/button>)/;
  if (targetBtnRegex.test(content)) {
    content = content.replace(targetBtnRegex, `$1${teamsButton}`);
  }
}

// 5. Add TeamsSetupModal before closing div
const modalSnippet = `
      {/* Microsoft Teams Operations Modal */}
      <TeamsSetupModal
        isOpen={showTeamsModal}
        onClose={() => setShowTeamsModal(false)}
        batchNumber={selectedBatch}
        date={selectedSheetDate}
        onAttendanceUpdated={onRefresh}
      />`;

if (!content.includes('<TeamsSetupModal')) {
  const targetModalRegex = /(<TraineeAbsenceNoticeModal[\s\S]*?\/>)/;
  if (targetModalRegex.test(content)) {
    content = content.replace(targetModalRegex, `$1${modalSnippet}`);
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully injected Teams integration into DailyTrackerView.tsx!');
