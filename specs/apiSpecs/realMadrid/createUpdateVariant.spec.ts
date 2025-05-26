//This file is under progress , kindly skip this for now

import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { ProductService } from '@src/pageObject/api/realMadrid/productService'
import { ProductPayloads } from '@src/fixtures/api/realMadrid/productPayload'

import authData from '@src/fixtures/api/authData.json'

test.describe('Admin Portal ||  Products || Variants', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // 1) Initialize AuthService
    const auth = new AuthService(browser, request, authData.productScope)

    // 2) Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('Create / Update Variant Product', async ({ request }) => {
    // Build ProductService
    const productService = new ProductService(
      request,
      JSON.stringify({
        catalogId: '01HTNGGZ5K87AW0PYCMBBM0DDP', // Need to update to Dynamically fetched from token
        sandboxId: '01J54A3Q2R2C7V02337EFP16Z4', // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { name: tokenResponse.scope },
      }),
    )
    // 1. Create Varient Product

    //  variant product payload

    const createProductPayload = ProductPayloads.getCreateProduct()
    createProductPayload.productType = 'VARIANT_BASED'

    // Create the product
    const createdProduct = await productService.createProduct(accessToken, createProductPayload)
    console.log('Created product ID:', createdProduct.id)

    expect(createdProduct).toHaveProperty('id')
    expect(createdProduct.name).toBe(createProductPayload.name)
    expect(createdProduct.defaultPrice.amount).toBe(createProductPayload.defaultPrice.amount)

    // 2. update varient product

    const productId = createdProduct.id
    console.log('Created product ID:', productId)

    /* const updateVarientProductPayload=ProductPayloads.getUpdateVariantProduct()

   // await productService.overrideUpdatePayloadWithCreateValues(createProductPayload,updateVarientProductPayload)
    updateVarientProductPayload.id=productId

    // update the product
    const updatedProduct = await productService.updateVarientProduct(accessToken, updateVarientProductPayload,productId)

    console.log('Updated product ID:', updatedProduct.id)

    //assertions
    expect(updatedProduct).toHaveProperty('id')
    expect(updatedProduct.name).toBe(updateVarientProductPayload.name)
    expect(updatedProduct.sku).toBe(updateVarientProductPayload.sku)
    expect(updatedProduct.uri).toBe(updateVarientProductPayload.uri)

*/
    // 3. Create Variant

    await productService.changeContextHeader(
      JSON.stringify({
        catalogId: tokenResponse.catalog_id, // Dynamically fetched from token
        sandboxId: tokenResponse.sandbox_id, // Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          name: tokenResponse.scope,
          subContainerName: tokenResponse.sub_scope,
        },
      }),
    )

    //  variant product payload

    const variantPayload = ProductPayloads.getCreateVariant()
    variantPayload.sku = createProductPayload.sku

    // Create the product
    const createdVarient = await productService.createProduct(accessToken, variantPayload)
    console.log('Created product ID:', createdProduct.id)

    expect(createdVarient).toHaveProperty('id')
    expect(createdVarient.productId).toBe(productId)
    expect(createdVarient.optionValues.Color).toBe(variantPayload.optionValues.Color)
    expect(createdVarient.optionValues.sku).toBe(variantPayload.sku)
  })
})
