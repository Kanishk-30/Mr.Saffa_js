const mongoose = require("mongoose")

// ✅ SOLUTION: Store the last generated inquiry number in memory
let lastGeneratedNumber = 0

const inquirySchema = new mongoose.Schema(
  {
    inquiryNumber: {
      type: String,
      unique: true,
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        maxlength: [300, "Address cannot exceed 300 characters"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
      },
      firmName: {
        type: String,
        trim: true,
        default: "",
      },
      gstNumber: {
        type: String,
        trim: true,
        default: "",
      },
      requirements: {
        type: String,
        default: "",
      },
      expectedQuantity: {
        type: String,
        default: "",
      },
      timeline: {
        type: String,
        default: "",
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      default: "New",
      enum: ["New", "Contacted", "Quoted", "Converted", "Closed"],
    },
    notes: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    estimatedValue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

// ✅ Helper function to extract number from inquiry number string
function getNumberFromInquiryNumber(inquiryStr) {
  if (!inquiryStr) return 0
  const numberPart = inquiryStr.replace('INQ', '')
  return parseInt(numberPart, 10) || 0
}

// ✅ PERFECT SOLUTION: Always increment from last generated number
inquirySchema.pre("save", async function (next) {
  if (!this.inquiryNumber) {
    try {
      // ✅ If lastGeneratedNumber not initialized, get highest from DB
      if (lastGeneratedNumber === 0) {
        console.log("🔍 Initializing last generated number from database...")
        
        const highestInquiry = await mongoose.model("Inquiry")
          .findOne({}, { inquiryNumber: 1 })
          .sort({ inquiryNumber: -1 })
          .lean()

        if (highestInquiry && highestInquiry.inquiryNumber) {
          lastGeneratedNumber = getNumberFromInquiryNumber(highestInquiry.inquiryNumber)
          console.log(`📊 Found highest inquiry: ${highestInquiry.inquiryNumber}, last number: ${lastGeneratedNumber}`)
        } else {
          lastGeneratedNumber = 0
          console.log("📊 No existing inquiries found, starting from 0")
        }
      }

      // ✅ Always increment the counter
      lastGeneratedNumber += 1
      this.inquiryNumber = `INQ${String(lastGeneratedNumber).padStart(6, "0")}`
      
      console.log(`✅ Generated new inquiry number: ${this.inquiryNumber} (counter: ${lastGeneratedNumber})`)
    } catch (error) {
      console.error("❌ Error generating inquiry number:", error)
      return next(error)
    }
  }
  next()
})

// Calculate estimated value
inquirySchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.estimatedValue = this.items.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 1))
    }, 0)
    console.log(`💰 Calculated estimated value: ₹${this.estimatedValue}`)
  }
  next()
})

// ✅ BONUS: Method to manually reset the counter (for admin use)
inquirySchema.statics.resetInquiryCounter = function() {
  lastGeneratedNumber = 0
  console.log("🔄 Inquiry counter reset")
}

// ✅ BONUS: Method to get current counter value
inquirySchema.statics.getCurrentCounter = function() {
  return lastGeneratedNumber
}

// Simple method to check if follow-up is needed
inquirySchema.methods.needsFollowup = function() {
  const hoursOld = Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60))
  const urgentStatuses = ['New', 'Contacted']
  
  return (
    (hoursOld > 24 && urgentStatuses.includes(this.status)) ||
    (this.priority === 'High' && hoursOld > 4) ||
    (this.priority === 'Urgent' && hoursOld > 1)
  )
}

// Simple method to get formatted value
inquirySchema.methods.getFormattedValue = function() {
  return `₹${this.estimatedValue.toLocaleString('en-IN')}`
}

// ✅ Indexes for performance
inquirySchema.index({ inquiryNumber: 1 })
inquirySchema.index({ createdAt: -1 })
inquirySchema.index({ status: 1 })

module.exports = mongoose.model("Inquiry", inquirySchema)
