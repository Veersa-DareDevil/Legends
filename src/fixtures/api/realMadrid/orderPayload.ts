export class OrderPayloads {
  static updateFulfillmentStatus(fulfillmentId: string, items: Record<string, number>) {
    return {
      items: items, // initialize empty or with dynamic keys later
      fulfillmentId: fulfillmentId,
      status: 'FULFILLED',
      sendNotification: true,
    }
  }
}

export class ReturnItem {
  note: string | null = null
  orderFulfillmentItemId: string
  quantity: number
  primaryReturnReason: string = 'DEFECTIVE_PRODUCT'
  secondaryReturnReason: string = 'NONE'
  expectedCondition: string = 'UNKNOWN'
  returnType: string = 'REFUND'

  constructor(orderFulfillmentItemId: string, quantity: number) {
    this.orderFulfillmentItemId = orderFulfillmentItemId
    this.quantity = quantity
  }
}

export class CancelReturnItem {
  note: string | null = null
  orderFulfillmentItemId: string
  quantity: number
  condition: string = 'UNKNOWN'
  refundFulfillmentCharge: boolean = true
  refundTaxCharge: boolean = true

  constructor(orderFulfillmentItemId: string, quantity: number) {
    this.orderFulfillmentItemId = orderFulfillmentItemId
    this.quantity = quantity
  }
}

export class AdditionalConfirmRequest {
  orderFulfillmentItemId: string
  refundTaxCharge: boolean = false

  constructor(orderFulfillmentItemId: string) {
    this.orderFulfillmentItemId = orderFulfillmentItemId
  }
}
