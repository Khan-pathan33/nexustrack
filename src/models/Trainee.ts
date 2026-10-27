import { Schema, models, model } from 'mongoose';

const TraineeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, default: 'General' },
  skills: { type: [String], default: [] },
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'on-leave'], default: 'active' },
  avatar: { type: String, default: '' },
  joinedDate: { type: String, default: '' },
}, { timestamps: true });

export const Trainee = models.Trainee || model('Trainee', TraineeSchema);
