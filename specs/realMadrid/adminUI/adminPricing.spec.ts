import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { AddCategory } from '@src/pageObject/realMadrid/adminUI/addCategory'
import { pricingFeature } from '@src/pageObject/realMadrid/adminUI/pricing'
import adminData from '@src/fixtures/realMadrid/adminDetails.json'
import { test, expect } from '@playwright/test'

test.describe('Pricing Management', () => {
  let commonFunction: CommonUtils
  let navigation: Navigation
  let category: AddCategory
  let pricing: pricingFeature

  test.beforeEach('Visiting', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new Navigation(page)
    category = new AddCategory(page)
    pricing = new pricingFeature(page)
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

    // promoting the offer code
    await category.promoteProductToSandbox() // will make promote in common function later.
    await page.waitForTimeout(30000)
  })
})
