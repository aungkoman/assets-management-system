const Region = require('../models/Region');

class RegionService {
  static async createRegion(data) {
    const region = new Region(data);
    return await region.save();
  }

  static async getRegions() {
    return await Region.find().sort({ name: 1 });
  }

  static async getRegionById(id) {
    const region = await Region.findById(id);
    if (!region) throw new Error('Region not found');
    return region;
  }

  static async updateRegion(id, updateData) {
    const region = await Region.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!region) throw new Error('Region not found');
    return region;
  }

  static async deleteRegion(id) {
    const region = await Region.findByIdAndDelete(id);
    if (!region) throw new Error('Region not found');
    return region;
  }
}

module.exports = RegionService;
