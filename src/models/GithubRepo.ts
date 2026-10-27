import { Schema, models, model } from 'mongoose';

const GithubRepoSchema = new Schema({
  username: { type: String, required: true },
  repoName: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  openIssues: { type: Number, default: 0 },
  language: { type: String, default: '' },
  lastUpdated: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  defaultBranch: { type: String, default: 'main' },
}, { timestamps: true });

export const GithubRepo = models.GithubRepo || model('GithubRepo', GithubRepoSchema);
