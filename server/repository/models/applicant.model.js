// Mongoose model for applicants
const mongoose = require('mongoose');
const passwordHashPlugin = require("./plugins/passwordHash.plugin.js");

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  status:{type: String, default: "active"},
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  pfp: { type: Buffer },
  pfpContentType: { type: String, default: 'image/jpeg' },
  resume: { type: Buffer },
  resumeContentType: { type: String, default: 'application/pdf' },
  jobsAppliedTo: [{
    _id: false,
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true},
    appliedAt: {type: Date, default: Date.now},
  }],
}, { timestamps: true });

applicantSchema.plugin(passwordHashPlugin);

module.exports = mongoose.model('Applicant', applicantSchema);
