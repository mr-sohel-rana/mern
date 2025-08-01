const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const jwtSecret = process.env.JWT_SECRET || "default-secret-key";

// Middleware to verify user token
const requireSignIn = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { _id: decoded.user_id, ...decoded };
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await UserModel.findById(req.user._id);
    
    if (!user || user.role !== 1) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Error verifying admin role:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { requireSignIn, isAdmin };
