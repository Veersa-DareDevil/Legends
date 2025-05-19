// Base URLs for different portals
export const ADMIN_BASE_URL = 'https://uat-real-madrid-admin.legendscommerce.io'

export const STOREFRONT_BASE_URL = 'https://uat-real-madrid.legendscommerce.io' // Placeholder - update with actual storefront URL

// Admin Portal Endpoints
export const ADMIN_ENDPOINTS = {
  authAuthorize: `${ADMIN_BASE_URL}/auth/oauth/authorize`,
  authToken: `${ADMIN_BASE_URL}/auth/oauth/token`,
  silentCallback: `${ADMIN_BASE_URL}/silent-callback.html`,
  products: `${ADMIN_BASE_URL}/api/catalog/products`,
  // Add other admin endpoints here as needed
}

// Storefront Portal Endpoints
export const STOREFRONT_ENDPOINTS = {
  // Add storefront endpoints here as needed
}
