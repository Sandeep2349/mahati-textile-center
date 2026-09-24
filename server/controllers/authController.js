import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key-32chars-min!', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @desc    Authenticate admin user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
    });
  }
};
