import {test} from '../fixtures/case.fixture';
import LoginPage from "../pages/utils/login.page";
import HomePage from "../pages/home-page/home.page";
import {Page} from 'playwright';
import { credentials } from '../constants/credentails';
import { Navbar } from '../pages/utils/navbar';
import { CaseListPage } from '../pages/case/case.list.page';
import { CaseOperation } from '../pages/utils/case.operation';
import { CaseCharityPage } from '../pages/case/case.charity.page';
import { AdminProfileMenu } from '../pages/admin/profile.menu';
import {constants as auditorConstants} from '../constants/case.auditors.text';
import {constants as caseConstants} from '../constants/case.text';
import { CaseAuditorsPage } from '../pages/case/case.auditors.page';
import { CasePage } from '../pages/donation-page/case.page';
import { DonateCasePage } from '../pages/donation-page/donate-case-page/donate.case.page';
import { PaymentPage } from '../pages/payment/payment.page';

test.describe('S04 - Charity Panel', () => {
    test('C001 - Can login as charity manager', async ({page}: {
        page: Page
    }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);

        // await homePage.waitForPageLoad();
        await homePage.verifyCarouselVisible();
    });
    test('C002 - Charity can add invoice', async ({page, publishCaseBySystemAdmin}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 700000);

        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const navbar: Navbar = new Navbar(page);
        const casePage = new CasePage(page);
        const donateCasePage = new DonateCasePage(page);
        const paymentPage = new PaymentPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseCharityPage:CaseCharityPage = new CaseCharityPage(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);

        await casePage.clickDonateCaseButton(CaseOperation.CaseId);
        await donateCasePage.donateCase();
        await paymentPage.pay();

        await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);
        await homePage.verifyCarouselVisible();

        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();

        await caseListPage.openAddInvoiceForm(CaseOperation.CaseId);
    
        await caseCharityPage.addInvoice();

        await navbar.clickUserToggleLink();
        await navbar.logout(); 

        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await homePage.verifyCarouselVisible();
      
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.firstFinancialAuditor);

        await caseListPage.verifyCaseRecordStatusById(CaseOperation.CaseId, caseConstants.waitingFirstFinancialAuditor);

        await caseListPage.openAddInvoiceForm(CaseOperation.CaseId);

        await caseAuditorsPage.verifyInvoiceInfo();

        await page.close();
    });
});
