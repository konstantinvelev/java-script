const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { authCookieName, authHeaderName, jwtSecret } = config;

module.exports = function (req, res, next) {
  const token = req.cookies[authCookieName] || req.headers[authHeaderName];
  if (!token) { next(); return; }
  jwt.verify(token, jwtSecret, function (err, decoded) {
    if (err) { next(err); return; }
    req.user = { _id: decoded.userId, username: decoded.username };
    res.locals.isLogged = !!req.user;
    res.locals.userUsername = req.user.username;
    next();
  });
};