"use client"

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import axios from "axios"

// ✅ CRITICAL: Production-ready API base URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const OrderTracking = () => {
  const [searchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const statusSteps = [
    { key: "Pending", label: "Order Placed", icon: Clock },
    { key: "Confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "Processing", label: "Processing", icon: Package },
    { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle },
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      // ✅ UPDATED: Uses environment-aware API URL
      const response = await axios.get(`${API}/orders/${orderNumber}`)
      setOrder(response.data)
    } catch (error) {
      setError("Order not found. Please check your order number.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status) => {
    return statusSteps.findIndex((step) => step.key === status)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Track Your Order</h1>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., MS000001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? "Searching..." : "Track"}</span>
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">{error}</div>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-8">
              {/* Order Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Order Number:</span> {order.orderNumber}
                      </p>
                      <p>
                        <span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Total Amount:</span> ₹{order.totalAmount}
                      </p>
                      <p>
                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>
                    <div className="text-gray-600">
                      <p>{order.customerInfo.name}</p>
                      <p>{order.customerInfo.address}</p>
                      <p>PIN: {order.customerInfo.pincode}</p>
                      <p>Phone: {order.customerInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const currentIndex = getStatusIndex(order.status)
                      const isCompleted = index <= currentIndex
                      const isCurrent = index === currentIndex

                      return (
                        <div key={step.key} className="flex flex-col items-center relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : isCurrent
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "bg-gray-200 border-gray-300 text-gray-500"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className={`mt-2 text-sm font-medium ${
                              isCompleted || isCurrent ? "text-gray-800" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </span>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`absolute top-6 left-12 w-full h-0.5 ${
                                index < currentIndex ? "bg-green-500" : "bg-gray-300"
                              }`}
                              style={{ width: "calc(100vw / 5 - 3rem)" }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Current Status: <span className="text-blue-600">{order.status}</span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.productId?.image || "/placeholder.svg?height=60&width=60&query=product"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-lg font-bold text-blue-600">₹{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
