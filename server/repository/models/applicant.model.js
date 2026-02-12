// Mongoose model for applicants
const mongoose = require('mongoose');
const passwordHashPlugin = require("./plugins/passwordHash.plugin.js");

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  pfp: { type: Buffer },   // binary image jpeg or a png
  resume: { type: Buffer }, // binary document pdf
}, { timestamps: true });

applicantSchema.plugin(passwordHashPlugin);

module.exports = mongoose.model('Applicant', applicantSchema);
