import { test, expect } from '@playwright/test'
import { ContentfulService } from '@src/pageObject/realMadrid/adminUI/contentfulService'
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { contentfulAuthData, localEnglish } from '@src/fixtures/api/realMadrid/contentfulData'

// This test case has large timeouts due to propagation delay of data from contentful
test.describe.serial('Contentful Translation Updates - Real Madrid', () => {
  let contentful: ContentfulService

  const TEST_ENTRY_ID = contentfulAuthData.testEntryID
  const FIELD_NAME = contentfulAuthData.fieldName

  const locale = localEnglish

  test.beforeEach(async ({ page }) => {
    test.setTimeout(1200000)
    contentful = new ContentfulService(page)
  })

  test(`Update and verify translation for addToCartLabel`, async ({ page }) => {
    // Step 1: Get original value
    const originalValue = await contentful.getEntryField(TEST_ENTRY_ID, FIELD_NAME, locale.code)

    // Step 2: Update the translation
    const updateResult = await contentful.updateTranslation(
      TEST_ENTRY_ID,
      FIELD_NAME,
      locale.code,
      locale.value,
    )
    expect(updateResult.success).toBe(true)

    // Step 3: Verify in Contentful
    const updatedValue = await contentful.getEntryField(TEST_ENTRY_ID, FIELD_NAME, locale.code)
    expect(updatedValue).toBe(locale.value)

    // Step 4: Wait for propagation
    await page.waitForTimeout(2000)

    // Step 5: Navigate to PDP with correct locale
    const pdpUrl = `${process.env.STOREFRONT_BASE_URL}/${locale.fullCode}`
    await contentful.navigateToLocaleStorefront(pdpUrl)

    // Step 6: Verify button text
    const product = new Product(page)
    await product.selectNavTraining()
    const commonFunction = new CommonUtils(page)
    await commonFunction.rejectAllCookies()
    await product.selectProduct()

    await contentful.verifyAddToCartButtonValue(locale.value)

    // Step 7: Revert to original

    
      const revertResult = await contentful.updateTranslation(
        TEST_ENTRY_ID,
        FIELD_NAME,
        locale.code,
        originalValue!,
      )
      expect(revertResult.success).toBe(true)

      const reverted = await contentful.getEntryField(TEST_ENTRY_ID, FIELD_NAME, locale.code)
      expect(reverted).toBe(originalValue)
      // Wait for propagation
      await page.waitForTimeout(240000)
    
  })
})
