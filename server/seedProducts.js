const mongoose = require("mongoose")
const Product = require("./models/Product")
const dotenv = require("dotenv")

dotenv.config()

const products = [
  {
    name: "Dish Wash",
    price: 130,
    category: "Kitchen Care",
    description: "Effective dish washing liquid that cuts through grease and grime. Gentle on hands.",
    image: "/images/products/dishwash-1l.png", // Updated path
    display_order: 1,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Bathroom Cleaner",
    price: 85,
    category: "Bathroom Care",
    description: "Complete bathroom cleaning solution for tiles, fixtures, and surfaces. Leaves a fresh fragrance.",
    image: "/images/products/bathroom-cleaner.png", // Updated path
    featured: true,
    featured_order: 5,
    display_order: 2,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Toilet Cleaner",
    price: 180,
    category: "Bathroom Care",
    description: "Powerful toilet cleaner that removes tough stains and kills germs effectively. Safe for all toilet types.",
    image: "/images/products/toilet-cleaner.png", // Updated path
    featured: true,
    featured_order: 6,
    display_order: 3,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Liquid Detergent",
    price: 260,
    category: "General Cleaning",
    description: "Premium liquid detergent for washing clothes with fabric care. Suitable for all fabrics.",
    image: "/images/products/liquid-detergent.png", // Keep your existing path
    featured_order: 4,
    featured: true,
    display_order: 4,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Phenyl",
    price: 60,
    category: "Floor Care",
    description: "Traditional phenyl for floor cleaning with fresh fragrance. Effective disinfectant properties.",
    image: "/images/products/phenyl.png", // Updated path
    display_order: 5,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Floor Disinfectant",
    price: 70,
    category: "Floor Care",
    description: "Advanced floor disinfectant that cleans and sanitizes all floor types. Kills 99.9% germs.",
    image: "/images/products/floor-disinfectant-3.png", // Updated path
    display_order: 6,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Floor Disinfectant lemon",
    price: 80,
    category: "Floor Care",
    description: "Advanced floor disinfectant that cleans and sanitizes all floor types. Kills 99.9% germs.",
    image: "/images/products/floor-disinfectant-2.png", // Updated path
    display_order: 7,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Floor Cleaner lemon",
    price: 86,
    category: "Floor Care",
    description: "All-purpose floor cleaner suitable for all types of flooring. Pleasant fragrance.",
    image: "/images/products/floor-cleaner-lemon.png", // Updated path
    featured: true,
    featured_order: 1,
    display_order: 8,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Concentrated Phenyl",
    price: 100,
    category: "Floor Care",
    description: "Traditional phenyl for floor cleaning with fresh fragrance. Effective disinfectant properties.",
    image: "/images/products/concentrated-phenyl.png", // Updated path
    display_order: 9,
    stockQuantity: 300,
    size: "200ml", // Added size field
  },
  {
    name: "Lisapol Home Ready",
    price: 70,
    category: "General Cleaning",
    description: "Ready-to-use Lisapol solution for immediate cleaning. No dilution required.",
    image: "/images/products/lisapol-jar.png", // Updated path
    display_order: 10,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Hand Wash",
    price: 110,
    category: "Hand Care",
    description: "Gentle hand wash with moisturizing properties and antibacterial action. Soft on skin.",
    image: "/images/products/hand-wash-2.png", // Updated path
    display_order: 11,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Tile Cleaner",
    price: 150,
    category: "Bathroom Care",
    description: "Specialized tile cleaner for bathroom and kitchen tiles. Removes soap scum and water stains.",
    image: "/images/products/tile-cleaner.png", // Updated path
    display_order: 12,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Floor Disinfectant rose",
    price: 80,
    category: "Floor Care",
    description: "Advanced floor disinfectant that cleans and sanitizes all floor types. Kills 99.9% germs.",
    image: "/images/products/floor-disinfectant.png", // Updated path
    display_order: 13,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Black Floor Disinfectant",
    price: 50,
    category: "Floor Care",
    description: "Premium black floor disinfectant for deep cleaning and protection. Long-lasting fragrance.",
    image: "/images/products/black-phenyl.png", // Updated path
    display_order: 14,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Floor Disinfectant Refill",
    price: 300,
    category: "Floor Care",
    description: "Premium black floor disinfectant for deep cleaning and protection. Long-lasting fragrance.",
    image: "/images/products/floor-disinfectant-refill.png", // Updated path
    display_order: 15,
    stockQuantity: 300,
    size: "5L", // Added size field
  },
  {
    name: "Phenyl Refill",
    price: 200,
    category: "Floor Care",
    description: "Traditional phenyl for floor cleaning with fresh fragrance. Effective disinfectant properties.",
    image: "/images/products/phenyl-refill.png", // Updated path
    display_order: 16,
    stockQuantity: 300,
    size: "5L", // Added size field
  },
  {
    name: "Hand Wash",
    price: 110,
    category: "Hand Care",
    description: "Gentle hand wash with moisturizing properties and antibacterial action. Soft on skin.",
    image: "/images/products/hand-wash.png", // Updated path
    featured: true,
    featured_order: 2,
    display_order: 17,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Hand Wash Refill",
    price: 140,
    category: "Hand Care",
    description: "Gentle hand wash with moisturizing properties and antibacterial action. Soft on skin.",
    image: "/images/products/hand-wash-refill.png", // Updated path
    display_order: 18,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Glass Cleaner",
    price: 90,
    category: "General Cleaning",
    description: "Streak-free glass cleaner for windows, mirrors, and glass surfaces. Crystal clear results.",
    image: "/images/products/glass-cleaner.png", // Updated path
    display_order: 19,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Detergent Powder",
    price: 80,
    category: "General Cleaning",
    description: "Premium liquid detergent for washing clothes with fabric care. Suitable for all fabrics.",
    image: "/images/products/detergent-powder.png", // Keep your existing path
    display_order: 20,
    stockQuantity: 300,
    size: "1KG", // Added size field
  },
  {
    name: "Dish Wash",
    price: 60,
    category: "Kitchen Care",
    description: "Effective dish washing liquid that cuts through grease and grime. Gentle on hands.",
    image: "/images/products/dishwash-200ml.png", // Updated path
    display_order: 21,
    stockQuantity: 300,
    size: "200ml", // Added size field
  },
  {
    name: "Dish Wash",
    price: 106,
    category: "Kitchen Care",
    description: "Effective dish washing liquid that cuts through grease and grime. Gentle on hands.",
    image: "/images/products/dishwash-500ml.png", // Updated path
    featured: true,
    featured_order: 3,
    display_order: 22,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
  {
    name: "Dish Wash",
    price: 110,
    category: "Kitchen Care",
    description: "Effective dish washing liquid that cuts through grease and grime. Gentle on hands.",
    image: "/images/products/dishwash-500ml.png", // Updated path
    display_order: 23,
    stockQuantity: 300,
    size: "750ml", // Added size field
  },
  {
    name: "Dish Wash",
    price: 550,
    category: "Kitchen Care",
    description: "Effective dish washing liquid that cuts through grease and grime. Gentle on hands.",
    image: "/images/products/dishwash-refill.png", // Updated path
    display_order: 24,
    stockQuantity: 300,
    size: "5L", // Added size field
  },
  {
    name: "Liquid Detergent",
    price: 850,
    category: "General Cleaning",
    description: "Premium liquid detergent for washing clothes with fabric care. Suitable for all fabrics.",
    image: "/images/products/liquid-detergent-refill.png", // Keep your existing path
    display_order: 25,
    stockQuantity: 300,
    size: "5L", // Added size field
  },
  {
    name: "Namak Tejab",
    price: 60,
    category: "General Cleaning",
    description: "Traditional cleaning agent for tough stains and mineral deposits. Effective rust remover.",
    image: "/images/products/namak-tejab.png", // Updated path
    display_order: 26,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Lisapol",
    price: 40,
    category: "General Cleaning",
    description: "Multi-purpose cleaning agent for various household cleaning needs. Concentrated formula.",
    image: "/images/products/lisapol-readymade.png", // Updated path
    display_order: 27,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Lisapol Refill",
    price: 180,
    category: "General Cleaning",
    description: "Multi-purpose cleaning agent for various household cleaning needs. Concentrated formula.",
    image: "/images/products/lisapol-refill.png", // Updated path
    display_order: 28,
    stockQuantity: 300,
    size: "5L", // Added size field
  },
  {
    name: "Floor Cleaner rose",
    price: 86,
    category: "Floor Care",
    description: "All-purpose floor cleaner suitable for all types of flooring. Pleasant fragrance.",
    image: "/images/products/floor-cleaner-rose.png", // Updated path
    display_order: 29,
    stockQuantity: 300,
    size: "1L", // Added size field
  },
  {
    name: "Toilet Cleaner",
    price: 40,
    category: "Bathroom Care",
    description: "Powerful toilet cleaner that removes tough stains and kills germs effectively. Safe for all toilet types.",
    image: "/images/products/toilet-cleaner-200gm.png", // Updated path
    display_order: 30,
    stockQuantity: 300,
    size: "200ml", // Added size field
  },
  {
    name: "Toilet Cleaner",
    price: 85,
    category: "Bathroom Care",
    description: "Powerful toilet cleaner that removes tough stains and kills germs effectively. Safe for all toilet types.",
    image: "/images/products/toilet-cleaner-500gm.png", // Updated path
    display_order: 31,
    stockQuantity: 300,
    size: "500ml", // Added size field
  },
]

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mrsaffa")
    console.log("Connected to MongoDB")

    // Clear existing products
    await Product.deleteMany({})
    console.log("Cleared existing products")

    // Insert new products
    const insertedProducts = await Product.insertMany(products)
    console.log(`Successfully seeded ${insertedProducts.length} products!`)

    // Display seeded products
    insertedProducts.forEach((product) => {
      console.log(`- ${product.name} (${product.category}) - ₹${product.price} - ${product.size}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Error seeding products:", error)
    process.exit(1)
  }
}

// Run only if this file is executed directly
if (require.main === module) {
  seedProducts()
}

module.exports = { products, seedProducts }
