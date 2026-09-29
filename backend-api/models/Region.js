const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  nameMm: { 
    type: String, 
    required: true,
    trim: true 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  }, 
  description: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);