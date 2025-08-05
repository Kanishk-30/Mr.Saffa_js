"use client"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
      {/* Enhanced Image Section */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          style={{ 
            aspectRatio: '1/1',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#d50204] to-[#0101d9] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            ⭐ Featured
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-gray-800 font-bold">Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Product Info Section - REDUCED HEIGHT */}
      <div className="p-3 relative bg-gradient-to-br from-gray-50/30 to-white">
        {/* Top Row: Product Name (Left) + Quantity (Right) */}
        <div className="flex items-start justify-between mb-2">
          {/* Product Name - Upper Left (ENLARGED) */}
          <h3 className="font-bold text-gray-800 text-lg leading-tight flex-1 pr-3 line-clamp-2 group-hover:text-[#0101d9] transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Product Quantity - Upper Right (REDUCED) */}
          <div className="bg-gradient-to-r from-[#0101d9]/10 to-[#d50204]/10 px-2 py-1 rounded-full border border-[#0101d9]/20">
            <span className="text-xs text-[#0101d9] font-medium">
              {product.size || "Standard"}
            </span>
          </div>
        </div>

        {/* Bottom Row: Price (Left) + Cart Button (Right) */}
        <div className="flex items-center justify-between">
          {/* Product Price - Lower Left (REDUCED) */}
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1">
              <span className="text-xs text-gray-400 font-medium">FROM</span>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d50204] to-[#0101d9]">
                ₹{product.price}
              </span>
            </div>
          </div>

          {/* Add Cart Button - Lower Right (REDUCED) */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`relative overflow-hidden px-3 py-2 rounded-lg transition-all duration-300 group/btn ${
              product.inStock
                ? "bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white hover:shadow-lg hover:scale-105 active:scale-95 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>

        {/* Enhanced brand accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0101d9] to-[#d50204] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm group-hover:shadow-[#0101d9]/30"></div>
      </div>
    </div>
  )
}

export default ProductCard
