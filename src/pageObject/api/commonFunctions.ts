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

  static generateCustomId(): string {
    const length = 26
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = '01' // fixed prefix, can be modified if needed

    for (let i = 2; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      result += charset[randomIndex]
    }

    return result
  }

  static findInList(list: Array<Record<string, object | string>>, key: string) {
    for (const obj of list) {
      if (obj!.type === key) {
        return obj
      }
    }
    return undefined
  }
}
