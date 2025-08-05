"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item._id === action.payload._id)
      if (existingItem) {
        return state.map((item) => (item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...state, { ...action.payload, quantity: 1 }]

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return state.filter((item) => item._id !== action.payload.id)
      }
      return state.map((item) =>
        item._id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )

    case "REMOVE_FROM_CART":
      return state.filter((item) => item._id !== action.payload)

    case "CLEAR_CART":
      return []

    case "LOAD_CART":
      return action.payload || []

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("mrsaffa_cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      localStorage.removeItem("mrsaffa_cart")
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("mrsaffa_cart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cartItems])

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error("Invalid product data")
      return
    }
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const updateQuantity = (id, quantity) => {
    if (!id || quantity < 0) {
      console.error("Invalid quantity update parameters")
      return
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeFromCart = (id) => {
    if (!id) {
      console.error("Invalid product ID for removal")
      return
    }
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number.parseFloat(item.price) || 0
      const quantity = Number.parseInt(item.quantity) || 0
      return total + price * quantity
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (Number.parseInt(item.quantity) || 0), 0)
  }

  const isInCart = (productId) => {
    return cartItems.some((item) => item._id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item._id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
