const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Find the user by ID from the token payload and attach to req
      // We exclude the password and check if the user is soft-deleted
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.isDeleted) {
        return res.status(401).json({ message: 'Not authorized: User not found or deactivated' });
      }

      // Move to the next middleware or controller
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized: Token failed or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized: No token provided' });
  }
};

module.exports = { protect };