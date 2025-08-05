const express = require("express")
const Product = require("../models/Product")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// Get all products with filtering, pagination, and sorting
router.get("/", async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      search, 
      page = 1, 
      limit = 50, 
      sort = 'default' 
    } = req.query

    // Build filter object
    const filter = {}
    if (category && category !== "All") filter.category = category
    if (featured === "true") filter.featured = true
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, 
        { description: { $regex: search, $options: "i" } }
      ]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Determine sort options
    const getSortOptions = (sortType) => {
      switch (sortType) {
        case 'display':
          return { display_order: 1, createdAt: -1 }
        case 'priceAsc':
          return { price: 1 }
        case 'priceDesc':
          return { price: -1 }
        case 'featured':
          return { featured_order: 1, featured: -1, createdAt: -1 }
        case 'name':
          return { name: 1 }
        default:
          return { createdAt: -1 }
      }
    }

    // Get products with pagination and sorting
    const products = await Product.find(filter)
      .sort(getSortOptions(sort))
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get featured products in order (for homepage)
router.get("/featured/ordered", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
      .sort({ featured_order: 1, createdAt: -1 })
      .limit(6) // Limit to 6 featured products for homepage

    res.json({
      products: featuredProducts,
      total: featuredProducts.length
    })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }
    res.status(500).json({ message: error.message })
  }
})

// Create product (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body)
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    res.status(400).json({ message: error.message })
  }
})

// Update product (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }
    res.status(400).json({ message: error.message })
  }
})

// Update featured order (admin only)
router.patch("/:id/featured-order", authMiddleware, async (req, res) => {
  try {
    const { featured_order } = req.body
    
    if (!Number.isInteger(featured_order) || featured_order < 1) {
      return res.status(400).json({ message: "Featured order must be a positive integer" })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { featured_order, featured: true }, // Automatically set featured to true
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    
    res.json(product)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }
    res.status(400).json({ message: error.message })
  }
})

// Update display order (admin only)
router.patch("/:id/display-order", authMiddleware, async (req, res) => {
  try {
    const { display_order } = req.body
    
    if (!Number.isInteger(display_order) || display_order < 1) {
      return res.status(400).json({ message: "Display order must be a positive integer" })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { display_order }, 
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    
    res.json(product)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }
    res.status(400).json({ message: error.message })
  }
})

// Delete product (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" })
    }
    res.status(500).json({ message: error.message })
  }
})

// Get product categories
router.get("/meta/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get product statistics (admin only)
router.get("/meta/stats", authMiddleware, async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalStock: { $sum: "$stockQuantity" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    const totalProducts = await Product.countDocuments()
    const featuredProducts = await Product.countDocuments({ featured: true })
    const outOfStock = await Product.countDocuments({ inStock: false })

    res.json({
      categoryStats: stats,
      totalProducts,
      featuredProducts,
      outOfStock
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
