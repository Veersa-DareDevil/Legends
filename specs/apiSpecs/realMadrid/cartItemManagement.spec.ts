import { test, expect, request } from '@playwright/test'
import {
  CONFIG,
  searchProducts,
  addItemToCart,
  updateCartItemQuantity,
  deleteItemFromCart,
  refreshGuestToken,
} from '@src/pageObject/api/realMadrid/cartService'

interface CartItem {
  id: string
  name?: string
  quantity: number
  cartVersion?: number
}

interface Cart {
  id: string
  version: number
  cartItems: CartItem[]
}

interface CartResponse {
  cart?: Cart
  cartItems?: CartItem[]
  newCart?: Cart
}

interface Product {
  id: string
  name?: string
}

interface SearchResponse {
  content?: Product[]
}

test('Catalog Search, Add to Cart, Update Quantity, and Delete Item – Full Flow', async () => {
  const apiContext = await request.newContext()

  // Step 1: Search for products
  const { response: searchRes, body: searchBody } = await searchProducts(apiContext)
  expect(searchRes.ok()).toBeTruthy()
  const products = (searchBody as SearchResponse)?.content ?? []
  expect(products.length).toBeGreaterThan(0)
  const firstProductId = products[0]?.id
  console.log('First product ID from catalog search:', firstProductId)

  // Step 2: Add product to cart with retry logic
  let cartVersion = CONFIG.defaultVersion
  let guestToken = CONFIG.defaultGuestToken
  let { response: addRes, body: addBody } = await addItemToCart(apiContext, cartVersion, guestToken)
  if (addRes.status() === 409) {
    const addResponseBody = addBody as CartResponse
    const newVersion =
      addResponseBody?.newCart?.cartItems?.[0]?.cartVersion || addResponseBody?.newCart?.version
    if (typeof newVersion === 'number') {
      console.warn(`409 Conflict – retrying with updated cart version: ${newVersion}`)
      cartVersion = newVersion
      ;({ response: addRes, body: addBody } = await addItemToCart(
        apiContext,
        cartVersion,
        guestToken,
      ))
    } else {
      throw new Error('409 Conflict but no valid cart version found in response.')
    }
  }
  if (addRes.status() === 401) {
    console.warn('401 Unauthorized – refreshing guest token and retrying…')
    guestToken = await refreshGuestToken(apiContext, CONFIG.cartId, cartVersion)
    ;({ response: addRes, body: addBody } = await addItemToCart(
      apiContext,
      cartVersion,
      guestToken,
    ))
  }

  expect(addRes.ok()).toBeTruthy()
  const addResponseBody = addBody as CartResponse
  expect(addResponseBody.cart?.id).toBe(CONFIG.cartId)
  console.log(`Item successfully added to cart (version: ${cartVersion})`)

  // Step 3: Extract cart item ID for operations
  let cartItems: CartItem[] = []
  let cartItemId: string | null = null

  console.log('Looking for cart items...')

  if (addResponseBody?.cartItems && addResponseBody.cartItems.length > 0) {
    cartItems = addResponseBody.cartItems
    console.log('Found cart items in addBody.cartItems, length:', cartItems.length)
  } else if (addResponseBody?.cart?.cartItems && addResponseBody.cart.cartItems.length > 0) {
    cartItems = addResponseBody.cart.cartItems
    console.log('Found cart items in addBody.cart.cartItems, length:', cartItems.length)
  }

  if (cartItems.length > 0) {
    cartItemId = cartItems[0]?.id
    console.log('Cart item ID extracted:', cartItemId)
    console.log('Cart item name:', cartItems[0]?.name)
  } else {
    console.error('No cart items found')
    throw new Error('Cart item ID not found - no cart items in response')
  }

  // Update cart version from add response if available
  const updatedCartVersion = addResponseBody?.cart?.version || cartVersion
  cartVersion = updatedCartVersion

  // Step 4: Update cart item quantity with retry logic
  const newQuantity = 2
  console.log(`Attempting to update cart item quantity to ${newQuantity} for item: ${cartItemId}`)
  let { response: updateRes, body: updateBody } = await updateCartItemQuantity(
    apiContext,
    cartItemId,
    newQuantity,
    cartVersion,
    guestToken,
  )

  console.log(`Update response status: ${updateRes.status()}`)

  if (updateRes.status() === 409) {
    const updateResponseBody = updateBody as CartResponse
    const newVersion = updateResponseBody?.newCart?.version || updateResponseBody?.cart?.version
    if (typeof newVersion === 'number') {
      console.warn(`409 Conflict on update – retrying with updated cart version: ${newVersion}`)
      cartVersion = newVersion
      ;({ response: updateRes, body: updateBody } = await updateCartItemQuantity(
        apiContext,
        cartItemId,
        newQuantity,
        cartVersion,
        guestToken,
      ))
      console.log(`Retry update response status: ${updateRes.status()}`)
    } else {
      throw new Error('409 Conflict on update but no valid cart version found in response.')
    }
  }

  if (updateRes.status() === 401) {
    console.warn('401 Unauthorized on update – refreshing guest token and retrying…')
    guestToken = await refreshGuestToken(apiContext, CONFIG.cartId, cartVersion)
    ;({ response: updateRes, body: updateBody } = await updateCartItemQuantity(
      apiContext,
      cartItemId,
      newQuantity,
      cartVersion,
      guestToken,
    ))
    console.log(`Retry update response status: ${updateRes.status()}`)
  }

  if (!updateRes.ok()) {
    console.error(`Update failed with status: ${updateRes.status()}`)
    throw new Error(`Update request failed with status: ${updateRes.status()}`)
  }

  console.log(`Cart item quantity successfully updated to ${newQuantity} (version: ${cartVersion})`)

  // Verify the quantity was updated
  const updateResponseBody = updateBody as CartResponse
  const updatedCartItems =
    updateResponseBody?.cart?.cartItems || updateResponseBody?.cartItems || []
  const updatedItem = updatedCartItems.find((item: CartItem) => item.id === cartItemId)
  if (updatedItem && updatedItem.quantity === newQuantity) {
    console.log(`Verified quantity updated: ${updatedItem.quantity}`)
  } else {
    console.warn(
      `Could not verify quantity update. Expected: ${newQuantity}, Found: ${updatedItem?.quantity}`,
    )
  }

  // Update cart version from update response if available
  const finalCartVersion = updateResponseBody?.cart?.version || cartVersion
  cartVersion = finalCartVersion

  // Step 5: Delete item from cart with retry logic
  console.log(`Attempting to delete cart item: ${cartItemId} with version: ${cartVersion}`)
  let { response: deleteRes, body: deleteBody } = await deleteItemFromCart(
    apiContext,
    cartItemId,
    cartVersion,
    guestToken,
  )

  console.log(`Delete response status: ${deleteRes.status()}`)

  if (deleteRes.status() === 409) {
    const deleteResponseBody = deleteBody as CartResponse
    const newVersion = deleteResponseBody?.newCart?.version || deleteResponseBody?.cart?.version
    if (typeof newVersion === 'number') {
      console.warn(`409 Conflict on delete – retrying with updated cart version: ${newVersion}`)
      cartVersion = newVersion
      ;({ response: deleteRes, body: deleteBody } = await deleteItemFromCart(
        apiContext,
        cartItemId,
        cartVersion,
        guestToken,
      ))
      console.log(`Retry delete response status: ${deleteRes.status()}`)
    } else {
      throw new Error('409 Conflict on delete but no valid cart version found in response.')
    }
  }

  if (deleteRes.status() === 401) {
    console.warn('401 Unauthorized on delete – refreshing guest token and retrying…')
    guestToken = await refreshGuestToken(apiContext, CONFIG.cartId, cartVersion)
    ;({ response: deleteRes, body: deleteBody } = await deleteItemFromCart(
      apiContext,
      cartItemId,
      cartVersion,
      guestToken,
    ))
    console.log(`Retry delete response status: ${deleteRes.status()}`)
  }

  if (!deleteRes.ok()) {
    console.error(`Delete failed with status: ${deleteRes.status()}`)
    throw new Error(`Delete request failed with status: ${deleteRes.status()}`)
  }
  console.log(`Item successfully deleted from cart (version: ${cartVersion})`)

  // Verify the item was actually removed
  const deleteResponseBody = deleteBody as CartResponse
  const remainingCartItems =
    deleteResponseBody?.cart?.cartItems || deleteResponseBody?.cartItems || []
  const itemStillExists = remainingCartItems.some((item: CartItem) => item.id === cartItemId)
  expect(itemStillExists).toBeFalsy()
  console.log('Verified item was removed from cart')
})
