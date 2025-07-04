import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { FaStore, FaTrash, FaShoppingCart, FaCamera } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Image component with error handling
const ProductImage = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-gray-400 text-center">
          <FaCamera className="text-2xl mb-1 mx-auto" />
          <div className="text-xs">No Image</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} bg-gray-200 animate-pulse`}></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}

const Cart = () => {
  // Initialize with empty cart - in real app this would come from context/localStorage/API
  const [cartItems, setCartItems] = useState(() => {
    // Try to load cart from localStorage
    try {
      const savedCart = localStorage.getItem('bechakena-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Don't show toast here as component is still mounting
      return []
    }
  })
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [couponCode, setCouponCode] = useState('')

  // Listen for cart updates from other pages
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCartItems(event.detail || [])
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // Also listen for storage changes in case cart is updated in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bechakena-cart') {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : []
          setCartItems(newCart)
        } catch (error) {
          console.error('Error parsing cart from storage:', error)
          toast.error('Cart sync failed. Please refresh the page.')
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  const saveCartToStorage = (items) => {
    try {
      localStorage.setItem('bechakena-cart', JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
      toast.error('Failed to save cart. Please try again.')
    }
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    
    const item = cartItems.find(item => item.id === id)
    if (item && item.available_stock && newQuantity > item.available_stock) {
      toast.error(`Sorry, only ${item.available_stock} items available!`)
      return
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    saveCartToStorage(updatedItems)
    
    // Trigger cart update event for header
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedItems }))
  }

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)
    saveCartToStorage(updatedItems)
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    
    // Trigger cart update event for header
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedItems }))
    toast.success('Item removed from cart')
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectItem = (id) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
    setSelectAll(newSelected.size === cartItems.length)
  }

  const clearAll = () => {
    setCartItems([])
    saveCartToStorage([])
    setSelectedItems(new Set())
    setSelectAll(false)
    
    // Trigger cart update event for header
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }))
    toast.success('Cart cleared successfully')
  }

  const handleCheckout = () => {
    if (selectedCount === 0) return
    
    // Show demo purchase success message
    toast.success(`🎉 Purchase successful! Order total: ৳${subtotal}`)
    
    // Clear the cart after successful "purchase"
    setTimeout(() => {
      setCartItems([])
      saveCartToStorage([])
      setSelectedItems(new Set())
      setSelectAll(false)
      
      // Trigger cart update event for header
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }))
      
      // Show additional confirmation
      toast.info('Your cart has been cleared. Thank you for shopping with us!')
    }, 1500) // Small delay to show success message first
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    
    // Demo coupon functionality
    if (couponCode.toUpperCase() === 'BECHAKENA10') {
      toast.success('Coupon applied! 10% discount added')
    } else {
      toast.error('Invalid coupon code')
    }
  }


  const subtotal = cartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => {
      const price = parseFloat(item.discount_price || item.regular_price || item.price || 0)
      return sum + (price * (item.quantity || 1))
    }, 0).toFixed(2)

  const selectedCount = selectedItems.size

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#00b795]">Home</Link>
          <span>&gt;</span>
          <span>My Cart</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-bold">My Cart ({cartItems.length})</h2>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#00b795] focus:ring-[#00b795]"
                    />
                    <span className="text-sm">Select All</span>
                  </label>
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="mt-2 rounded border-gray-300 text-[#00b795] focus:ring-[#00b795] flex-shrink-0"
                    />

                    {/* Store Badge and Image */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-green-100 text-[#00b795] text-xs px-2 py-1 rounded flex items-center space-x-1">
                          <FaStore className="w-3 h-3" />
                          <span className="hidden sm:inline">{item.store}</span>
                        </span>
                      </div>
                      
                      {/* Product Image */}
                      <ProductImage
                        src={item.thumbnail || item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                        {item.selectedColor && item.selectedSize && ', '}
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-base sm:text-lg font-bold text-[#00b795]">
                          ৳{item.discount_price || item.regular_price || item.price || '0.00'}
                        </span>
                        {item.regular_price && item.discount_price && item.regular_price !== item.discount_price && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            ৳{item.regular_price}
                          </span>
                        )}
                      </div>

                      {/* Stock Info */}
                      {item.available_stock && (
                        <p className="text-xs text-gray-500 mb-2">
                          {item.available_stock} in stock
                        </p>
                      )}

                      {/* Quantity and Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-sm"
                          >
                            -
                          </button>
                          <span className="w-10 sm:w-12 text-center py-1 border border-gray-300 rounded text-sm">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-sm"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartItems.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4 flex justify-center">
                  <FaShoppingCart />
                </div>
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <div className="space-y-3">
                  <Link
                    to="/products"
                    className="bg-[#00b795] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#00b795] inline-block text-sm sm:text-base"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-4">Order summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Price ({selectedCount} items)</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping fee</span>
                <span className="text-[#00b795]">To be added</span>
              </div>
              
              {/* Coupon Section */}
              <div className="border-t pt-3">
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Store / BechaKena coupon"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-[#00b795] focus:border-[#00b795]"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 sm:px-6 py-2 bg-[#00b795] text-white rounded-r text-sm font-medium hover:bg-[#00a085] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Sub Total</span>
                <span>৳{subtotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              className={`w-full py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                selectedCount > 0
                  ? 'bg-[#00b795] text-white hover:bg-[#00b795]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </button>

            {/* Terms */}
            <div className="mt-4">
              <label className="flex items-start space-x-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-gray-300 text-[#00b795] focus:ring-[#00b795] flex-shrink-0"
                />
                <span>
                  I have read and agree to the Terms and Conditions, 
                  Privacy Policy and Refund and Return Policy
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
