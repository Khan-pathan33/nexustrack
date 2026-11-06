const fs = require('fs');
const path = require('path');

const histPath = path.join(__dirname, '..', 'teams_attendance_history.json');
const history = JSON.parse(fs.readFileSync(histPath, 'utf8'));

// Update 2026-11-06 Batch 3 with real Teams check-in
if (history['2026-11-06'] && history['2026-11-06']['3']) {
  const b3 = history['2026-11-06']['3'];
  b3.punches = [
    {
      traineeId: 'b3_trainee_tejaswar',
      traineeName: 'Tejeswar Rao',
      traineeEmail: 'tejaswar.rao@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:00 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 0,
      messageText: 'Good Morning Team',
      detectedAt: '09:00:10 AM',
    },
    {
      traineeId: 'b3_trainee_althaf',
      traineeName: 'Althaf Syed',
      traineeEmail: 'althaf.syed@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:00 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 0,
      messageText: 'Good Morning Team',
      detectedAt: '09:00:22 AM',
    },
    {
      traineeId: 'b3_trainee_girish',
      traineeName: 'Girish C',
      traineeEmail: 'girish.c@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:00 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 0,
      messageText: 'Good Morning Team',
      detectedAt: '09:00:15 AM',
    },
    {
      traineeId: 'b3_trainee_chandra',
      traineeName: 'Chandra Shekar K',
      traineeEmail: 'chandra.shekar@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:00 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 0,
      messageText: 'Good Morning Team',
      detectedAt: '09:00:35 AM',
    },
    {
      traineeId: 'b3_trainee_bala',
      traineeName: 'Bala Krishna Parimi',
      traineeEmail: 'bala.krishna@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:00 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 0,
      messageText: 'Good Morning Team',
      detectedAt: '09:00:48 AM',
    },
    {
      traineeId: 'b3_trainee_sana',
      traineeName: 'Sana Sulthana',
      traineeEmail: 'sana.sulthana@nybinfotech.com',
      batchNumber: '3',
      loginTime: '09:02 AM',
      goodMorningSent: true,
      status: 'on-time',
      minutesLate: 2,
      messageText: 'Good Morning Team',
      detectedAt: '09:02:18 AM',
    },
  ];

  b3.punchedCount = 6;
  b3.totalTrainees = 6;
  b3.onTimeCount = 6;
  b3.graceCount = 0;
  b3.absentCount = 0;
}

// Clean any accidental "all" keys
Object.keys(history).forEach((k) => delete history[k]['all']);

fs.writeFileSync(histPath, JSON.stringify(history, null, 2), 'utf8');
console.log('teams_attendance_history.json successfully updated for 2026-11-06 (Batch 3: 6/6 Present)');

