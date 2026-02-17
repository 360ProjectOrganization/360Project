// Mongoose model for job postings
const mongoose = require('mongoose');

const JOB_STATUSES = ['ACTIVE', 'UNPUBLISHED', 'CLOSED'];

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  location: { type: String, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: JOB_STATUSES,
    default: 'ACTIVE',
  },
  publishedAt: { type: Date },
  closedAt: { type: Date },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
}, { timestamps: true });

jobPostingSchema.statics.STATUSES = JOB_STATUSES;

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
JobPosting.STATUSES = JOB_STATUSES;
module.exports = JobPosting;
