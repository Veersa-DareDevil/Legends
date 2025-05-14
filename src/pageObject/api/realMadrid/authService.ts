import { Browser, APIRequestContext, expect } from '@playwright/test';
import { generatePKCECodes } from '@src/utils/apiUtils/realMadrid/pkce';
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils';
import { ApiHeaders } from '@src/utils/apiUtils/realMadrid/apiHeaders';

export class AuthService {
  constructor(
    private browser: Browser,
    private apiRequest: APIRequestContext,
    private opts: {
      clientId: string;
      authUrl: string;
      tokenUrl: string;
      redirectUri: string;
      scope: string;
    }
  ) {}

  /** drive the browser to log in and grab the code */
  async getAuthorizationCode() {
    const { codeVerifier, codeChallenge } = generatePKCECodes();
    const params = new URLSearchParams({
      response_type:         'code',
      client_id:             this.opts.clientId,
      redirect_uri:          this.opts.redirectUri,
      code_challenge:        codeChallenge,
      code_challenge_method: 'S256',
      scope:                 this.opts.scope,
    });
    const authUrl = `${this.opts.authUrl}?${params}`;
    const ctx = await this.browser.newContext();
    const page = await ctx.newPage();
    //login to admin
    const login = new CommonUtils(page);
    await page.goto(authUrl);
    await login.loginToAdmin();
    // wait for the redirect to the redirect_uri
    await page.waitForURL(`**${this.opts.redirectUri}?code=*`, { timeout: 60_000 });
    const code = new URL(page.url()).searchParams.get('code');
    await ctx.close();
    if (!code) throw new Error('No authorization code received');
    return { code, codeVerifier };
  }

  /** exchange the code + verifier for the token */
  async fetchAccessToken(code: string, codeVerifier: string) {
    const response = await this.apiRequest.post(this.opts.tokenUrl, {
      form: {
        client_id:     this.opts.clientId,
        grant_type:    'authorization_code',
        code,
        code_verifier: codeVerifier,
        redirect_uri:  this.opts.redirectUri,
        scope:         this.opts.scope,
      },
      headers: ApiHeaders.getFormUrlEncodedHeaders(),
    });
    expect(response.status()).toBe(200);
    if (!response.ok()) throw new Error(`Token fetch failed: ${response.status()}`);
    const body = await response.json();
    if (!body.access_token) throw new Error('No access_token in response');
    return body;
  }

  /** full PKCE flow → returns a valid Bearer token */
  async getAccessTokenResonseBody() {
    const { code, codeVerifier } = await this.getAuthorizationCode();
    return this.fetchAccessToken(code, codeVerifier);
  }

}
