import { Schema, models, model } from 'mongoose';

const MailSchema = new Schema({
  subject: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status: { type: String, enum: ['pending', 'replied', 'archived', 'follow-up'], default: 'pending' },
  category: { type: String, default: 'General' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const Mail = models.Mail || model('Mail', MailSchema);
