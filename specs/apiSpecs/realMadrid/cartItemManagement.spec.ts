import { test, expect } from '@playwright/test'
import { CartService } from '@src/pageObject/api/realMadrid/cartService'
import authData from '@src/fixtures/api/authData.json'
import { CartItem, CartResponse, SearchResponse } from '@src/fixtures/api/realMadrid/cartPayload'

test.describe('Storefront || Cart Operations', () => {
  let cartService: CartService

  test.beforeEach(async ({ request }) => {
    cartService = new CartService(request)
  })

  test('Cart Flow: Search, Add, Update, Delete', async () => {
    // Step 1: Search for products
    const searchBody = await cartService.searchProducts()
    const products = (searchBody as SearchResponse)?.content ?? []
    expect(products.length).toBeGreaterThan(0)
    const firstProductId = products[0]?.id
    console.log('First product ID from catalog search:', firstProductId)

    // Step 2: Add product to cart with retry logic
    let cartVersion = authData.storefront.defaultVersion
    let guestToken = authData.storefront.defaultGuestToken
    let addBody = await cartService.addItemToCart(cartVersion, guestToken)

    // Handle 409 conflict
    if (addBody.statusCode === 409) {
      const addResponseBody = addBody as CartResponse
      const newVersion =
        addResponseBody?.newCart?.cartItems?.[0]?.cartVersion || addResponseBody?.newCart?.version
      if (typeof newVersion === 'number') {
        console.log(`409 Conflict – retrying with updated cart version: ${newVersion}`)
        cartVersion = newVersion
        addBody = await cartService.addItemToCart(cartVersion, guestToken)
      }
    }

    // Handle 401 unauthorized
    if (addBody.statusCode === 401) {
      console.log('401 Unauthorized – refreshing guest token and retrying…')
      guestToken = await cartService.refreshGuestToken(cartVersion)
      addBody = await cartService.addItemToCart(cartVersion, guestToken)
    }

    const addResponseBody = addBody as CartResponse
    console.log(addResponseBody)
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

    // Step 4: Update cart item quantity
    const newQuantity = 2
    let updateBody = await cartService.updateCartItemQuantity(
      cartItemId,
      newQuantity,
      cartVersion,
      guestToken,
    )

    // Handle conflicts and unauthorized responses for update
    if (updateBody.status === 409) {
      const updateResponseBody = updateBody as CartResponse
      const newVersion = updateResponseBody?.newCart?.version || updateResponseBody?.cart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        updateBody = await cartService.updateCartItemQuantity(
          cartItemId,
          newQuantity,
          cartVersion,
          guestToken,
        )
      }
    }

    if (updateBody.status === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      updateBody = await cartService.updateCartItemQuantity(
        cartItemId,
        newQuantity,
        cartVersion,
        guestToken,
      )
    }

    console.log(`Cart item quantity successfully updated to ${newQuantity}`)

    // Update cart version
    const updateResponseBody = updateBody as CartResponse
    cartVersion = updateResponseBody?.cart?.version || cartVersion

    // Step 5: Delete item from cart
    let deleteBody = await cartService.deleteItemFromCart(cartItemId, cartVersion, guestToken)

    // Handle conflicts and unauthorized responses for delete
    if (deleteBody.status === 409) {
      const deleteResponseBody = deleteBody as CartResponse
      const newVersion = deleteResponseBody?.newCart?.version || deleteResponseBody?.cart?.version
      if (typeof newVersion === 'number') {
        cartVersion = newVersion
        deleteBody = await cartService.deleteItemFromCart(cartItemId, cartVersion, guestToken)
      }
    }

    if (deleteBody.status === 401) {
      guestToken = await cartService.refreshGuestToken(cartVersion)
      deleteBody = await cartService.deleteItemFromCart(cartItemId, cartVersion, guestToken)
    }

    console.log('Item successfully deleted from cart')

    // Verify item was removed
    const deleteResponseBody = deleteBody as CartResponse
    const remainingCartItems =
      deleteResponseBody?.cart?.cartItems || deleteResponseBody?.cartItems || []
    const itemStillExists = remainingCartItems.some((item: CartItem) => item.id === cartItemId)
    expect(itemStillExists).toBeFalsy()
    console.log('Verified item was removed from cart')
  })
})
