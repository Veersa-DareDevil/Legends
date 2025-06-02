import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { PersonalizeProduct } from '@src/pageObject/realMadrid/mobileUI/personalizeProduct'

import testData from '@src/fixtures/realMadrid/personalizeProduct.json'

test.describe('Personalization Product', () => {
  let commonFunction: CommonUtils
  let personalizeProduct: PersonalizeProduct

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    personalizeProduct = new PersonalizeProduct(page)
    await commonFunction.goToPortal('storefront')
  })

  test('640373 - Personalization Pricing', async ({ page }) => {
    const productUrl = `${process.env.RM_STOREFRONT_URL}product/${testData.productName}`
    await page.goto(productUrl)
    await page.waitForLoadState('load')
    await commonFunction.rejectAllCookies()
    await personalizeProduct.verifyPersonalizeOptions()
    await personalizeProduct.verfyPersonalizeOptionPreviewPrice(
      personalizeProduct.selectPlayerOption,
      true,
    )
    await personalizeProduct.verfyPersonalizeOptionPreviewPrice(
      personalizeProduct.personalizeOption,
      true,
    )
  })
})
