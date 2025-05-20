import { test, expect } from '@playwright/test';
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService.ts';
import { PAYLOAD } from '@src/fixtures/api/realMadrid/categoryPayload.ts';
import authData from '@src/fixtures/api/authData.json';
import { CategoryService } from '@src/pageObject/api/realMadrid/categoryService.ts';

test.describe('Admin Portal || Catalog || Category', () => {
  let accessToken: string;
  let tokenResponse: { [key: string]: string };

  test.beforeEach(async ({ browser, request }) => {
    // 1) Initialize AuthService
    const auth = new AuthService(browser, request, authData.categoryScope);

    // 2) Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody(); // This method should return the token response body
    accessToken = tokenResponse.access_token; // Extract the access token from the response
    expect(accessToken).toBeTruthy();
  });

  test('POST API: Create Category', async ({ request }) => {
    // 3) Category Service
    const categoryService = new CategoryService(
      request,
      JSON.stringify({
        catalogId: '01HTNGGZ5K87AW0PYCMBBM0DDP', // Need to update to Dynamically fetched from token
        sandboxId: '01J54A3Q2R2C7V02337EFP16Z4', // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    );

    // 4) Compose your payload

    const payload = { ...PAYLOAD.createCategory };

    // 5) Create the category
    const created = await categoryService.createCategory(accessToken, payload);
    console.log('Created Category ID:', created.id);

    // 6) Assertions
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(payload.name);
    expect(created.url).toBe(payload.url);
    expect(created.productMembershipType).toBe(payload.productMembershipType);
  });
});
