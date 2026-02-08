// Mongoose model for applicants
const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  pfp: { type: Buffer },
  pfpContentType: { type: String, default: 'image/jpeg' },
  resume: { type: Buffer },
  resumeContentType: { type: String, default: 'application/pdf' },
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
