const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a given user id.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

/**
 * Register a new user.
 * @throws {Error} with a custom `statusCode` and `errors` property when validation fails.
 */
const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error('Registration failed');
    error.statusCode = 400;
    error.errors = { email: ['User with this email already exists'] };
    throw error;
  }

  const user = await User.create({ name, email, password });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

/**
 * Authenticate a user with email + password.
 * @throws {Error} with statusCode 401 on invalid credentials.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email, isDeleted: false });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  }

  const error = new Error('Authentication failed');
  error.statusCode = 401;
  error.errors = { credentials: ['Invalid email or password'] };
  throw error;
};

/**
 * Fetch a paginated list of active users.
 */
const getUsers = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  const skip = (page - 1) * limit;
  const filter = { isDeleted: false };

  const [users, totalItems] = await Promise.all([
    User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  const pagination = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { users, pagination };
};

/**
 * Fetch a single user by id.
 * @throws {Error} with statusCode 404 if not found.
 */
const getUserById = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update a user's own profile.
 * @throws {Error} with statusCode 403 if not the owner, 404 if not found.
 */
const updateUser = async (requestingUserId, targetId, updates) => {
  if (requestingUserId.toString() !== targetId) {
    const error = new Error('Permission denied');
    error.statusCode = 403;
    error.errors = { auth: ['You can only update your own profile'] };
    throw error;
  }

  const user = await User.findOne({ _id: targetId, isDeleted: false });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.name = updates.name || user.name;
  user.email = updates.email || user.email;
  if (updates.password) {
    user.password = updates.password;
  }

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  };
};

/**
 * Soft-delete (deactivate) a user.
 * @throws {Error} with statusCode 404 if not found.
 */
const softDeleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isDeleted = true;
  await user.save();
};

/**
 * Hard-delete (permanently remove) a user.
 * @throws {Error} with statusCode 404 if not found.
 */
const hardDeleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  hardDeleteUser,
};