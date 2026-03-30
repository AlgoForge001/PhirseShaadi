const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1. Get token from header (Format: Bearer <token>)
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access denied, no token" });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded user (userId, email, role) to req.user
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
