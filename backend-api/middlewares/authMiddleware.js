const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.isDeleted) {
        return sendError(res, 401, 'Not authorized', { user: ['User not found or deactivated'] });
      }

      return next();
    } catch (error) {
      return sendError(res, 401, 'Not authorized', { token: ['Token failed or expired'] });
    }
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized', { token: ['No token provided'] });
  }
};

module.exports = { protect };