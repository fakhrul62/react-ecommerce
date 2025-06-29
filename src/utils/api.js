// API configuration for different environments
const isDevelopment = import.meta.env.DEV

// Use different base URLs for development vs production
export const API_BASE_URL = isDevelopment 
  ? 'http://157.230.240.97:9999/api/v1'  // Direct HTTP in development
  : '/api/proxy'                          // Proxy route in production

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`
}

// Helper function to proxy image URLs for HTTPS compatibility
export const getProxiedImageUrl = (imageUrl) => {
  // If no image URL provided, return placeholder
  if (!imageUrl) {
    return '/api/placeholder/400/400'
  }

  // In development, return original URL
  if (isDevelopment) {
    return imageUrl
  }

  // In production, check if it's an HTTP image URL that needs proxying
  if (imageUrl.startsWith('http://157.230.240.97:8888/') || 
      imageUrl.startsWith('http://157.230.240.97:9999/')) {
    // Use a CORS proxy service for images
    return `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`
  }

  // If it's already HTTPS or relative, return as-is
  return imageUrl
}

// Enhanced fetch wrapper with error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint)
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw error
  }
}
