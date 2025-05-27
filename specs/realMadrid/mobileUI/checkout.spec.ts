import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { test } from '@playwright/test'
import { Product } from '@src/pageObject/realMadrid/mobileUI/product'
import { CheckoutPage } from '@src/pageObject/realMadrid/mobileUI/checkout'
import { MobileNavigation } from '@src/pageObject/realMadrid/mobileUI/navigation'
import testData from '@src/fixtures/realMadrid/checkoutValidation.json'

let login: CommonUtils
let product: Product
let checkout: CheckoutPage
let navigation: MobileNavigation

test.describe('Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    checkout = new CheckoutPage(page)
    navigation = new MobileNavigation(page)
    await login.goToPortal('storefront')
  })

  test('56825-Validate Checkout Validations', async ({}) => {
    await navigation.openMenu()
    await product.selectNavTraining()
    const productName = await product.selectProduct()
    console.log('Product Name:', productName)
    await product.addToCart(productName as string)
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

  test('98940 - Checkout - Update Locale to Match Shipping Country', async ({}) => {
    await navigation.openMenu()
    await product.selectNavTraining()
    const productName = await product.selectProduct()
    console.log('Product Name:', productName)
    await product.addToCart(productName as string)
    await checkout.selectCheckout()
    await checkout.fillYourDetails(
      testData.validData.userDetails.fullName,
      testData.validData.userDetails.email,
      testData.validData.userDetails.phone,
      testData.validData.userDetails.address1,
      testData.validData.userDetails.address2,
      testData.validData.userDetails.city,
      testData.validData.userDetails.postcode,
    )
    await checkout.selectCountry(testData.validData.address.testCountry1)
    await checkout.selectState(testData.validData.address.testState1)
    await checkout.continueToShipping()
    await checkout.verifyCurrency(testData.validData.currency.USD)
    //change the country and state to validate the currency change
    await checkout.selectCountry(testData.validData.address.testCountry2)
    await checkout.selectState(testData.validData.address.testState2)
    await checkout.continueToShipping()
    await checkout.verifyCurrency(testData.validData.currency.EUR)
  })

  test('99734 - Checkout with Split Fulfillment', async ({page}) => {

// need to complete later

    await page.goto('https://real-madrid.uat.storefront.legendscommerce.io/en-es/product/mens-home-authentic-shirt-24-25-white-indy')
    await page.waitForLoadState('domcontentloaded')
    await product.addToCart('Mens Home Authentic Shirt 24/25 White (Indy)')

    await page.goto('https://real-madrid.uat.storefront.legendscommerce.io/en-es/product/rmcfmf0067-real-madrid-home-socks-23-24-white')
    await page.waitForLoadState('domcontentloaded')
    await product.addToCart('RMCFMF0067 Real Madrid Home Socks 23/24 White')
  })
})
