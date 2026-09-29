const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendError(res, 400, 'Registration failed', { email: ['User with this email already exists'] });
    }

    const user = await User.create({ name, email, password });
    const data = { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) };
    
    sendSuccess(res, 201, 'User registered successfully', data);
  } catch (error) {
    sendError(res, 500, 'Server error during registration', error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });

    if (user && (await user.matchPassword(password))) {
      const data = { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) };
      return sendSuccess(res, 200, 'Login successful', data);
    } 
    
    sendError(res, 401, 'Authentication failed', { credentials: ['Invalid email or password'] });
  } catch (error) {
    sendError(res, 500, 'Server error during login', error.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    // 1. Get page and limit from query string (set defaults if not provided)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // 2. Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 3. Define the filter
    const filter = { isDeleted: false };

    // 4. Execute data query and count query in parallel
    const [users, totalItems] = await Promise.all([
      User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }), // Optional: sorts by newest first
      User.countDocuments(filter)
    ]);

    // 5. Construct the pagination object
    const totalPages = Math.ceil(totalItems / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    // 6. Send unified response
    sendSuccess(res, 200, 'Users retrieved successfully', users, pagination);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch users', error.message);
  }
};






exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    sendSuccess(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch user', error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return sendError(res, 403, 'Permission denied', { auth: ['You can only update your own profile'] });
    }

    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; 
    }

    const updatedUser = await user.save();
    const data = { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email };
    
    sendSuccess(res, 200, 'User updated successfully', data);
  } catch (error) {
    sendError(res, 500, 'Failed to update user', error.message);
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isDeleted = true;
    await user.save();
    sendSuccess(res, 200, 'User successfully deactivated');
  } catch (error) {
    sendError(res, 500, 'Failed to deactivate user', error.message);
  }
};

exports.hardDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    
    sendSuccess(res, 200, 'User permanently removed from database');
  } catch (error) {
    sendError(res, 500, 'Failed to delete user', error.message);
  }
};