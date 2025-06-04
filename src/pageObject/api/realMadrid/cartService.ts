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
      ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion),
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

  async updateShippingAddress(
    cartId: string,
    guestToken: string,
    cartVersion: number,
    payload: object,
  ) {
    const queryParams = new URLSearchParams({ unifyFulfillmentGroups: 'false' })

    const response = await ApiRequest.patchRequest(
      this.apiRequest,
      `${STOREFRONT_ENDPOINTS.updateShippingAddress(cartId)}?${queryParams}`,
      ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion),
      payload,
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Update Shipping Address failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async getFulfillmentOptions(cartId: string) {
    const response = await ApiRequest.getRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.fulfillmentOptions(cartId),
      ApiHeaders.getStorefrontHeaders(),
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Fulfillment Options API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }
  async selectFulfillmentOption(
    cartId: string,
    cartVersion: number,
    payload: object,
    guestToken: string,
  ) {
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.selectFulfillmentOption(cartId),
      ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion),
      payload,
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Select Fulfillment Option failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async getPaymentMethodOptions(cartId: string, cartVersion: number, guestToken: string) {
    const response = await ApiRequest.getRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.getPaymentMethodOptions(cartId),
      ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion),
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Fetching payment methods failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async changeCurrencyLocale(locale: string, currency: string) {
    const payload = CartPayloads.getCurrencyLocalePayload()
    payload.priceCartRequest.currency = currency
    payload.priceCartRequest.locale = locale

    const response = await ApiRequest.postRequest(
      this.apiRequest,
      STOREFRONT_ENDPOINTS.changeCurrencyLocale,
      ApiHeaders.getStorefrontHeadersWithoutGuestCart(),
      payload,
    )

    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Creating cart failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async applyOfferCode(cartId: string, cartVersion: number, guestToken: string, offerCode: string) {
    const payload = {
      code: offerCode,
    }

    const headers = ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion)
    const url = STOREFRONT_ENDPOINTS.cartOfferCodes(cartId)

    const response = await ApiRequest.postRequest(this.apiRequest, url, headers, payload)

    expect(response.status()).toBe(200)
    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Apply Offer Code API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async removeOfferCode(
    cartId: string,
    offerCode: string,
    cartVersion: number,
    guestToken: string,
  ) {
    const headers = ApiHeaders.getStorefrontHeadersWithoutGuestCart(guestToken, cartVersion)

    const url = STOREFRONT_ENDPOINTS.cartOfferCodes(cartId) + `/${offerCode}`

    const response = await ApiRequest.deleteRequest(this.apiRequest, url, headers)

    expect(response.status()).toBe(200)
    if (!response.ok() && response.status() !== 409 && response.status() !== 401) {
      const text = await response.text()
      throw new Error(`Remove Offer Code API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }
}
