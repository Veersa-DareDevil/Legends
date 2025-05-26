import { test, expect } from '@playwright/test'
import { AuthService } from '@src/utils/apiUtils/realMadrid/authService'

import authData from '@src/fixtures/api/authData.json'
import { OrderService } from '@src/pageObject/api/realMadrid/orderService'
import { QueryParams } from '@src/fixtures/api/realMadrid/queryParameters'
import { OrderPayloads } from '@src/fixtures/api/realMadrid/orderPayload'

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

  test('POST API: Fullfill an order', async ({browser, request }) => {

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
  const searchResult = await orderService.searchOrderFulfillment(accessToken, QueryParams.newFullfillmentOrders)
  console.log('Order Fulfillment Search Result:', searchResult)

  // assertion
  expect(Array.isArray(searchResult.content || searchResult.orders)).toBeTruthy()

  const firstOrderId=searchResult.content[0].id

  // 2) Get Order Details for Fullfillment (first order in new)

   const orderDetails = await orderService.getOrderDetailForFullfillment(accessToken, firstOrderId)
  console.log('Fulfillment View Response:', orderDetails)

  //assertions
  expect(orderDetails).toHaveProperty('id', firstOrderId)
  expect(orderDetails.fulfillmentItems[0].id).toBeDefined()
  expect(orderDetails.fulfillmentItems[0].quantity).toBeDefined()
  


  // 3) Fullfill Order

  // Initialize AuthService
    const auth = new AuthService(browser, request,authData.orderFulfillmentScope)

    // Fetch a fresh access token
    tokenResponse = await auth.getAccessTokenResonseBody() // This method should return the token response body
    accessToken = tokenResponse.access_token // Extract the access token from the response
    expect(accessToken).toBeTruthy()

  await orderService.changeContextHeader(JSON.stringify({
        tenantId: tokenResponse.tenant_id,
        applicationId: tokenResponse.application_ids[0],
        customerContextId: tokenResponse.customer_context_ids[0]
      }))

      const changeStatusPayload=OrderPayloads.updateFulfillmentStatus()

      changeStatusPayload.fulfillmentId=orderDetails.id
      changeStatusPayload.items = {
  [orderDetails.fulfillmentItems[0].id]: orderDetails.fulfillmentItems[0].quantity
}

      const changeStatusResponse = await orderService.changeFulfillmentStatus(accessToken,changeStatusPayload)
    console.log('Fulfillment Status Change Response:', changeStatusResponse)

    // Basic assertion
    expect(changeStatusPayload).toHaveProperty('status', 'FULFILLED')
    expect(changeStatusResponse.id).toBe(firstOrderId)



  })
})
