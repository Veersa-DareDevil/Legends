import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { test, expect } from '@playwright/test'
import { Product } from '@src/pageObject/indianaUniversity/desktopUI/product'
import { CheckoutPage } from '@src/pageObject/indianaUniversity/desktopUI/checkout'
import { Payment } from '@src/pageObject/indianaUniversity/desktopUI/payment'
import testData from '@src/fixtures/indianaUniversity/checkoutValidation.json'
import cardDetails from '@src/fixtures/indianaUniversity/paymentValidations.json'
import productData from '@src/fixtures/indianaUniversity/product.json'

let login: CommonUtils
let product: Product
let checkout: CheckoutPage
let payment: Payment

test.describe('Checkout Scenario', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    checkout = new CheckoutPage(page)
    payment = new Payment(page)
    await login.goToPortal('storefront')
    await page.waitForTimeout(2000)
  })

  test('56825-Checkout Validation', async ({}) => {
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

  test('72788-Submitting an Order', async ({ page }) => {
    //await product.selectNavTraining()
    const productName = await product.selectProduct()
    console.log('Product Name:', productName)
    await product.addToCart()
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
    await checkout.selectCountry(testData.validData.userDetails.country)
    await page.waitForTimeout(1000)
    await checkout.selectState(testData.validData.userDetails.state)
    await checkout.continueToShipping()
    await page.waitForSelector('text=Continue to payment', { state: 'visible' })
    await page.waitForTimeout(1000)
    await checkout.continueToPayment()
    await payment.paymentButton.waitFor({ state: 'visible' })
    await payment.fillPaymentDetails(
      cardDetails.cardDetails.cardName,
      cardDetails.cardDetails.cardNumber,
      cardDetails.cardDetails.expiryDate,
      cardDetails.cardDetails.cvv,
    )
    await payment.submitPayment()
    //await checkout.waitForShipmentLoader()
  })

  test('872885 - Add to Cart Validation on Out of Stock Product', async ({ page }) => {
    const homePageUrl = await page.url()
    const fullUrl=`${homePageUrl}${productData.outOfStockProduct}`
    await page.goto(fullUrl)
    await checkout.getOutOfStockProduct()
    await expect(page.getByText('Item out of stock')).toBeVisible()
    await checkout.getEmailNotification(testData.emailNotify)
  })
})
