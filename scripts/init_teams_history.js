const fs = require('fs');
const path = require('path');

const historyFile = path.join(__dirname, '..', 'teams_attendance_history.json');

const BATCH_3_TRAINEES = [
  'Tejeswar Rao',
  'Althaf Syed',
  'Chandra Shekar K',
  'Bala Krishna Parimi',
  'Sana Sulthana',
  'Girish C'
];

const BATCH_4_TRAINEES = [
  'Adinarayana Meesala',
  'Adithya Ram',
  'Jose Amala Kishor',
  'Snehith Reddy Challa',
  'Sruthi Badavath',
  'Nikhil Kumar Kurapati',
  'Ramesh Kumar A'
];

const history = {
  "2026-11-05": {
    "3": {
      "channel": "NYB Technical Group - III",
      "date": "2026-11-05",
      "displayDate": "05-11-2026",
      "punchedCount": 5,
      "totalTrainees": 6,
      "onTimeCount": 5,
      "graceCount": 0,
      "absentCount": 1,
      "punches": [
        {
          "traineeId": "b3_trainee_tejaswar",
          "traineeName": "Tejeswar Rao",
          "traineeEmail": "tejaswar.rao@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good Morning Team",
          "detectedAt": "09:00:10 AM"
        },
        {
          "traineeId": "b3_trainee_althaf",
          "traineeName": "Althaf Syed",
          "traineeEmail": "althaf.syed@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good Morning Team",
          "detectedAt": "09:00:22 AM"
        },
        {
          "traineeId": "b3_trainee_chandra",
          "traineeName": "Chandra Shekar K",
          "traineeEmail": "chandra.shekar@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good Morning Team",
          "detectedAt": "09:00:35 AM"
        },
        {
          "traineeId": "b3_trainee_bala",
          "traineeName": "Bala Krishna Parimi",
          "traineeEmail": "bala.krishna@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team",
          "detectedAt": "09:00:48 AM"
        },
        {
          "traineeId": "b3_trainee_sana",
          "traineeName": "Sana Sulthana",
          "traineeEmail": "sana.sulthana@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:02 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 2,
          "messageText": "Good Morning Team",
          "detectedAt": "09:02:18 AM"
        },
        {
          "traineeId": "b3_trainee_girish",
          "traineeName": "Girish C",
          "traineeEmail": "girish.c@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "",
          "goodMorningSent": false,
          "status": "absent",
          "minutesLate": 0,
          "messageText": "No Good Morning message detected in NYB Technical Group - III by 9:20 AM cutoff.",
          "detectedAt": "Unreachable / Away"
        }
      ]
    },
    "4": {
      "channel": "NYB Technical Group - IV",
      "date": "2026-11-05",
      "displayDate": "05-11-2026",
      "punchedCount": 5,
      "totalTrainees": 7,
      "onTimeCount": 3,
      "graceCount": 2,
      "absentCount": 2,
      "punches": [
        {
          "traineeId": "b4_trainee_adinarayana",
          "traineeName": "Adinarayana Meesala",
          "traineeEmail": "adinarayana.meesala@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:51 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning ma’am, logged in for today’s React tasks.",
          "detectedAt": "08:51:22 AM"
        },
        {
          "traineeId": "b4_trainee_adithya",
          "traineeName": "Adithya Ram",
          "traineeEmail": "adithya.ram@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:55 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning everyone! Ready for today’s session.",
          "detectedAt": "08:55:04 AM"
        },
        {
          "traineeId": "b4_trainee_jose",
          "traineeName": "Jose Amala Kishor",
          "traineeEmail": "jose.amala@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "09:04 AM",
          "goodMorningSent": true,
          "status": "grace-period",
          "minutesLate": 4,
          "messageText": "Good morning team and ma’am.",
          "detectedAt": "09:04:15 AM"
        },
        {
          "traineeId": "b4_trainee_snehith",
          "traineeName": "Snehith Reddy Challa",
          "traineeEmail": "snehith.reddy@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "09:07 AM",
          "goodMorningSent": true,
          "status": "grace-period",
          "minutesLate": 7,
          "messageText": "Good morning all.",
          "detectedAt": "09:07:38 AM"
        },
        {
          "traineeId": "b4_trainee_sruthi",
          "traineeName": "Sruthi Badavath",
          "traineeEmail": "sruthi.badavath@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:58 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team.",
          "detectedAt": "08:58:49 AM"
        },
        {
          "traineeId": "b4_trainee_nikhil",
          "traineeName": "Nikhil Kumar Kurapati",
          "traineeEmail": "nikhil.kumar@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "",
          "goodMorningSent": false,
          "status": "absent",
          "minutesLate": 0,
          "messageText": "No login / Good Morning message detected in Teams channel by 9:20 AM cutoff.",
          "detectedAt": "Unreachable / Away"
        },
        {
          "traineeId": "b4_trainee_ramesh",
          "traineeName": "Ramesh Kumar A",
          "traineeEmail": "ramesh.kumar@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "",
          "goodMorningSent": false,
          "status": "absent",
          "minutesLate": 0,
          "messageText": "No login / Good Morning message detected in Teams channel by 9:20 AM cutoff.",
          "detectedAt": "Unreachable / Away"
        }
      ]
    }
  },
  "2026-11-04": {
    "3": {
      "channel": "NYB Technical Group - III",
      "date": "2026-11-04",
      "displayDate": "04-11-2026",
      "punchedCount": 6,
      "totalTrainees": 6,
      "onTimeCount": 5,
      "graceCount": 1,
      "absentCount": 0,
      "punches": [
        {
          "traineeId": "b3_trainee_althaf",
          "traineeName": "Althaf Syed",
          "traineeEmail": "althaf.syed@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "08:54 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning mam! Working on Sunray Hospital project.",
          "detectedAt": "08:54:12 AM"
        },
        {
          "traineeId": "b3_trainee_bala",
          "traineeName": "Bala Krishna Parimi",
          "traineeEmail": "bala.krishna@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "08:57 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning ma'am and team",
          "detectedAt": "08:57:30 AM"
        },
        {
          "traineeId": "b3_trainee_chandra",
          "traineeName": "Chandra Shekar K",
          "traineeEmail": "chandra.shekar@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team, logged in",
          "detectedAt": "09:00:15 AM"
        },
        {
          "traineeId": "b3_trainee_tejaswar",
          "traineeName": "Tejeswar Rao",
          "traineeEmail": "tejaswar.rao@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:00 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team",
          "detectedAt": "09:00:45 AM"
        },
        {
          "traineeId": "b3_trainee_sana",
          "traineeName": "Sana Sulthana",
          "traineeEmail": "sana.sulthana@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:01 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 1,
          "messageText": "Good Morning Team",
          "detectedAt": "09:01:20 AM"
        },
        {
          "traineeId": "b3_trainee_girish",
          "traineeName": "Girish C",
          "traineeEmail": "girish.c@nybinfotech.com",
          "batchNumber": "3",
          "loginTime": "09:08 AM",
          "goodMorningSent": true,
          "status": "grace-period",
          "minutesLate": 8,
          "messageText": "Good morning everyone",
          "detectedAt": "09:08:40 AM"
        }
      ]
    },
    "4": {
      "channel": "NYB Technical Group - IV",
      "date": "2026-11-04",
      "displayDate": "04-11-2026",
      "punchedCount": 6,
      "totalTrainees": 7,
      "onTimeCount": 4,
      "graceCount": 2,
      "absentCount": 1,
      "punches": [
        {
          "traineeId": "b4_trainee_adinarayana",
          "traineeName": "Adinarayana Meesala",
          "traineeEmail": "adinarayana.meesala@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:52 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team",
          "detectedAt": "08:52:10 AM"
        },
        {
          "traineeId": "b4_trainee_sruthi",
          "traineeName": "Sruthi Badavath",
          "traineeEmail": "sruthi.badavath@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:56 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning team",
          "detectedAt": "08:56:45 AM"
        },
        {
          "traineeId": "b4_trainee_adithya",
          "traineeName": "Adithya Ram",
          "traineeEmail": "adithya.ram@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "08:58 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 0,
          "messageText": "Good morning everyone",
          "detectedAt": "08:58:30 AM"
        },
        {
          "traineeId": "b4_trainee_jose",
          "traineeName": "Jose Amala Kishor",
          "traineeEmail": "jose.amala@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "09:02 AM",
          "goodMorningSent": true,
          "status": "on-time",
          "minutesLate": 2,
          "messageText": "Good morning all",
          "detectedAt": "09:02:15 AM"
        },
        {
          "traineeId": "b4_trainee_snehith",
          "traineeName": "Snehith Reddy Challa",
          "traineeEmail": "snehith.reddy@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "09:05 AM",
          "goodMorningSent": true,
          "status": "grace-period",
          "minutesLate": 5,
          "messageText": "Good morning team",
          "detectedAt": "09:05:50 AM"
        },
        {
          "traineeId": "b4_trainee_ramesh",
          "traineeName": "Ramesh Kumar A",
          "traineeEmail": "ramesh.kumar@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "09:12 AM",
          "goodMorningSent": true,
          "status": "grace-period",
          "minutesLate": 12,
          "messageText": "Good morning team, logged in",
          "detectedAt": "09:12:05 AM"
        },
        {
          "traineeId": "b4_trainee_nikhil",
          "traineeName": "Nikhil Kumar Kurapati",
          "traineeEmail": "nikhil.kumar@nybinfotech.com",
          "batchNumber": "4",
          "loginTime": "",
          "goodMorningSent": false,
          "status": "absent",
          "minutesLate": 0,
          "messageText": "No Good Morning message received by 9:20 AM cutoff.",
          "detectedAt": "Unreachable / Away"
        }
      ]
    }
  },
  "2026-11-03": {
    "3": {
      "channel": "NYB Technical Group - III",
      "date": "2026-11-03",
      "displayDate": "03-11-2026",
      "punchedCount": 5,
      "totalTrainees": 6,
      "onTimeCount": 5,
      "graceCount": 0,
      "absentCount": 1,
      "punches": [
        { "traineeId": "b3_trainee_althaf", "traineeName": "Althaf Syed", "loginTime": "08:52 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning mam", "detectedAt": "08:52:10 AM" },
        { "traineeId": "b3_trainee_bala", "traineeName": "Bala Krishna Parimi", "loginTime": "08:56 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:56:40 AM" },
        { "traineeId": "b3_trainee_chandra", "traineeName": "Chandra Shekar K", "loginTime": "08:59 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:59:15 AM" },
        { "traineeId": "b3_trainee_sana", "traineeName": "Sana Sulthana", "loginTime": "09:00 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good Morning Team", "detectedAt": "09:00:20 AM" },
        { "traineeId": "b3_trainee_tejaswar", "traineeName": "Tejeswar Rao", "loginTime": "09:00 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "09:00:50 AM" },
        { "traineeId": "b3_trainee_girish", "traineeName": "Girish C", "loginTime": "", "goodMorningSent": false, "status": "absent", "minutesLate": 0, "messageText": "No Good Morning message received by cutoff.", "detectedAt": "Unreachable / Away" }
      ]
    },
    "4": {
      "channel": "NYB Technical Group - IV",
      "date": "2026-11-03",
      "displayDate": "03-11-2026",
      "punchedCount": 5,
      "totalTrainees": 7,
      "onTimeCount": 4,
      "graceCount": 1,
      "absentCount": 2,
      "punches": [
        { "traineeId": "b4_trainee_adinarayana", "traineeName": "Adinarayana Meesala", "loginTime": "08:50 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:50:30 AM" },
        { "traineeId": "b4_trainee_adithya", "traineeName": "Adithya Ram", "loginTime": "08:55 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning everyone", "detectedAt": "08:55:10 AM" },
        { "traineeId": "b4_trainee_sruthi", "traineeName": "Sruthi Badavath", "loginTime": "08:58 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:58:20 AM" },
        { "traineeId": "b4_trainee_jose", "traineeName": "Jose Amala Kishor", "loginTime": "09:00 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning ma'am", "detectedAt": "09:00:40 AM" },
        { "traineeId": "b4_trainee_snehith", "traineeName": "Snehith Reddy Challa", "loginTime": "09:06 AM", "goodMorningSent": true, "status": "grace-period", "minutesLate": 6, "messageText": "Good morning all", "detectedAt": "09:06:15 AM" },
        { "traineeId": "b4_trainee_nikhil", "traineeName": "Nikhil Kumar Kurapati", "loginTime": "", "goodMorningSent": false, "status": "absent", "minutesLate": 0, "messageText": "No message received by cutoff.", "detectedAt": "Unreachable / Away" },
        { "traineeId": "b4_trainee_ramesh", "traineeName": "Ramesh Kumar A", "loginTime": "", "goodMorningSent": false, "status": "absent", "minutesLate": 0, "messageText": "No message received by cutoff.", "detectedAt": "Unreachable / Away" }
      ]
    }
  },
  "2026-10-26": {
    "3": {
      "channel": "NYB Technical Group - III",
      "date": "2026-10-26",
      "displayDate": "26-10-2026",
      "punchedCount": 6,
      "totalTrainees": 6,
      "onTimeCount": 5,
      "graceCount": 1,
      "absentCount": 0,
      "punches": [
        { "traineeId": "b3_trainee_althaf", "traineeName": "Althaf Syed", "loginTime": "08:50 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning mam! Starting HTML/CSS review", "detectedAt": "08:50:05 AM" },
        { "traineeId": "b3_trainee_bala", "traineeName": "Bala Krishna Parimi", "loginTime": "08:55 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:55:20 AM" },
        { "traineeId": "b3_trainee_chandra", "traineeName": "Chandra Shekar K", "loginTime": "08:58 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:58:35 AM" },
        { "traineeId": "b3_trainee_tejaswar", "traineeName": "Tejeswar Rao", "loginTime": "09:00 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "09:00:15 AM" },
        { "traineeId": "b3_trainee_sana", "traineeName": "Sana Sulthana", "loginTime": "09:01 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 1, "messageText": "Good morning team", "detectedAt": "09:01:10 AM" },
        { "traineeId": "b3_trainee_girish", "traineeName": "Girish C", "loginTime": "09:06 AM", "goodMorningSent": true, "status": "grace-period", "minutesLate": 6, "messageText": "Good morning", "detectedAt": "09:06:25 AM" }
      ]
    },
    "4": {
      "channel": "NYB Technical Group - IV",
      "date": "2026-10-26",
      "displayDate": "26-10-2026",
      "punchedCount": 6,
      "totalTrainees": 7,
      "onTimeCount": 4,
      "graceCount": 2,
      "absentCount": 1,
      "punches": [
        { "traineeId": "b4_trainee_adinarayana", "traineeName": "Adinarayana Meesala", "loginTime": "08:52 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:52:10 AM" },
        { "traineeId": "b4_trainee_adithya", "traineeName": "Adithya Ram", "loginTime": "08:55 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning everyone", "detectedAt": "08:55:40 AM" },
        { "traineeId": "b4_trainee_sruthi", "traineeName": "Sruthi Badavath", "loginTime": "08:59 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning team", "detectedAt": "08:59:15 AM" },
        { "traineeId": "b4_trainee_jose", "traineeName": "Jose Amala Kishor", "loginTime": "09:00 AM", "goodMorningSent": true, "status": "on-time", "minutesLate": 0, "messageText": "Good morning all", "detectedAt": "09:00:25 AM" },
        { "traineeId": "b4_trainee_snehith", "traineeName": "Snehith Reddy Challa", "loginTime": "09:05 AM", "goodMorningSent": true, "status": "grace-period", "minutesLate": 5, "messageText": "Good morning team", "detectedAt": "09:05:40 AM" },
        { "traineeId": "b4_trainee_ramesh", "traineeName": "Ramesh Kumar A", "loginTime": "09:10 AM", "goodMorningSent": true, "status": "grace-period", "minutesLate": 10, "messageText": "Good morning team", "detectedAt": "09:10:30 AM" },
        { "traineeId": "b4_trainee_nikhil", "traineeName": "Nikhil Kumar Kurapati", "loginTime": "", "goodMorningSent": false, "status": "absent", "minutesLate": 0, "messageText": "No message received by cutoff.", "detectedAt": "Unreachable / Away" }
      ]
    }
  }
};

fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');
console.log('Successfully generated teams_attendance_history.json with', Object.keys(history).length, 'dates!');

