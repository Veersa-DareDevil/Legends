import * as contentful from 'contentful-management'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || ''
const CONTENTFUL_ENV_ID = process.env.CONTENTFUL_ENV_ID || 'uat'
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

export class ContentfulService {
  private client // Let TypeScript infer the type
  private environment: contentful.Environment | undefined

  constructor() {
    this.client = contentful.createClient({
      accessToken: ACCESS_TOKEN!,
    })
    this.environment = undefined
  }

  async init() {
    const space = await this.client.getSpace(CONTENTFUL_SPACE_ID)
    this.environment = await space.getEnvironment(CONTENTFUL_ENV_ID)
  }

  async getPrivacyPolicyText(entryId: string): Promise<string> {
    if (!this.environment) {
      await this.init()
    }

    // Ensure environment is defined before using it
    if (!this.environment) {
      throw new Error('Contentful environment not initialized.')
    }

    const entry = await this.environment.getEntry(entryId)
    // Extract content from the 'pageContent' field
    let richTextDoc = entry.fields?.pageContent?.['en-US'] || entry.fields?.pageContent?.['en']

    // Fallback to any available locale if English is not found
    if (!richTextDoc && entry.fields?.pageContent) {
      for (const locale in entry.fields.pageContent) {
        richTextDoc = entry.fields.pageContent[locale]
        if (richTextDoc) {
          break // Use the first available locale
        }
      }
    }

    if (!richTextDoc) {
      throw new Error(`Privacy policy content not found for entry ID: ${entryId}`)
    }

    return documentToPlainTextString(richTextDoc).trim()
  }
}
