export class CartPayloads {
  static generateCartPayload() {
    const timestamp = Date.now()
    return [
      {
        productId: '01J3ZJDH5EWG3X1EYBDY170PCQ',
        variantId: '01J3ZJDH6XVDG50AW3CNR50D1A',
        quantity: 1,
        itemAttributeChoices: {},
        dependentCartItems: [],
        itemAttributes: {
          purchaseItemMetadata: {
            options: [
              {
                id: '01JD9R4AX9818415W9X6WQ05FD',
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
