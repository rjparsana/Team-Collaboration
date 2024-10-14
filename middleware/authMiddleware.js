
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

// Middleware to restrict access by role
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden. Access denied.' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
