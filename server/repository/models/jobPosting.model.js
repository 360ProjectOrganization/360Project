// Mongoose model for job postings
const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  location: { type: String, trim: true },
  description: { type: String, trim: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
