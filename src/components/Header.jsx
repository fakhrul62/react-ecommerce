import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  FiSearch, 
  FiMapPin, 
  FiHelpCircle, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUser, 
  FiMenu,
  FiMoreHorizontal
} from 'react-icons/fi'
import { HiOutlineBuildingStorefront } from 'react-icons/hi2'
import { PiHeadphonesLight } from 'react-icons/pi'
import { BsBoxSeam } from 'react-icons/bs'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { apiRequest, getProxiedImageUrl } from '../utils/api'

const Header = () => {
  const [categories, setCategories] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
    updateCartCount()
  }, [])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      const cartItems = event.detail || []
      setCartCount(cartItems.reduce((total, item) => total + (item.quantity || 1), 0))
    }

    const handleStorageChange = (e) => {
      if (e.key === 'falcon-cart') {
        updateCartCount()
      }
    }

    // Listen for cart update events
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem('falcon-cart')
      const cartItems = savedCart ? JSON.parse(savedCart) : []
      const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
      setCartCount(totalItems)
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      setCartCount(0)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await apiRequest('categories')
      
      // Handle different API response structures
      if (Array.isArray(data)) {
        setCategories(data)
      } else if (data.data && Array.isArray(data.data)) {
        setCategories(data.data)
      } else if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories)
      } else {
        console.log('Categories API response:', data)
        setCategories([]) // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([]) // Fallback to empty array on error
    }
  }

  return (
    <div className="bg-slate-800 text-white">
      {/* Top Header */}
      <div className="px-4 sm:px-6 lg:px-20 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img src="/images/logo.png" className='w-6' alt="" /> 
              <span className='text-white text-xl sm:text-2xl font-bold'>FALCON</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-2 sm:mx-4 lg:mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for anything..."
                className="w-full bg-white px-3 sm:px-4 py-1 md:py-2 pr-12 sm:pr-14 rounded text-slate-800 placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b795] text-sm sm:text-base"
              />
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#00b795] text-white px-2 sm:px-3 py-2 sm:py-3 rounded">
                <FiSearch className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
            <Link to="/cart" className="relative">
              <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button>
              <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white text-slate-800 drop-shadow-lg">
        <div className="px-4 sm:px-6 lg:px-20 py-3">
          {/* Main Navigation Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-2 mr-4 sm:mr-10 flex-shrink-0 hover:text-[#00b795] transition-colors"
              >
                <FiMenu className="w-4 h-4 text-[#00b795]" />
                <span className="text-sm sm:text-base">Categories</span>
              </button>
              
              {/* Categories - Hidden on mobile and tablet, visible on desktop */}
              <div className="hidden xl:flex space-x-2 sm:space-x-4 overflow-x-auto">
                {Array.isArray(categories) && categories.slice(0, 4).map((category, index) => (
                  <span 
                    key={category.id || index} 
                    className="hover:text-[#00b795] transition-colors whitespace-nowrap text-sm sm:text-base"
                  >
                    {category.name || category.title || 'Category'}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Desktop Actions - Hidden on mobile/tablet */}
            <div className='hidden xl:flex items-center gap-4'>
               <button className="flex items-center space-x-1 hover:text-[#00b795] transition-colors whitespace-nowrap">
                <BsBoxSeam className="w-4 h-4" />
                <span className="text-sm">TRACK ORDER</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-[#00b795] transition-colors whitespace-nowrap">
                <PiHeadphonesLight className="w-4 h-4" />
                <span className="text-sm">HELP CENTER</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-[#00b795] transition-colors whitespace-nowrap">
                <HiOutlineBuildingStorefront className="w-4 h-4 text-[#00b795]" />
                <span className="text-sm">SELL WITH US</span>
              </button>
            </div>

            {/* Mobile/Tablet Toggle Button - Visible only on mobile/tablet */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden flex items-center space-x-1 hover:text-[#00b795] transition-colors"
            >
              <HiOutlineMenuAlt3 className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile/Tablet Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <button className="flex items-center space-x-2 hover:text-[#00b795] transition-colors py-2">
                  <BsBoxSeam className="w-4 h-4" />
                  <span className="text-sm">TRACK ORDER</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-[#00b795] transition-colors py-2">
                  <PiHeadphonesLight className="w-4 h-4" />
                  <span className="text-sm">HELP CENTER</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-[#00b795] transition-colors py-2">
                  <HiOutlineBuildingStorefront className="w-4 h-4 text-[#00b795]" />
                  <span className="text-sm">SELL WITH US</span>
                </button>
              </div>
            </div>
          )}

          {/* Categories Dropdown Menu */}
          {isCategoriesOpen && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.isArray(categories) && categories.map((category, index) => (
                  <Link
                    key={category.id || index}
                    to={`/products?category=${category.slug || category.id}`}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {category.image ? (
                      <img 
                        src={getProxiedImageUrl(category.image)} 
                        alt={category.name || category.title} 
                        className="w-12 h-12 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <FiMenu className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-center text-gray-700 group-hover:text-[#00b795] transition-colors">
                      {category.name || category.title || 'Category'}
                    </span>
                  </Link>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <span className="text-sm">No categories available</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
