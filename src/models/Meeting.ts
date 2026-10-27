import { Schema, models, model } from 'mongoose';

const MeetingSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 30 }, // minutes
  attendees: { type: [String], default: [] },
  location: { type: String, default: 'Online' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String, default: '' },
  actionItems: { type: [String], default: [] },
}, { timestamps: true });

export const Meeting = models.Meeting || model('Meeting', MeetingSchema);
