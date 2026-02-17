// the middleware is used to read auth header and verify the token
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader.split(' ');

  if (!scheme || scheme !== 'Bearer') {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireAuth };

// https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/#heading-how-to-implement-jwt-authentication