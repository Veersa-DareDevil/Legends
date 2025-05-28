import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { CategoryPayloads } from '@src/fixtures/api/realMadrid/categoryPayload'
import authData from '@src/fixtures/api/authData.json'
import { CategoryService } from '@src/pageObject/api/realMadrid/categoryService'

test.describe('Admin Portal || Catalog || Category', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // Initialize AuthService
    const auth = new AuthService(browser, request, authData.categoryScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('GET API: Category Details', async ({ request }) => {
    //  Category Service
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

    // Compose your payload

    const payload = CategoryPayloads.createCategory()

    // Create the category
    const created = await categoryService.createCategory(accessToken, payload)

    // Assertions
    expect(created).toHaveProperty('id')
    expect(created.name).toBe(payload.name)
    expect(created.url).toBe(payload.url)

    // Get Details of Created Category

    const categoryId = created.id

    await categoryService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          id: categoryId,
          name: tokenResponse.scope,
        },
      }),
    )

    const categoryDetails = await categoryService.getCategoryDetails(accessToken, categoryId)

    // Assertions
    expect(categoryDetails).toHaveProperty('id', categoryId)
    expect(categoryDetails.name).toBe(payload.name)
    expect(categoryDetails.url).toBe(payload.url)
    expect(categoryDetails.productMembershipType).toBe(payload.productMembershipType)
  })
})
