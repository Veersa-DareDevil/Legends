import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { PersonalizeProduct } from '@src/pageObject/realMadrid/desktopUI/personalizeProduct'
import { CheckoutPage } from '@src/pageObject/realMadrid/desktopUI/checkout'
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'

import testData from '@src/fixtures/realMadrid/personalizeProduct.json'

test.describe('Personalization Product', () => {
  let commonFunction: CommonUtils
  let personalizeProduct: PersonalizeProduct
  let checkout: CheckoutPage
  let product: Product

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    personalizeProduct = new PersonalizeProduct(page)
    checkout = new CheckoutPage(page)
    product = new Product(page)
    await commonFunction.goToPortal('storefront')
  })

  test('640373 - Personalization Pricing', async ({ page }) => {
    const productUrl = `${process.env.RM_STOREFRONT_URL}product/${testData.productName}`
    await page.goto(productUrl)
    await page.waitForLoadState('load')
    await commonFunction.rejectAllCookies()
    await personalizeProduct.verifyPersonalizationOptions()
    await personalizeProduct.verfyPersonalizationOptionPreviewPrice(personalizeProduct.selectPlayerOption, true)
    await personalizeProduct.verfyPersonalizationOptionPreviewPrice(personalizeProduct.personalizeOption, true)
  })

  test('518685 - Personalizing a Jersey', async ({ page }) => {
    const productUrl = `${process.env.RM_STOREFRONT_URL}product/${testData.productName}`
    await page.goto(productUrl)
    await page.waitForLoadState('load')
    await commonFunction.rejectAllCookies()
    // Verify the personalization options are available
    await personalizeProduct.verifyPersonalizationOptions()

   // 1. verify the select player option for Personalization
    await personalizeProduct.verifySelectPlayerPersonalizeOption()
    await checkout.continueShoppingButton.click()
    await personalizeProduct.validateSelectPlayerPreviewMatchesInput()
    
   // 2. verify the personalize option for Personalization
    await personalizeProduct.verifyPersonalizeOption()
    await checkout.continueShoppingButton.click()
    await personalizeProduct.validatePersonalizePreviewMatchesInput(testData.personalizeOptions.option1.name, testData.personalizeOptions.option1.number)

  })
})
