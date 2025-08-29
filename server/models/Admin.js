const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true, // ✅ Ensure consistent case
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"], // ✅ Fixed regex
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "super_admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// ✅ Enhanced password hashing with logging
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    console.log("🔒 Hashing password for admin:", this.username)
    const salt = await bcrypt.genSalt(12)
    const originalPassword = this.password
    this.password = await bcrypt.hash(this.password, salt)
    console.log("✅ Password hashed successfully")
    console.log("  Original length:", originalPassword.length)
    console.log("  Hash length:", this.password.length)
    next()
  } catch (error) {
    console.error("❌ Password hashing error:", error)
    next(error)
  }
})

// ✅ Enhanced password comparison with logging
adminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("🔍 Comparing password for admin:", this.username)
    console.log("  Candidate password length:", candidatePassword.length)
    console.log("  Stored hash length:", this.password.length)
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log("🔍 Password match result:", isMatch)
    return isMatch
  } catch (error) {
    console.error("❌ Password comparison error:", error)
    throw error
  }
}

// ✅ Enhanced last login update
adminSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  this.loginAttempts = 0
  console.log("📅 Updated last login for:", this.username)
  return this.save()
}

// ✅ Add index for performance
adminSchema.index({ username: 1 })

module.exports = mongoose.model("Admin", adminSchema)
