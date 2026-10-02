const RegionService = require('../services/regionService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class RegionController {
  static async createRegion(req, res) {
    try {
      const region = await RegionService.createRegion(req.body);
      return sendSuccess(res, 201, 'Region created successfully', region);
    } catch (error) {
      return sendError(res, 400, 'Failed to create region', error.message);
    }
  }

  static async getRegions(req, res) {
    try {
      const regions = await RegionService.getRegions();
      return sendSuccess(res, 200, 'Regions retrieved successfully', regions);
    } catch (error) {
      return sendError(res, 500, 'Failed to retrieve regions', error.message);
    }
  }

  static async getRegionById(req, res) {
    try {
      const region = await RegionService.getRegionById(req.params.id);
      return sendSuccess(res, 200, 'Region retrieved successfully', region);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to retrieve region', error.message);
    }
  }

  static async updateRegion(req, res) {
    try {
      const region = await RegionService.updateRegion(req.params.id, req.body);
      return sendSuccess(res, 200, 'Region updated successfully', region);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to update region', error.message);
    }
  }

  static async deleteRegion(req, res) {
    try {
      const region = await RegionService.deleteRegion(req.params.id);
      return sendSuccess(res, 200, 'Region deleted successfully', region);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to delete region', error.message);
    }
  }
}

module.exports = RegionController;
