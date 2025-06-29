import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import { apiRequest, getProxiedImageUrl } from '../utils/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([]) // Store all products for filtering
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  // First, load categories and all products
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchCategories(), fetchAllProducts()])
    }
    initializeData()
  }, [])

  // Apply filtering and pagination when categories or selection changes
  useEffect(() => {
    const applyFiltersAndPagination = () => {
      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        setProducts([])
        setTotalProducts(0)
        setTotalPages(1)
        return
      }

      // Filter products based on selected category
      let filteredProducts = allProducts
      
      if (selectedCategory !== 'all') {
        // For now, since products don't have category info in the API response,
        // we'll use a simple search-based approach
        // This will be improved once we get more category information
        filteredProducts = allProducts.filter(product => {
          const productName = (product.name || '').toLowerCase()
          const categoryName = selectedCategory.toLowerCase()
          
          // Simple keyword matching based on category name
          const categoryKeywords = {
            "women's & girls' fashion": ['women', 'girl', 'ladies', 'female', 'dress', 'fashion'],
            "men's & boys' fashion": ['men', 'boy', 'male', 'shirt', 'pant'],
            "electronics devices": ['phone', 'laptop', 'computer', 'electronic', 'device', 'iphone', 'samsung'],
            "home & lifestyle": ['home', 'kitchen', 'furniture', 'decor'],
            "health & beauty": ['beauty', 'health', 'cosmetic', 'skincare'],
            "sports & outdoor": ['sport', 'outdoor', 'fitness', 'exercise'],
            "babies & toys": ['baby', 'toy', 'child', 'kid'],
            "groceries & pets": ['food', 'grocery', 'pet'],
            "automotive & motorbike": ['car', 'bike', 'auto', 'motor']
          }
          
          const keywords = categoryKeywords[categoryName] || [categoryName]
          return keywords.some(keyword => productName.includes(keyword))
        })
        
        console.log(`Filtered ${filteredProducts.length} products for category: ${selectedCategory}`)
      }
      
      // Apply pagination to filtered results
      const itemsPerPage = 20 // Use consistent items per page
      const totalFiltered = filteredProducts.length
      const calculatedTotalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage))
      
      // Ensure current page is valid
      const validCurrentPage = Math.min(currentPage, calculatedTotalPages)
      
      const startIndex = (validCurrentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
      
      setProducts(paginatedProducts)
      setTotalProducts(totalFiltered)
      setTotalPages(calculatedTotalPages)
      
      // Update current page if it was adjusted
      if (validCurrentPage !== currentPage) {
        setCurrentPage(validCurrentPage)
      }
    }

    if (categoriesLoaded && allProducts.length > 0) {
      applyFiltersAndPagination()
    }
  }, [selectedCategory, currentPage, allProducts, categoriesLoaded])

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch all products by getting multiple pages
      let allProductsData = []
      let currentPageNum = 1
      let hasMorePages = true
      
      while (hasMorePages && currentPageNum <= 10) { // Limit to 10 pages for performance
        const data = await apiRequest(`shop/products?page=${currentPageNum}`)
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          allProductsData = [...allProductsData, ...data.data]
          hasMorePages = currentPageNum < (data.last_page || 1)
          currentPageNum++
        } else {
          hasMorePages = false
        }
      }
      
      console.log(`Fetched ${allProductsData.length} total products from ${currentPageNum - 1} pages`)
      setAllProducts(allProductsData)
      
    } catch (error) {
      console.error('Error fetching all products:', error)
      setAllProducts([])
      toast.error('Failed to load products. Please refresh the page.')
    } finally {
      setLoading(false)
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
        setCategories([])
      }
      setCategoriesLoaded(true)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
      setCategoriesLoaded(true)
    }
  }

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when category changes
  }

  // The products state now contains the filtered and paginated products
  const filteredProducts = Array.isArray(products) ? products : []

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00b795]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#00b795]">Home</Link>
          <span>&gt;</span>
          <span>Products</span>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Sidebar - Categories */}
        <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <ul className="space-y-2 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
            <li>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-3 py-2 rounded transition-colors text-sm sm:text-base ${
                  selectedCategory === 'all' 
                    ? 'bg-green-100 text-[#00b795]' 
                    : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
            </li>
            {Array.isArray(categories) && categories.map((category) => (
              <li key={category.id || category.name}>
                <button
                  onClick={() => handleCategoryChange(category.name || category.title)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors text-sm sm:text-base ${
                    selectedCategory === (category.name || category.title)
                      ? 'bg-green-100 text-[#00b795]' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name || category.title || 'Category'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Products' : selectedCategory}
            </h2>
            <div className="text-xs sm:text-sm text-gray-600">
              {totalProducts > 0 ? (
                <>
                  Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalProducts)} of {totalProducts} products
                </>
              ) : (
                `${filteredProducts.length} products found`
              )}
            </div>
          </div>

          {/* Loading overlay - simplified since we pre-load all products */}
          <div className="relative">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
              <Link 
                key={product.id || product._id} 
                to={`/product/${product.slug || product.id || product._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={getProxiedImageUrl(product.thumbnail || product.image)} 
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.discount_price && product.regular_price && (
                    <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-orange-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs rounded">
                      {Math.round(((product.regular_price - product.discount_price) / product.regular_price) * 100)}% OFF
                    </span>
                  )}
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      {product.badges.map((badge, idx) => (
                        <span key={idx} className="bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs rounded mb-1 block">
                          {badge.name || badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
                    {product.name || product.title || 'Product'}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(Math.max(1, Math.round(product.rating_avg || 0)))}
                      {'☆'.repeat(5 - Math.max(1, Math.round(product.rating_avg || 0)))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating_avg || '0'} ({product.rating_count || '0'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-[#00b795]">
                        ৳{product.discount_price || product.regular_price || '0'}
                      </span>
                      {product.discount_price && product.regular_price && product.discount_price !== product.regular_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ৳{product.regular_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Stock: {product.available_stock || 0}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-gray-600">No products found in this category</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalProducts} total products)
              </div>
              
              {/* Pagination controls */}
              <nav className="flex items-center space-x-2">
                {/* First and Previous buttons */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  First
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers - Smart pagination for large page counts */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = []
                    const maxVisiblePages = 7
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                    
                    // Adjust start if we're near the end
                    if (endPage - startPage < maxVisiblePages - 1) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1)
                    }

                    // Always show first page if not in range
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        >
                          1
                        </button>
                      )
                      if (startPage > 2) {
                        pages.push(
                          <span key="start-ellipsis" className="px-2 py-2 text-gray-500">...</span>
                        )
                      }
                    }

                    // Page numbers in range
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-2 rounded-lg border ${
                            i === currentPage
                              ? 'bg-[#00b795] text-white border-[#00b795]'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                        >
                          {i}
                        </button>
                      )
                    }

                    // Always show last page if not in range
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="end-ellipsis" className="px-2 py-2 text-gray-500">...</span>
                        )
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        >
                          {totalPages}
                        </button>
                      )
                    }

                    return pages
                  })()}
                </div>

                {/* Next and Last buttons */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  Next
                </button>
                
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  Last
                </button>
              </nav>
              
              {/* Jump to page input */}
              {totalPages > 10 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder={currentPage.toString()}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt(e.target.value)
                        if (page >= 1 && page <= totalPages && page !== currentPage) {
                          handlePageChange(page)
                          e.target.value = ''
                        }
                      }
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <span className="text-gray-600">of {totalPages}</span>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
