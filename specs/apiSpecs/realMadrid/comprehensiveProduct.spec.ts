import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { ProductService } from '@src/pageObject/api/realMadrid/productService'
import authData from '@src/fixtures/api/authData.json'
import { QueryParams } from '@src/fixtures/api/realMadrid/queryParameters'
import { ProductPayloads } from '@src/fixtures/api/realMadrid/productPayload'
import { CommonFunctions } from '@src/pageObject/api/commonFunctions'

test.describe('Admin Portal || Comprehensive Endpoint || Products', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // Initialize AuthService
    const auth = new AuthService(browser, request, authData.priceListScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('Make a Comprehensive Product via API', async ({ browser, request }) => {
    // Build ProductService
    const productService = new ProductService(
      request,
      JSON.stringify({
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )
    //1) Fetch Price Lists

    const priceListResponse = await productService.getPriceList(
      accessToken,
      QueryParams.comprehensiveLists,
    )
    expect(priceListResponse.content.length).toBeGreaterThan(0)

    //2) Fetch Data Driven Enums

    let auth = new AuthService(browser, request, authData.ddeScope)

    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )

    const ddeResponse = await productService.getDDE(accessToken, QueryParams.comprehensiveLists)
    expect(ddeResponse.content.length).toBeGreaterThan(0)

    //3) Fetch All Inventory Locations

    auth = new AuthService(browser, request, authData.inventoryLocationScope)

    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )

    const inventoryLocationsResponse = await productService.getInventoryLocations(
      accessToken,
      QueryParams.comprehensiveLists,
    )
    expect(inventoryLocationsResponse.content.length).toBeGreaterThan(0)

    //Step 4 ) Fetch Advanced Tags

    auth = new AuthService(browser, request, authData.tagScope)

    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )

    const advancedTagsResponse = await productService.getAdvancedTags(
      accessToken,
      QueryParams.comprehensiveLists,
    )
    expect(advancedTagsResponse.content.length).toBeGreaterThan(0)

    //step 5)) create standard product

    auth = new AuthService(browser, request, authData.productScope)

    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )

    const productPayload = ProductPayloads.getCreateProduct()

    const createdProduct = await productService.createProduct(accessToken, productPayload)

    expect(createdProduct).toHaveProperty('id')
    expect(createdProduct.name).toBe(productPayload.name)
    expect(createdProduct.defaultPrice.amount).toBe(productPayload.defaultPrice.amount)

    // step 6)) add price list data

    auth = new AuthService(browser, request, authData.priceListScope)

    tokenResponse = await auth.getAccessTokenResonseBody()
    accessToken = tokenResponse.access_token
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId,
        sandboxId: authData.sandboxId,
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          id: createdProduct.id,
          name: tokenResponse.scope,
          subContainerName: authData.priceData,
        },
      }),
    )

    const priceDataPayload = ProductPayloads.createPriceData()

    priceDataPayload.target.targetId = createdProduct.sku
    priceDataPayload.priceListId = priceListResponse.content[0].id
    priceDataPayload.priceListName = priceListResponse.content[0].name
    priceDataPayload.priceListCurrency = priceListResponse.content[0].currency

    const priceDataResponse = await productService.addPriceList(accessToken, priceDataPayload)

    expect(priceDataResponse.priceListId).toBe(priceDataPayload.priceListId)
    expect(priceDataResponse.priceListName).toBe(priceDataPayload.priceListName)
    expect(priceDataResponse.target.targetId).toBe(priceDataPayload.target.targetId)

    // step 7 : Add Advanced tags
    const advancedTagsPayload = { tag: advancedTagsResponse.content[0] }

    auth = new AuthService(browser, request, authData.productScope)

    tokenResponse = await auth.getAccessTokenResonseBody()
    accessToken = tokenResponse.access_token
    expect(accessToken).toBeTruthy()

    productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId,
        sandboxId: authData.sandboxId,
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          id: createdProduct.id,
          name: tokenResponse.scope,
          subContainerName: authData.productTag,
        },
      }),
    )

    const tagResponse = await productService.addAdvancedTag(
      accessToken,
      createdProduct.id,
      advancedTagsPayload,
    )

    expect(tagResponse.tag.id).toBe(advancedTagsPayload.tag.id)
    expect(tagResponse.tag.type).toBe(advancedTagsPayload.tag.type)
    expect(tagResponse.product.id).toBe(createdProduct.id)

    //step 8)) Add data driven enums as brand and merchandisingType

    productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId,
        sandboxId: authData.sandboxId,
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          id: createdProduct.id,
          name: tokenResponse.scope,
        },
      }),
    )

    const merchandisingType = CommonFunctions.findInList(ddeResponse.content, 'MERCHANDISING_TYPE')
    const brand = CommonFunctions.findInList(ddeResponse.content, 'BRAND')

    const updatePayload = {
      ...productPayload,
      id: createdProduct.id,
      brand: brand,
      merchandisingType: merchandisingType,
    }

    const updatedProduct = await productService.updateProduct(
      accessToken,
      createdProduct.id,
      updatePayload,
    )

    // assertions
    expect(updatedProduct.id).toBe(createdProduct.id)
    expect(updatedProduct.brand.id).toBe(brand!.id)
    expect(updatedProduct.merchandisingType.id).toBe(merchandisingType!.id)
    expect(updatedProduct.brand.value).toBe(brand!.value)
    expect(updatedProduct.merchandisingType.value).toBe(merchandisingType!.value)
  })
})
