import { APIRequestContext } from '@playwright/test'

// Configuration
export const CONFIG = {
  cartId: '01JTAQZF2A9V59171V84VG05GM',
  baseURL: 'https://storefront-api.legendscommerce.io',
  baseApiUrl: 'https://uat-storefront-api.legendscommerce.io',
  storefrontOrigin: 'https://real-madrid.uat.storefront.legendscommerce.io',
  applicationToken: 'real_madrid',
  defaultVersion: 34,
  defaultGuestToken: '01JTFEGHRVV4651PWBG1Y61C8T',
}

// Generate cart payload
export function generateCartPayload() {
  const timestamp = Date.now()
  return [
    {
      productId: '01J3ZJDH5EWG3X1EYBDY170PCQ',
      variantId: '01J3ZJDH6XVDG50AW3CNR50D1A',
      quantity: 1,
      itemAttributeChoices: {},
      dependentCartItems: [],
      itemAttributes: {
        purchaseItemMetadata: {
          options: [
            {
              id: '01JD9R4AX9818415W9X6WQ05FD',
              type: 'VARIANT_DISTINGUISHING',
              bundlingEnabled: false,
              label: 'Size',
              displayOrder: 1,
              attribute: {
                name: 'Size',
                type: 'SIZE',
                required: false,
              },
              allowedValues: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => ({
                label: size,
                value: size,
                attributes: {},
              })),
              order: timestamp,
            },
          ],
          order: timestamp,
        },
      },
      note: null,
    },
  ]
}

// Search for products
export async function searchProducts(request: APIRequestContext) {
  const searchParams = new URLSearchParams({
    page: '0',
    primaryAndSecondaryOnly: 'true',
    query: 'jersey',
    size: '12',
    type: 'PRODUCT',
  })

  const response = await request.get(
    `${CONFIG.baseApiUrl}/api/catalog-browse/browse/search/catalog?${searchParams}`,
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US',
        origin: CONFIG.storefrontOrigin,
        referer: `${CONFIG.storefrontOrigin}/`,
        'x-application-token': CONFIG.applicationToken,
        'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
        'x-feature-flags': JSON.stringify({
          'split-fulfillment': true,
          'arrive-by-estimates': true,
          'CACHE_use-backend-pricing-normalization': true,
          'smarty-verification': true,
        }),
        'x-price-context': JSON.stringify({ currency: 'USD' }),
      },
    },
  )

  const body = await response.json()
  return { response, body }
}

// Add item to cart
export async function addItemToCart(
  request: APIRequestContext,
  version: number,
  guestToken: string,
) {
  const payload = generateCartPayload()
  const response = await request.post(
    `${CONFIG.baseURL}/api/cart-operations/cart/${CONFIG.cartId}/bulk-items`,
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        origin: 'https://us.shop.realmadrid.com',
        'x-application-token': CONFIG.applicationToken,
        'x-cart-version': String(version),
        'x-guest-token': guestToken,
        'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
        'x-feature-flags': JSON.stringify({
          'split-fulfillment': false,
          'CACHE_use-backend-pricing-normalization': true,
        }),
      },
      data: payload,
    },
  )
  const body = await response.json()
  return { response, body }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  request: APIRequestContext,
  cartItemId: string,
  quantity: number,
  version: number,
  guestToken: string,
) {
  const payload = {
    cartItemId: cartItemId,
    quantity: quantity,
  }

  const response = await request.patch(
    `${CONFIG.baseURL}/api/cart-operations/cart/${CONFIG.cartId}/items/${cartItemId}`,
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US',
        'content-type': 'application/json',
        origin: CONFIG.storefrontOrigin,
        referer: `${CONFIG.storefrontOrigin}/`,
        'x-application-token': CONFIG.applicationToken,
        'x-cart-version': String(version),
        'x-guest-token': guestToken,
        'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
        'x-feature-flags': JSON.stringify({
          'split-fulfillment': true,
          'arrive-by-estimates': true,
          'CACHE_use-backend-pricing-normalization': true,
          'smarty-verification': true,
        }),
      },
      data: payload,
    },
  )
  const body = await response.json()
  return { response, body }
}

// Delete item from cart
export async function deleteItemFromCart(
  request: APIRequestContext,
  cartItemId: string,
  version: number,
  guestToken: string,
) {
  const response = await request.delete(
    `${CONFIG.baseURL}/api/cart-operations/cart/${CONFIG.cartId}/bulk-items?cartItemIds=${cartItemId}`,
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US',
        origin: CONFIG.storefrontOrigin,
        referer: `${CONFIG.storefrontOrigin}/`,
        'x-application-token': CONFIG.applicationToken,
        'x-cart-version': String(version),
        'x-guest-token': guestToken,
        'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
        'x-feature-flags': JSON.stringify({
          'split-fulfillment': true,
          'arrive-by-estimates': true,
          'CACHE_use-backend-pricing-normalization': true,
          'smarty-verification': true,
        }),
      },
    },
  )
  const body = await response.json()
  return { response, body }
}

// Refresh guest token
export async function refreshGuestToken(api: APIRequestContext, cartId: string, version: number) {
  const url = `${CONFIG.baseURL}/api/cart-operations/checkout/${cartId}/guest-token`
  const response = await api.post(url, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-application-token': CONFIG.applicationToken,
      'x-cart-version': version.toString(),
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
    },
    data: {},
  })

  if (response.status() !== 200) {
    throw new Error(
      `Failed to refresh guest token. Status: ${response.status()}, Body: ${await response.text()}`,
    )
  }

  const body = await response.json()
  const token = body?.token?.tokenString
  if (!token) {
    throw new Error(`Token not found in response: ${JSON.stringify(body)}`)
  }

  return token
}
