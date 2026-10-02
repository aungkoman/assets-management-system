const AssetService = require('../services/assetService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AssetController {
  static async createAsset(req, res) {
    try {
      const asset = await AssetService.createAsset(req.body);
      return sendSuccess(res, 201, 'Asset created successfully', asset);
    } catch (error) {
      return sendError(res, 400, 'Failed to create asset', error.message);
    }
  }

  static async getAssets(req, res) {
    try {
      const result = await AssetService.getAssets(req.query);
      return sendSuccess(res, 200, 'Assets retrieved successfully', result.data, result.pagination);
    } catch (error) {
      return sendError(res, 500, 'Failed to retrieve assets', error.message);
    }
  }

  static async getAssetById(req, res) {
    try {
      const asset = await AssetService.getAssetById(req.params.id);
      return sendSuccess(res, 200, 'Asset retrieved successfully', asset);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to retrieve asset', error.message);
    }
  }

  static async updateAsset(req, res) {
    try {
      const asset = await AssetService.updateAsset(req.params.id, req.body);
      return sendSuccess(res, 200, 'Asset updated successfully', asset);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to update asset', error.message);
    }
  }

  static async deleteAsset(req, res) {
    try {
      const asset = await AssetService.deleteAsset(req.params.id);
      return sendSuccess(res, 200, 'Asset deleted successfully', asset);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to delete asset', error.message);
    }
  }
}

module.exports = AssetController;
