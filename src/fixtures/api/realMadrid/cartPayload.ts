export class CartPayloads {
  static generateCartPayload() {
    const timestamp = Date.now()
    return [
      {
        productId: '01HTR6W3XDV22E059S7EEN1FGZ',
        variantId: '01HTR6W3Y8W7N70RAD0GEE0WGR',
        quantity: 1,
        itemAttributeChoices: {},
        dependentCartItems: [],
        itemAttributes: {
          purchaseItemMetadata: {
            options: [
              {
                id: '01HTR6W3XD5V8W00GMTWZ1008X',
                type: 'VARIANT_DISTINGUISHING',
                bundlingEnabled: false,
                label: 'Size',
                displayOrder: 1,
                attribute: {
                  name: 'Size',
                  type: 'SIZE',
                  required: false,
                },
                allowedValues: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => ({
                  label: size,
                  value: size,
                  attributes: {},
                })),
                order: timestamp,
              },
            ],
            order: timestamp,
          },
        },
        note: null,
      },
    ]
  }

  static generateUpdateQuantityPayload(cartItemId: string, quantity: number) {
    return {
      cartItemId,
      quantity,
    }
  }
}

// Interfaces
export interface CartItem {
  id: string
  name?: string
  quantity: number
  cartVersion?: number
}

export interface Cart {
  id: string
  version: number
  cartItems: CartItem[]
}

export interface CartResponse {
  cart?: Cart
  cartItems?: CartItem[]
  newCart?: Cart
}

export interface Product {
  id: string
  name?: string
}

export interface SearchResponse {
  content?: Product[]
}
