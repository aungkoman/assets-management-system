const mongoose = require('mongoose');

const townshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true},
  // add Region Object / Foreign Key
  region: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Region',
    required: true // Ensures a township cannot be created without a parent region
  }
}, { timestamps: true });

module.exports = mongoose.model('Township', townshipSchema);