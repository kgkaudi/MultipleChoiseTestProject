const jwt = require("jsonwebtoken");

// PROTECT
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Missing header
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Must start with Bearer
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded must contain required fields
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ADMIN ONLY
exports.adminOnly = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};
