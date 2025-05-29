//This file is under progress , kindly skip this for now

import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import { ProductService } from '@src/pageObject/api/realMadrid/productService'
import { ProductPayloads } from '@src/fixtures/api/realMadrid/productPayload'

import authData from '@src/fixtures/api/authData.json'
import { CommonFunctions } from '@src/pageObject/api/commonFunctions'

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
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
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

    expect(createdProduct).toHaveProperty('id')
    expect(createdProduct.name).toBe(createProductPayload.name)
    expect(createdProduct.defaultPrice.amount).toBe(createProductPayload.defaultPrice.amount)

    // 2. update varient product

    const productId = createdProduct.id

    await productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: { id: productId, name: tokenResponse.scope },
      }),
    )

    //update payload

    const optionId = CommonFunctions.generateCustomId()
    const optionPayload = ProductPayloads.getOptionsPayload()

    optionPayload.id = optionId

    const updateVarientProductPayload = {
      ...createProductPayload,
      id: productId,
      options: [optionPayload],
    }

    // update the product
    const updatedProduct = await productService.updateVarientProduct(
      accessToken,
      updateVarientProductPayload,
      productId,
    )

    //assertions
    expect(updatedProduct).toHaveProperty('id')
    expect(updatedProduct.name).toBe(updateVarientProductPayload.name)
    expect(updatedProduct.sku).toBe(updateVarientProductPayload.sku)
    expect(updatedProduct.uri).toBe(updateVarientProductPayload.uri)

    // 3. Create Variant

    await productService.changeContextHeader(
      JSON.stringify({
        catalogId: authData.catalogId, // Need to update to Dynamically fetched from token
        sandboxId: authData.sandboxId, // Need to Update to Dynamically fetched from token
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
        changeContainer: {
          id: productId,
          name: tokenResponse.scope,
          subContainerName: tokenResponse.sub_scope,
        },
      }),
    )

    //  variant payload

    const variantPayload = ProductPayloads.getCreateVariant(
      optionPayload.attributeChoice.allowedValues[0].value,
    )
    variantPayload.sku = createProductPayload.sku

    // Create the variant
    const createdVarient = await productService.createVariant(
      accessToken,
      variantPayload,
      productId,
    )

    expect(createdVarient).toHaveProperty('id')
    expect(createdVarient.productId).toBe(productId)
    expect(createdVarient.optionValues.size).toBe(variantPayload.optionValues.size)
    expect(createdVarient.sku).toBe(variantPayload.sku)

    //4) create remaining variants

    for (let i = 1; i < optionPayload.attributeChoice.allowedValues.length; i++) {
      const remainigVariantPayload = ProductPayloads.getCreateVariant(
        optionPayload.attributeChoice.allowedValues[1].value,
      )
      const remainingCreatedVarient = await productService.createVariant(
        accessToken,
        remainigVariantPayload,
        productId,
      )

      expect(remainingCreatedVarient).toHaveProperty('id')
      expect(remainingCreatedVarient.productId).toBe(productId)
      expect(remainingCreatedVarient.optionValues.size).toBe(
        remainigVariantPayload.optionValues.size,
      )
      expect(remainingCreatedVarient.sku).toBe(remainigVariantPayload.sku)
    }
  })
})
