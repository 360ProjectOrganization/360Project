// Mongoose model for administrators
const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Administrator', administratorSchema);
