const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'components', 'TraineeAttendanceRegister.tsx');
let code = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. Add Calendar to imports
if (!code.includes('Calendar,')) {
  code = code.replace(
    'import {\n  Clock, CheckCircle2, AlertTriangle, LogIn, LogOut, Mail, Send,\n  RefreshCw, Check, X, Shield, User, Filter, AlertCircle, Sparkles, Users, MessageSquare\n} from \'lucide-react\';',
    `import {\n  Clock, CheckCircle2, AlertTriangle, LogIn, LogOut, Mail, Send,\n  RefreshCw, Check, X, Shield, User, Filter, AlertCircle, Sparkles, Users, MessageSquare, Calendar\n} from 'lucide-react';`
  );
}

// 2. Add selectedDate state and dynamic quickDates
const stateTarget = `  const [activeBatch, setActiveBatch] = useState<string>(batchNumber || '3');\n  const [records, setRecords] = useState<AttendanceItem[]>([]);`;
const newState = `  const [activeBatch, setActiveBatch] = useState<string>(batchNumber || '3');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (date) {
      if (/^\\d{2}-\\d{2}-\\d{4}$/.test(date)) {
        const [d, m, y] = date.split('-');
        return \`\${y}-\${m}-\${d}\`;
      }
      return date;
    }
    return new Date().toISOString().split('T')[0];
  });
  const [records, setRecords] = useState<AttendanceItem[]>([]);

  // Sync internal selectedDate if external prop changes
  useEffect(() => {
    if (date) {
      const norm = /^\\d{2}-\\d{2}-\\d{4}$/.test(date)
        ? \`\${date.split('-')[2]}-\${date.split('-')[1]}-\${date.split('-')[0]}\`
        : date;
      setSelectedDate(norm);
    }
  }, [date]);

  // Dynamic quick date helpers
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

code = code.replace(stateTarget, newState);

// 3. Update fetchAttendance to use selectedDate
code = code.replace(
  'const res = await fetch(`/api/attendance?date=${date}&batch=${activeBatch}&grace=${graceMinutes}`);',
  'const res = await fetch(`/api/attendance?date=${selectedDate}&batch=${activeBatch}&grace=${graceMinutes}`);'
);
code = code.replace(
  '}, [date, activeBatch, graceMinutes]);',
  '}, [selectedDate, activeBatch, graceMinutes]);'
);

// 4. Update handlers to pass selectedDate
code = code.replace(
  'action: \'login\',\n          traineeId,\n          date,\n          batch: activeBatch,',
  'action: \'login\',\n          traineeId,\n          date: selectedDate,\n          batch: activeBatch,'
);
code = code.replace(
  'action: \'logout\',\n          traineeId,\n          date,\n          batch: activeBatch,',
  'action: \'logout\',\n          traineeId,\n          date: selectedDate,\n          batch: activeBatch,'
);
code = code.replace(
  'action: \'toggle-gm\',\n          traineeId,\n          date,\n          batch: activeBatch,',
  'action: \'toggle-gm\',\n          traineeId,\n          date: selectedDate,\n          batch: activeBatch,'
);

// 5. Update TeamsSetupModal prop
code = code.replace(
  'date={date}',
  'date={selectedDate}'
);

// 6. Insert Interactive Date Strip right before {/* KPI Cards Row */}
const kpiTarget = `      {/* KPI Cards Row */}`;
const dateStrip = `      {/* ── INTERACTIVE DATE-WISE ATTENDANCE SELECTOR STRIP ── */}
      <div
        style={{
          padding: '12px 18px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Cohort Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Trainee Cohort:</span>
          <button
            type="button"
            onClick={() => handleSelectBatch('3')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: activeBatch === '3' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeBatch === '3' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeBatch === '3' ? '#38bdf8' : '#94a3b8',
            }}
          >
            Batch 3 (NYB Group III)
          </button>
          <button
            type="button"
            onClick={() => handleSelectBatch('4')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: activeBatch === '4' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeBatch === '4' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeBatch === '4' ? '#c084fc' : '#94a3b8',
            }}
          >
            Batch 4 (NYB Group IV)
          </button>
        </div>

        {/* Date Selector & Quick Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={14} color="#38bdf8" />
            <span>Select Date:</span>
          </span>

          {quickDates.map((q) => {
            const isActive = selectedDate === q.value;
            return (
              <button
                key={q.value}
                type="button"
                onClick={() => setSelectedDate(q.value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                }}
              >
                {q.label}
              </button>
            );
          })}

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(e.target.value);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: 11,
              cursor: 'pointer',
            }}
            title="Pick any date from calendar"
          />
        </div>
      </div>\n\n`;

code = code.replace(kpiTarget, `${dateStrip}${kpiTarget}`);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('TraineeAttendanceRegister.tsx now features full date-wise attendance controls!');
