"use client"

import { useState, useEffect } from "react"
import { 
  Eye, Users, TrendingUp, LogOut, AlertCircle, Search,
  Filter, RefreshCw, Trash2, CheckCircle, Edit3, Calendar,
  Phone, Mail, User, Building, Clock
} from "lucide-react"
import axios from "axios"

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  
  // Dashboard & Inquiry Data
  const [dashboardStats, setDashboardStats] = useState({})
  const [inquiries, setInquiries] = useState([])
  const [inquiryFilters, setInquiryFilters] = useState({ status: "All", search: "" })
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalInquiries, setTotalInquiries] = useState(0)
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      setIsLoggedIn(true)
      fetchDashboardData()
    }
  }, [])

  // Authentication Functions
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`${API}/auth/admin/login`, loginData)
      localStorage.setItem("adminToken", response.data.token)
      setIsLoggedIn(true)
      fetchDashboardData()
    } catch (error) {
      alert("Invalid credentials")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsLoggedIn(false)
    setInquiries([])
    setDashboardStats({})
    setCurrentPage(1)
    setTotalPages(1)
    setTotalInquiries(0)
  }

  // Fetch dashboard data and recent inquiries
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
      
      const [statsRes, inquiriesRes] = await Promise.all([
        axios.get(`${API}/inquiry/stats/dashboard`, config),
        axios.get(`${API}/inquiry?limit=10`, config)
      ])
      
      if (statsRes.data.success !== false) {
        setDashboardStats(statsRes.data)
      }
      
      if (inquiriesRes.data.success !== false) {
        const responseInquiries = inquiriesRes.data.inquiries || []
        setInquiries(responseInquiries)
      }
      
    } catch (error) {
      console.error("❌ Dashboard Error:", error)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        handleLogout()
      }
    }
  }

  // Fetch inquiries with pagination
  const fetchInquiries = async (page = 1) => {
    try {
      setIsLoadingInquiries(true)
      
      const token = localStorage.getItem("adminToken")
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
      
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", "20")
      if (inquiryFilters.status !== "All") params.append("status", inquiryFilters.status)
      if (inquiryFilters.search) params.append("search", inquiryFilters.search)
      
      const url = `${API}/inquiry?${params}`
      const response = await axios.get(url, config)
      
      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch inquiries")
      }
      
      const responseInquiries = response.data.inquiries || []
      const pagination = response.data.pagination || {}
      
      setInquiries(responseInquiries)
      setCurrentPage(pagination.current || 1)
      setTotalPages(pagination.pages || 1)
      setTotalInquiries(pagination.total || 0)
      
    } catch (error) {
      console.error("❌ Error fetching inquiries:", error)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        handleLogout()
      }
    } finally {
      setIsLoadingInquiries(false)
    }
  }

  // Update inquiry status
  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken")
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
      
      const response = await axios.put(`${API}/inquiry/${inquiryId}`, 
        { status: newStatus }, 
        config
      )
      
      if (response.data.success) {
        // Refresh data based on current view
        if (activeTab === "inquiries") {
          fetchInquiries(currentPage)
        } else {
          fetchDashboardData()
        }
        setSelectedInquiry(null)
        alert(`✅ Status updated to "${newStatus}" successfully`)
      }
      
    } catch (error) {
      console.error("❌ Error updating inquiry:", error)
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        alert("Failed to update status")
      }
    }
  }

  // Delete inquiry
  const deleteInquiry = async (inquiryId, inquiryNumber) => {
    if (!window.confirm(`Are you sure you want to delete inquiry ${inquiryNumber}?`)) {
      return
    }
    
    try {
      const token = localStorage.getItem("adminToken")
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
      
      const response = await axios.delete(`${API}/inquiry/${inquiryId}`, config)
      
      if (response.data.success) {
        if (activeTab === "inquiries") {
          fetchInquiries(currentPage)
        } else {
          fetchDashboardData()
        }
        setSelectedInquiry(null)
        alert("✅ Inquiry deleted successfully")
      }
      
    } catch (error) {
      console.error("❌ Error deleting inquiry:", error)
      alert("Failed to delete inquiry")
    }
  }

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchInquiries(newPage)
    }
  }

  // Apply filters
  const applyFilters = () => {
    fetchInquiries(1)
  }

  // Utility Functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      "New": "bg-blue-100 text-blue-800 border-blue-200",
      "Contacted": "bg-yellow-100 text-yellow-800 border-yellow-200", 
      "Quoted": "bg-purple-100 text-purple-800 border-purple-200",
      "Converted": "bg-green-100 text-green-800 border-green-200",
      "Closed": "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    const icons = {
      "New": <AlertCircle className="w-4 h-4" />,
      "Contacted": <Phone className="w-4 h-4" />,
      "Quoted": <Edit3 className="w-4 h-4" />,
      "Converted": <CheckCircle className="w-4 h-4" />,
      "Closed": <Clock className="w-4 h-4" />,
    }
    return icons[status] || <AlertCircle className="w-4 h-4" />
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-3xl">MS</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Mr. Saffa Inquiry Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </div>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Mr. Saffa - Business Inquiry Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp, count: dashboardStats.totalInquiries },
              { id: "inquiries", label: "All Inquiries", icon: Users, count: totalInquiries },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id)
                  if (id === "inquiries") {
                    fetchInquiries(1)
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-4 border-b-3 font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {count > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {dashboardStats.totalInquiries || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {dashboardStats.newInquiries || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Converted</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {dashboardStats.convertedInquiries || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Potential Value</p>
                    <p className="text-3xl font-bold text-gray-800">
                      ₹{(dashboardStats.potentialInquiryValue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Recent Inquiries</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Showing {inquiries.length} recent inquiries
                  </span>
                  <button
                    onClick={fetchDashboardData}
                    className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors duration-200"
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="p-6">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2 text-lg">No inquiries found</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Inquiries will appear here once customers submit them
                    </p>
                    <button
                      onClick={fetchDashboardData}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Refresh Data
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.slice(0, 8).map((inquiry) => (
                      <div key={inquiry._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-full bg-gray-100">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{inquiry.customerInfo.name}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {inquiry.customerInfo.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {inquiry.customerInfo.phone}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{inquiry.inquiryNumber}</p>
                              {inquiry.customerInfo.firmName && (
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Building className="w-3 h-3 mr-1" />
                                  {inquiry.customerInfo.firmName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">₹{(inquiry.estimatedValue || 0).toLocaleString('en-IN')}</p>
                            <p className="text-sm text-gray-500">Estimated Value</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(inquiry.status)}`}>
                              {getStatusIcon(inquiry.status)}
                              <span className="ml-1">{inquiry.status}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(inquiry.createdAt)}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <>
            {/* Inquiry Filters */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <select
                    value={inquiryFilters.status}
                    onChange={(e) => {
                      setInquiryFilters(prev => ({ ...prev, status: e.target.value }))
                    }}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 flex-grow max-w-md">
                  <Search className="w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or inquiry number..."
                    value={inquiryFilters.search}
                    onChange={(e) => setInquiryFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters()
                      }
                    }}
                    className="flex-grow px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={applyFilters}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {totalInquiries > 0 && (
                    <span>Showing {inquiries.length} of {totalInquiries} inquiries</span>
                  )}
                </div>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Inquiry Management
                  </h2>
                  <button
                    onClick={() => fetchInquiries(currentPage)}
                    className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:text-blue-800 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {isLoadingInquiries ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading inquiries...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Inquiry
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-2">No inquiries found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                          </td>
                        </tr>
                      ) : (
                        inquiries.map((inquiry) => (
                          <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-semibold text-gray-900">{inquiry.inquiryNumber}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-gray-100 mr-3">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{inquiry.customerInfo.name}</div>
                                  {inquiry.customerInfo.firmName && (
                                    <div className="text-sm text-gray-500 flex items-center">
                                      <Building className="w-3 h-3 mr-1" />
                                      {inquiry.customerInfo.firmName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className="flex items-center text-gray-900 mb-1">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {inquiry.customerInfo.phone}
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {inquiry.customerInfo.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-semibold text-gray-900">₹{(inquiry.estimatedValue || 0).toLocaleString('en-IN')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(inquiry.status)}`}>
                                {getStatusIcon(inquiry.status)}
                                <span className="ml-1">{inquiry.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(inquiry.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedInquiry(inquiry)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteInquiry(inquiry._id, inquiry.inquiryNumber)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages} ({totalInquiries} total inquiries)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, currentPage - 2) + i
                      if (page > totalPages) return null
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                            page === currentPage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Inquiry Details - {selectedInquiry.inquiryNumber}
                  </h3>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedInquiry.status)}`}>
                      {getStatusIcon(selectedInquiry.status)}
                      <span className="ml-1">{selectedInquiry.status}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(selectedInquiry.createdAt)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Name</label>
                      <p className="text-gray-900 font-medium">{selectedInquiry.customerInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Phone</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-green-600" />
                        {selectedInquiry.customerInfo.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Email</label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        {selectedInquiry.customerInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Address</label>
                      <p className="text-gray-900">{selectedInquiry.customerInfo.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">PIN Code</label>
                      <p className="text-gray-900">{selectedInquiry.customerInfo.pincode}</p>
                    </div>
                    {selectedInquiry.customerInfo.firmName && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Company</label>
                        <p className="text-gray-900 flex items-center">
                          <Building className="w-4 h-4 mr-2 text-purple-600" />
                          {selectedInquiry.customerInfo.firmName}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.customerInfo.gstNumber && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">GST Number</label>
                        <p className="text-gray-900">{selectedInquiry.customerInfo.gstNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inquiry Items */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">Requested Products</h4>
                <div className="space-y-3">
                  {selectedInquiry.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        {item.quantity && <span className="text-gray-600 ml-3">Quantity: {item.quantity}</span>}
                      </div>
                      <span className="font-bold text-lg text-gray-900">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">Total Estimated Value:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{(selectedInquiry.estimatedValue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {selectedInquiry.customerInfo.requirements && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Customer Requirements</h4>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-gray-900">{selectedInquiry.customerInfo.requirements}</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedInquiry.customerInfo.expectedQuantity && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Expected Quantity</h4>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-900">{selectedInquiry.customerInfo.expectedQuantity}</p>
                    </div>
                  </div>
                )}
                
                {selectedInquiry.customerInfo.timeline && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Timeline</h4>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-900">{selectedInquiry.customerInfo.timeline}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              {selectedInquiry.notes && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Admin Notes</h4>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-gray-900">{selectedInquiry.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col space-y-6 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Update Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {["New", "Contacted", "Quoted", "Converted", "Closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateInquiryStatus(selectedInquiry._id, status)}
                        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                          selectedInquiry.status === status
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Created: {formatDate(selectedInquiry.createdAt)}
                  </p>
                  
                  <button
                    onClick={() => deleteInquiry(selectedInquiry._id, selectedInquiry.inquiryNumber)}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Inquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
