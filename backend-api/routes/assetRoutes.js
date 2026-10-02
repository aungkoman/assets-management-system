const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/assetController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, AssetController.createAsset);
router.get('/', protect, AssetController.getAssets);
router.get('/:id', protect, AssetController.getAssetById);
router.put('/:id', protect, AssetController.updateAsset);
router.delete('/:id', protect, AssetController.deleteAsset);

module.exports = router;
