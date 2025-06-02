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

  static generateAddressPayloadOne() {
    return {
      companyName: '',
      fullName: 'snehil',
      addressLine1: '123 Market Street',
      addressLine2: 'Apt 5B',
      city: 'San Francisco',
      postalCode: '94103',
      stateProvinceRegion: 'CA',
      phonePrimary: {
        phoneNumber: '+1 415 555 1234',
      },
      country: 'US',
      id: 'address-usa',
    }
  }
  static generateAddressPayloadTwo() {
    return {
      companyName: '',
      fullName: 'snehil',
      addressLine1: 'Berliner Straße 21',
      addressLine2: '',
      city: 'Frankfurt',
      postalCode: '60311',
      stateProvinceRegion: 'Hesse',
      phonePrimary: {
        phoneNumber: '+49 160 1234567',
      },
      country: 'DE',
      id: 'address-germany',
    }
  }

  static generateAddressPayloadThree() {
  return {
    companyName: '',
    fullName: 'snehil',
    addressLine1: 'No. 100 Nanjing Road',
    addressLine2: '',
    city: 'Shanghai',
    postalCode: '200001',
    stateProvinceRegion: 'Shanghai',
    phonePrimary: {
      phoneNumber: '+86 13800138000',
    },
    country: 'CN',
    id: 'address-china',
  }
}


  static getSelectFulfillmentPayload() {
    return {
      serviceLevel: 'EXPRESS',
      fulfillmentType: 'SHIP',
      description: 'EXPRESS',
      calculatorIds: ['01HPFCT3GC5J170BNW70ZQ1WSA'],
      bandFields: ['WEIGHT'],
      fulfillmentReference: '01JWFWGQ3HAHFX9WFRSBN3EZ4T',
      estimatedMinDaysToFulfill: 6,
      estimatedMaxDaysToFulfill: 8,
      price: {
        amount: 34,
        currency: 'EUR',
      },
      taxable: true,
      taxCode: null,
      additionalAttributes: {},
      fulfillmentEstimate: {
        estimatedAt: '2025-05-30T06:01:55.780693227Z',
        orderByRequirement: '2025-05-30T09:00:00Z',
        arrivesByEstimate: '2025-06-07T09:00:00Z',
      },
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
