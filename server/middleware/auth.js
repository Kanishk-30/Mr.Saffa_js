const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mrsaffa_secret_key_2024")

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId)
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Access denied. Admin not found or inactive." })
    }

    req.admin = decoded
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." })
    }
    res.status(500).json({ message: "Token verification failed." })
  }
}

module.exports = { authMiddleware }
