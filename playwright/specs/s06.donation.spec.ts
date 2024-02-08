import {test} from '../fixtures/case.fixture';
import LoginPage from '../pages/utils/login.page';
import { credentials } from '../constants/credentails';
import {CasePage} from "../pages/donation-page/case.page";
import { DonateCasePage } from '../pages/donation-page/donate-case-page/donate.case.page';
import { PaymentPage } from '../pages/payment/payment.page';
import { CaseOperation } from '../pages/utils/case.operation';
import { Navbar } from '../pages/utils/navbar';
import HomePage from '../pages/home-page/home.page';
import Filters from '../pages/home-page/filters.page';

test.describe('S06 - Donation process', () => {
    test('D001 - Donor can donate all remaining amount', async ({page, publishCaseBySystemAdmin}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 550000);

        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const casePage = new CasePage(page);
        const donateCasePage = new DonateCasePage(page);
        const paymentPage = new PaymentPage(page);
        const navbar: Navbar = new Navbar(page);
        const filtersPage: Filters = new Filters(page);

        await loginPage.loginAsDonor(credentials.donor.phoneNumber, credentials.donor.otpCode);

        await homePage.openFilters();
        await filtersPage.searchCase(CaseOperation.CaseId);

        await casePage.clickDonateCaseButton(CaseOperation.CaseId);
        await donateCasePage.donateCase();
        await paymentPage.pay();
        await donateCasePage.verifyDonateSuccessfullyDonor(CaseOperation.CaseId);

        await navbar.clickUserToggleLink();
        await navbar.logout(); 

        await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);
        await homePage.verifyCarouselVisible();

        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();

        await donateCasePage.verifyDonateSuccessfullyCharity(CaseOperation.CaseId);

        await page.close();
    });
    test('D002 - Donation success dialog should appear correctly after donation successfully', async ({page, baseURL, publishCaseBySystemAdmin}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 550000);

        const loginPage = new LoginPage(page);
        const casePage = new CasePage(page);
        const donateCasePage = new DonateCasePage(page);
        const paymentPage = new PaymentPage(page);
        const homePage = new HomePage(page);
        const filtersPage: Filters = new Filters(page);

        await loginPage.loginAsDonor(credentials.donor.phoneNumber, credentials.donor.otpCode);

        await homePage.openFilters();
        await filtersPage.searchCase(CaseOperation.CaseId);

        await casePage.clickDonateCaseButton(CaseOperation.CaseId);
        await donateCasePage.donateCase();
        await paymentPage.pay();
        await donateCasePage.verifyDonateSuccessfullyDialogFields(baseURL, CaseOperation.CaseId);
        await page.close();
    });
});
