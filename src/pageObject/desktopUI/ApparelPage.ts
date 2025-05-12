import { Page, Locator, expect } from '@playwright/test';
import testData from '../../fixtures/validationData.json';

export default class CommonFunction {
  readonly page: Page;
  readonly acceptCookiesButton: Locator;
  readonly realMadridLogoLink: Locator;
  readonly fashionCollectionLink: Locator;
  readonly fashionHeading: Locator;
  readonly fashionDescription: Locator;
  readonly mensTrackPantsLink: Locator;
  readonly productBreadcrumb: Locator;
  readonly productTitleHeading: Locator;
  readonly sizeButton: (size: string) => Locator;
  readonly addToCartButton: Locator;
  readonly yourBagHeading: Locator;
  readonly cartItemName: Locator;
  readonly subtotalText: Locator;
  readonly totalText: Locator;
  readonly cartCheckoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly yourDetailsHeading: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly countryDropdown: Locator;
  readonly countryOption: (country: string) => Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly cityInput: Locator;
  readonly stateDropdown: Locator;
  readonly stateOption: (state: string) => Locator;
  readonly postalCodeInput: Locator;
  readonly consentCheckboxGroup: Locator;
  readonly consentCheckbox: Locator;
  readonly continueToShippingButton: Locator;
  readonly standardShippingButton: Locator;
  readonly expressShippingButton: Locator;
  readonly backToDetailsButton: Locator;
  readonly continueToPaymentButton: Locator;
  readonly paymentHeading: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvcInput: Locator;
  readonly nameOnAccountInput: Locator;
  readonly sameAsDeliveryAddressButton: Locator;
  readonly confirmAndPayButton: Locator;
  readonly invalidCardNumberMessage: Locator;
  readonly fashionHeadingDropdown: Locator;
  readonly policyReject: Locator;
  readonly yourDetalsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All Cookies' });
    this.realMadridLogoLink = page.getByRole('link', { name: 'New Real Madrid Logo' });
    this.fashionCollectionLink = page.getByRole('link', { name: 'Fashion' });
    this.fashionHeading = page.getByRole('heading', { name: 'Fashion' });
    this.fashionHeadingDropdown = page.locator('[id="headlessui-popover-button-\\:R2onil26\\:"]')
    this.fashionDescription = page.locator('div').filter({ hasText: /^Fashion from Real Madrid: elegance and passion in every garment\.$/ }).first();
    this.mensTrackPantsLink = page.getByRole('link', { name: 'Mens Bring Back 99/00 Track Pants $' });
    this.productBreadcrumb = page.locator('div').filter({ hasText: /^Home>Mens Bring Back 99\/00 Track PantsMens Bring Back 99\/00 Track PantsHome$/ });
    this.productTitleHeading = page.getByRole('heading', { name: 'Mens Bring Back 99/00 Track' });
    this.sizeButton = (size: string) => page.getByRole('option', { name: 'Variant Swatch' }).filter({ hasText: new RegExp(`^${size}$`) });
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.yourBagHeading = page.getByRole('heading', { name: 'Your bag | 1 Item' });
    this.cartItemName = page.getByTestId('minicart').getByRole('link', { name: 'Mens Bring Back 99/00 Track' });
    this.subtotalText = page.getByText('Subtotal$');
    this.totalText = page.getByText('Total', { exact: true });
    this.policyReject = page.getByRole('button', { name: 'Reject All' })
    this.cartCheckoutButton = page.locator('[data-testid="checkoutbutton"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.yourDetailsHeading = page.getByText('Your detailsEditYour');
    this.fullNameInput = page.locator('input[name="fullName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneNumberInput = page.locator('input[name="phoneNumber"]');
    this.countryDropdown = page.locator('.css-n9qnu9').first(); // This locator is fragile, consider improving if possible
    this.countryOption = (country: string) => page.getByRole('option', { name: country, exact: true });
    this.addressLine1Input = page.locator('input[name="addressLine1"]');
    this.addressLine2Input = page.locator('input[name="addressLine2"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateDropdown = page.locator('div').filter({ hasText: /^State\/Province\/Region$/ }).nth(1); // This locator is fragile, consider improving if possible
    this.stateOption = (state: string) => page.getByRole('option', { name: state });
    this.postalCodeInput = page.locator('input[name="postalCode"]');
    this.consentCheckboxGroup = page.getByRole('group').locator('div').filter({ hasText: 'I consent that REAL MADRID' }).first(); // This locator is fragile, consider improving if possible
    this.consentCheckbox = page.getByLabel('', { exact: true }); // This locator is fragile, consider improving if possible
    this.continueToShippingButton = page.getByRole('button', { name: 'Continue to shipping' });
    this.yourDetalsSection = page.locator('.relative > .p-6').first(); // This locator is fragile, consider improving if possible
    this.standardShippingButton = page.getByRole('button', { name: 'Standard Transportation time' });
    this.expressShippingButton = page.getByRole('button', { name: 'Express Transportation time 7' });
    this.backToDetailsButton = page.getByRole('button', { name: 'Back to details' });
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' });
    this.paymentHeading = page.locator('div').filter({ hasText: /^Payment$/ }).nth(1); // This locator is fragile, consider improving if possible
    // Locate Stripe iframes by filtering based on the presence of their specific input fields
    // Stripe fields via frameLocator + title attribute
    this.cardNumberInput = page
      .frameLocator('iframe[title="Secure card number input frame"]')
      .locator('input[name="cardnumber"]');

    this.expiryDateInput = page
      .frameLocator('iframe[title="Secure expiration date input frame"]')
      .locator('input[name="exp-date"]');

    this.cvcInput = page
      .frameLocator('iframe[title="Secure CVC input frame"]')
      .locator('input[name="cvc"]');
    this.nameOnAccountInput = page.locator('input[name="nameOnAccount"]');
    this.sameAsDeliveryAddressButton = page.getByRole('button', { name: 'Same as delivery address' });
    this.confirmAndPayButton = page.getByTestId('paybutton'); 
    this.invalidCardNumberMessage = page.getByText(testData.invalidCardNumberMessage, { exact: true });
  }

  async navigateToHomePage() {
    await this.page.goto('/');
    await expect(this.realMadridLogoLink).toBeVisible();
  }

  async clickFashionLink() {
    await this.policyReject.click();
    await this.page.waitForTimeout(2000);
    // await this.fashionCollectionLink.click();
    // await this.page.waitForTimeout(1000); // Wait for dropdown animation to complete
    // await this.page.mouse.move(0, 0); // Move mouse away from dropdown
    // await this.page.waitForTimeout(2000); // Wait for page load
    if (await this.fashionHeadingDropdown.isVisible()) {
      
      await this.fashionHeadingDropdown.click({force: true});
    }
    await expect(this.fashionHeading).toBeVisible();
  }

  async clickMensTrackPants() {
    await this.mensTrackPantsLink.click({ force: true });
    await this.page.waitForTimeout(3000); // Wait for 2 seconds to ensure the page is fully loaded
    if (await this.fashionHeadingDropdown.isVisible()) {
      await this.fashionHeadingDropdown.click({force: true});
    }
    await expect(this.productBreadcrumb).toBeVisible();
    await expect(this.productTitleHeading).toBeVisible();
  }

  async selectSize(size: string) {
    await this.sizeButton(size).click({ force: true });
  }

  async addToCart() {
    await this.addToCartButton.click({force: true});
    await expect(this.yourBagHeading).toBeVisible({ timeout: 8000 });
  }

  async verifyCartContents() {
    await expect(this.cartItemName).toBeVisible();
    await expect(this.subtotalText).toBeVisible();
    await expect(this.totalText).toBeVisible();
    await expect(this.cartCheckoutButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
    // Wait for 2 seconds to ensure the page is fully loaded
  }

  async clickCartCheckout() {
    await this.cartCheckoutButton.click();

    await expect(this.yourDetailsHeading).toBeVisible({ timeout: 8000 });
  }

  async fillContactDetails(fullName: string, email: string, phoneNumber: string, country: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.countryDropdown.click();
    await this.countryOption(country).click();
  }

  async fillShippingAddress(address1: string, address2: string, city: string, state: string, postalCode: string) {
    await this.addressLine1Input.fill(address1);
    await this.addressLine2Input.fill(address2);
    await this.cityInput.fill(city);
    await this.stateDropdown.click();
    await this.stateOption(state).click();
    await this.postalCodeInput.fill(postalCode);
  }

  async acceptConsent() {
    await expect(this.consentCheckboxGroup).toBeVisible();
    await this.consentCheckbox.check();
    await expect(this.continueToShippingButton).toBeVisible();
  }

  async continueToShipping() {
    await this.continueToShippingButton.click({force: true});
    await this.page.waitForTimeout(10000); // Wait for navigation
    await Promise.all([
      expect(this.yourDetalsSection).toBeVisible({ timeout: 10000 }),
      expect(this.standardShippingButton).toBeVisible({ timeout: 10000 }),
      expect(this.expressShippingButton).toBeVisible({ timeout: 10000 }),
      expect(this.backToDetailsButton).toBeVisible({ timeout: 10000 })
    ]);
    await this.validateDetailsData();
  }

  async validateDetailsData() {
    const detailsText = await this.yourDetalsSection.textContent();
    console.log('Details Section Text:', detailsText);
    //data validation
    expect(detailsText).toContain(testData.details.name);
    expect(detailsText).toContain(testData.details.street);
    expect(detailsText).toContain(testData.details.zip);
    expect(detailsText).toContain(testData.details.city);
    expect(detailsText).toContain(testData.details.state);
    expect(detailsText).toContain(testData.details.country);
    expect(detailsText).toContain(testData.details.phone);
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click();
    await expect(this.cardNumberInput).toBeVisible({ timeout: 5000 });
    await expect(this.expiryDateInput).toBeVisible({ timeout: 5000 });
    await expect(this.cvcInput).toBeVisible({ timeout: 5000 });
    await expect(this.nameOnAccountInput).toBeVisible({ timeout: 5000 });
  }


  async fillPaymentDetails(nameOnAccount: string, cardNumber: string, expiry: string, cvc: string) {
    await this.nameOnAccountInput.fill(nameOnAccount);
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiry);
    await this.cvcInput.fill(cvc);
  }

  async clickSameAsDeliveryAddress() {
    await expect(this.sameAsDeliveryAddressButton).toBeVisible();
    await this.sameAsDeliveryAddressButton.click();
  }

  async clickConfirmAndPay() {
    await this.confirmAndPayButton.click();
  }

  async verifyInvalidCardMessage(cardNumber: string) {
    await this.cardNumberInput.fill(cardNumber);
    await expect(this.invalidCardNumberMessage).toBeVisible();
    await this.cardNumberInput.clear()
  }
}
