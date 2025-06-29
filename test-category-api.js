// Test API category filtering with slugs
async function testCategoryFiltering() {
  try {
    console.log('Testing category filtering with slugs...')
    
    // Test filtering by electronics-device
    console.log('\n=== Testing electronics-device ===')
    const electronicsResponse = await fetch('http://157.230.240.97:9999/api/v1/shop/products?category=electronics-device')
    const electronicsData = await electronicsResponse.json()
    console.log(`Electronics products: ${electronicsData.data ? electronicsData.data.length : 0}`)
    if (electronicsData.data && electronicsData.data.length > 0) {
      console.log('First electronics product:', electronicsData.data[0].name)
    }
    
    // Test filtering by womens-girls-fashion
    console.log('\n=== Testing womens-girls-fashion ===')
    const fashionResponse = await fetch('http://157.230.240.97:9999/api/v1/shop/products?category=womens-girls-fashion')
    const fashionData = await fashionResponse.json()
    console.log(`Fashion products: ${fashionData.data ? fashionData.data.length : 0}`)
    if (fashionData.data && fashionData.data.length > 0) {
      console.log('First fashion product:', fashionData.data[0].name)
    }
    
    // Test no filter (all products)
    console.log('\n=== Testing all products ===')
    const allResponse = await fetch('http://157.230.240.97:9999/api/v1/shop/products')
    const allData = await allResponse.json()
    console.log(`All products: ${allData.data ? allData.data.length : 0}`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testCategoryFiltering()
