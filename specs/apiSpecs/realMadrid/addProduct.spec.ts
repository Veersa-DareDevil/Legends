import { test, expect } from '@playwright/test';
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService';
import { ProductService } from '@src/pageObject/api/realMadrid/productService';
import { PAYLOAD } from '@src/fixtures/api/realMadrid/productPayload';
import authData from '@src/fixtures/api/authData.json'

test.describe('Admin Portal || Catalog || Products', () => {
  let accessToken: string;
  let tokenResponse: { [key: string]: string };

    test.beforeEach(async ({ browser, request }) => {
        // 1) Initialize AuthService
        const auth = new AuthService(browser, request, authData.productScope);

    // 2) Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody(); // This method should return the token response body
    accessToken = tokenResponse.access_token; // Extract the access token from the response
    expect(accessToken).toBeTruthy();
  });

    test('POST API: Create a New Product via API', async ({ request }) => {
        // 3) Build ProductService
        const productService = new ProductService(
            request,
            JSON.stringify({
                catalogId: "01HTNGGZ5K87AW0PYCMBBM0DDP", // Need to update to Dynamically fetched from token
                sandboxId: "01J54A3Q2R2C7V02337EFP16Z4", // Need to Update to Dynamically fetched from token  
                tenantId: tokenResponse.tenant_id,
                applicationId: tokenResponse.application_ids[0],
                customerContextId: tokenResponse.customer_context_ids[0],
                changeContainer: { name: tokenResponse.scope }
            })
        );

        // 4) Compose your payload
        
        const payload = { ...PAYLOAD.createProduct };
        
        // 5) Create the product
        const created = await productService.createProduct(accessToken, payload);
        console.log('Created product ID:', created.id);

        // 6) Assertions
        expect(created).toHaveProperty('id');
        expect(created.name).toBe(payload.name);
        expect(created.defaultPrice.amount).toBe(payload.defaultPrice.amount);
    });
});
