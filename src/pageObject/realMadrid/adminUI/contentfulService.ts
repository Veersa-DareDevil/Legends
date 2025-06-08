import { createClient, type PlainClientAPI } from 'contentful-management'
import 'dotenv/config'
import { Locator, Page } from 'playwright'
import { expect } from 'playwright/test'

interface TranslationUpdateResult {
  success: boolean
  originalValue?: string
  updatedValue?: string
}

export class ContentfulService {
  private client: PlainClientAPI
  private defaultSpaceId: string
  private defaultEnvironmentId: string
  readonly addToCartButton: Locator
  private page: Page

  constructor(page: Page) {
    this.client = createClient(
      {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
      },
      {
        type: 'plain',
        defaults: {
          spaceId: process.env.CONTENTFUL_SPACE_ID!,
          environmentId: process.env.CONTENTFUL_ENVIRONMENT! || 'uat',
        },
      },
    )
    this.defaultSpaceId = process.env.CONTENTFUL_SPACE_ID!
    this.defaultEnvironmentId = process.env.CONTENTFUL_ENVIRONMENT! || 'uat'
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')

    this.page = page
  }

  async updateTranslation(
    entryId: string,
    fieldName: string,
    locale: string,
    value: string,
  ): Promise<TranslationUpdateResult> {
    try {
      const entry = await this.client.entry.get({ entryId })
      const originalValue = entry.fields[fieldName]?.[locale]

      // Update the entry fields
      const updatedFields = {
        ...entry.fields,
        [fieldName]: {
          ...entry.fields[fieldName],
          [locale]: value,
        },
      }

      const updatedEntry = await this.client.entry.update(
        { entryId },
        {
          fields: updatedFields,
          sys: entry.sys,
        },
      )

      const publishedEntry = await this.client.entry.publish({ entryId }, updatedEntry)

      return {
        success: true,
        originalValue,
        updatedValue: value,
      }
    } catch (error) {
      console.error('Contentful update failed:', error)
      throw error
    }
  }

  async getEntryField(
    entryId: string,
    fieldName: string,
    locale: string,
  ): Promise<string | undefined> {
    const entry = await this.client.entry.get({ entryId })
    return entry.fields[fieldName]?.[locale]
  }

  async navigateToLocaleStorefront(url: string) {
    await this.page.goto(url)
    await this.page.waitForLoadState('load')
    await this.page.waitForSelector('text=Loading', { state: 'hidden' })
  }

  async verifyAddToCartButtonValue(value: string) {
    await expect(this.addToCartButton).toBeVisible()
    await expect(this.addToCartButton).toHaveText(value, { timeout: 10000 })
  }
}
