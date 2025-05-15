import { APIRequestContext, expect } from '@playwright/test';
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints';
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders';
import { APIUtils } from '@src/utils/apiUtils/realMadrid/ApiUtil';



export class ProductService {
  constructor(
    private apiRequest: APIRequestContext,
    private contextHeader: string  // the JSON string for x-context-request
  ) {}

  /** Create a new product */
  async createProduct(accessToken: string, payload: any) {
    const resp = await APIUtils.postRequest(this.apiRequest,ADMIN_ENDPOINTS.products,ApiHeaders.getAuthJsonHeaders(accessToken,this.contextHeader),payload)
    expect(resp.status()).toBe(200)
    if (!resp.ok()) {
      const text = await resp.text();
      throw new Error(`Products API failed (${resp.status()}): ${text}`);
    }
    return resp.json();
  }
}
