import { APIRequestContext, expect } from '@playwright/test'
import { STOREFRONT_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints'
import { CartPayloads } from '@src/fixtures/api/realMadrid/cartPayload'
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders'
import { ApiRequest } from '@src/utils/apiUtils/apiRequest'
import authData from '@src/fixtures/api/authData.json'
import { QueryParams } from '@src/fixtures/api/realMadrid/queryParameters'

export class CartService {
  constructor(private apiRequest: APIRequestContext) {}

  /** Search for products in catalog */
  async searchProducts() {
    const searchParams = new URLSearchParams(QueryParams.searchProductStorefront)

    const response = await ApiRequest.getRequest(
      this.apiRequest,
      `${STOREFRONT_ENDPOINTS.catalogSearch}?${searchParams}`,
      ApiHeaders.getStorefrontHeaders(),
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Product Search API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  /** Add item to cart */
  async addItemToCart(cartVersion: number, guestToken: string) {
    const payload = CartPayloads.generateCartPayload()
    
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.cartBulkItems(authData.storefront.cartId),
      ApiHeaders.getCartOperationHeaders(guestToken, cartVersion),
      payload,
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Add to Cart API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  /** Update cart item quantity */
  async updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
    cartVersion: number,
    guestToken: string,
  ) {
    const payload = CartPayloads.generateUpdateQuantityPayload(cartItemId, quantity)

    const response = await ApiRequest.patchRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.cartItem(authData.storefront.cartId, cartItemId),
      ApiHeaders.getStorefrontHeaders(guestToken, cartVersion),
      payload,
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Update Cart Item API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  /** Delete item from cart */
  async deleteItemFromCart(cartItemId: string, cartVersion: number, guestToken: string) {
    const response = await ApiRequest.deleteRequest(
      this.apiRequest,
      `${STOREFRONT_ENDPOINTS.cartItemsBulkDelete(authData.storefront.cartId)}?cartItemIds=${cartItemId}`,
      ApiHeaders.getStorefrontHeaders(guestToken, cartVersion),
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Delete Cart Item API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  /** Refresh guest token */
  async refreshGuestToken(cartVersion: number) {
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.guestToken(authData.storefront.cartId),
      ApiHeaders.getGuestTokenHeaders(cartVersion),
      {},
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Refresh Guest Token API failed (${response.status()}): ${text}`)
    }

    const body = await response.json()
    const token = body?.token?.tokenString
    if (!token) {
      throw new Error(`Token not found in response: ${JSON.stringify(body)}`)
    }

    return token
  }
}