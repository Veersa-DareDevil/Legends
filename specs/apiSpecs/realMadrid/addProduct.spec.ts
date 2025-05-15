import { test, expect } from '@playwright/test';
import { AuthService } from '@src/pageObject/api/commonObjects/authService';
import { ProductService } from '@src/pageObject/api/realMadrid/productService';
import { PAYLOAD } from '@src/fixtures/api/realMadrid/productPayload';
import AuthData from '@src/fixtures/api/realMadrid/AuthData.json'

test.describe('Admin Portal || Catalog || Products', () => {
    let accessToken: string;
    let tokenResponse: any;

    test.beforeEach(async ({ browser, request }) => {
        // 1) Initialize AuthService
        const auth = new AuthService(browser, request, AuthData.scope);

        // 2) Fetch a fresh access token
        tokenResponse = await auth.getAccessTokenResonseBody(); // This method should return the token response body
        accessToken = tokenResponse.access_token;               // Extract the access token from the response
        expect(accessToken).toBeTruthy();
    });

    test('POST API: Create a New Product via API', async ({ request }) => {
        // 3) Build ProductService
        const productService = new ProductService(
            request,
            JSON.stringify({
                catalogId: tokenResponse.catalogId, 
                sandboxId: tokenResponse.sandboxId, 
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
        expect(created.name).toBe(payload.name);
        expect(created.defaultPrice.amount).toBe(payload.defaultPrice.amount);
    });
});