const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// Get all orders (admin only) with pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query

    // Build filter
    const filter = {}
    if (status && status !== "All") filter.status = status
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customerInfo.name": { $regex: search, $options: "i" } },
        { "customerInfo.phone": { $regex: search, $options: "i" } },
      ]
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const orders = await Order.find(filter)
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Order.countDocuments(filter)

    res.json({
      orders,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get single order by order number
router.get("/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate(
      "items.productId",
      "name image category",
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new order
router.post("/", async (req, res) => {
  try {
    const { customerInfo, items, paymentMethod } = req.body

    // Validate required fields
    if (!customerInfo || !items || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" })
    }

    // Validate products exist and are in stock
    const productIds = items.map((item) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Some products not found" })
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId)
      if (!product.inStock) {
        return res.status(400).json({ message: `${product.name} is out of stock` })
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        })
      }
    }

    // Create order with validated data
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId)
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      }
    })

    const order = new Order({
      customerInfo,
      items: orderItems,
      paymentMethod,
    })

    const savedOrder = await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockQuantity: -item.quantity } })
    }

    res.status(201).json(savedOrder)
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    console.error("Error creating order:", error)
    res.status(400).json({ message: error.message })
  }
})

// Update order status (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body

    const updateData = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (notes !== undefined) updateData.notes = notes

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate(
      "items.productId",
      "name image",
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors.join(", ") })
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" })
    }
    res.status(400).json({ message: error.message })
  }
})

// Get order statistics (admin only)
router.get("/stats/dashboard", authMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ status: "Pending" })
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" })

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    // Recent orders
    const recentOrders = await Order.find().populate("items.productId", "name").sort({ createdAt: -1 }).limit(5)

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      recentOrders,
    })
  } catch (error) {
    console.error("Error fetching order stats:", error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
