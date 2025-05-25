import { APIRequestContext, expect } from '@playwright/test'
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints'
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders'
import { ApiRequest } from '@src/utils/apiUtils/apiRequest'

export class CategoryService {
  constructor(
    private apiRequest: APIRequestContext,
    private contextHeader: string, // the JSON string for x-context-request
  ) {}

  // create new category

  async createCategory(accessToken: string, payload: object) {
    const response = await ApiRequest.postRequest(
      this.apiRequest,
      ADMIN_ENDPOINTS.categories,
      ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      payload,
    )
    expect(response.status()).toBe(200)
    if (!response.ok()) {
      const text = await response.text()
      throw new Error(`Categories API failed (${response.status()}): ${text}`)
    }
    return response.json()
  }
  
  async getCategoryDetails(accessToken: string, categoryId: string) {
  const response = await ApiRequest.getRequest(
    this.apiRequest,
    `${ADMIN_ENDPOINTS.categories}/${categoryId}`,
    ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader)
  )

  expect(response.status()).toBe(200)
  if (!response.ok()) {
    const text = await response.text()
    throw new Error(`Get Category Details API failed (${response.status()}): ${text}`)
  }

  return response.json()
}


async changeContextHeader(newContextHeader:string){
    this.contextHeader=newContextHeader
  }
}
