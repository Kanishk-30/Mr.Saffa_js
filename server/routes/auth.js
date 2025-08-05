const express = require("express")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    // Find admin
    const admin = await Admin.findOne({ username, isActive: true })
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Update last login
    await admin.updateLastLogin()

    // Generate token
    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "mrsaffa_secret_key_2024",
      { expiresIn: "24h" },
    )

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Create default admin (run once)
router.post("/admin/create", async (req, res) => {
  try {
    const { username = "admin", password = "admin123", email } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const admin = new Admin({
      username,
      password,
      email,
      role: "admin",
    })

    await admin.save()
    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    console.error("Admin creation error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Verify token
router.get("/admin/verify", authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-password")
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Admin not found or inactive" })
    }

    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Change password
router.put("/admin/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    const admin = await Admin.findById(req.admin.adminId)
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
