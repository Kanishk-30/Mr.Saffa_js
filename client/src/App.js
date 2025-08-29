import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Admin from "./pages/Admin"
import Catalogue from "./pages/Catalogue"
import InquiryThankYou from "./pages/InquiryThankYou"
import Contact from "./pages/contact.jsx"               
import { CartProvider } from "./context/CartContext"
import "./App.css"

// ✅ Wrapper for thank you page
const InquiryThankYouWrapper = () => {
  const location = useLocation()
  const inquiry = location.state?.inquiry
  return <InquiryThankYou inquiry={inquiry} />
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/contact" element={<Contact />} />   {/* ✅ NEW */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/thank-you" element={<InquiryThankYouWrapper />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
