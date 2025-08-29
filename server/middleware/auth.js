const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")
    
    // Enhanced debugging
    console.log("🔐 Auth middleware check:")
    console.log("  Auth header:", authHeader ? "Present" : "Missing")
    
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      console.log("❌ No token provided")
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    console.log("🎫 Token length:", token.length)
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mrsaffa_secret_key_2024")
    console.log("✅ Token decoded:", decoded.username)

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId)
    console.log("👤 Admin found:", !!admin)
    console.log("👤 Admin active:", admin?.isActive)
    
    if (!admin || !admin.isActive) {
      console.log("❌ Admin not found or inactive")
      return res.status(401).json({ message: "Access denied. Admin not found or inactive." })
    }

    req.admin = decoded
    next()
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message)
    
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
