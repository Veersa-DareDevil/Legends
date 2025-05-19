import { APIRequestContext } from '@playwright/test';

export class ApiRequest {
  static async postRequest(
    request: APIRequestContext,
    url: string,
    headers: Record<string, string | null | undefined>,
    body: object,
  ) {
    const safeHeaders = sanitizeHeaders(headers);
    const response = await request.post(url, {
      headers: safeHeaders,
      data: JSON.stringify(body),
    });
    return response;
  }

  static async putRequest(
    request: APIRequestContext,
    url: string,
    headers: Record<string, string | null | undefined>,
    body: object,
  ) {
    const safeHeaders = sanitizeHeaders(headers);
    const response = await request.put(url, {
      headers: safeHeaders,
      data: JSON.stringify(body),
    });
    return response;
  }

  static async getRequest(request: APIRequestContext, url: string, headers: Record<string, string | null | undefined>) {
    const safeHeaders = sanitizeHeaders(headers);
    const response = await request.get(url, {
      headers: safeHeaders,
    });
    return response;
  }

  static async deleteRequest(
    request: APIRequestContext,
    url: string,
    headers: Record<string, string | null | undefined>,
  ) {
    const safeHeaders = sanitizeHeaders(headers);
    const response = await request.delete(url, {
      headers: safeHeaders,
    });
    return response;
  }

  static async patchRequest(
    request: APIRequestContext,
    url: string,
    headers: Record<string, string | null | undefined>,
    body?: object,
  ) {
    const safeHeaders = sanitizeHeaders(headers);
    const response = await request.patch(url, {
      headers: safeHeaders,
      data: body ?? {},
    });
    return response;
  }
}

//Ensures headers contain only valid values while filtering out `null`.
function sanitizeHeaders(headers: Record<string, string | null | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => [key, value ?? '']),
  );
}
