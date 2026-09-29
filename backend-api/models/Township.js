const mongoose = require('mongoose');

const townshipSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  nameMm: { 
    type: String, 
    default: '' 
  },
  region: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Region',
    required: true 
  }, 
  description: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Township', townshipSchema);