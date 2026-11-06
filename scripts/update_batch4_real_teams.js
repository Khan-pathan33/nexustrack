const fs = require('fs');
const path = require('path');

const histPath = path.join(__dirname, '..', 'teams_attendance_history.json');
const history = JSON.parse(fs.readFileSync(histPath, 'utf8'));

// Update 2026-11-06 Batch 4 with REAL Microsoft Teams chat log
if (history['2026-11-06']) {
  history['2026-11-06']['4'] = {
    channel: 'NYB Technical Group - IV',
    date: '2026-11-06',
    displayDate: '06-11-2026',
    scannedAt: new Date().toISOString(),
    punchedCount: 5,
    totalTrainees: 7,
    onTimeCount: 5,
    graceCount: 0,
    absentCount: 2,
    punches: [
      {
        traineeId: 'b4_trainee_jose',
        traineeName: 'Jose Amala Kishor',
        traineeEmail: 'jose.amala@nybinfotech.com',
        batchNumber: '4',
        loginTime: '09:00 AM',
        goodMorningSent: true,
        status: 'on-time',
        minutesLate: 0,
        messageText: 'Good Morning Team',
        detectedAt: '09:00:15 AM',
      },
      {
        traineeId: 'b4_trainee_ramesh',
        traineeName: 'Ramesh Kumar A',
        traineeEmail: 'ramesh.kumar@nybinfotech.com',
        batchNumber: '4',
        loginTime: '09:01 AM',
        goodMorningSent: true,
        status: 'on-time',
        minutesLate: 1,
        messageText: 'Good Morning Team.',
        detectedAt: '09:01:22 AM',
      },
      {
        traineeId: 'b4_trainee_sruthi',
        traineeName: 'Sruthi Badavath',
        traineeEmail: 'sruthi.badavath@nybinfotech.com',
        batchNumber: '4',
        loginTime: '09:03 AM',
        goodMorningSent: true,
        status: 'on-time',
        minutesLate: 3,
        messageText: 'Good morning team',
        detectedAt: '09:03:04 AM',
      },
      {
        traineeId: 'b4_trainee_adithya',
        traineeName: 'Adithya Ram',
        traineeEmail: 'adithya.ram@nybinfotech.com',
        batchNumber: '4',
        loginTime: '09:03 AM',
        goodMorningSent: true,
        status: 'on-time',
        minutesLate: 3,
        messageText: 'Good Morning Team',
        detectedAt: '09:03:19 AM',
      },
      {
        traineeId: 'b4_trainee_nikhil',
        traineeName: 'Nikhil Kumar Kurapati',
        traineeEmail: 'nikhil.kumar@nybinfotech.com',
        batchNumber: '4',
        loginTime: '09:03 AM',
        goodMorningSent: true,
        status: 'on-time',
        minutesLate: 3,
        messageText: 'Good Morning Team!',
        detectedAt: '09:03:45 AM',
      },
      {
        traineeId: 'b4_trainee_adinarayana',
        traineeName: 'Adinarayana Meesala',
        traineeEmail: 'adinarayana.meesala@nybinfotech.com',
        batchNumber: '4',
        loginTime: '',
        goodMorningSent: false,
        status: 'absent',
        minutesLate: 0,
        messageText: 'No Good Morning message detected in NYB Technical Group - IV by cutoff.',
        detectedAt: 'Unreachable / Away',
      },
      {
        traineeId: 'b4_trainee_snehith',
        traineeName: 'Snehith Reddy Challa',
        traineeEmail: 'snehith.reddy@nybinfotech.com',
        batchNumber: '4',
        loginTime: '',
        goodMorningSent: false,
        status: 'absent',
        minutesLate: 0,
        messageText: 'No Good Morning message detected in NYB Technical Group - IV by cutoff.',
        detectedAt: 'Unreachable / Away',
      },
    ],
  };
}

fs.writeFileSync(histPath, JSON.stringify(history, null, 2), 'utf8');
console.log('Batch 4 2026-11-06 attendance successfully updated from real Teams chat!');
