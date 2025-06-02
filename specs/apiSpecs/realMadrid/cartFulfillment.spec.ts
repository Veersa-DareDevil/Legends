import { test, expect } from '@playwright/test'
import { CartService } from '@src/pageObject/api/realMadrid/cartService'
import authData from '@src/fixtures/api/authData.json'
import { CartItem, CartPayloads, CartResponse, SearchResponse } from '@src/fixtures/api/realMadrid/cartPayload'

test.describe('Storefront || Cart Operations', () => {
  let cartService: CartService

  test.beforeEach(async ({ request }) => {
    cartService = new CartService(request)
  })

  test('Cart Shipping anf Fulfillment', async () => {
    // Step 1: Search for products
    const searchBody = await cartService.searchProducts()
    const products = (searchBody as SearchResponse)?.content ?? []
    expect(products.length).toBeGreaterThan(0)
    const firstProductId = products[0]?.id
    console.log('First product ID from catalog search:', firstProductId)

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
        console.log(`409 Conflict – retrying with updated cart version: ${newVersion}`)
        cartVersion = newVersion
        addResponse = await cartService.addItemToCart(cartVersion, guestToken)
      }
    }

    // Handle 401 unauthorized
    if (addResponse.statusCode === 401) {
      console.log('401 Unauthorized – refreshing guest token and retrying…')
      guestToken = await cartService.refreshGuestToken(cartVersion)
      addResponse = await cartService.addItemToCart(cartVersion, guestToken)
    }

    const addResponseBody = addResponse as CartResponse
    expect(addResponseBody.cart?.id).toBe(authData.storefront.cartId)
    console.log(`Item successfully added to cart (version: ${cartVersion})`)

    // Step 3: Extract cart item ID
    let cartItems: CartItem[] = []
    let cartItemId: string

    if (addResponseBody?.cartItems && addResponseBody.cartItems.length > 0) {
      cartItems = addResponseBody.cartItems
    } else if (addResponseBody?.cart?.cartItems && addResponseBody.cart.cartItems.length > 0) {
      cartItems = addResponseBody.cart.cartItems
    }

    expect(cartItems.length).toBeGreaterThan(0)
    cartItemId = cartItems[0]?.id
    console.log('Cart item ID extracted:', cartItemId)

    // Update cart version
    cartVersion = addResponseBody?.cart?.version || cartVersion

    // Step 4 : update shipping address 

    const shippingAddressPayloadOne=CartPayloads.generateAddressPayloadOne()

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
        shippingResponseBody?.newCart?.cartItems?.[0]?.cartVersion || addResponseBody?.newCart?.version
      if (typeof newVersion === 'number') {
        console.log(`409 Conflict – retrying with updated cart version: ${newVersion}`)
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
      console.log('401 Unauthorized – refreshing guest token and retrying…')
      guestToken = await cartService.refreshGuestToken(cartVersion)
      shippingResponse = await cartService.updateShippingAddress(
    authData.storefront.cartId,
    guestToken,
    cartVersion,
    shippingAddressPayloadOne
  )
    }

    console.log('Shipping address update response:', shippingResponse)

  
  expect(shippingResponse.fulfillmentGroups[0].address.country).toBe(shippingAddressPayloadOne.country)
expect(shippingResponse.fulfillmentGroups[0].address.city).toBe(shippingAddressPayloadOne.city)
expect(shippingResponse.fulfillmentGroups[0].address.stateProvinceRegion).toBe(shippingAddressPayloadOne.stateProvinceRegion)
expect(shippingResponse.fulfillmentGroups[0].address.postalCode).toBe(shippingAddressPayloadOne.postalCode)

// Step 4 : fetch fulfillment options

const fulfillmentResponse = await cartService.getFulfillmentOptions(authData.storefront.cartId)
  console.log('Fulfillment options response:', fulfillmentResponse)
  const firstKeyOfGroupFulfillment = Object.keys(fulfillmentResponse.groupFulfillmentOptions)[0];
const fulfillmentData = fulfillmentResponse.groupFulfillmentOptions[firstKeyOfGroupFulfillment];

  expect(fulfillmentData.length).toBeGreaterThan(0)
  expect(fulfillmentData[0]).toHaveProperty('fulfillmentType')
  expect(fulfillmentData[0]).toHaveProperty('serviceLevel')

  const firstOptionPrice=fulfillmentData[0].price.amount
  const firstOptionMinDays=fulfillmentData[0].estimatedMinDaysToFulfill

  console.log(firstOptionPrice)

   
    
  })
})
