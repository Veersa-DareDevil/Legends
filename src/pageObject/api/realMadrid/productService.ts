import { APIRequestContext, expect } from '@playwright/test';
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints';
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders';

export class ProductService {
  constructor(
    private apiRequest: APIRequestContext,
    private contextHeader: string, // the JSON string for x-context-request
  ) {}

  /** Create a new product */
  async createProduct(accessToken: string, payload: object) {
    const resp = await this.apiRequest.post(ADMIN_ENDPOINTS.products, {
      headers: ApiHeaders.getAuthJsonHeaders(accessToken, this.contextHeader),
      data: payload,
    });
    expect(resp.status()).toBe(200);
    if (!resp.ok()) {
      const text = await resp.text();
      throw new Error(`Products API failed (${resp.status()}): ${text}`);
    }
    return resp.json();
  }
}
