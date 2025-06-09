import { Page, Locator, expect } from '@playwright/test'
import adminData from '@src/fixtures/realMadrid/adminDetails.json'

export class pricingFeature {
  readonly page: Page
  readonly addOfferBtn: Locator
  readonly inputOfferName: Locator
  readonly inputDiscountAmount: Locator
  readonly cartSubtotalInput: Locator

  // Maximum usage section
  readonly maxTotalUsesInput: Locator
  readonly maxUsesPerOrderInput: Locator
  readonly maxUsesPerUserInput: Locator

  // Toggles for usage type (Limited)
  readonly maxTotalUsesLimitedToggle: Locator
  readonly maxUsesPerOrderLimitedToggle: Locator
  readonly maxUsesPerUserLimitedToggle: Locator

  // Combinability section
  readonly combinabilityContainer: Locator
  readonly strategyDropdown: Locator
  readonly stackableToggle: Locator
  readonly qualifiersAsQualifiersToggle: Locator
  readonly qualifiersAsTargetsToggle: Locator
  readonly addOverrideBtn: Locator

  // Advanced Options
  readonly currencyCodeInput: Locator
  readonly maxUsesPerUserFrequencyInput: Locator

  // Create offer
  readonly createOfferBtn: Locator

  // Create offer code modal
  readonly createOfferCodeBtn: Locator
  readonly inputofferCode: Locator
  readonly maxUsesCodeInput: Locator
  readonly maxUsesPerUserCodeInput: Locator
  readonly submitCreateOfferCodeButton: Locator // submit button on create offer code modal

  constructor(page: Page) {
    this.page = page
    this.addOfferBtn = page.getByRole('button', { name: 'Add Offer' })

    // Basic Info
    const basicInfo = page.locator('#basic-information')
    this.inputOfferName = basicInfo.locator('input[name="name"]')
    this.inputDiscountAmount = basicInfo.locator('input[name="discount.amount"]')
    this.cartSubtotalInput = page.locator('#cartSubtotal')

    // Usage Restrictions
    const usage = page.locator('#maximum-usage')
    this.maxTotalUsesInput = usage.locator('input[name="maxUses"]')
    this.maxUsesPerOrderInput = usage.locator('input[name="maxUsesPerOrder"]')
    this.maxUsesPerUserInput = usage.locator('input[name="maxUsesPerUser"]')
    this.maxTotalUsesLimitedToggle = usage
      .locator('label[for="toggleSwitch-undefined-false"]')
      .nth(0)
    this.maxUsesPerOrderLimitedToggle = usage
      .locator('label[for="toggleSwitch-undefined-false"]')
      .nth(1)
    this.maxUsesPerUserLimitedToggle = usage
      .locator('label[for="toggleSwitch-undefined-false"]')
      .nth(2)

    // Combinability
    this.combinabilityContainer = page.locator('#combinability')
    this.strategyDropdown = this.combinabilityContainer.locator(
      '#combinabilityType .Select__control',
    )
    this.stackableToggle = this.combinabilityContainer.locator(
      'label[for="toggleSwitch-stackable-true"]',
    )
    this.qualifiersAsQualifiersToggle = this.combinabilityContainer.locator(
      'input[name="qualifiersCanBeQualifiers"]',
    )
    this.qualifiersAsTargetsToggle = this.combinabilityContainer.locator(
      'input[name="qualifiersCanBeTargets"]',
    )
    this.addOverrideBtn = this.combinabilityContainer.getByRole('button', {
      name: 'Add Combinability Overrides',
    })

    // Advanced Options
    const advanced = page.locator('#advanced-options')
    this.currencyCodeInput = advanced.locator('input[name="currency"]')
    this.maxUsesPerUserFrequencyInput = advanced.locator('input[name="maxUsesPerUserFrequency"]')

    // Create offer
    this.createOfferBtn = page.getByRole('button', { name: 'Create Offer' })

    // Offer code modal
    this.createOfferCodeBtn = page.getByRole('button', { name: 'Create Offer Code' })
    this.inputofferCode = page.locator('input[name="code"]')
    this.maxUsesCodeInput = page.locator('input[name="maxUses"]').nth(1)
    this.maxUsesPerUserCodeInput = page.locator('input[name="maxUsesPerUser"]').nth(1)
    this.submitCreateOfferCodeButton = page.getByText('Submit')
  }

