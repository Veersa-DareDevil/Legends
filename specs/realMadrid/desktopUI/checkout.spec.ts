import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { test } from '@playwright/test'
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'
import { CheckoutPage } from '@src/pageObject/realMadrid/desktopUI/checkout'
import { Payment } from '@src/pageObject/realMadrid/desktopUI/payment'
import { SearchPage } from '@src/pageObject/realMadrid/desktopUI/search'
import testData from '@src/fixtures/realMadrid/checkoutValidation.json'
import cardDetails from '@src/fixtures/realMadrid/paymentValidations.json'
import { log } from 'console'

let login: CommonUtils
let product: Product
let checkout: CheckoutPage
let payment: Payment
let search: SearchPage

test.describe('Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    checkout = new CheckoutPage(page)
    payment = new Payment(page)
    search = new SearchPage(page)
    await login.goToPortal('storefront')
  })

  test('56825- Validate Checkout Validations', async ({}) => {
    await product.selectNavTraining()
    const productName = await product.selectProduct()
    // console.log('Product Name:', productName)
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
    await product.selectNavFashion()
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

  test('99734 - Checkout with Split Fulfillment', async ({ page }) => {
    // product 1
    await page.goto(
      'https://real-madrid.uat.storefront.legendscommerce.io/en-es/product/mens-home-authentic-shirt-24-25-white-indy',
    )
    await page.waitForLoadState('domcontentloaded')
    await product.addToCart()
    await checkout.continueShopping()
    // product 2
    await page.waitForTimeout(1000)
    await search.searchProduct('Home Socks 23/24 White')
    await page.waitForLoadState('domcontentloaded')
    await product.selectProduct()
    await product.addToCart()
    //go to checkout
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
    await checkout.selectCountry(testData.validData.address.testCountry2)
    await checkout.selectState(testData.validData.address.testState2)
    await checkout.continueToShipping()

    await page.waitForSelector('text=Continue to payment', { state: 'visible' })
    await page.waitForTimeout(1000)
    // Validate the split shipments
    await checkout.validateAndSelectShipments()
    await checkout.waitForShipmentLoader()

    await checkout.continueToPayment()

    await payment.paymentButton.waitFor({ state: 'visible' })
    await payment.fillPaymentDetails(
      cardDetails.cardDetails.cardName,
      cardDetails.cardDetails.cardNumber,
      cardDetails.cardDetails.expiryDate,
      cardDetails.cardDetails.cvv,
    )
    await payment.submitPayment()
    await checkout.waitForShipmentLoader()
  })
})
