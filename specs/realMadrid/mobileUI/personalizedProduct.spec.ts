import { test, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { PersonalizeProduct } from '@src/pageObject/realMadrid/mobileUI/personalizeProduct'
import { CheckoutPage } from '@src/pageObject/realMadrid/mobileUI/checkout'
import { Payment } from '@src/pageObject/realMadrid/mobileUI/payment'
import testDataCheckout from '@src/fixtures/realMadrid/checkoutValidation.json'
import cardDetails from '@src/fixtures/realMadrid/paymentValidations.json'
import { Product } from '@src/pageObject/realMadrid/mobileUI/product'

import testData from '@src/fixtures/realMadrid/personalizeProduct.json'

test.describe('Personalization Product', () => {
  let commonFunction: CommonUtils
  let personalizeProduct: PersonalizeProduct
  let checkout: CheckoutPage
  let payment: Payment
  let product: Product

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    personalizeProduct = new PersonalizeProduct(page)
    checkout = new CheckoutPage(page)
    payment = new Payment(page)
    product = new Product(page)
    await commonFunction.goToPortal('storefront')
  })

  test('640373 - Personalization Pricing', async ({ page }) => {
    const productUrl = `${process.env.RM_STOREFRONT_URL}product/${testData.productName}`
    await page.goto(productUrl)
    await page.waitForLoadState('load')
    await commonFunction.rejectAllCookies()
    await personalizeProduct.verifyPersonalizationOptions()
    await personalizeProduct.verfyPersonalizeOptionPreviewPrice(
      personalizeProduct.selectPlayerOption,
      true,
    )
    await personalizeProduct.verfyPersonalizeOptionPreviewPrice(
      personalizeProduct.personalizeOption,
      true,
    )
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
    await personalizeProduct.validatePersonalizePreviewMatchesInput(
      testData.personalizeOptions.option1.name,
      testData.personalizeOptions.option1.number,
    )
  })

  test('new - Purchasing a Personalized Product', async ({ page }) => {
    const productUrl = `${process.env.RM_STOREFRONT_URL}product/${testData.productName}`
    await page.goto(productUrl)
    await page.waitForLoadState('load')
    await commonFunction.rejectAllCookies()

    //get Default product price
    const defaultPrice = await personalizeProduct.getDefaultProductPrice()
    await personalizeProduct.personalizeOption.click()
    await personalizeProduct.fillPersonalizeOptionDetails(
      testData.personalizeOptions.option1.name,
      testData.personalizeOptions.option1.number,
    )
    await personalizeProduct.validatePersonalizePreviewMatchesInput(
      testData.personalizeOptions.option1.name,
      testData.personalizeOptions.option1.number,
    )
    await product.addToCart()
    await page.waitForTimeout(2000)
    const personalizedPriceText = await product.miniCartProductPrice('$').innerText()
    const personalizedPrice = await personalizeProduct.extractPriceFromText(personalizedPriceText)
    // Validate that the personalized price is greater than or equal to the None personalised price
    expect(Number(personalizedPrice)).toBeGreaterThanOrEqual(Number(defaultPrice))

    //go to checkout page
    await checkout.selectCheckout()
    await checkout.fillYourDetails(
      testDataCheckout.validData.userDetails.fullName,
      testDataCheckout.validData.userDetails.email,
      testDataCheckout.validData.userDetails.phone,
      testDataCheckout.validData.userDetails.address1,
      testDataCheckout.validData.userDetails.address2,
      testDataCheckout.validData.userDetails.city,
      testDataCheckout.validData.userDetails.postcode,
    )

    await checkout.selectCountry(testDataCheckout.validData.address.testCountry2)
    await checkout.selectState(testDataCheckout.validData.address.testState2)
    await checkout.continueToShipping()
    await checkout.continueToPayment()

    //Go to payment page and fill payment details
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
