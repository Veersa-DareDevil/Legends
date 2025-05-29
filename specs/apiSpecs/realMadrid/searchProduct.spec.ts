import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { ProductService } from '@src/pageObject/api/realMadrid/productService'
import { ProductPayloads } from '@src/fixtures/api/realMadrid/productPayload'
import authData from '@src/fixtures/api/authData.json'
import { QueryParams } from '@src/fixtures/api/realMadrid/queryParameters'

test.describe('Admin Portal || Search || Products', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // Initialize AuthService
    const auth = new AuthService(browser, request, authData.productScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('Get API: Search Created Product via API', async ({ request }) => {
    // Build ProductService
    const productService = new ProductService(
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
    // 1) Create the Product for Searching

    //Compose your payload

    const createPayload = ProductPayloads.getCreateProduct()

    // Create the product
    const createdProduct = await productService.createProduct(accessToken, createPayload)

    // Assertions
    expect(createdProduct).toHaveProperty('id')
    expect(createdProduct.name).toBe(createPayload.name)
    expect(createdProduct.defaultPrice.amount).toBe(createPayload.defaultPrice.amount)

    // 2) Search the Peroduct

    const searchResponse = await productService.searchProductByName(
      accessToken,
      QueryParams.productSearchByName(createPayload.name),
    )
    const searchContent = searchResponse.content

    // assertions
    expect(searchContent?.length).toBeGreaterThan(0)
    expect(searchContent[0].name).toBe(createPayload.name)
    expect(searchContent[0].uri).toBe(createPayload.uri)
    expect(searchContent[0].sku).toBe(createPayload.sku)
  })
})
