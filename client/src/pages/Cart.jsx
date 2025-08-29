"use client"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "../context/CartContext"

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()

  const subtotal = getCartTotal()      // Total of selected products
  const total = subtotal               // No delivery fees in B2B inquiry flow

  /*  ───────── Empty cart ─────────  */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your inquiry list is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Select the products you're interested in, then submit an inquiry for bulk pricing and availability.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /*  ───────── Cart with items ─────────  */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selected Products for Inquiry
        </h1>
        <p className="text-gray-600 mb-8">
          Get bulk pricing and custom quotes for your business needs
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.category}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{item.price} <span className="text-sm text-gray-500">(Base Price)</span>
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div className="text-right">
                      <p className="font-bold text-gray-800 mb-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">Est. Value</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Inquiry Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Total</span>
                  <span className="font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between text-lg font-bold text-blue-800">
                    <span>Get Custom Quote</span>
                    <span>Best Price</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Bulk discounts and special pricing available
                  </p>
                </div>
              </div>

              {/* Benefits for B2B */}
              <div className="mb-6 text-sm text-gray-600">
                <p className="font-semibold mb-2">✓ What you get:</p>
                <ul className="space-y-1">
                  <li>• Bulk pricing discounts</li>
                  <li>• Custom formulations</li>
                  <li>• Flexible delivery options</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>

              {/* ✅ UPDATED: CTA buttons with inquiry-focused text */}
              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300 text-center block mb-3"
              >
                Submit Business Inquiry
              </Link>

              <Link
                to="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
              >
                Explore Products
              </Link>

              {/* ✅ NEW: Additional inquiry help section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Not sure about quantities or have specific requirements?
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">📞 Call:</span>
                    <span className="ml-2">+91 7878888406</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">📧 Email:</span>
                    <span className="ml-2">mrsaffa01@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
