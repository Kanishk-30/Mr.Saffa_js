const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// Import routes
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const authRoutes = require("./routes/auth")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Fix for rate limiter X-Forwarded-For warning
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())

// Rate limiting - Updated configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// ✅ UPDATED: Production-ready CORS configuration
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

// ✅ UPDATED: Production-ready MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mrsaffa")
    console.log("✅ Connected to MongoDB successfully")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Connect to database
connectDB()

// Routes
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)

// ✅ UPDATED: Health check (moved to root for Vercel)
app.get("/", (req, res) => {
  res.json({
    message: "Mr. Saffa API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Keep your existing health check too
app.get("/api/health", (req, res) => {
  res.json({
    message: "Mr. Saffa API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
