const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  hardDeleteUser
} = require('../controllers/userController');

// Import the auth middleware
const { protect } = require('../middlewares/authMiddleware');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Protected Routes ---
// Simply pass 'protect' as the second argument to secure the route
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.patch('/:id/soft-delete', protect, softDeleteUser);
router.delete('/:id/hard-delete', protect, hardDeleteUser);

module.exports = router;