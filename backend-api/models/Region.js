const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);