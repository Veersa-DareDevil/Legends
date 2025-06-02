// Base URLs for different portals
export const ADMIN_BASE_URL = 'https://uat-real-madrid-admin.legendscommerce.io'

export const STOREFRONT_BASE_URL = 'https://uat-real-madrid.legendscommerce.io'

export const STOREFRONT_API_BASE_URL = 'https://uat-storefront-api.legendscommerce.io'

// Admin Portal Endpoints
export const ADMIN_ENDPOINTS = {
  authAuthorize: `${ADMIN_BASE_URL}/auth/oauth/authorize`,
  authToken: `${ADMIN_BASE_URL}/auth/oauth/token`,
  silentCallback: `${ADMIN_BASE_URL}/silent-callback.html`,
  products: `${ADMIN_BASE_URL}/api/catalog/products`,
  categories: `${ADMIN_BASE_URL}/api/catalog/categories`,
  search: `${ADMIN_BASE_URL}/api/search`,
  orderFullfillment: `${ADMIN_BASE_URL}/api/order-operations/fulfillment-operations/status-change`,
  fullfillmentView: `${ADMIN_BASE_URL}/api/order/fulfillment-views`,
  returnOperations: `${ADMIN_BASE_URL}/api/order/return-operations`,
  // Add other admin endpoints here as needed
}

// Storefront Portal Endpoints
export const STOREFRONT_ENDPOINTS = {
  // Catalog and Browse endpoints
  catalogSearch: `${STOREFRONT_API_BASE_URL}/api/catalog-browse/browse/search/catalog`,

  // Cart Operations endpoints
  cartBulkItems: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/cart/${cartId}/bulk-items`,
  cartItem: (cartId: string, cartItemId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/cart/${cartId}/items/${cartItemId}`,
  cartItemsBulkDelete: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/cart/${cartId}/bulk-items`,
  guestToken: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/checkout/${cartId}/guest-token`,
  updateShippingAddress: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/checkout/${cartId}/update-shipping-address`,
  fulfillmentOptions: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/checkout/${cartId}/fulfillment-options`,
  selectFulfillmentOption: (cartId: string) =>
    `${STOREFRONT_API_BASE_URL}/api/cart-operations/fulfillment-options/${cartId}/select`,
  getPaymentMethodOptions: (cartId: string) =>
  `${STOREFRONT_API_BASE_URL}/api/cart-operations/checkout/${cartId}/payment-method-options`

  // Add other storefront endpoints here as needed
}
