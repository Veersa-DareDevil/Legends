# Test info

- Name: Admin Portal || Catalog || Products >> POST API: Create a New Product via API
- Location: C:\Users\SnehilGangwar\Documents\Legends\specs\apiSpecs\realMadrid\addProduct.spec.ts:21:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 403
    at ProductService.createProduct (C:\Users\SnehilGangwar\Documents\Legends\src\pageObject\api\realMadrid\productService.ts:17:27)
    at C:\Users\SnehilGangwar\Documents\Legends\specs\apiSpecs\realMadrid\addProduct.spec.ts:40:25
```

# Test source

```ts
   1 | import { APIRequestContext, expect } from '@playwright/test';
   2 | import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints';
   3 | import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders';
   4 | import { APIUtils } from '@src/utils/apiUtils/realMadrid/ApiUtil';
   5 |
   6 |
   7 |
   8 | export class ProductService {
   9 |   constructor(
  10 |     private apiRequest: APIRequestContext,
  11 |     private contextHeader: string  // the JSON string for x-context-request
  12 |   ) {}
  13 |
  14 |   /** Create a new product */
  15 |   async createProduct(accessToken: string, payload: any) {
  16 |     const resp = await APIUtils.postRequest(this.apiRequest,ADMIN_ENDPOINTS.products,ApiHeaders.getAuthJsonHeaders(accessToken,this.contextHeader),payload)
> 17 |     expect(resp.status()).toBe(200)
     |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  18 |     if (!resp.ok()) {
  19 |       const text = await resp.text();
  20 |       throw new Error(`Products API failed (${resp.status()}): ${text}`);
  21 |     }
  22 |     return resp.json();
  23 |   }
  24 | }
  25 |
```