const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      max: [10000, "Price cannot exceed 10000"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["Bathroom Care", "Kitchen Care", "Floor Care", "Hand Care", "General Cleaning"],
        message: "Category must be one of: Bathroom Care, Kitchen Care, Floor Care, Hand Care, General Cleaning",
      },
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    featured_order: {
      type: Number,
      default: null,
      min: [1, "Featured order must be at least 1"],
      validate: {
        validator: function(v) {
          // Only validate if featured is true and featured_order is provided
          if (this.featured && v !== null) {
            return Number.isInteger(v) && v > 0;
          }
          return true;
        },
        message: 'Featured order must be a positive integer'
      }
    },
    display_order: {
      type: Number,
      default: null,
      min: [1, "Display order must be at least 1"],
      validate: {
        validator: function(v) {
          if (v !== null) {
            return Number.isInteger(v) && v > 0;
          }
          return true;
        },
        message: 'Display order must be a positive integer'
      }
    },
    stockQuantity: {
      type: Number,
      default: 100,
      min: [0, "Stock quantity cannot be negative"],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    size: {
      type: String,
      default: "Standard Size",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
productSchema.index({ category: 1, featured: 1, featured_order: 1 })
productSchema.index({ category: 1, display_order: 1 })
productSchema.index({ name: "text", description: "text" })

// Pre-save middleware to generate SKU
productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = `MS-${this.category.replace(/\s+/g, "").toUpperCase()}-${Date.now()}`
  }
  next()
})

module.exports = mongoose.model("Product", productSchema)
