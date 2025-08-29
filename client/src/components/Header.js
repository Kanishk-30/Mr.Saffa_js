"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShoppingCart, Menu, X, MapPin, Phone } from "lucide-react"
import { useCart } from "../context/CartContext"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getCartItemsCount } = useCart()
  const location = useLocation()

  const cartItemsCount = getCartItemsCount()

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/catalogue", label: "Catalogue" },
    { path: "/contact", label: "Contact" }, // ✅ NEW
  ]

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#0101d9] to-[#d50204] text-white py-2">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Hanumangarh</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Helpline:- +91 7878888406</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="hover:opacity-90 transition-opacity duration-200">
            <img
              src="/images/mr-saffa-logo.png"
              alt="Mr. Saffa Cleaning Products"
              className="h-14 w-auto md:h-16"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback logo */}
            <div
              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#d50204] to-[#0101d9] rounded-full flex items-center justify-center shadow-lg"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-lg md:text-xl">MS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${isActivePath(link.path)
                    ? "text-[#0101d9] border-b-2 border-[#0101d9] pb-1"
                    : "text-gray-700 hover:text-[#0101d9]"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-[#0101d9] transition-colors duration-200"
              aria-label={`Shopping cart with ${cartItemsCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d50204] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#0101d9] transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 py-2 px-2 rounded ${isActivePath(link.path)
                      ? "text-[#0101d9] font-semibold bg-gradient-to-r from-[#0101d9]/10 to-[#d50204]/10"
                      : "text-gray-700 hover:text-[#0101d9] hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
