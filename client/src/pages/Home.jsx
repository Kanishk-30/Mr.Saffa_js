"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Truck, Shield, Clock, Star } from "lucide-react"
import ProductCard from "../components/ProductCard"
import axios from "axios"

// ✅ CRITICAL: Production-ready API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // ✅ UPDATED: Uses environment-aware API URL
      const response = await axios.get(`${API}/products/featured/ordered`)
      // Fix: Extract products array from API response
      const productsArray = response.data.products || response.data || []
      const featured = productsArray.filter((product) => product.featured)?.slice(0, 6)
      setFeaturedProducts(featured)
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#0101d9]" />,
      title: "Safe Delivery",
      description: "Secure packaging and careful handling ensure your products arrive in perfect condition",
    },
    {
      icon: <Shield className="w-8 h-8 text-[#d50204]" />,
      title: "Quality Products",
      description: "Premium ingredients and proven formulas ensure maximum cleaning effectiveness",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#0101d9]" />,
      title: "Fast Response",
      description: "Quick customer support team ready to help with orders and product advice anytime",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-red-50 py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Your Cleaning Assistant<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0101d9] to-[#d50204]">
                  {" "}
                  Mr. Saffa
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Professional-grade cleaning products at budget-friendly prices—clean more, spend less, rely on us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#0000c2] hover:to-[#b8020a] transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                >
                  Explore!!!
                </Link>
                <Link
                  to="/catalogue"
                  className="border-2 border-[#0101d9] text-[#0101d9] px-8 py-4 rounded-lg font-semibold hover:border-[#d50204] hover:text-[#d50204] transition-all duration-300 text-center"
                >
                  View Catalogue
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-red-100 rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/images/hero_img.png"
                  alt="Mr. Saffa Premium Cleaning Products"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=400&width=400"
                    e.target.className = "w-80 h-80 object-contain"
                  }}
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
              {/* Brand Badge */}
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white px-4 py-2 rounded-full font-semibold text-sm">
                Mr. Saffa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Mr. Saffa?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium cleaning products that keep every space spotless
              <br className="hidden sm:block" />
              —smart prices, trusted quality, and a team ready to connect whenever you need us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100 hover:border-[#0101d9]/20">
                <div className="flex justify-center mb-4 p-3 bg-gradient-to-r from-[#0101d9]/10 to-[#d50204]/10 rounded-full w-20 h-20 mx-auto items-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0101d9] to-[#d50204]">
                Featured Products
              </span>
            </h2>
            <p className="text-gray-600">Quality cleaning products available for bulk orders and partnerships</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gradient-to-r from-[#0101d9]/20 to-[#d50204]/20 h-48 rounded mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#0000c2] hover:to-[#b8020a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Customer & Partner Reviews</h2>
            <p className="text-gray-600">Quality you can trust, service you can rely on</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0101d9]/5 to-[#d50204]/5 p-6 rounded-lg border border-[#0101d9]/10">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Excellent quality products and such caring service! They personally follow up to ensure I'm satisfied. Rare to find such genuine care in business today"
              </p>
              <p className="font-semibold text-[#0101d9]">- Sunita Singhal, Homemaker</p>
            </div>
            <div className="bg-gradient-to-br from-[#d50204]/5 to-[#0101d9]/5 p-6 rounded-lg border border-[#d50204]/10">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Outstanding product quality with reliable support. I can reach them anytime for help. They treat me as a valued partner, not just another dealer."
              </p>
              <p className="font-semibold text-[#d50204]">- Vikram Patel, Authorized Retailer</p>
            </div>
            <div className="bg-gradient-to-br from-[#0101d9]/5 to-[#d50204]/5 p-6 rounded-lg border border-[#0101d9]/10">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Premium products that sell themselves! Their constant support and genuine gratitude for our partnership makes all the difference. True business partners."
              </p>
              <p className="font-semibold text-[#0101d9]">- Ravi Sharma, Regional Agency Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Customer service and product help: Contact us below<br />Dealer partnership program: Register for exclusive details
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-[#0101d9] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#0101d9] transition-all duration-300 text-center"
            >
              Register!!!
            </Link>
          </div>
        </div>
      </section>

      {/* Service Area Banner */}
      <section className="py-8 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            Originating from Hanumangarh—cleaning solutions you can trust, with guaranteed quality and pocket-friendly rates |
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
