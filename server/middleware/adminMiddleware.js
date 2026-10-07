import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error)
    res.status(500).json({ message: 'Server Error verifying admin role' });
  }
};

export default adminMiddleware;
