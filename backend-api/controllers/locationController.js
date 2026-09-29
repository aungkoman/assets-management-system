const LocationService = require('../services/locationService'); 
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Adjust path to where your helpers are located

class LocationController {
  /**
   * Create a new location
   * POST /api/locations
   */
  static async createLocation(req, res) {
    try {
      const location = await LocationService.createLocation(req.body);
      return sendSuccess(res, 201, 'Location created successfully', location);
    } catch (error) {
      return sendError(res, 400, 'Failed to create location', error.message);
    }
  }

  /**
   * Get all active locations
   * GET /api/locations
   */
  static async getLocations(req, res) {
    try {
      const locations = await LocationService.getLocations(req.query);
      return sendSuccess(res, 200, 'Locations retrieved successfully', locations);
    } catch (error) {
      return sendError(res, 500, 'Failed to retrieve locations', error.message);
    }
  }

  /**
   * Get a single location by ID
   * GET /api/locations/:id
   */
  static async getLocationById(req, res) {
    try {
      const location = await LocationService.getLocationById(req.params.id);
      return sendSuccess(res, 200, 'Location retrieved successfully', location);
    } catch (error) {
      // 404 Not Found if the service throws a "not found" error
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to retrieve location', error.message);
    }
  }

  /**
   * Update a location by ID
   * PUT or PATCH /api/locations/:id
   */
  static async updateLocation(req, res) {
    try {
      const location = await LocationService.updateLocation(req.params.id, req.body);
      return sendSuccess(res, 200, 'Location updated successfully', location);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to update location', error.message);
    }
  }

  /**
   * Soft delete a location
   * DELETE /api/locations/:id
   */
  static async deleteLocation(req, res) {
    try {
      const location = await LocationService.deleteLocation(req.params.id);
      return sendSuccess(res, 200, 'Location deleted successfully', location);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return sendError(res, statusCode, 'Failed to delete location', error.message);
    }
  }
}

module.exports = LocationController;