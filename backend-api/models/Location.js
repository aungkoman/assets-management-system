const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    // township 
    // parent , nullable refernce.
    // type , bank / building / unit / cash box etc
    category: {
        type: String,
        enum: ['Building', 'Floor', 'Room', 'Rack', 'Desk'], // နောက်ပိုင်း ဒီမှာ လာတိုးမယ်။ ဂိုဒေါင်၊ ငွေတိုက်၊ အေတီအမ် စသည်။
        default: 'Building'
    },

    // add Region Object / Foreign Key
    townshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Township',
        default: null, // Ensures a township cannot be created without a parent region
    },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location',
        default: null // If null, this is a top-level location (e.g., a Building)
    },
    address: {
        street: String,
        city: String,
        zipCode: String,
        lat: Number,
        lng: Number
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }

}, { timestamps: true });

// Add this to format the JSON output
locationSchema.set('toJSON', {
    virtuals: true, // Includes the virtual 'id' field
    transform: (doc, ret) => {
        delete ret._id; // Removes the original '_id' field
        delete ret.__v; // Removes the version key (optional, but standard for APIs)
    }
});


module.exports = mongoose.model('Location', locationSchema);