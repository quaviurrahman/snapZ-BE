const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ Unauthorized: 'Missing token' });
  }

  try {
    const jwtSecret = 'snapZ'
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ Unauthorized: 'Invalid token.' });
  }
};

module.exports = checkAuth;
