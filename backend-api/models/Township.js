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

// Add this to format the JSON output
townshipSchema.set('toJSON', {
    virtuals: true, // Includes the virtual 'id' field
    transform: (doc, ret) => {
        delete ret._id; // Removes the original '_id' field
        delete ret.__v; // Removes the version key (optional, but standard for APIs)
    }
});
module.exports = mongoose.model('Township', townshipSchema);