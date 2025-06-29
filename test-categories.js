// Test API category filtering capabilities
async function testCategoryFiltering() {
  try {
    console.log('Testing category filtering...')
    
    // First, get categories
    console.log('\n=== Getting Categories ===')
    const categoriesResponse = await fetch('http://157.230.240.97:9999/api/v1/categories')
    const categoriesData = await categoriesResponse.json()
    console.log('Categories response structure:', Object.keys(categoriesData))
    
    if (categoriesData.data && categoriesData.data.length > 0) {
      const firstCategory = categoriesData.data[0]
      console.log('First category:', firstCategory)
      
      // Test different category filter approaches
      const categoryName = firstCategory.name || firstCategory.title
      console.log(`\n=== Testing filters for category: ${categoryName} ===`)
      
      // Test various possible parameter names
      const testParams = [
        `category=${encodeURIComponent(categoryName)}`,
        `category_id=${firstCategory.id}`,
        `category_name=${encodeURIComponent(categoryName)}`,
        `filter[category]=${encodeURIComponent(categoryName)}`,
        `search=${encodeURIComponent(categoryName)}`
      ]
      
      for (const param of testParams) {
        try {
          console.log(`\nTesting: ?${param}`)
          const response = await fetch(`http://157.230.240.97:9999/api/v1/shop/products?${param}`)
          const data = await response.json()
          
          if (data.data && data.data.length > 0) {
            console.log(`✅ Success with ${param}: ${data.data.length} products`)
            console.log(`   First product: ${data.data[0].name}`)
          } else {
            console.log(`❌ No products with ${param}`)
          }
        } catch (error) {
          console.log(`❌ Error with ${param}:`, error.message)
        }
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

testCategoryFiltering()
