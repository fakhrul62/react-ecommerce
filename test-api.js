// Test script to check API response structure
async function testAPI() {
  try {
    console.log('Testing page 1...')
    const response1 = await fetch('http://157.230.240.97:9999/api/v1/shop/products')
    const data1 = await response1.json()
    console.log('Page 1 structure:', {
      message: data1.message,
      dataLength: data1.data?.length,
      keys: Object.keys(data1),
      hasMeta: !!data1.meta,
      hasTotal: !!data1.total,
      hasTotalPages: !!data1.total_pages,
      firstProduct: data1.data?.[0]?.name
    })

    console.log('\nTesting page 2...')
    const response2 = await fetch('http://157.230.240.97:9999/api/v1/shop/products?page=2')
    const data2 = await response2.json()
    console.log('Page 2 structure:', {
      message: data2.message,
      dataLength: data2.data?.length,
      keys: Object.keys(data2),
      hasMeta: !!data2.meta,
      hasTotal: !!data2.total,
      hasTotalPages: !!data2.total_pages,
      firstProduct: data2.data?.[0]?.name
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

testAPI()
