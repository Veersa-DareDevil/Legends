import { test } from '@playwright/test';
import ApparelPage from '../../../src/pageObject/mobileUI/ApparelPage';

test.describe('Apparel Buying End-to-End Test', () => {

  test('should allow a user to buy apparel from the homepage', async ({ page }) => {
    const apparelPage = new ApparelPage(page);

    // Navigate to homepage 
    await apparelPage.navigateToHomePage();
    await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page is fully loaded
    // Click on Fashion link
    await apparelPage.clickFashionButton();

    // Click on Mens Bring Back 99/00 Track Pants
    await apparelPage.clickMensTrackPants();

    // Select size L
    await apparelPage.selectSize('L');

    // Add to Cart
    await apparelPage.addToCart();

    // Verify Cart Contents
    await apparelPage.verifyCartContents();

    // Click Checkout on Cart page
    await apparelPage.clickCartCheckout();

    // Fill Contact Details
    await apparelPage.fillContactDetails('abhinav', 'test@gmail.com', '7777777777', 'India');

    // Fill Shipping Address
    await apparelPage.fillShippingAddress('street-1', '120', 'Ghaziabad', 'Uttar Pradesh', '210012');

    // Accept Consent
    await apparelPage.acceptConsent();

    // Continue to Shipping
    await apparelPage.continueToShipping();

    // Back to details and continue to shipping again (as per codegen)
    // await apparelPage.backToDetailsButton.click();
    // await apparelPage.continueToShippingButton.click();

    // Continue to Payment
    await apparelPage.continueToPayment();

    // Verify invalid card message
    await apparelPage.verifyInvalidCardMessage('6666 6666 6666 6666');

    // Fill Payment Details (using valid card details for testing)
    await apparelPage.fillPaymentDetails('Test Card', '4242 4242 4242 4242', '12/25', '123');

    // Click Same as delivery address
    await apparelPage.clickSameAsDeliveryAddress();

    // Click Confirm & Pay (This will likely fail with invalid card details)
    await apparelPage.clickConfirmAndPay(); // Uncomment if you want to attempt the final click
  });
});
