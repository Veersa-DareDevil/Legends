import { APIRequestContext } from '@playwright/test';

const baseURL = 'https://storefront-api.legendscommerce.io';

export async function getGuestTokenAndCartId(request: APIRequestContext): Promise<{ guestToken: string; cartId: string }> {
  const response = await request.post(`${baseURL}/api/cart-operations/carts`, {
    headers: {
      'accept': 'application/json',
      'accept-language': 'en-US',
      'content-type': 'application/json',
      'origin': 'https://us.shop.realmadrid.com',
      'priority': 'u=1, i',
      'referer': 'https://us.shop.realmadrid.com/',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'x-application-token': 'real_madrid',
      'x-context-request': '{"customerSegmentIds":[]}',
      'x-feature-flags': '{"split-fulfillment":false,"CACHE_use-backend-pricing-normalization":true}',
    },
    data: {},
  });

  if (!response.ok()) {
    throw new Error(`Failed to create guest cart: ${response.status()}`);
  }

  const body = await response.json();

  // Assuming the response body has guestToken and cartId properties
  const guestToken = body.guestToken;
  const cartId = body.cartId;

  if (!guestToken || !cartId) {
      throw new Error('Guest token or Cart ID not found in the response body.');
  }


  console.log(`🔑 Retrieved Guest Token: ${guestToken}`);
  console.log(`🛒 Retrieved Cart ID: ${cartId}`);

  return { guestToken, cartId };
}