const TownshipService = require('../services/townshipService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class TownshipController {
  static async createTownship(req, res) {
    try {
      const township = await TownshipService.createTownship(req.body);
      return sendSuccess(res, 201, 'Township created successfully', township);
    } catch (error) {
      return sendError(res, 400, 'Failed to create township', error.message);
    }
  }

  static async getTownships(req, res) {
    try {
      const townships = await TownshipService.getTownships();
      return sendSuccess(res, 200, 'Townships retrieved successfully', townships);
    } catch (error) {
      return sendError(res, 500, 'Failed to retrieve townships', error.message);
    }
  }

  static async getTownshipById(req, res) {
    try {
      const township = await TownshipService.getTownshipById(req.params.id);
      return sendSuccess(res, 200, 'Township retrieved successfully', township);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to retrieve township', error.message);
    }
  }

  static async updateTownship(req, res) {
    try {
      const township = await TownshipService.updateTownship(req.params.id, req.body);
      return sendSuccess(res, 200, 'Township updated successfully', township);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to update township', error.message);
    }
  }

  static async deleteTownship(req, res) {
    try {
      const township = await TownshipService.deleteTownship(req.params.id);
      return sendSuccess(res, 200, 'Township deleted successfully', township);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to delete township', error.message);
    }
  }
}

module.exports = TownshipController;
