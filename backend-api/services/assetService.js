const Asset = require('../models/Asset');

class AssetService {
  static async createAsset(data) {
    const asset = new Asset(data);
    return await asset.save();
  }

  static async getAssets(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.location) filter.location = query.location;

    const [assets, totalItems] = await Promise.all([
      Asset.find(filter)
        .populate('location', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Asset.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { data: assets, pagination };
  }

  static async getAssetById(id) {
    const asset = await Asset.findOne({ _id: id, isDeleted: false })
      .populate('location');
    if (!asset) throw new Error('Asset not found');
    return asset;
  }

  static async updateAsset(id, updateData) {
    const asset = await Asset.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!asset) throw new Error('Asset not found');
    return asset;
  }

  static async deleteAsset(id) {
    const asset = await Asset.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!asset) throw new Error('Asset not found');
    return asset;
  }
}

module.exports = AssetService;
