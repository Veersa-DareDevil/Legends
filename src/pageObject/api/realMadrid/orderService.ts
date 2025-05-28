import { APIRequestContext, expect } from '@playwright/test'
import { ApiRequest } from '@src/utils/apiUtils/apiRequest'
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders'
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints'
import { CommonFunctions } from '../commonFunctions'

export class OrderService {
  constructor(
    private apiRequest: APIRequestContext,
    private contextHeader: string, // JSON string for x-context-request
  ) {}

  async searchOrderFulfillment(
    accessToken: string,
    queryParams: Record<string, string | string[]>,
  ) {
    const queryString = CommonFunctions.buildQueryString(queryParams)

    const url = `${ADMIN_ENDPOINTS.search}/order-fulfillment-search?${queryString}`

    const response = await ApiRequest.getRequest(
      this.apiRequest,
      url,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Order Fulfillment Search API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async getOrderDetailForFullfillment(accessToken: string, orderId: string) {
    const url = `${ADMIN_ENDPOINTS.fullfillmentView}/${orderId}`

    const response = await ApiRequest.getRequest(
      this.apiRequest,
      url,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Get Fulfillment View By ID API failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async changeFulfillmentStatus(accessToken: string, payload: object) {
    const url = `${ADMIN_ENDPOINTS.orderFullfillment}`

    const response = await ApiRequest.postRequest(
      this.apiRequest,
      url,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      payload,
    )

    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Fulfillment status change failed (${response.status()}): ${text}`)
    }

    return response.json()
  }

  async changeContextHeader(newContextHeader: string) {
    this.contextHeader = newContextHeader
  }
}
