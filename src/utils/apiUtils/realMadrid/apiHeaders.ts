import authData from '@src/fixtures/api/authData.json'

/**
 * Generates common headers for API requests.
 */
export class ApiHeaders {
  /**
   * Get headers for requests expecting JSON response.
   */
  static getJsonHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }

  /**
   * Get headers for requests with Bearer token authentication and JSON content.
   * @param accessToken The access token.
   * @param contextHeader Optional x-context-request header value.
   */
  static getAuthJsonHeaders(accessToken: string, contextHeader?: string) {
    const headers: { [key: string]: string } = {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      accept: 'application/json',
    }
    if (contextHeader) {
      headers['x-context-request'] = contextHeader
    }
    return headers
  }

  /**
   * Get headers for form-urlencoded content.
   */
  static getFormUrlEncodedHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    }
  }

  static getStorefrontHeaders(guestToken?: string, cartVersion?: number) {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'accept-language': 'en-US',
      origin: process.env.RM_STOREFRONT_URL!!,
      referer: `${process.env.RM_STOREFRONT_URL!!}`,
      'x-application-token': authData.storefront.applicationToken,
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
      'x-feature-flags': JSON.stringify({
        'split-fulfillment': true,
        'arrive-by-estimates': true,
        'CACHE_use-backend-pricing-normalization': true,
        'smarty-verification': true,
      }),
      'x-price-context': JSON.stringify({ currency: 'USD' }),
    }

    if (guestToken) {
      headers['x-guest-token'] = guestToken
    }

    if (cartVersion) {
      headers['x-cart-version'] = String(cartVersion)
    }

    return headers
  }

  static getCartOperationHeaders(guestToken: string, cartVersion: number) {
    return {
      accept: 'application/json',
      'content-type': 'application/json',
      origin: 'https://us.shop.realmadrid.com',
      'x-application-token': authData.storefront.applicationToken,
      'x-cart-version': String(cartVersion),
      'x-guest-token': guestToken,
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
      'x-feature-flags': JSON.stringify({
        'split-fulfillment': false,
        'CACHE_use-backend-pricing-normalization': true,
      }),
    }
  }

  static getGuestTokenHeaders(cartVersion: number) {
    return {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-application-token': authData.storefront.applicationToken,
      'x-cart-version': cartVersion.toString(),
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
    }
  }
}
