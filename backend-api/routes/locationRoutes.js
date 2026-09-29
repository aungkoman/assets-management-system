const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');

// Import the auth middleware
const { protect } = require('../middlewares/authMiddleware');

// --- Protected Routes ---
// Apply 'protect' to ensure only authenticated users can manage and view locations
router.post('/', protect, LocationController.createLocation);
router.get('/', protect, LocationController.getLocations);
router.get('/:id', protect, LocationController.getLocationById);
router.put('/:id', protect, LocationController.updateLocation);
router.delete('/:id', protect, LocationController.deleteLocation);

module.exports = router;