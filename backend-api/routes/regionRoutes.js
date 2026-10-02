const express = require('express');
const router = express.Router();
const RegionController = require('../controllers/regionController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, RegionController.createRegion);
router.get('/', protect, RegionController.getRegions);
router.get('/:id', protect, RegionController.getRegionById);
router.put('/:id', protect, RegionController.updateRegion);
router.delete('/:id', protect, RegionController.deleteRegion);

module.exports = router;
