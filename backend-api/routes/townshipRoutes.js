const express = require('express');
const router = express.Router();
const TownshipController = require('../controllers/townshipController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, TownshipController.createTownship);
router.get('/', protect, TownshipController.getTownships);
router.get('/:id', protect, TownshipController.getTownshipById);
router.put('/:id', protect, TownshipController.updateTownship);
router.delete('/:id', protect, TownshipController.deleteTownship);

module.exports = router;
