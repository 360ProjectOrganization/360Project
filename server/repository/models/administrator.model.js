// Mongoose model for administrators
const mongoose = require('mongoose');
const passwordHashPlugin = require("./plugins/passwordHash.plugin.js");

const administratorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

administratorSchema.plugin(passwordHashPlugin);

module.exports = mongoose.model('Administrator', administratorSchema);
