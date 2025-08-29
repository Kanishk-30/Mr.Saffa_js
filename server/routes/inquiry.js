const express = require("express")
const Inquiry = require("../models/Inquiry")
const { authMiddleware } = require("../middleware/auth")
const { sendInquiryEmail } = require("../utils/emailService")
const router = express.Router()


// Get all inquiries - SIMPLE VERSION
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📋 Fetching inquiries...")
    
    const { page = 1, limit = 20, status, search } = req.query
    
    // Build filter
    const filter = {}
    if (status && status !== "All") filter.status = status
    if (search) {
      filter.$or = [
        { inquiryNumber: { $regex: search, $options: "i" } },
        { "customerInfo.name": { $regex: search, $options: "i" } },
        { "customerInfo.phone": { $regex: search, $options: "i" } },
      ]
    }

    // Simple pagination - NO PLUGINS NEEDED
    const pageNumber = parseInt(page) || 1
    const pageLimit = parseInt(limit) || 20
    const skip = (pageNumber - 1) * pageLimit

    const inquiries = await Inquiry.find(filter)
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)

    const total = await Inquiry.countDocuments(filter)
    const totalPages = Math.ceil(total / pageLimit)

    console.log(`✅ Found ${inquiries.length} inquiries`)

    res.json({
      success: true,
      inquiries,
      pagination: {
        current: pageNumber,
        limit: pageLimit,
        total,
        pages: totalPages,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      },
      message: `Found ${inquiries.length} inquiries`
    })

  } catch (error) {
    console.error("❌ Error fetching inquiries:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch inquiries"
    })
  }
})


// Dashboard statistics - SIMPLE VERSION
router.get("/stats/dashboard", authMiddleware, async (req, res) => {
  try {
    console.log("📊 Fetching dashboard stats...")

    const totalInquiries = await Inquiry.countDocuments()
    const newInquiries = await Inquiry.countDocuments({ status: "New" })
    const contactedInquiries = await Inquiry.countDocuments({ status: "Contacted" })
    const convertedInquiries = await Inquiry.countDocuments({ status: "Converted" })
    
    // Get recent inquiries
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('inquiryNumber customerInfo.name status estimatedValue createdAt')

    // Calculate potential value - SIMPLE WAY
    const allInquiries = await Inquiry.find({ status: { $nin: ["Closed"] } })
    const potentialInquiryValue = allInquiries.reduce((sum, inquiry) => sum + inquiry.estimatedValue, 0)

    console.log("✅ Dashboard stats calculated")

    res.json({
      success: true,
      totalInquiries,
      newInquiries,
      contactedInquiries,
      convertedInquiries,
      potentialInquiryValue,
      recentInquiries,
      lastUpdated: new Date()
    })

  } catch (error) {
    console.error("❌ Dashboard error:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch statistics"
    })
  }
})


// ✅ UPDATED: Create new inquiry - Returns inquiry object directly for frontend
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating new inquiry...")
    console.log("Request body:", req.body)

    const { customerInfo, items } = req.body

    // Simple validation
    if (!customerInfo) {
      return res.status(400).json({ 
        success: false,
        message: "Customer information is required" 
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "At least one item is required" 
      })
    }

    // Check required customer fields
    const requiredFields = ['name', 'phone', 'email', 'address', 'pincode']
    for (const field of requiredFields) {
      if (!customerInfo[field]) {
        return res.status(400).json({ 
          success: false,
          message: `${field} is required` 
        })
      }
    }

    const inquiry = new Inquiry({ customerInfo, items })
    const savedInquiry = await inquiry.save()

    console.log(`✅ Inquiry created: ${savedInquiry.inquiryNumber}`)
    console.log(`💰 Calculated estimated value: ${savedInquiry.estimatedValue}`)

    // Try to send email (don't fail if email fails)
    try {
      await sendInquiryEmail(savedInquiry)
      console.log("📧 Email sent successfully")
    } catch (emailError) {
      console.log("⚠️ Email failed (but inquiry saved):", emailError.message)
    }

    // ✅ CRITICAL FIX: Return inquiry object directly (not nested)
    // This matches your frontend expectation: response.data = inquiry object
    res.status(201).json(savedInquiry)

  } catch (error) {
    console.error("❌ Create error:", error)
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        success: false,
        message: "Validation failed: " + errors.join(", ")
      })
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate inquiry number. Please try again."
      })
    }
    
    res.status(500).json({ 
      success: false,
      message: "Failed to create inquiry"
    })
  }
})


// Update inquiry
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`🔄 Updating inquiry ${req.params.id}`)

    const { status, notes, priority } = req.body

    const validStatuses = ["New", "Contacted", "Quoted", "Converted", "Closed"]
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}` 
      })
    }

    const updateData = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (priority) updateData.priority = priority

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    )

    if (!inquiry) {
      return res.status(404).json({ 
        success: false,
        message: "Inquiry not found" 
      })
    }

    console.log(`✅ Updated inquiry: ${inquiry.inquiryNumber}`)
    
    res.json({
      success: true,
      message: "Updated successfully",
      inquiry
    })

  } catch (error) {
    console.error("❌ Update error:", error)
    res.status(500).json({ 
      success: false,
      message: "Update failed"
    })
  }
})


// Delete inquiry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`🗑️ Deleting inquiry ${req.params.id}`)

    const inquiry = await Inquiry.findByIdAndDelete(req.params.id)
    
    if (!inquiry) {
      return res.status(404).json({ 
        success: false,
        message: "Inquiry not found" 
      })
    }

    console.log(`✅ Deleted inquiry: ${inquiry.inquiryNumber}`)
    
    res.json({ 
      success: true,
      message: "Deleted successfully"
    })

  } catch (error) {
    console.error("❌ Delete error:", error)
    res.status(500).json({ 
      success: false,
      message: "Delete failed"
    })
  }
})


// Get single inquiry by inquiry number
router.get("/:inquiryNumber", async (req, res) => {
  try {
    console.log(`🔍 Getting inquiry ${req.params.inquiryNumber}`)

    const inquiry = await Inquiry.findOne({ inquiryNumber: req.params.inquiryNumber })
      .populate("items.productId", "name image")

    if (!inquiry) {
      return res.status(404).json({ 
        success: false,
        message: "Inquiry not found" 
      })
    }
    
    res.json({
      success: true,
      inquiry: inquiry
    })
  } catch (error) {
    console.error("❌ Error fetching single inquiry:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch inquiry"
    })
  }
})


module.exports = router
