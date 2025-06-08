import { test, expect, Page } from '@playwright/test'
import { ContentfulService } from '@src/utils/commonUtils/contentful'
import { privacyPolicyEntryId } from '@src/fixtures/api/realMadrid/contentfulData'

test.describe('Privacy Policy Page', () => {
  let policyText = ''
  let contentfulService: ContentfulService

  test.beforeAll(async () => {
    contentfulService = new ContentfulService()
    policyText = await contentfulService.getPrivacyPolicyText(privacyPolicyEntryId)
  })

  test('548764 & 921763 - Contentful Content Page || Privacy Policy', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto(`${process.env.RM_STOREFRONT_URL}content/privacy-policy`)

    const mainContent = await page.locator('main').innerText()

    if (mainContent) {
      const normalizedPageText = mainContent.replace(/\s+/g, ' ').trim()
      const normalizedPolicyText = policyText.replace(/\s+/g, ' ').trim()

      expect(normalizedPageText).toContain(normalizedPolicyText)
    } else {
      expect(false).toBe(true) // Fail the test if mainContent is null
    }
  })
})
