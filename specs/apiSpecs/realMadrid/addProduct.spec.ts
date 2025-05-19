import { test, expect } from '@playwright/test';
import { AuthService } from '@src/pageObject/api/realMadrid/authService';
import { ProductService } from '@src/pageObject/api/realMadrid/productService';
import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints';
import { PAYLOAD } from '@src/fixtures/api/realMadrid/productPayload';

test.describe('Admin Portal || Catalog || Products', () => {
  let accessToken: string;
  let tokenResponse: { [key: string]: string };

  test.beforeEach(async ({ browser, request }) => {
    // 1) Initialize AuthService
    const auth = new AuthService(browser, request, {
      clientId: 'real-madridAdmin',
      authUrl: ADMIN_ENDPOINTS.authAuthorize, // Authorization URL remains the same
      tokenUrl: ADMIN_ENDPOINTS.authToken, // Token URL remains the same
      redirectUri: ADMIN_ENDPOINTS.silentCallback, // Redirect URI remains the same
      scope: 'PRODUCT', // Scope for product creation , update as needed
    });

    // 2) Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody(); // This method should return the token response body
    accessToken = tokenResponse.access_token; // Extract the access token from the response
    expect(accessToken).toBeTruthy();
  });

  test('POST API: Create a New Product via API', async ({ request }) => {
    // 3) Build ProductService
    const productSvc = new ProductService(
      request,
      JSON.stringify({
        catalogId: '01HTNGGZ5K87AW0PYCMBBM0DDP', // Need to update to Dynamically fetched from token response
        sandboxId: '01J54A3Q2R2C7V02337EFP16Z4', // Need to Update to Dynamically fetched from token response
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    );

    // 4) Compose your payload
    const productNumber = Math.floor(Math.random() * 1000);
    const payload = { ...PAYLOAD.createProduct };
    payload.name = `Test Product ${productNumber}`;
    payload.sku = `Test Product SKU ${productNumber}`;
    payload.defaultPrice.amount = productNumber;
    payload.uri = `/test-product-${productNumber}`;

    // 5) Create the product
    const created = await productSvc.createProduct(accessToken, payload);
    console.log('Created product ID:', created.id);

    // 6) Assertions
    expect(created.name).toBe(payload.name);
    expect(created.defaultPrice.amount).toBe(payload.defaultPrice.amount);
  });
});
