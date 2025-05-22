import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { test } from '@playwright/test'
import { Product } from '@src/pageObject/indianaUniversity/mobileUI/product'
import { CheckoutPage } from '@src/pageObject/indianaUniversity/mobileUI/checkout'
//import { MobileNavigation } from '@src/pageObject/indianaUniversity/mobileUI/navigation'
import testData from '@src/fixtures/indianaUniversity/checkoutValidation.json'

let login: CommonUtils
let product: Product
let checkout: CheckoutPage
//let navigation: MobileNavigation

test.describe('56825-Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    checkout = new CheckoutPage(page)
    //navigation = new MobileNavigation(page)
    await login.goToPortal('storefront')
    //await login.loginToStorefront()
    await page.waitForTimeout(2000)
  })

  test('Should Validate Checkout Validations', async ({}) => {
    //await navigation.selectMenu()
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
