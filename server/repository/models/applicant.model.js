// Mongoose model for applicants
const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  pfp: { type: Buffer },   // binary image jpeg or a png
  resume: { type: Buffer }, // binary document pdf
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
