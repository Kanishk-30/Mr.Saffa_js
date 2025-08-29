"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building, Phone, FileText } from "lucide-react"
import { useCart } from "../context/CartContext"
import axios from "axios"

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Checkout = ({ standalone = false }) => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    firmName: "",
    gstNumber: "",
    address: "",
    pincode: "",
    requirements: "",
    expectedQuantity: "",
    timeline: "",
  })

  const estimatedValue = getCartTotal()

  // Prevent redirect to cart only if NOT standalone and cart is empty
  if (!standalone && cartItems.length === 0) {
    navigate("/cart")
    return null
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const inquiryData = {
        customerInfo: {
          name: formData.name,
          phone: formData.phone.replace(/\D/g, ""),
          email: formData.email,
          address: formData.address,
          pincode: formData.pincode,
          firmName: formData.firmName,
          gstNumber: formData.gstNumber,
          requirements: formData.requirements,
          expectedQuantity: formData.expectedQuantity || null,
          timeline: formData.timeline,
        },
        items: standalone
          ? [
              {
                productId: null,
                name: "Bulk Inquiry",
                price: 0,
                quantity: null,
              },
            ]
          : cartItems.map((item) => ({
              productId: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
      }

      const response = await axios.post(`${API}/inquiry`, inquiryData)

      if (response.data) {
        clearCart()
        navigate("/thank-you", { state: { inquiry: response.data } })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      alert(`❌ Failed to submit inquiry: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Inquiry Form</h1>
          <p className="text-gray-600">Get custom quotes and bulk pricing for your business needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inquiry Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Business Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="9876543210"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without +91</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.business@email.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firm/Company Name *</label>
                  <input
                    type="text"
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="22AAAAA0000A1Z5 (Optional)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Complete business address with city and state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your area PIN code (e.g., 335513)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We serve across India. Enter your PIN code for delivery coordination.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Quantity</label>
                  <select
                    name="expectedQuantity"
                    value={formData.expectedQuantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select quantity range</option>
                    <option value="1-50">1-50 units</option>
                    <option value="51-200">51-200 units</option>
                    <option value="201-500">201-500 units</option>
                    <option value="500+">500+ units</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (Within 1 week)</option>
                    <option value="1month">Within 1 month</option>
                    <option value="3months">Within 3 months</option>
                    <option value="ongoing">Ongoing supply needed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about custom formulations, packaging requirements, delivery preferences, etc."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Submitting Inquiry..." : "Submit Business Inquiry"}
              </button>
            </form>
          </div>

          {/* Inquiry Summary */}
          {!standalone && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Inquiry Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Interest Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <p className="text-xs text-gray-500">Base Price</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Value</span>
                  <span className="font-semibold">₹{estimatedValue.toFixed(2)}</span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Our team will review your requirements</li>
                    <li>• You'll receive a custom quote within 24 hours</li>
                    <li>• Bulk pricing and discounts will be applied</li>
                    <li>• Free samples available for bulk orders</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-semibold text-blue-800">Need immediate assistance?</span>
                  </div>
                  <p className="text-sm text-blue-700">Call us: +91 98765 43210</p>
                  <p className="text-sm text-blue-700">Email: sales@mr-saffa.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
