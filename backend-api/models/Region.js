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
// Add this to format the JSON output
regionSchema.set('toJSON', {
    virtuals: true, // Includes the virtual 'id' field
    transform: (doc, ret) => {
        delete ret._id; // Removes the original '_id' field
        delete ret.__v; // Removes the version key (optional, but standard for APIs)
    }
});
module.exports = mongoose.model('Region', regionSchema);