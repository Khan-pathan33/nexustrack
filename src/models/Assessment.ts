import { Schema, models, model } from 'mongoose';

const AssessmentSchema = new Schema({
  traineeId: { type: String, required: true },
  traineeName: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, default: 'General' },
  score: { type: Number, required: true },
  maxScore: { type: Number, default: 100 },
  date: { type: String, required: true },
  feedback: { type: String, default: '' },
  grade: { type: String, default: '' },
}, { timestamps: true });

export const Assessment = models.Assessment || model('Assessment', AssessmentSchema);
