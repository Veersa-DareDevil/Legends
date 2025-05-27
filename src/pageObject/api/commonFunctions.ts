export class CommonFunctions {
  static buildQueryString(
    params: Record<string, string | number | boolean | (string | number | boolean)[]>,
  ): string {
    return Object.entries(params)
      .flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.map((v) => `${key}=${encodeURIComponent(String(v))}`)
          : `${key}=${encodeURIComponent(String(value))}`,
      )
      .join('&')
  }
}
