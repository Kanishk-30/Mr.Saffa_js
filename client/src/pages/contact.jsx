import React, { useState } from "react"
import { Phone, Mail, MessageCircle, UserCheck, FileText } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Contact = () => {
  const [showForm, setShowForm] = useState(false)
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

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
        items: [
          {
            productId: null,
            name: "Bulk Inquiry",
            price: 0,
            quantity: null,
          },
        ],
      }

      const response = await axios.post(`${API}/inquiry`, inquiryData)
      if (response.data) {
        setLoading(false)
        navigate("/thank-you", { state: { inquiry: response.data } })
      }
    } catch (error) {
      setLoading(false)
      alert(
        `❌ Failed to submit inquiry: ${error.response?.data?.message || error.message}`
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* Customer Care Support */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-5">
            <MessageCircle className="w-7 h-7 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Customer Care</h2>
          </div>
          <ul className="space-y-3 mb-5 text-gray-700 font-medium">
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              <a href="tel:+917878888406" className="hover:underline text-blue-700">
                +91-7878888406
              </a>
            </li>
            <li className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
              <a
                href="https://wa.me/917878888406"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-700 font-semibold"
              >
                WhatsApp Chat
              </a>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-green-600" />
              <a
                href="mailto:mrsaffa01@gmail.com"
                className="hover:underline text-blue-700"
              >
                support@mrsaffa.mail
              </a>
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            Reach us via phone, WhatsApp, or email for queries, product information,
            and general customer support.
          </p>
        </section>

        {/* Bulk & Business Inquiry */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-5">
            <UserCheck className="w-7 h-7 text-blue-700 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Bulk & Business Inquiries
            </h2>
          </div>
          <p className="text-gray-700 mb-6">
            Interested in wholesale or B2B deals? Start your inquiry to get custom
            rates and special offers from our commercial team.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 
                         text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
            >
              Fill Inquiry Form
            </button>
            <Link
              to="/products"
              className="border border-blue-500 text-blue-700 px-8 py-3 rounded-lg font-semibold 
                         hover:bg-blue-50 transition flex items-center justify-center"
            >
              Explore Products
            </Link>
          </div>
        </section>

        {/* Inquiry Form Section - show when Fill Inquiry clicked */}
        {showForm && (
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Business Inquiry Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="9876543210"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit mobile number without +91
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.business@email.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Firm/Company Name & GST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firm/Company Name *
                  </label>
                  <input
                    type="text"
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your company name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="22AAAAA0000A1Z5 (Optional)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder="Complete business address with city and state"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  placeholder="Enter your area PIN code (e.g., 335513)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We serve across India. Enter your PIN code for delivery coordination.
                </p>
              </div>

              {/* Expected Quantity & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Monthly Quantity
                  </label>
                  <select
                    name="expectedQuantity"
                    value={formData.expectedQuantity}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select quantity range</option>
                    <option value="1-50">1-50 units</option>
                    <option value="51-200">51-200 units</option>
                    <option value="201-500">201-500 units</option>
                    <option value="500+">500+ units</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (Within 1 week)</option>
                    <option value="1month">Within 1 month</option>
                    <option value="3months">Within 3 months</option>
                    <option value="ongoing">Ongoing supply needed</option>
                  </select>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about custom formulations, packaging requirements, delivery preferences, etc."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Submitting Inquiry..." : "Submit Business Inquiry"}
              </button>
            </form>

            {/* What happens next */}
            <div className="mt-10 max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-green-600 mb-3">What happens next?</h3>
              <div className="bg-green-50 p-4 rounded-lg text-green-800 text-sm">
                <ul className="space-y-1">
                  <li>• Our team will review your requirements</li>
                  <li>• You'll receive a custom quote within 24 hours</li>
                  <li>• Bulk pricing and discounts will be applied</li>
                  <li>• Free samples available for bulk orders</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Contact
