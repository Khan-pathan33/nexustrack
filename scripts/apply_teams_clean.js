const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'DailyTrackerView.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

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
  const saveBtnRegex = /(\{\/\*\s*Save Changes\s*\*\/)/;
  if (saveBtnRegex.test(content)) {
    content = content.replace(saveBtnRegex, `${teamsButton}\n\n            $1`);
    console.log('4. Added Teams button to toolbar');
  } else {
    console.log('4. Regex for save button not matched');
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
  const modalRegex = /(<TraineeAbsenceNoticeModal[\s\S]*?\/>)/;
  if (modalRegex.test(content)) {
    content = content.replace(modalRegex, `$1${modalSnippet}`);
    console.log('5. Added TeamsSetupModal component');
  } else {
    console.log('5. Regex for modal not matched');
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Done updating DailyTrackerView.tsx!');
