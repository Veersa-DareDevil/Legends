import { test, expect } from '@playwright/test'
import { CartService } from '@src/pageObject/api/realMadrid/cartService'
import authData from '@src/fixtures/api/authData.json'
import {
  CartPayloads,
  CartResponse,
  SearchResponse,
} from '@src/fixtures/api/realMadrid/cartPayload'

test.describe('Storefront || Cart Operations', () => {
  let cartService: CartService

  test.beforeEach(async ({ request }) => {
    cartService = new CartService(request)
  })

  test('Cart Shipping and Fulfillment', async () => {
    // Step 1: Search for products
    const searchBody = await cartService.searchProducts()
    const products = (searchBody as SearchResponse)?.content ?? []
    expect(products.length).toBeGreaterThan(0)

    // Step 2: Add product to cart with retry logic
    let cartVersion = authData.storefront.defaultVersion
    let guestToken = authData.storefront.defaultGuestToken
    let addResponse = await cartService.addItemToCart(cartVersion, guestToken)

    // Handle 409 conflict
    if (addResponse.statusCode === 409) {
      const addResponseBody = addResponse as CartResponse
      const newVersion =
        addResponseBody?.newCart?.cartItems?.[0]?.cartVersion || addResponseBody?.newCart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        addResponse = await cartService.addItemToCart(cartVersion, guestToken)
      }
    }

    // Handle 401 unauthorized
    if (addResponse.statusCode === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      addResponse = await cartService.addItemToCart(cartVersion, guestToken)
    }

    const addResponseBody = addResponse as CartResponse
    expect(addResponseBody.cart?.id).toBe(authData.storefront.cartId)

    // Update cart version
    cartVersion = addResponseBody?.cart?.version || cartVersion

    // Step 3 : update shipping address

    const shippingAddressPayloadOne = CartPayloads.generateAddressPayloadOne()

    let shippingResponse = await cartService.updateShippingAddress(
      authData.storefront.cartId,
      guestToken,
      cartVersion,
      shippingAddressPayloadOne,
    )

    // Handle 409 conflict
    if (shippingResponse.statusCode === 409) {
      const shippingResponseBody = shippingResponse
      const newVersion =
        shippingResponseBody?.newCart?.cartItems?.[0]?.cartVersion ||
        shippingResponseBody?.newCart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        shippingResponse = await cartService.updateShippingAddress(
          authData.storefront.cartId,
          guestToken,
          cartVersion,
          shippingAddressPayloadOne,
        )
      }
    }

    // Handle 401 unauthorized
    if (shippingResponse.statusCode === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      shippingResponse = await cartService.updateShippingAddress(
        authData.storefront.cartId,
        guestToken,
        cartVersion,
        shippingAddressPayloadOne,
      )
    }

    expect(shippingResponse.fulfillmentGroups[0].address.country).toBe(
      shippingAddressPayloadOne.country,
    )
    expect(shippingResponse.fulfillmentGroups[0].address.city).toBe(shippingAddressPayloadOne.city)
    expect(shippingResponse.fulfillmentGroups[0].address.stateProvinceRegion).toBe(
      shippingAddressPayloadOne.stateProvinceRegion,
    )
    expect(shippingResponse.fulfillmentGroups[0].address.postalCode).toBe(
      shippingAddressPayloadOne.postalCode,
    )

    // Step 4 : fetch fulfillment options

    const fulfillmentResponse = await cartService.getFulfillmentOptions(authData.storefront.cartId)
    const firstKeyOfGroupFulfillment = Object.keys(fulfillmentResponse.groupFulfillmentOptions)[0]
    const fulfillmentData = fulfillmentResponse.groupFulfillmentOptions[firstKeyOfGroupFulfillment]

    expect(fulfillmentData.length).toBeGreaterThan(0)
    expect(fulfillmentData[0]).toHaveProperty('fulfillmentType')
    expect(fulfillmentData[0]).toHaveProperty('serviceLevel')

    const firstOptionPrice = fulfillmentData[0].price.amount

    // Update cart version
    cartVersion = shippingResponse?.cartItems[0]?.cartVersion || cartVersion

    // Step 5 : update shipping address Again

    const shippingAddressPayloadTwo = CartPayloads.generateAddressPayloadTwo()

    let shippingResponseTwo = await cartService.updateShippingAddress(
      authData.storefront.cartId,
      guestToken,
      cartVersion,
      shippingAddressPayloadTwo,
    )

    // Handle 409 conflict
    if (shippingResponseTwo.statusCode === 409) {
      const shippingResponseBodyTwo = shippingResponseTwo
      const newVersion =
        shippingResponseBodyTwo?.newCart?.cartItems?.[0]?.cartVersion ||
        shippingResponseBodyTwo?.newCart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        shippingResponseTwo = await cartService.updateShippingAddress(
          authData.storefront.cartId,
          guestToken,
          cartVersion,
          shippingAddressPayloadTwo,
        )
      }
    }

    // Handle 401 unauthorized
    if (shippingResponseTwo.statusCode === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      shippingResponseTwo = await cartService.updateShippingAddress(
        authData.storefront.cartId,
        guestToken,
        cartVersion,
        shippingAddressPayloadTwo,
      )
    }

    expect(shippingResponseTwo.fulfillmentGroups[0].address.country).toBe(
      shippingAddressPayloadTwo.country,
    )
    expect(shippingResponseTwo.fulfillmentGroups[0].address.city).toBe(
      shippingAddressPayloadTwo.city,
    )
    expect(shippingResponseTwo.fulfillmentGroups[0].address.stateProvinceRegion).toBe(
      shippingAddressPayloadTwo.stateProvinceRegion,
    )
    expect(shippingResponseTwo.fulfillmentGroups[0].address.postalCode).toBe(
      shippingAddressPayloadTwo.postalCode,
    )

    // Step 6 : fetch fulfillment options Again

    const fulfillmentResponseTwo = await cartService.getFulfillmentOptions(
      authData.storefront.cartId,
    )
    const firstKeyOfGroupFulfillmentTwo = Object.keys(
      fulfillmentResponseTwo.groupFulfillmentOptions,
    )[0]
    const fulfillmentDataTwo =
      fulfillmentResponseTwo.groupFulfillmentOptions[firstKeyOfGroupFulfillmentTwo]

    expect(fulfillmentDataTwo.length).toBeGreaterThan(0)
    expect(fulfillmentDataTwo[0]).toHaveProperty('fulfillmentType')
    expect(fulfillmentDataTwo[0]).toHaveProperty('serviceLevel')

    const firstOptionPriceTwo = fulfillmentDataTwo[0].price.amount

    // check the price changes with change in fulfillment options

    expect(firstOptionPrice).not.toBe(firstOptionPriceTwo)

    // Step 7: Select Fulfillment option

    // Update cart version
    cartVersion = shippingResponseTwo?.cartItems[0]?.cartVersion || cartVersion

    //payload
    const selectFulfillmentPayload = fulfillmentDataTwo[0]

    //response
    let selectFulfillmentResponse = await cartService.selectFulfillmentOption(
      authData.storefront.cartId,
      cartVersion,
      selectFulfillmentPayload,
    )

    // Handle 409 conflict
    if (selectFulfillmentResponse.statusCode === 409) {
      const selectFulfillmentResponseBody = selectFulfillmentResponse
      const newVersion =
        selectFulfillmentResponseBody?.newCart?.cartItems?.[0]?.cartVersion ||
        selectFulfillmentResponseBody?.newCart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        selectFulfillmentResponse = await cartService.selectFulfillmentOption(
          authData.storefront.cartId,
          cartVersion,
          selectFulfillmentPayload,
        )
      }
    }

    // Handle 401 unauthorized
    if (selectFulfillmentResponse.statusCode === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      selectFulfillmentResponse = await cartService.selectFulfillmentOption(
        authData.storefront.cartId,
        cartVersion,
        selectFulfillmentPayload,
      )
    }

    const checkFulfillment =
      selectFulfillmentResponse.cart.fulfillmentGroups[0].pricedFulfillmentOption

    //assertions
    expect(checkFulfillment.serviceLevel).toBe(selectFulfillmentPayload.serviceLevel)
    expect(checkFulfillment.fulfillmentType).toBe(selectFulfillmentPayload.fulfillmentType)
    expect(checkFulfillment.fulfillmentReference).toBe(
      selectFulfillmentPayload.fulfillmentReference,
    )
  })
})
