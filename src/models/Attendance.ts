import mongoose from 'mongoose';

export interface AttendanceDocument extends mongoose.Document {
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  batchNumber: string;
  date: string; // YYYY-MM-DD
  loginTime: string; // e.g. "08:58 AM"
  logoutTime: string; // e.g. "06:05 PM"
  status: 'on-time' | 'grace-period' | 'late' | 'absent' | 'on-leave' | 'logged-out';
  goodMorningSent: boolean;
  absenceNoticeSent: boolean;
  absenceNoticeDraftedAt?: string;
  minutesLate: number;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema(
  {
    traineeId: { type: String, required: true },
    traineeName: { type: String, required: true },
    traineeEmail: { type: String, default: '' },
    batchNumber: { type: String, default: '3' },
    date: { type: String, required: true },
    loginTime: { type: String, default: '' },
    logoutTime: { type: String, default: '' },
    status: {
      type: String,
      enum: ['on-time', 'grace-period', 'late', 'absent', 'on-leave', 'logged-out'],
      default: 'absent',
    },
    goodMorningSent: { type: Boolean, default: false },
    absenceNoticeSent: { type: Boolean, default: false },
    absenceNoticeDraftedAt: { type: String, default: '' },
    minutesLate: { type: Number, default: 0 },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

AttendanceSchema.index({ traineeId: 1, date: 1 }, { unique: true });

export const Attendance =
  mongoose.models.Attendance || mongoose.model<AttendanceDocument>('Attendance', AttendanceSchema);
