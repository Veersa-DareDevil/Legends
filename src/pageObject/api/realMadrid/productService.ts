import { APIRequestContext, expect } from '@playwright/test'
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints'
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders'
import { ApiRequest } from '@src/utils/apiUtils/apiRequest'

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
  /*
  async overrideUpdatePayloadWithCreateValues(
    createPayload: any,
    updateVarientProductPayload: any,
  ) {
    // Complete list of fields that exist in both payloads
    const commonFields = [
      'reviewsSummary',
      'defaultPrice',
      'discountable',
      'online',
      'activeStartDate',
      'productType',
      'inventoryType',
      'inventoryCheckStrategy',
      'inventoryReservationStrategy',
      'individuallySold',
      'name',
      'uri',
      'sku',
      '$tracking',
      'availableOnline',
      'eligibleForPickup',
      'merchandisingProduct',
      'businessType',
      'translatedUrls',
      'defaultLanguageTranslations',
      'contextState',
      'channels',
      'priceWithDependentItems',
      'currency',
      'active',
      'onSale',
    ]

    // Override update payload fields with create payload values
    commonFields.forEach((field) => {
      if (createPayload[field] !== undefined) {
        // For objects, do a shallow merge rather than complete replacement
        if (
          typeof createPayload[field] === 'object' &&
          createPayload[field] !== null &&
          updateVarientProductPayload[field] &&
          !Array.isArray(createPayload[field])
        ) {
          updateVarientProductPayload[field] = {
            ...updateVarientProductPayload[field],
            ...createPayload[field],
          }
        } else {
          updateVarientProductPayload[field] = createPayload[field]
        }
      }
    })

    // Special handling for nested objects that need deep merging
    if (
      createPayload.defaultLanguageTranslations &&
      updateVarientProductPayload.defaultLanguageTranslations
    ) {
      updateVarientProductPayload.defaultLanguageTranslations = {
        ...updateVarientProductPayload.defaultLanguageTranslations,
        ...createPayload.defaultLanguageTranslations,
      }
    }

    if (createPayload.translatedUrls && updateVarientProductPayload.translatedUrls) {
      updateVarientProductPayload.translatedUrls = [
        ...createPayload.translatedUrls,
        ...updateVarientProductPayload.translatedUrls.filter(
          (url: any) => !createPayload.translatedUrls.some((cu: any) => cu.locale === url.locale),
        ),
      ]
    }
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
  }*/

  async changeContextHeader(newContextHeader: string) {
    this.contextHeader = newContextHeader
  }
}
