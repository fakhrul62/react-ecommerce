import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { toast } from 'react-toastify'

const ProductDetails = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showFullSpecification, setShowFullSpecification] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use the product endpoint which supports both slug and ID
        const response = await fetch(`http://157.230.240.97:9999/api/v1/product/${slug}`)
        const data = await response.json()
        
        console.log('Product API Response:', data) // Debug log
        
        // Handle API response structure - the data is directly in the response
        let productData = data.data || data
        
        setProduct(productData)
        
        // If it's a variant product, set the first variation as default
        if (productData.is_variant && productData.variations?.length > 0) {
          const firstVariation = productData.variations[0]
          setSelectedVariation(firstVariation)
          
          // Set default attributes based on first variation
          const defaultAttributes = {}
          if (firstVariation.variation_attributes) {
            firstVariation.variation_attributes.forEach(attr => {
              if (attr.attribute && attr.attribute_option) {
                defaultAttributes[attr.attribute.name] = attr.attribute_option.attribute_value
              }
            })
          }
          setSelectedAttributes(defaultAttributes)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [slug])

  // Helper functions
  const handleAttributeChange = (attributeName, value) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value }
    setSelectedAttributes(newAttributes)
    
    // Find matching variation based on selected attributes
    if (product.variations) {
      const matchingVariation = product.variations.find(variation => {
        if (!variation.variation_attributes) return false
        
        return variation.variation_attributes.every(attr => {
          if (!attr.attribute || !attr.attribute_option) return false
          const attrName = attr.attribute.name
          const attrValue = attr.attribute_option.attribute_value
          return newAttributes[attrName] === attrValue
        })
      })
      
      if (matchingVariation) {
        setSelectedVariation(matchingVariation)
        setSelectedImage(0) // Reset to first image of new variation
      }
    }
  }

  // Get current price and stock info
  const getCurrentPrice = () => {
    if (selectedVariation) {
      return {
        price: selectedVariation.discount_price || selectedVariation.regular_price,
        originalPrice: selectedVariation.regular_price,
        stock: selectedVariation.total_stock_qty
      }
    } else if (product.product_detail) {
      return {
        price: product.product_detail.discount_price || product.product_detail.regular_price,
        originalPrice: product.product_detail.regular_price,
        stock: product.total_stock_qty
      }
    }
    return { price: '0', originalPrice: null, stock: 0 }
  }

  // Get current images
  const getCurrentImages = () => {
    const images = []
    
    // Add main product thumbnail first
    if (product.thumbnail) {
      images.push(product.thumbnail)
    }
    
    // Add product images from the images array
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(imgObj => {
        if (imgObj.url) {
          images.push(imgObj.url)
        }
      })
    }
    
    // Add product image object if it exists
    if (product.image && typeof product.image === 'object') {
      Object.values(product.image).forEach(img => {
        if (typeof img === 'string') {
          images.push(img)
        } else if (img.url) {
          images.push(img.url)
        }
      })
    }
    
    // Add selected variation image if available
    if (selectedVariation && selectedVariation.image) {
      // Add variation image to the front if it's not already included
      if (!images.includes(selectedVariation.image)) {
        images.unshift(selectedVariation.image)
      }
    }
    
    // Add variation images if available
    if (selectedVariation && selectedVariation.images && Array.isArray(selectedVariation.images)) {
      selectedVariation.images.forEach(imgObj => {
        if (imgObj.url && !images.includes(imgObj.url)) {
          images.push(imgObj.url)
        }
      })
    }
    
    return images.length > 0 ? images : ['/api/placeholder/400/400']
  }

  // Get all unique attributes and their options
  const getProductAttributes = () => {
    if (!product.variations) return {}
    
    const attributes = {}
    product.variations.forEach(variation => {
      if (variation.variation_attributes && Array.isArray(variation.variation_attributes)) {
        variation.variation_attributes.forEach(attr => {
          if (attr.attribute && attr.attribute_option) {
            const attrName = attr.attribute.name
            const attrValue = attr.attribute_option.attribute_value
            
            if (!attributes[attrName]) {
              attributes[attrName] = new Set()
            }
            attributes[attrName].add(attrValue)
          }
        })
      }
    })
    
    // Convert Sets to Arrays
    Object.keys(attributes).forEach(key => {
      attributes[key] = Array.from(attributes[key])
    })
    
    return attributes
  }

  const addToCart = () => {
    const currentInfo = getCurrentPrice()
    
    if (currentInfo.stock === 0) {
      toast.error('Sorry, this product is out of stock!')
      return
    }
    
    if (quantity > currentInfo.stock) {
      toast.error(`Sorry, only ${currentInfo.stock} items available!`)
      return
    }
    
    // Add to cart logic here
    const cartItem = {
      id: `${product.id}_${selectedVariation?.id || 'default'}`, // Unique ID for cart items with variations
      productId: product.id,
      variationId: selectedVariation?.id,
      name: product.name,
      slug: product.slug,
      regular_price: currentInfo.regular_price,
      discount_price: currentInfo.discount_price,
      price: currentInfo.price,
      quantity: quantity,
      selectedAttributes,
      selectedColor: selectedAttributes?.Color || selectedAttributes?.color,
      selectedSize: selectedAttributes?.Size || selectedAttributes?.size,
      thumbnail: selectedVariation?.image || product.thumbnail,
      image: selectedVariation?.image || product.thumbnail,
      sku: selectedVariation?.sku || product.sku,
      available_stock: currentInfo.stock,
      store: 'Falcon Store' // You can extract this from product data if available
    }

    // Save to localStorage
    try {
      const existingCart = JSON.parse(localStorage.getItem('falcon-cart') || '[]')
      
      // Check if item with same ID already exists
      const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id)
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newQuantity = existingCart[existingItemIndex].quantity + quantity
        if (newQuantity > currentInfo.stock) {
          toast.error(`Cannot add more items. Only ${currentInfo.stock} available, and you already have ${existingCart[existingItemIndex].quantity} in cart.`)
          return
        }
        existingCart[existingItemIndex].quantity = newQuantity
        toast.success(`Updated quantity to ${newQuantity} in cart`)
      } else {
        // Add new item to cart
        existingCart.push(cartItem)
        toast.success(`Added ${quantity} ${product.name} to cart!`)
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('falcon-cart', JSON.stringify(existingCart))
      
      console.log('Added to cart:', cartItem)
      
      // Optional: Trigger a custom event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: existingCart }))
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Error adding item to cart. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00b795]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  const currentInfo = getCurrentPrice()
  const images = getCurrentImages()
  const productAttributes = getProductAttributes()

  return (
    <div className="mx-auto py-4">
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#00b795]">Home</Link>
          <span>&gt;</span>
          <Link to="/products" className="hover:text-[#00b795]">Products</Link>
          <span>&gt;</span>
          <span className="truncate">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 sm:gap-8 lg:gap-12 bg-white px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-10">
        {/* Product Images */}
        <div className='lg:col-span-3 col-span-9'>
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 sm:mb-4 overflow-hidden">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  selectedImage === index ? 'border-[#00b795]' : 'border-gray-200'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='lg:col-span-4 col-span-9'>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-3 sm:mb-4">
            <span className="text-gray-800 font-medium mr-2 text-sm sm:text-base">
              {product.rating_avg || '0'}
            </span>
            <div className="flex text-yellow-400 mr-2 text-sm sm:text-base">
              {'★'.repeat(Math.round(product.rating_avg || 0))}
              {'☆'.repeat(5 - Math.round(product.rating_avg || 0))}
            </div>
            <span className="text-gray-600 text-sm sm:text-base">
              {product.rating_count || '0'}
            </span>
            <div className="ml-auto flex space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-[#00b795]">
              ৳{currentInfo.price}
            </span>
            {currentInfo.originalPrice && currentInfo.price !== currentInfo.originalPrice && (
              <span className="text-lg sm:text-xl text-gray-400 line-through">
                ৳{currentInfo.originalPrice}
              </span>
            )}
          </div>

          {/* Promotion */}
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center">
              <span className="text-gray-700 mr-2 text-sm sm:text-base">Promotion</span>
              <div className="bg-orange-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">
                Min. spend ৳550 ▼
              </div>
            </div>
          </div>

          {/* Dynamic Product Attributes */}
          {Object.keys(productAttributes).map(attributeName => (
            <div key={attributeName} className="mb-4 sm:mb-6">
              {/* For Color attribute - special styling */}
              {attributeName.toLowerCase() === 'color' ? (
                <>
                  <div className="flex items-center mb-2 sm:mb-3">
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Available Color: </span>
                    <span className="text-gray-800 font-medium ml-1 text-sm sm:text-base">
                      {selectedAttributes[attributeName] || productAttributes[attributeName][0] || 'Navy Blue'}
                    </span>
                  </div>
                  <div className="flex space-x-2 sm:space-x-3">
                    {productAttributes[attributeName].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleAttributeChange(attributeName, color)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 ${
                          selectedAttributes[attributeName] === color ? 'border-[#00b795] border-4' : 'border-gray-300'
                        } ${color.toLowerCase() === 'navy blue' || color.toLowerCase() === 'blue' ? 'bg-blue-600' : 
                             color.toLowerCase() === 'red' ? 'bg-red-600' : 
                             color.toLowerCase() === 'green' ? 'bg-[#00b795]' : 
                             color.toLowerCase() === 'black' ? 'bg-black' : 
                             color.toLowerCase() === 'white' ? 'bg-white' : 'bg-gray-500'}`}
                        title={color}
                      />
                    ))}
                  </div>
                </>
              ) : (
                /* For other attributes - button styling */
                <>
                  <div className="flex items-center mb-2 sm:mb-3">
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Select {attributeName}: </span>
                    <span className="text-gray-800 font-medium ml-1 text-sm sm:text-base">
                      {selectedAttributes[attributeName] || productAttributes[attributeName][0] || 'Please select'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productAttributes[attributeName].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAttributeChange(attributeName, value)}
                        className={`px-3 sm:px-4 py-2 border rounded transition-colors text-sm sm:text-base ${
                          selectedAttributes[attributeName] === value
                            ? 'border-[#00b795] bg-[#00b795] text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Quantity
            </label>
            <div className="flex items-center space-x-0 border border-gray-300 rounded w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600"
              >
                −
              </button>
              <span className="w-12 sm:w-16 text-center py-2 border-l border-r border-gray-300 bg-white text-sm sm:text-base">
                {String(quantity).padStart(2, '0')}
              </span>
              <button
                onClick={() => setQuantity(Math.min(currentInfo.stock || 100, quantity + 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                disabled={quantity >= (currentInfo.stock || 100)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={currentInfo.stock === 0}
            className={`w-full py-3 sm:py-4 rounded-lg font-medium transition-colors mb-4 sm:mb-6 text-sm sm:text-base ${
              currentInfo.stock > 0
                ? 'bg-[#00b795] text-white hover:bg-[#00a085]'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {currentInfo.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Delivery Options and Seller Info Sidebar */}
        <div className='lg:col-span-2 col-span-9 space-y-3 sm:space-y-4'>
          {/* Delivery Options */}
          <div className="border border-zinc-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">Delivery Options</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="text-teal-500 mt-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm sm:text-base">Regular</div>
                  <div className="text-xs sm:text-sm text-gray-600">Delivery within 2-3 days</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3 opacity-50">
                <div className="text-gray-400 mt-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-400 text-sm sm:text-base">Express</div>
                  <div className="text-xs sm:text-sm text-gray-400">Delivery within 24 Hours</div>
                  <div className="text-xs text-red-500">Not Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sold By */}
          <div className="border border-zinc-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">Sold by</h3>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                {product.merchant?.shop_name ? product.merchant.shop_name.charAt(0) : 'S'}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm sm:text-base">
                  {product.merchant?.shop_name}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500 text-xs sm:text-sm">★</span>
                  <span className="text-purple-600 text-xs sm:text-sm font-medium">Rising Star</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              <button className="flex-1 bg-teal-100 text-teal-700 py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium hover:bg-teal-200 transition-colors">
                💬 Chat Now
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors">
                View Shop
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
              <div>
                <div className="text-gray-600 text-xs">Ship on Time</div>
                <div className="font-bold text-lg sm:text-2xl text-gray-800">100%</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Chat Response</div>
                <div className="font-bold text-lg sm:text-2xl text-gray-800">90%</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Shop Rating</div>
                <div className="font-bold text-lg sm:text-2xl text-gray-800">99.8%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8 sm:mt-12 px-4 sm:px-6 lg:px-20 space-y-8 sm:space-y-12">
        {/* Description Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Description</h2>
          <div className="prose prose-sm sm:prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {product.description || ''}
            </p>
            
            {showFullDescription && (
              <>
                {product.long_description && (
                  <div className="text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base">{product.long_description}</p>
                  </div>
                )}
                
                {/* Additional Product Information */}
                {(product.features || product.benefits || product.usage_instructions) && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Additional Information</h3>
                    
                    {product.features && (
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Key Features:</h4>
                        <div className="space-y-1 sm:space-y-2">
                          {Array.isArray(product.features) ? (
                            product.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-gray-700">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00b795] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                <span className="text-sm sm:text-base">{feature}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-700 text-sm sm:text-base">{product.features}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {product.benefits && (
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Benefits:</h4>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.benefits}</p>
                      </div>
                    )}
                    
                    {product.usage_instructions && (
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Usage Instructions:</h4>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.usage_instructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="flex justify-center my-6 sm:my-8">
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                {showFullDescription ? 'See Less ▲' : 'See More ▼'}
              </button>
            </div>
          </div>
        </div>

        {/* Specification Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Specification</h2>
          
          {/* Product Name as Header */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            {product.name}
          </h3>
          
          {/* Specifications List */}
          <div className="space-y-2 sm:space-y-3">
            {/* Dynamic specifications from product data */}
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex items-start text-gray-700">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 sm:mr-3 mt-2 flex-shrink-0"></span>
                <div className="text-sm sm:text-base">
                  <span className="font-medium mr-1 sm:mr-2">{key}:</span>
                  <span>{value}</span>
                </div>
              </div>
            ))}
            
            {/* Basic product information */}
            {product.sku && (
              <div className="flex items-center text-gray-700">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">SKU: {product.sku}</span>
              </div>
            )}
            {product.brand?.name && (
              <div className="flex items-center text-gray-700">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">Brand: {product.brand.name}</span>
              </div>
            )}
            {product.barcode && (
              <div className="flex items-center text-gray-700">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">Barcode: {product.barcode}</span>
              </div>
            )}
            
            {showFullSpecification && (
              <>
                {/* Additional specifications when expanded */}
                {product.total_stock_qty && (
                  <div className="flex items-center text-gray-700">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-sm sm:text-base">Total Stock: {product.total_stock_qty}</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-center mt-6 sm:mt-8">
            <button 
              onClick={() => setShowFullSpecification(!showFullSpecification)}
              className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              {showFullSpecification ? 'See Less ▲' : 'See More ▼'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
