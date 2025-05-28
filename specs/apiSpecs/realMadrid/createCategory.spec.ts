import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { CategoryPayloads } from '@src/fixtures/api/realMadrid/categoryPayload'
import authData from '@src/fixtures/api/authData.json'
import { CategoryService } from '@src/pageObject/api/realMadrid/categoryService'

test.describe('Admin Portal || Catalog || Category', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // 1) Initialize AuthService
    const auth = new AuthService(browser, request, authData.categoryScope)

    // 2) Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('POST API: Create Category', async ({ request }) => {
    // 3) Category Service
    const categoryService = new CategoryService(
      request,
      JSON.stringify({
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )

    // 4) Compose your payload

    const payload = CategoryPayloads.createCategory()

    // 5) Create the category
    const created = await categoryService.createCategory(accessToken, payload)

    // 6) Assertions
    expect(created).toHaveProperty('id')
    expect(created.name).toBe(payload.name)
    expect(created.url).toBe(payload.url)
    expect(created.productMembershipType).toBe(payload.productMembershipType)
  })
})
