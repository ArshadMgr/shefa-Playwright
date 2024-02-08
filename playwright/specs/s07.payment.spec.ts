import {test} from '../fixtures/case.fixture';
import LoginPage from '../pages/utils/login.page';
import { credentials } from '../constants/credentails';
import { PaymentPage } from '../pages/payment/payment.page';
import { CasePage } from '../pages/donation-page/case.page';
import { DonateCasePage } from '../pages/donation-page/donate-case-page/donate.case.page';
import HomePage from '../pages/home-page/home.page';
import Filters from '../pages/home-page/filters.page';
import { CaseOperation } from '../pages/utils/case.operation';

test.describe('S07 - Payment process', () => {
    test('P001 - Payment fields are displayed successfully', async ({page, publishCaseBySystemAdmin}, testInfo) => {
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
        await paymentPage.verifyAllFields();

        await page.close();
    });
});
