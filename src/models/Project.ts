import { Schema, models, model } from 'mongoose';

const MilestoneSchema = new Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['planning', 'active', 'review', 'completed', 'on-hold'], default: 'planning' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  deadline: { type: String, default: '' },
  team: { type: [String], default: [] },
  milestones: { type: [MilestoneSchema], default: [] },
  priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  color: { type: String, default: '#7c3aed' },
}, { timestamps: true });

export const Project = models.Project || model('Project', ProjectSchema);
