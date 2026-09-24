import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-32chars-min!');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: 'User not found or inactive' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
};
