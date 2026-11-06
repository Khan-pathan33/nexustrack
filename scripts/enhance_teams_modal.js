const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'components', 'TeamsSetupModal.tsx');
let code = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. Update Props interface
code = code.replace(
  `interface TeamsSetupModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  batchNumber: string;\n  date: string;\n  onAttendanceUpdated?: () => void;\n}`,
  `interface TeamsSetupModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  batchNumber: string;\n  date: string;\n  onAttendanceUpdated?: (punches?: any[]) => void;\n}`
);

// 2. Pass punches in onAttendanceUpdated call
code = code.replace(
  `onAttendanceUpdated?.();`,
  `onAttendanceUpdated?.(data.scannedPunches || scannedData?.scannedPunches || []);`
);

// 3. Make quickDates dynamic
const dynamicQuickDates = `  // Dynamic quick dates relative to current date
  const todayIso = new Date().toISOString().split('T')[0];
  const dObj = new Date();
  const formatPillDate = (iso: string, isToday = false) => {
    const parts = iso.split('-');
    const day = parts[2];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    return isToday ? \`Today (\${day} \${month})\` : \`\${day} \${month}\`;
  };

  const yesterdayDate = new Date(dObj.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayBeforeYesterday = new Date(dObj.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const quickDates = [
    { label: formatPillDate(todayIso, true), value: todayIso },
    { label: formatPillDate(yesterdayDate), value: yesterdayDate },
    { label: formatPillDate(dayBeforeYesterday), value: dayBeforeYesterday },
    { label: '05 Nov', value: '2026-11-05' },
    { label: '26 Oct', value: '2026-10-26' },
  ].filter((v, idx, arr) => arr.findIndex((t) => t.value === v.value) === idx);`;

code = code.replace(
  `  const quickDates = [\n    { label: 'Today (05 Nov)', value: '2026-11-05' },\n    { label: '04 Nov', value: '2026-11-04' },\n    { label: '03 Nov', value: '2026-11-03' },\n    { label: '26 Oct', value: '2026-10-26' },\n  ];`,
  dynamicQuickDates
);

// 4. Add "Paste from Clipboard" button in the Paste tab
const sampleButtonTarget = `              <button
                type="button"
                onClick={handleLoadSampleChat}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'rgba(91, 95, 199, 0.15)',
                  border: '1px solid rgba(91, 95, 199, 0.3)',
                  color: '#a5b4fc',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {copiedSample ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSample ? 'Sample Loaded!' : 'Load Sample Morning Chat'}</span>
              </button>`;

const enhancedButtons = `              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (navigator?.clipboard?.readText) {
                        const text = await navigator.clipboard.readText();
                        if (text && text.trim().length > 5) {
                          setRawChatText(text);
                          toastSuccess('Pasted from Clipboard', \`Loaded \${text.split('\\n').length} lines from Teams.\`);
                        } else {
                          toastInfo('Clipboard Empty', 'Please copy chat messages from Teams first.');
                        }
                      } else {
                        toastInfo('Clipboard Unavailable', 'Please press Ctrl+V into the text box below.');
                      }
                    } catch {
                      toastInfo('Permission Needed', 'Please press Ctrl+V to paste into the text box.');
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  }}
                  title="Auto-paste text currently copied to your clipboard"
                >
                  <Copy size={13} />
                  <span>📋 Paste from Clipboard</span>
                </button>
${sampleButtonTarget}
              </div>`;

if (code.includes(sampleButtonTarget)) {
  code = code.replace(sampleButtonTarget, enhancedButtons);
} else {
  console.warn('sampleButtonTarget not found, skipping clipboard button injection');
}

fs.writeFileSync(targetFile, code, 'utf8');
console.log('TeamsSetupModal.tsx updated successfully!');
