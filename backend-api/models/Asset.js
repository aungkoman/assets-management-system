const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { 
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
  },
  category: {
    type: String,
    enum: ['Electronics', 'Furniture', 'Vehicle', 'Equipment', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance', 'Retired'],
    default: 'Active'
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  serialNumber: {
    type: String
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

assetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Asset', assetSchema);
