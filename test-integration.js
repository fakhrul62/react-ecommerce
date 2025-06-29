// Test to see if products have category data or if we need a different approach
async function testCategoryIntegration() {
  try {
    // Test 1: Check if individual product has category data
    console.log('=== TESTING INDIVIDUAL PRODUCT DETAILS ===')
    const productResponse = await fetch('http://157.230.240.97:9999/api/v1/product/iphone-15-plus')
    const productData = await productResponse.json()
    console.log('Individual product keys:', Object.keys(productData.data || productData))
    console.log('Category related fields:', {
      category: productData.data?.category || productData.category,
      categories: productData.data?.categories || productData.categories,
      category_id: productData.data?.category_id || productData.category_id,
      product_category: productData.data?.product_category || productData.product_category
    })
    
    // Test 2: Check if there are more products with different structures
    console.log('\n=== CHECKING MULTIPLE PRODUCTS ===')
    const productsResponse = await fetch('http://157.230.240.97:9999/api/v1/shop/products')
    const productsData = await productsResponse.json()
    
    if (productsData.data && productsData.data.length > 0) {
      productsData.data.slice(0, 5).forEach((product, index) => {
        console.log(`Product ${index + 1} (${product.name}):`, {
          id: product.id,
          category: product.category,
          categories: product.categories,
          category_id: product.category_id,
          tags: product.tags,
          hasCategory: !!product.category,
          hasCategories: !!product.categories
        })
      })
    }
    
    // Test 3: Try to see if category filtering works at API level with category slug
    console.log('\n=== TESTING API CATEGORY FILTERING WITH SLUG ===')
    const categorySlug = 'electronics-device'
    const filteredResponse = await fetch(`http://157.230.240.97:9999/api/v1/shop/products?category=${categorySlug}`)
    const filteredData = await filteredResponse.json()
    console.log(`Products with category ${categorySlug}:`, {
      total: filteredData.total,
      count: filteredData.data?.length,
      first_product: filteredData.data?.[0]?.name
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testCategoryIntegration()
