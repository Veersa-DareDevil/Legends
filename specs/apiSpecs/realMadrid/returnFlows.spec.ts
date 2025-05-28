import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'
import authData from '@src/fixtures/api/authData.json'
import { OrderService } from '@src/pageObject/api/realMadrid/orderService'
import { QueryParams } from '@src/fixtures/api/realMadrid/queryParameters'
import {
  AdditionalConfirmRequest,
  CancelReturnItem,
  OrderPayloads,
  ReturnItem,
} from '@src/fixtures/api/realMadrid/orderPayload'

test.describe('Admin Portal || Orders || Fullfillment || Return Flows', () => {
  let accessToken: string
  let tokenResponse: { [key: string]: string }

  test.beforeEach(async ({ browser, request }) => {
    // Initialize AuthService
    const auth = new AuthService(browser, request, authData.orderFulfillmentViewScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()
  })

  test('POST API: Fulfill an order', async ({ browser, request }) => {
    // 1) Search Orderers

    //prepare context header
    const contextHeader = JSON.stringify({
      tenantId: tokenResponse.tenant_id,
      applicationId: tokenResponse.application_ids[0],
      customerContextId: tokenResponse.customer_context_ids[0],
      changeContainer: {},
    })

    // build order service
    const orderService = new OrderService(request, contextHeader)

    //get search results
    const searchResult = await orderService.searchOrderFulfillment(
      accessToken,
      QueryParams.newFullfillmentOrders,
    )

    // assertion
    expect(Array.isArray(searchResult.content || searchResult.orders)).toBeTruthy()

    const firstOrderId = searchResult.content[0].id

    // 2) Get Order Details for Fullfillment (first order in new)

    const orderDetails = await orderService.getOrderDetailForFullfillment(accessToken, firstOrderId)
    

    //assertions
    expect(orderDetails).toHaveProperty('id', firstOrderId)
    expect(orderDetails.fulfillmentItems[0].id).toBeDefined()
    expect(orderDetails.fulfillmentItems[0].quantity).toBeDefined()

    // 3) Fullfill Order

    // Initialize AuthService
    const auth = new AuthService(browser, request, authData.orderFulfillmentScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare fulfillment payload
    const items: Record<string, number> = {}

    for (let i = 0; i < orderDetails.fulfillmentItems.length; i++) {
      const item = orderDetails.fulfillmentItems[i]
      items[item.id] = item.quantity
    }
    const changeStatusPayload = OrderPayloads.updateFulfillmentStatus(orderDetails.id, items)

    //fulfill order
    const changeStatusResponse = await orderService.changeFulfillmentStatus(
      accessToken,
      changeStatusPayload,
    )

    // Basic assertion
    expect(changeStatusPayload).toHaveProperty('status', 'FULFILLED')
    expect(changeStatusResponse.id).toBe(firstOrderId)
  })

  test('POST API: Create a return for the order', async ({ browser, request }) => {
    // 1) Search Orderers

    //prepare context header
    const contextHeader = JSON.stringify({
      tenantId: tokenResponse.tenant_id,
      applicationId: tokenResponse.application_ids[0],
      customerContextId: tokenResponse.customer_context_ids[0],
      changeContainer: {},
    })

    // build order service
    const orderService = new OrderService(request, contextHeader)

    //get search results
    const searchResult = await orderService.searchOrderFulfillment(
      accessToken,
      QueryParams.newFullfillmentOrders,
    )

    // assertion
    expect(Array.isArray(searchResult.content || searchResult.orders)).toBeTruthy()

    const firstOrderId = searchResult.content[0].id

    // 2) Get Order Details for Fullfillment (first order in new)

    const orderDetails = await orderService.getOrderDetailForFullfillment(accessToken, firstOrderId)

    //assertions
    expect(orderDetails).toHaveProperty('id', firstOrderId)
    expect(orderDetails.fulfillmentItems[0].id).toBeDefined()
    expect(orderDetails.fulfillmentItems[0].quantity).toBeDefined()

    // 3) Fullfill Order

    // Initialize AuthService
    let auth = new AuthService(browser, request, authData.orderFulfillmentScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare fulfillment payload
    const fulfillmentItems: Record<string, number> = {}

    for (let i = 0; i < orderDetails.fulfillmentItems.length; i++) {
      const item = orderDetails.fulfillmentItems[i]
      fulfillmentItems[item.id] = item.quantity
    }
    const changeStatusPayload = OrderPayloads.updateFulfillmentStatus(
      orderDetails.id,
      fulfillmentItems,
    )

    //fulfill orders
    const changeStatusResponse = await orderService.changeFulfillmentStatus(
      accessToken,
      changeStatusPayload,
    )

    // Basic assertion
    expect(changeStatusPayload).toHaveProperty('status', 'FULFILLED')
    expect(changeStatusResponse.id).toBe(firstOrderId)

    // 4) Return the Order

    // Initialize AuthService
    auth = new AuthService(browser, request, authData.returnScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare return payload

    const returnItems: ReturnItem[] = []

    for (const item of orderDetails.fulfillmentItems) {
      returnItems.push(new ReturnItem(item.id, item.quantity))
    }

    const returnPayload = { items: returnItems }

    //create return
    const createReturnResponse = await orderService.createReturn(
      accessToken,
      returnPayload,
      orderDetails.orderId,
    )

    // assertion
    expect(createReturnResponse).toHaveProperty('status', 'PENDING')
    expect(createReturnResponse.orderId).toBe(orderDetails.orderId)
    expect(createReturnResponse.items.length).toBe(returnItems.length)
  })

  test('POST API: Cancel return for the order', async ({ browser, request }) => {
    // 1) Search Orderers

    //prepare context header
    const contextHeader = JSON.stringify({
      tenantId: tokenResponse.tenant_id,
      applicationId: tokenResponse.application_ids[0],
      customerContextId: tokenResponse.customer_context_ids[0],
      changeContainer: {},
    })

    // build order service
    const orderService = new OrderService(request, contextHeader)

    //get search results
    const searchResult = await orderService.searchOrderFulfillment(
      accessToken,
      QueryParams.newFullfillmentOrders,
    )

    // assertion
    expect(Array.isArray(searchResult.content || searchResult.orders)).toBeTruthy()

    const firstOrderId = searchResult.content[0].id

    // 2) Get Order Details for Fullfillment (first order in new)

    const orderDetails = await orderService.getOrderDetailForFullfillment(accessToken, firstOrderId)

    //assertions
    expect(orderDetails).toHaveProperty('id', firstOrderId)
    expect(orderDetails.fulfillmentItems[0].id).toBeDefined()
    expect(orderDetails.fulfillmentItems[0].quantity).toBeDefined()

    // 3) Fullfill Order

    // Initialize AuthService
    let auth = new AuthService(browser, request, authData.orderFulfillmentScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare fulfillment payload
    const fulfillmentItems: Record<string, number> = {}

    for (let i = 0; i < orderDetails.fulfillmentItems.length; i++) {
      const item = orderDetails.fulfillmentItems[i]
      fulfillmentItems[item.id] = item.quantity
    }
    const changeStatusPayload = OrderPayloads.updateFulfillmentStatus(
      orderDetails.id,
      fulfillmentItems,
    )

    //fulfill orders
    const changeStatusResponse = await orderService.changeFulfillmentStatus(
      accessToken,
      changeStatusPayload,
    )

    // Basic assertion
    expect(changeStatusPayload).toHaveProperty('status', 'FULFILLED')
    expect(changeStatusResponse.id).toBe(firstOrderId)

    // 4) Return the Order

    // Initialize AuthService
    auth = new AuthService(browser, request, authData.returnScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare return payload

    const returnItems: ReturnItem[] = []

    for (const item of orderDetails.fulfillmentItems) {
      returnItems.push(new ReturnItem(item.id, item.quantity))
    }

    const returnPayload = { items: returnItems }

    //create return
    const createReturnResponse = await orderService.createReturn(
      accessToken,
      returnPayload,
      orderDetails.orderId,
    )

    // assertion
    expect(createReturnResponse).toHaveProperty('status', 'PENDING')
    expect(createReturnResponse.orderId).toBe(orderDetails.orderId)
    expect(createReturnResponse.items.length).toBe(returnItems.length)

    //5) Cancel Return

    //prepare cancel payload

    const cancelItems: CancelReturnItem[] = []

    for (const item of orderDetails.fulfillmentItems) {
      cancelItems.push(new CancelReturnItem(item.id, item.quantity))
    }

    const cancelPayload = { items: returnItems, returnAuthorizationId: createReturnResponse.id }

    //cancel return response
    const cancelReturnResponse = await orderService.cancelReturn(
      accessToken,
      cancelPayload,
      createReturnResponse.orderId,
    )

    // assertion
    expect(cancelReturnResponse[0]).toHaveProperty('status', 'CANCELLED')
    expect(cancelReturnResponse[0].orderId).toBe(createReturnResponse.orderId)
    expect(cancelReturnResponse[0].items.length).toBe(cancelItems.length)
  })

  test('POST API: Confirm return for the order', async ({ browser, request }) => {
    // 1) Search Orderers

    //prepare context header
    const contextHeader = JSON.stringify({
      tenantId: tokenResponse.tenant_id,
      applicationId: tokenResponse.application_ids[0],
      customerContextId: tokenResponse.customer_context_ids[0],
      changeContainer: {},
    })

    // build order service
    const orderService = new OrderService(request, contextHeader)

    //get search results
    const searchResult = await orderService.searchOrderFulfillment(
      accessToken,
      QueryParams.newFullfillmentOrders,
    )

    // assertion
    expect(Array.isArray(searchResult.content || searchResult.orders)).toBeTruthy()

    const firstOrderId = searchResult.content[0].id

    // 2) Get Order Details for Fullfillment (first order in new)

    const orderDetails = await orderService.getOrderDetailForFullfillment(accessToken, firstOrderId)

    //assertions
    expect(orderDetails).toHaveProperty('id', firstOrderId)
    expect(orderDetails.fulfillmentItems[0].id).toBeDefined()
    expect(orderDetails.fulfillmentItems[0].quantity).toBeDefined()

    // 3) Fullfill Order

    // Initialize AuthService
    let auth = new AuthService(browser, request, authData.orderFulfillmentScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare fulfillment payload
    const fulfillmentItems: Record<string, number> = {}

    for (let i = 0; i < orderDetails.fulfillmentItems.length; i++) {
      const item = orderDetails.fulfillmentItems[i]
      fulfillmentItems[item.id] = item.quantity
    }
    const changeStatusPayload = OrderPayloads.updateFulfillmentStatus(
      orderDetails.id,
      fulfillmentItems,
    )

    //fulfill orders
    const changeStatusResponse = await orderService.changeFulfillmentStatus(
      accessToken,
      changeStatusPayload,
    )

    // Basic assertion
    expect(changeStatusPayload).toHaveProperty('status', 'FULFILLED')
    expect(changeStatusResponse.id).toBe(firstOrderId)

    // 4) Return the Order

    // Initialize AuthService
    auth = new AuthService(browser, request, authData.returnScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

    await orderService.changeContextHeader(
      JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0],
      }),
    )

    //prepare return payload

    const returnItems: ReturnItem[] = []

    for (const item of orderDetails.fulfillmentItems) {
      returnItems.push(new ReturnItem(item.id, item.quantity))
    }

    const returnPayload = { items: returnItems }

    //create return
    const createReturnResponse = await orderService.createReturn(
      accessToken,
      returnPayload,
      orderDetails.orderId,
    )

    // assertion
    expect(createReturnResponse).toHaveProperty('status', 'PENDING')
    expect(createReturnResponse.orderId).toBe(orderDetails.orderId)
    expect(createReturnResponse.items.length).toBe(returnItems.length)

    //5) Confirm Return

    //prepare confirm payload

    const confirmItems: CancelReturnItem[] = []
    const additionalConfirmRequest: AdditionalConfirmRequest[] = []

    for (const item of orderDetails.fulfillmentItems) {
      confirmItems.push(new CancelReturnItem(item.id, item.quantity))
    }

    for (const item of orderDetails.fulfillmentItems) {
      additionalConfirmRequest.push(new AdditionalConfirmRequest(item.id))
    }

    const confirmPayload = {
      items: returnItems,
      additionalConfirmReturnItemRequests: additionalConfirmRequest,
      returnAuthorizationId: createReturnResponse.id,
      sendNotification: true,
    }

    //confirm return response
    const confirmReturnResponse = await orderService.confirmReturn(
      accessToken,
      confirmPayload,
      createReturnResponse.orderId,
    )

    // assertion
    expect(confirmReturnResponse).toHaveProperty('status', 'CONFIRMED')
    expect(confirmReturnResponse.orderId).toBe(createReturnResponse.orderId)
    expect(confirmReturnResponse.items.length).toBe(confirmItems.length)
  })
})
