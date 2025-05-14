# Test info

- Name: Happy path: create a new product via API
- Location: C:\Users\AbhinavSharma\Legends\specs\apiSpecs\addProduct.spec.ts:6:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**https://uat-real-madrid-admin.legendscommerce.io/silent-callback.html?code=*" until "load"
============================================================
    at AuthService.getAuthorizationCode (C:\Users\AbhinavSharma\Legends\src\pageObject\api\authService.ts:37:16)
    at AuthService.getAccessToken (C:\Users\AbhinavSharma\Legends\src\pageObject\api\authService.ts:68:36)
    at C:\Users\AbhinavSharma\Legends\specs\apiSpecs\addProduct.spec.ts:18:17
```

# Page snapshot

```yaml
- link "Logo":
  - /url: /
  - img "Logo"
- img "Portrait"
- text: Real Madrid
- combobox "Choose an Application"
- img
- textbox "Filter ..."
- img
- text: Catalog
- img
- img
- text: Pricing
- img
- img
- text: Content Management
- img
- img
- text: Commerce
- img
- img
- text: Search
- img
- img
- text: Processes
- img
- img
- text: Application Updates
- img
- img
- text: Security
- img
- img
- text: Inventory
- img
- img
- text: Fulfillment
- img
- img
- button "cog":
  - img
- button "user":
  - img
- heading "Welcome to the Legends Core Commerce Admin" [level=5]
- paragraph: Use the section to the left to navigate
- paragraph: Currently running v.1.10.10-lg-rc6.9
```

# Test source

```ts
   1 | import { Browser, APIRequestContext } from '@playwright/test';
   2 | import { generatePKCECodes } from '@src/utils/apiUtils/pkce';
   3 | import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils';
   4 |
   5 | export class AuthService {
   6 |   constructor(
   7 |     private browser: Browser,
   8 |     private apiRequest: APIRequestContext,
   9 |     private opts: {
  10 |       clientId: string;
  11 |       authUrl: string;
  12 |       tokenUrl: string;
  13 |       redirectUri: string;
  14 |       scope: string;
  15 |     }
  16 |   ) {}
  17 |
  18 |   /** drive the browser to log in and grab the code */
  19 |   async getAuthorizationCode() {
  20 |     const { codeVerifier, codeChallenge } = generatePKCECodes();
  21 |     const params = new URLSearchParams({
  22 |       response_type:         'code',
  23 |       client_id:             this.opts.clientId,
  24 |       redirect_uri:          this.opts.redirectUri,
  25 |       code_challenge:        codeChallenge,
  26 |       code_challenge_method: 'S256',
  27 |       scope:                 this.opts.scope,
  28 |     });
  29 |     const authUrl = `${this.opts.authUrl}?${params}`;
  30 |     const ctx = await this.browser.newContext();
  31 |     const page = await ctx.newPage();
  32 |     //login to admin
  33 |     const login = new CommonUtils(page);
  34 |     await login.goToPortal('admin');
  35 |     await login.loginToAdmin();
  36 |     // wait for the redirect to the redirect_uri
> 37 |     await page.waitForURL(`**${this.opts.redirectUri}?code=*`, { timeout: 60_000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  38 |     const code = new URL(page.url()).searchParams.get('code');
  39 |     await ctx.close();
  40 |     if (!code) throw new Error('No authorization code received');
  41 |     return { code, codeVerifier };
  42 |   }
  43 |
  44 |   /** exchange the code + verifier for the token */
  45 |   async fetchAccessToken(code: string, codeVerifier: string) {
  46 |     const response = await this.apiRequest.post(this.opts.tokenUrl, {
  47 |       form: {
  48 |         client_id:     this.opts.clientId,
  49 |         grant_type:    'authorization_code',
  50 |         code,
  51 |         code_verifier: codeVerifier,
  52 |         redirect_uri:  this.opts.redirectUri,
  53 |         scope:         this.opts.scope,
  54 |       },
  55 |       headers: {
  56 |         'Content-Type': 'application/x-www-form-urlencoded',
  57 |         'Accept':         'application/json',
  58 |       },
  59 |     });
  60 |     if (!response.ok()) throw new Error(`Token fetch failed: ${response.status()}`);
  61 |     const body = await response.json();
  62 |     if (!body.access_token) throw new Error('No access_token in response');
  63 |     return body.access_token as string;
  64 |   }
  65 |
  66 |   /** full PKCE flow → returns a valid Bearer token */
  67 |   async getAccessToken() {
  68 |     const { code, codeVerifier } = await this.getAuthorizationCode();
  69 |     return this.fetchAccessToken(code, codeVerifier);
  70 |   }
  71 | }
  72 |
```