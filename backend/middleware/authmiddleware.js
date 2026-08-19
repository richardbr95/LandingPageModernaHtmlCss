const jwt = require("jsonwebtoken");

const jwtSecret = "my-secret-key";

function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(400).json({
      message: "Access token required",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
}

function authorizeRole(requiredRole) {
  return function (req, res, next) {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
