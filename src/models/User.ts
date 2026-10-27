import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['coordinator', 'mentor', 'admin'], default: 'coordinator' },
  batch: { type: String, default: '3' },
  batchName: { type: String, default: 'Batch 3 - Web Development' },
  emailUser: { type: String, default: '' },
  emailPass: { type: String, default: '' },
  emailProvider: { type: String, enum: ['gmail', 'outlook', 'both', 'custom'], default: 'both' },
  gmailUser: { type: String, default: '' },
  gmailPass: { type: String, default: '' },
  outlookUser: { type: String, default: '' },
  outlookPass: { type: String, default: '' },
  imapHost: { type: String, default: 'outlook.office365.com' },
  imapPort: { type: Number, default: 993 },
  smtpHost: { type: String, default: 'smtp.office365.com' },
  smtpPort: { type: Number, default: 587 },
  excelFilename: { type: String, default: 'Technical Team batch-3_Daily_Status_Report.xlsx' },
  excelPassword: { type: String, default: '' },
  sharepointUrl: { type: String, default: '' },
  tlEmail: { type: String, default: '' },
  hasCompletedOnboarding: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

