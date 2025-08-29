const express = require("express")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// Enhanced Admin login with detailed debugging
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    console.log("🔍 Login attempt details:")
    console.log("  Username:", username)
    console.log("  Password provided:", !!password)

    // Validate input
    if (!username || !password) {
      console.log("❌ Missing username or password")
      return res.status(400).json({ message: "Username and password are required" })
    }

    // Find admin
    console.log("🔎 Searching for admin:", username)
    const admin = await Admin.findOne({ 
      username: username.toLowerCase().trim(),
      isActive: true 
    })
    
    console.log("👤 Admin found:", !!admin)
    
    if (!admin) {
      console.log("❌ No admin found, checking all admins in DB...")
      const allAdmins = await Admin.find({}, 'username isActive').lean()
      console.log("📊 All admins:", allAdmins)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if account is locked
    if (admin.isLocked) {
      console.log("🔒 Account is locked")
      return res.status(423).json({ message: "Account temporarily locked. Try again later." })
    }

    // Check password
    console.log("🔐 Verifying password...")
    const isMatch = await admin.comparePassword(password)
    
    if (!isMatch) {
      console.log("❌ Password mismatch")
      // Increment login attempts
      admin.loginAttempts += 1
      
      // Lock account after 5 failed attempts for 15 minutes
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = Date.now() + 15 * 60 * 1000 // 15 minutes
        console.log("🔒 Account locked due to multiple failed attempts")
      }
      
      await admin.save()
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Update last login
    console.log("📅 Updating last login...")
    await admin.updateLastLogin()

    // Generate token
    console.log("🎫 Generating JWT token...")
    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "mrsaffa_secret_key_2024",
      { expiresIn: "24h" }
    )

    console.log("✅ Login successful for:", username)
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
    console.error("❌ Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Enhanced admin creation
router.post("/admin/create", async (req, res) => {
  try {
    const { username = "admin", password = "admin123", email } = req.body

    console.log("👤 Creating admin:", username)

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() })
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", username)
      return res.status(400).json({ message: "Admin already exists" })
    }

    const admin = new Admin({
      username: username.toLowerCase(),
      password, // Will be hashed by pre-save hook
      email,
      role: "admin",
    })

    await admin.save()
    console.log("✅ Admin created successfully:", username)
    
    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("❌ Admin creation error:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    res.status(500).json({ message: error.message })
  }
})

// Keep your existing verify and change-password routes
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

    // Update password (will be hashed by pre-save hook)
    admin.password = newPassword
    await admin.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
