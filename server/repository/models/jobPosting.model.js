// Mongoose model for job postings
const mongoose = require('mongoose');

const JOB_STATUSES = ['ACTIVE', 'UNPUBLISHED', 'CLOSED'];
const JOB_CLOSURE_REASONS = ['FILLED', 'UNFILLED', 'CANCELLED', 'OTHER'];

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
  closureReason: { type: String, enum: JOB_CLOSURE_REASONS },
  publishedAt: { type: Date },
  closedAt: { type: Date },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
  comments: [{
    content: { type: String, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date },
  }],
}, { timestamps: true });

jobPostingSchema.statics.STATUSES = JOB_STATUSES;
jobPostingSchema.statics.CLOSURE_REASONS = JOB_CLOSURE_REASONS;

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
JobPosting.STATUSES = JOB_STATUSES;
JobPosting.CLOSURE_REASONS = JOB_CLOSURE_REASONS;
module.exports = JobPosting;
