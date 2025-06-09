import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { AddCategory } from '@src/pageObject/realMadrid/adminUI/addCategory'
import { pricingFeature } from '@src/pageObject/realMadrid/adminUI/pricing'
import adminData from '@src/fixtures/realMadrid/adminDetails.json'

// importing storefront files 
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'
import { CheckoutPage } from '@src/pageObject/realMadrid/desktopUI/checkout'
import testData from '@src/fixtures/realMadrid/checkoutValidation.json'
import { test, expect } from '@playwright/test'

test.describe('Pricing Management', () => {
    // admin
    let commonFunction: CommonUtils
    let navigation: Navigation
    let category: AddCategory
    let pricing: pricingFeature

    // store front
    let product: Product
    let checkout: CheckoutPage

    test.beforeEach('Visiting', async ({ page }) => {
        test.setTimeout(180000)
        commonFunction = new CommonUtils(page)
        navigation = new Navigation(page)
        category = new AddCategory(page)
        pricing = new pricingFeature(page)
        product = new Product(page)       //storefront
        checkout = new CheckoutPage(page) //storefront
        await commonFunction.goToPortal('admin')
        await commonFunction.loginToAdmin()
        await page.waitForTimeout(2000)
    })

    test('192837 - Create an Offer', async ({ page }) => {
        await navigation.clickPricing()
        await navigation.clickOffers()
        await pricing.addOffer()
        await pricing.addBasicInfo()
        const offerName = await pricing.addBasicInfo()

        // Assertions for basic info
        await expect(pricing.inputOfferName).toHaveValue(offerName)
        await expect(pricing.inputDiscountAmount).toHaveValue(adminData.Offers.basicInfo.discountAmount)
        await expect(pricing.cartSubtotalInput).toHaveValue(adminData.Offers.basicInfo.minCartValue)

        // Set usage restrictions
        await pricing.setMaximumUsageRestrictions()

        // Assertions for usage restrictions
        await expect(pricing.maxTotalUsesInput).toHaveValue(
            adminData.Offers.userRestrictions.maximumTotalUses,
        )
        await expect(pricing.maxUsesPerOrderInput).toHaveValue(
            adminData.Offers.userRestrictions.maximumUsesPerOrder,
        )
        await expect(pricing.maxUsesPerUserInput).toHaveValue(
            adminData.Offers.userRestrictions.maximumUsesPerUser,
        )

        // Set combinability options
        await pricing.setCombinabilityOptions()

        // Set and validate advanced options
        await pricing.setAdvancedOptions()
        await expect(pricing.currencyCodeInput).toHaveValue(
            adminData.Offers.advancedOptions.currencyCode,
        )

        // --- [Future fields validation - Uncomment if implemented] ---
        // await expect(pricing.maxSavingsPerOrderInput).toHaveValue(adminData.Offers.advancedOptions.maxSavingsPerOrder);
        // await expect(pricing.excludeDiscountedItemsToggle).toBeChecked();
        // await expect(pricing.limitToTimesToggle).toBeChecked();
        // await expect(pricing.maxUsesPerUserFrequencyInput).toHaveValue(adminData.Offers.advancedOptions.maxUsesPerUserFrequency);

        // click on create offer button
        await pricing.clickOfferButton()

        // click on create offer code button
        await pricing.clickCreateOfferCode()
        const code = await pricing.clickCreateOfferCode();

        // promoting the offer code
        await category.promoteProductToSandbox() // will make promote in common function later.
        await page.waitForTimeout(10000)

        // navigate to storefront
        const storefrontURL = `${process.env.RM_STOREFRONT_URL}`
        await page.goto(storefrontURL)
        await page.waitForLoadState('load')

        // verifying created offer code on store front
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

        await checkout.selectCountry(testData.validData.address.testCountry2);
        await checkout.selectState(testData.validData.address.testState2);
        await checkout.continueToShipping();
        await checkout.continueToPaymentButton.waitFor({ state: 'visible' });
        await checkout.verifyCurrency(testData.validData.currency.EUR);
        await page.waitForTimeout(5000)

        //applying discount code
        await checkout.addDiscountCode(code);
        await expect(page.getByText(code).nth(1)).toBeVisible();
        await expect(page.getByText(code).nth(1)).toHaveText(code);
    })
})