  async addOffer(): Promise<void> {
    await this.addOfferBtn.click()
    await this.page.waitForTimeout(1000)
  }

  async generateOfferName(): Promise<string> {
    const random = Math.floor(Math.random() * 10000)
    return `${adminData.Offers.basicInfo.offerName} ${random}`
  }

  async generateOfferCode(): Promise<string> {
    const random = Math.floor(Math.random() * 1000)
    return `${adminData.Offers.basicInfo.offerCode}${random}`
  }

  async addBasicInfo(): Promise<string> {
    const { discountAmount, minCartValue } = adminData.Offers.basicInfo
    const offerName = await this.generateOfferName()
    await this.inputOfferName.fill(offerName)
    await this.inputDiscountAmount.fill(discountAmount)
    await this.cartSubtotalInput.fill(minCartValue)
    return offerName
  }

  async setMaximumUsageRestrictions(): Promise<void> {
    const restrictions = adminData.Offers.userRestrictions
    await this.maxTotalUsesLimitedToggle.click()
    await this.maxUsesPerOrderLimitedToggle.click()
    await this.maxUsesPerUserLimitedToggle.click()
    await this.maxTotalUsesInput.fill(restrictions.maximumTotalUses)
    await this.maxUsesPerOrderInput.fill(restrictions.maximumUsesPerOrder)
    await this.maxUsesPerUserInput.fill(restrictions.maximumUsesPerUser)
  }

  async setCombinabilityOptions(): Promise<void> {
    const { stackable } = adminData.Offers.combinability
    if (
      !(await this.page.locator('input[name="stackable"][value="true"]').isChecked()) &&
      stackable
    ) {
      await this.stackableToggle.click()
    }

    // Future-use (optional)
    // const { combinabilityStrategy, qualifiersCanBeQualifiers, qualifiersCanBeTargets } = adminData.Offers.combinability;
    // await this.strategyDropdown.click();
    // await this.page.locator(`.Select__option >> text=${combinabilityStrategy}`).click();
    // if (qualifiersCanBeQualifiers) await this.qualifiersAsQualifiersToggle.click();
    // if (qualifiersCanBeTargets) await this.qualifiersAsTargetsToggle.click();
    // await this.addOverrideBtn.click();
  }

  async setAdvancedOptions(): Promise<void> {
    const advanced = adminData.Offers.advancedOptions

    await this.page.getByRole('button', { name: 'Advanced Options' }).click()

    await expect(this.currencyCodeInput).toBeVisible()
    await this.currencyCodeInput.fill(advanced.currencyCode)
    await this.maxUsesPerUserFrequencyInput.fill(advanced.maxUsesPerUserFrequency)
  }

  async clickOfferButton() {
    await this.createOfferBtn.click()
    await this.page.waitForTimeout(1000)
  }

  async clickCreateOfferCode(): Promise<string> {
    const { maximumTotalUses, maximumUsesPerUser } = adminData.Offers.userRestrictions

    await this.createOfferCodeBtn.waitFor({ state: 'visible' })
    await this.createOfferCodeBtn.click()
    await this.page.waitForTimeout(1000)

    const code = await this.generateOfferCode()
    await this.inputofferCode.fill(code)

    // Set values in the modal and keep Limited as default
    await this.maxUsesCodeInput.fill(maximumTotalUses)
    await this.maxUsesPerUserCodeInput.fill(maximumUsesPerUser)
    await this.submitCreateOfferCodeButton.click()
    await this.page.waitForTimeout(1000)
    return code
  }
}
