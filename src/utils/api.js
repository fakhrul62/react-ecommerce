// API configuration for different environments
const isDevelopment = import.meta.env.DEV
const isProduction = !isDevelopment

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
