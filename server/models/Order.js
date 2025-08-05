const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        maxlength: [200, "Address cannot exceed 200 characters"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        enum: {
          values: ["335513", "335512"],
          message: "We only deliver to pincodes 335513 and 335512",
        },
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          max: [50, "Quantity cannot exceed 50"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: {
        values: ["COD", "Online"],
        message: "Payment method must be either COD or Online",
      },
    },
    status: {
      type: String,
      default: "Pending",
      enum: {
        values: ["Pending", "Confirmed", "Processing", "Out for Delivery", "Delivered", "Cancelled"],
        message: "Invalid order status",
      },
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed", "Refunded"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ "customerInfo.phone": 1 })
orderSchema.index({ status: 1, createdAt: -1 })

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments()
    this.orderNumber = `MS${String(count + 1).padStart(6, "0")}`
  }
  next()
})

// Calculate delivery charge based on total
orderSchema.pre("save", function (next) {
  const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  this.deliveryCharge = subtotal >= 300 ? 0 : 40
  this.totalAmount = subtotal + this.deliveryCharge
  next()
})

module.exports = mongoose.model("Order", orderSchema)
