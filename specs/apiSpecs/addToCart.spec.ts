import { test, expect } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';


const cartId = '01JTAQZF2A9V59171V84VG05GM';
const baseURL = 'https://storefront-api.legendscommerce.io';

function getPayloadWithDynamicOrder() {
  const ts = Date.now();
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
              attribute: { name: 'Size', type: 'SIZE', required: false },
              allowedValues: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => ({
                label: size,
                value: size,
                attributes: {}
              })),
              order: ts
            }
          ],
          order: ts
        }
      },
      note: null
    }
  ];
}

async function addToCart(request: any, cartVersion: number,token:string): Promise<{ response: any; body: any }> {
  const payload = getPayloadWithDynamicOrder();

  const response = await request.post(`${baseURL}/api/cart-operations/cart/${cartId}/bulk-items`, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      origin: 'https://us.shop.realmadrid.com',
      'x-application-token': 'real_madrid',
      'x-cart-version': String(cartVersion),
      'x-guest-token': String(token),
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
      'x-feature-flags': JSON.stringify({
        'split-fulfillment': false,
        'CACHE_use-backend-pricing-normalization': true
      }),
    },
    data: payload
  });

  const body = await response.json();
  return { response, body };
}

//guest token

interface GuestTokenResponse {
  token: { tokenString: string }; // adjust this if the actual field name is different
}

/**
 * Fetches a fresh guest token for the given cart.
 *
 * @param api      – your Playwright APIRequestContext (e.g. test.request)
 * @param cartId   – the cart ID you’re working with
 * @param cartVersion – the latest cart version header
 * @returns the new guest token
 */
export async function refreshGuestToken(
  api: APIRequestContext,
  cartId: string,
  cartVersion: number
): Promise<string> {
  const url = `https://storefront-api.legendscommerce.io/api/cart-operations/checkout/${cartId}/guest-token`;

  const response = await api.post(url, {
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      // these two you might pull from your test config or env
      'x-application-token': 'real_madrid',
      'x-cart-version': cartVersion.toString(),
      // any other headers you need:
      'x-context-request': JSON.stringify({ customerSegmentIds: [] }),
      
    },
    data: {}, // body is empty JSON per the curl
  });

  if (response.status() !== 200) {
    const text = await response.text();
    throw new Error(
      `Failed to refresh guest token (status ${response.status()}): ${text}`
    );
  }

  const body = (await response.json()) as GuestTokenResponse;
  if (!body.token) {
    throw new Error(
      `guest-token response did not include a token: ${JSON.stringify(body)}`
    );
  }

  return body.token.tokenString;
}


test('Add to cart with retry on 409 using newCart.cartItems[0].cartVersion', async ({ request }) => {
  let cartVersion = 34;
  let token = "01JTFEGHRVV4651PWBG1Y61C8T"

  let { response, body } = await addToCart(request, cartVersion,token);

  if (response.status() === 409) {
    const newVersion = body?.newCart?.cartItems?.[0]?.cartVersion || body.newCart.version;

    if (typeof newVersion === 'number') {
      console.warn(`409 Conflict. Retrying with updated cart version: ${newVersion}`);
      cartVersion = newVersion;
      ({ response, body } = await addToCart(request, cartVersion,token));
    } else {
      throw new Error('409 Conflict and no valid cartVersion found in newCart object');
    }
  }
   // new: handle expired guest token
   if (response.status() === 401) {
    console.warn('401 Unauthorized – guest token expired. Refreshing token and retrying…');

    // 1) fetch a fresh guest token
    const guestToken = await refreshGuestToken(request, cartId, cartVersion);


    // 3) retry the addToCart call with the same cartVersion
    ({ response, body } = await addToCart(request, cartVersion, guestToken));
  }


  expect(response.ok()).toBeTruthy();
  expect(body.cart.id).toBe(cartId);
  console.log(`✅ Successfully added with cart version ${cartVersion}`);
});

