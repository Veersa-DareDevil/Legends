import { APIRequestContext, expect } from '@playwright/test'
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints'
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders'
import { ApiRequest } from '@src/utils/apiUtils/apiRequest'
import { CommonFunctions } from '../commonFunctions'

export class ProductService {
  constructor(
    private apiRequest: APIRequestContext,
    private contextHeader: string, // the JSON string for x-context-request
  ) {}

  /** Create a new product */
  async createProduct(accessToken: string, payload: object) {
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      ADMIN_ENDPOINTS.products,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      payload,
    )
    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Products API failed (${response.status()}): ${text}`)
    }
    return response.json()
  }

  async updateVarientProduct(accessToken: string, payload: object, productId: string) {
    const response = await ApiRequest.putRequest(
      this.apiRequest,
      `${ADMIN_ENDPOINTS.products}/${productId}`,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      payload,
    )
    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`API failed (${response.status()}): ${text}`)
    }
    return response.json()
  }

  async createVariant(accessToken: string, payload: object, productId: string) {
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      `${ADMIN_ENDPOINTS.products}/${productId}/variants`,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      payload,
    )
    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`API failed (${response.status()}): ${text}`)
    }
    return response.json()
  }

  async changeContextHeader(newContextHeader: string) {
    this.contextHeader = newContextHeader
  }

  async searchProductByName(accessToken: string, queryParams: Record<string, string>) {
    const queryString = CommonFunctions.buildQueryString(queryParams)
    const url = `${ADMIN_ENDPOINTS.search}/catalog-search?${queryString}`

    const response = await ApiRequest.getRequest(
      this.apiRequest,
      url,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Product Search API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }
}
