export class OrderPayloads {

  static updateFulfillmentStatus() {
  return {
    items: {} as Record<string, number>, // initialize empty or with dynamic keys later
    fulfillmentId: '',
    status: 'FULFILLED',
    sendNotification: true
  };
}
}