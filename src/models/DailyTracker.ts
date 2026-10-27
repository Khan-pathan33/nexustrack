import mongoose from 'mongoose';

const DailyTrackerSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  pendingTopics: { type: String, default: 'N/A' },
  completedTopicsStatus: { type: String, default: 'Partial' }, // Yes/No/Partial
  completedTopicsDetails: { type: String, default: '' },
  taskAssign: { type: String, default: 'Yes' }, // Yes/No
  doubts: { type: String, default: 'No Blockers Reported' },
  discussionSummary: { type: String, default: '' },
  githubPushStatus: { type: String, default: 'Yes' }, // Yes/No
  emailReviewStatus: { type: String, default: 'Pending' },
  standupParticipation: { type: String, default: 'Not Conducted' },
  standupRating: { type: String, default: 'N/A' },
  standupRemarks: { type: String, default: 'N/A' },
  selfProjectStatus: { type: String, default: 'N/A' },
  performanceScore: { type: Number, default: 0 },
  scoreReasoning: { type: String, default: '' }
}, { timestamps: true });

export const DailyTracker = mongoose.models.DailyTracker || mongoose.model('DailyTracker', DailyTrackerSchema);
