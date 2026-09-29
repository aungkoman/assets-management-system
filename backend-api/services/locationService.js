const Region = require('../models/Region'); // adjust path
const Township = require('../models/Township'); // adjust path
const Location = require('../models/Location'); // Adjust path based on your folder structure

class LocationService {
  /**
   * Create a new location
   */
  static async createLocation(data) {
    const location = new Location(data);
    return await location.save();
  }

  /**
   * Get all active locations with optional filtering
   * Populates township and parent location data
   */
  static async getLocations(filter = {}) {
    // Default to excluding soft-deleted records unless explicitly requested
    const query = { isDeleted: false, ...filter };
    
    return await Location.find(query)
      // .populate('township', 'name description') // Adjust fields based on Township schema
      .populate({
        path: 'township',
        populate: {
          path: 'region' // Deep populates the Region schema inside Township
        }
      })
      .populate('parentId', 'name category')
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single location by ID
   */
  static async getLocationById(id) {
    const location = await Location.findOne({ _id: id, isDeleted: false })
      // .populate('township')
      .populate({
        path: 'township',
        populate: {
          path: 'region' // Deep populates the Region schema inside Township
        }
      })
      .populate('parentId');
      
    if (!location) throw new Error('Location not found');
    return location;
  }

  /**
   * Update a location by ID
   */
  static async updateLocation(id, updateData) {
    const location = await Location.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true } // new: true returns the updated document
    );

    if (!location) throw new Error('Location not found');
    return location;
  }

  /**
   * Soft delete a location (Updates isDeleted flag instead of removing from DB)
   */
  static async deleteLocation(id) {
    const location = await Location.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, isActive: false } },
      { new: true }
    );

    if (!location) throw new Error('Location not found');
    return location;
  }
}

module.exports = LocationService;