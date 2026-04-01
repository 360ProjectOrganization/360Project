// Mongoose model for administrators
const mongoose = require('mongoose');
const passwordHashPlugin = require("./plugins/passwordHash.plugin.js");

const administratorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status:{type: String, default: "active"},
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  pfp: { type: Buffer },
  pfpContentType: { type: String, default: 'image/jpeg' },
}, { timestamps: true });

administratorSchema.plugin(passwordHashPlugin);

module.exports = mongoose.model('Administrator', administratorSchema);