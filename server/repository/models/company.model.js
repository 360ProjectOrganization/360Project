// Mongoose model for companies
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  pfp: { type: Buffer }, // binary image jpeg or a png
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' }],
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
