require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// Import routes
const productRoutes = require("./routes/products")
const inquiryRoutes = require("./routes/inquiry")
const authRoutes = require("./routes/auth")

const app = express()
const PORT = process.env.PORT || 5000

// Fix for rate limiter X-Forwarded-For warning
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CLIENT_URL || 'https://mr-saffa-client.vercel.app',
        'https://mrsaffa.in',
        'https://www.mrsaffa.in'
      ]
    : [
        process.env.CLIENT_URL || "http://localhost:3000",
        "http://localhost:3001"
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.static("uploads"))

// ✅ SIMPLIFIED: MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mrsaffa", {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log("✅ Connected to MongoDB successfully")
    console.log("📄 Database:", mongoose.connection.db.databaseName)
    
    // Check if admin user exists
    await checkAdminUsers()
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Check admin users for debugging
const checkAdminUsers = async () => {
  try {
    const Admin = require('./models/Admin')
    const adminCount = await Admin.countDocuments()
    console.log(`👤 Admin users in database: ${adminCount}`)
    
    if (adminCount === 0) {
      console.log('⚠️ No admin users found! Create one using:')
      console.log('POST /api/auth/admin/create')
      console.log('{"username":"admin","password":"admin123"}')
    } else {
      const admins = await Admin.find({}, 'username isActive').lean()
      console.log('👥 Available admins:', admins)
    }
  } catch (error) {
    console.error('❌ Error checking admin users:', error.message)
  }
}

// Initialize database connection
connectDB()

// Request logging middleware
app.use((req, res, next) => {
  // Only log auth requests to help debug login issues
  if (req.path.includes('/auth/')) {
    console.log(`🔍 ${req.method} ${req.path}`)
    if (req.method === 'POST') {
      console.log('📦 Body:', JSON.stringify(req.body, null, 2))
    }
  }
  next()
})

// Routes
app.use("/api/products", productRoutes)
app.use("/api/inquiry", inquiryRoutes)
app.use("/api/auth", authRoutes)

// ✅ SIMPLIFIED: Health checks without socket info
app.get("/", (req, res) => {
  res.json({
    message: "Mr. Saffa Inquiry API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    features: ["Product Catalog", "Business Inquiries", "Admin Panel"],
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    endpoints: {
      products: "/api/products",
      inquiry: "/api/inquiry",
      auth: "/api/auth"
    }
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    message: "Mr. Saffa Inquiry API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      name: mongoose.connection.db?.databaseName || "Unknown"
    },
    uptime: process.uptime(),
    endpoints: {
      products: "/api/products",
      inquiry: "/api/inquiry",
      auth: "/api/auth"
    }
  })
})

// Admin debug endpoint
app.get("/api/debug/admins", async (req, res) => {
  try {
    const Admin = require('./models/Admin')
    const admins = await Admin.find({}, 'username isActive createdAt').lean()
    res.json({
      count: admins.length,
      admins: admins
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error occurred:')
  console.error('Path:', req.path)
  console.error('Method:', req.method)
  console.error('Error:', err.stack)
  
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    path: req.path,
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use("*", (req, res) => {
  console.log('📍 404 - Route not found:', req.method, req.originalUrl)
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "/api/products",
      "/api/inquiry",
      "/api/auth",
      "/api/health",
      "/api/debug/admins"
    ]
  })
})

// ✅ BACK TO SIMPLE: Regular Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📋 Simple inquiry system ready!`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔧 Debug admins: http://localhost:${PORT}/api/debug/admins`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

module.exports = app
