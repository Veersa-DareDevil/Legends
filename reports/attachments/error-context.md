# Test info

- Name: Admin Portal || Catalog || Category >> POST API: Create Category
- Location: C:\Users\SnehilGangwar\Documents\Legends\specs\apiSpecs\realMadrid\createCategory.spec.ts:22:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 403
    at CategoryService.createCategory (C:\Users\SnehilGangwar\Documents\Legends\src\pageObject\api\realMadrid\categoryService.ts:18:31)
    at C:\Users\SnehilGangwar\Documents\Legends\specs\apiSpecs\realMadrid\createCategory.spec.ts:42:25
```

# Test source

```ts
   1 | import { APIRequestContext, expect } from '@playwright/test';
   2 | import { ADMIN_ENDPOINTS } from '@src/utils/apiUtils/realMadrid/apiEndpoints';
   3 | import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders';
   4 | import { ApiRequest } from '@src/utils/apiUtils/apiRequest';
   5 |
   6 |
   7 |
   8 | export class CategoryService {
   9 |   constructor(
  10 |     private apiRequest: APIRequestContext,
  11 |     private contextHeader: string  // the JSON string for x-context-request
  12 |   ) {}
  13 |
  14 |   // create new category
  15 |   
  16 |   async createCategory(accessToken: string, payload: any) {
  17 |     const response = await ApiRequest.postRequest(this.apiRequest,ADMIN_ENDPOINTS.categories,ApiHeaders.getAuthJsonHeaders(accessToken,this.contextHeader),payload)
> 18 |     expect(response.status()).toBe(200)
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  19 |     if (!response.ok()) {
  20 |       const text = await response.text();
  21 |       throw new Error(`Categories API failed (${response.status()}): ${text}`);
  22 |     }
  23 |     return response.json();
  24 |   }
  25 | }
  26 |
```