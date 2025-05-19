/**
 * Generates common headers for API requests.
 */
export class ApiHeaders {
  /**
   * Get headers for requests expecting JSON response.
   */
  static getJsonHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Get headers for requests with Bearer token authentication and JSON content.
   * @param accessToken The access token.
   * @param contextHeader Optional x-context-request header value.
   */
  static getAuthJsonHeaders(accessToken: string, contextHeader?: string) {
    const headers: { [key: string]: string } = {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      accept: 'application/json',
    };
    if (contextHeader) {
      headers['x-context-request'] = contextHeader;
    }
    return headers;
  }

  /**
   * Get headers for form-urlencoded content.
   */
  static getFormUrlEncodedHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    };
  }
}
