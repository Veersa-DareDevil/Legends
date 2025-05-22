import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { test } from '@playwright/test'
import { Product } from '@src/pageObject/indianaUniversity/desktopUI/product'
import { CheckoutPage } from '@src/pageObject/indianaUniversity/desktopUI/checkout'
import testData from '@src/fixtures/indianaUniversity/checkoutValidation.json'

let login: CommonUtils
let product: Product
let checkout: CheckoutPage

test.describe('56825-Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    checkout = new CheckoutPage(page)
    await login.goToPortal('storefront')
    //await login.loginToStorefront() // future use
    await page.waitForTimeout(2000)
  })

  test('Should Validate Checkout Validations', async ({}) => {
    //await product.selectNavTraining()
    const productName = await product.selectProduct()
    console.log('Product Name:', productName)
    await product.addToCart()
    await checkout.selectCheckout()
    await checkout.fillYourDetails(
      testData.nonWesternCharacters.userDetails.fullName,
      testData.nonWesternCharacters.userDetails.email,
      testData.nonWesternCharacters.userDetails.phone,
      testData.nonWesternCharacters.userDetails.address1,
      testData.nonWesternCharacters.userDetails.address2,
      testData.nonWesternCharacters.userDetails.city,
      testData.nonWesternCharacters.userDetails.postcode,
    )
    await checkout.validateWesternCharWarningMsg()
  })
})
