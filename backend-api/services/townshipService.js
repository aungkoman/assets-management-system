const Township = require('../models/Township');

class TownshipService {
  static async createTownship(data) {
    const township = new Township(data);
    return await township.save();
  }

  static async getTownships() {
    return await Township.find()
      .populate('region', 'name nameMm code')
      .sort({ name: 1 });
  }

  static async getTownshipById(id) {
    const township = await Township.findById(id).populate('region');
    if (!township) throw new Error('Township not found');
    return township;
  }

  static async updateTownship(id, updateData) {
    const township = await Township.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!township) throw new Error('Township not found');
    return township;
  }

  static async deleteTownship(id) {
    const township = await Township.findByIdAndDelete(id);
    if (!township) throw new Error('Township not found');
    return township;
  }
}

module.exports = TownshipService;
