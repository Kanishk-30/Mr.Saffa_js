"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import ProductCard from "../components/ProductCard"
import axios from "axios"

// ✅ CRITICAL: Production-ready API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["All", "Bathroom Care", "Kitchen Care", "Floor Care", "Hand Care", "General Cleaning"]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // ✅ UPDATED: Uses environment-aware API URL
      // Pass sort=display to use your manual order!
      const response = await axios.get(`${API}/products`, {
        params: { sort: "display" }
      })

      // Always expect products in response.data.products!
      const productsArray = response?.data.products || response.data || []
      if (!Array.isArray(productsArray)) {
        console.error('Products is not an array:', productsArray)
        setProducts([])
        setError('Invalid data format received from server')
        return
      }

      console.log(`Fetched ${productsArray.length} products successfully`)
      setProducts(productsArray)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    if (selectedCategory === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setShowFilters(false)
  }

  const handleRetry = () => {
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-3xl h-32 w-32 border-t-2 border-b-2 border-[#0101d9] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Mr. Saffa products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white px-6 py-3 rounded-lg font-medium hover:from-[#0000c2] hover:to-[#b8020a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our complete range of premium cleaning products for your home</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md mb-4 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {/* Filter Categories */}
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                    ? "bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🧽</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 text-lg">
              {selectedCategory !== "All"
                ? `No products available in ${selectedCategory} category.`
                : "No products available at the moment."
              }
            </p>
            {selectedCategory !== "All" && (
              <button
                onClick={() => handleCategoryChange("All")}
                className="mt-4 bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white px-6 py-2 rounded-lg font-medium hover:from-[#0000c2] hover:to-[#b8020a] transition-colors"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Success Message for Loaded Products */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              ✨ All products are available for delivery in Hanumangarh (335513, 335512)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
