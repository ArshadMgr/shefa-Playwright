import {test} from '@playwright/test';
import LoginPage from '../pages/utils/login.page';
import { credentials } from '../constants/credentails';
import { Navbar } from '../pages/utils/navbar';
import { CaseCreatePage } from '../pages/case/case.create.page';
import { CaseViewPage } from '../pages/case/case.view.page';
import { CaseListPage } from '../pages/case/case.list.page';
import { constants } from '../constants/case.text';

test.describe('S08 - Create new case', () => {
    test('C001 - Charity manager can create new visa case', async ({page}) => {
        //too long test
        test.setTimeout(100000);

        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const caseCreatePage:CaseCreatePage = new CaseCreatePage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);

        await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await caseCreatePage.addNewCase();
        await caseListPage.verifyFirstCaseRecordExist();
        await caseListPage.verifyFirstRecordIdentity();
        await caseListPage.verifyFirstCaseRecordStatus(constants.waitingTechnicalAuditor);
        await caseListPage.openFirstCaseViewForm();
        await caseViewPage.verifyCaseFields();

        await page.close();
    });
});
