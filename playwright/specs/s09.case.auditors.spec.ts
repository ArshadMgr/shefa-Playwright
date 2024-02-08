import {test} from '../fixtures/case.fixture';
import LoginPage from '../pages/utils/login.page';
import { credentials } from '../constants/credentails';
import { Navbar } from '../pages/utils/navbar';
import { AdminProfileMenu } from '../pages/admin/profile.menu';
import { CaseAuditorsPage } from '../pages/case/case.auditors.page';
import { CaseListPage } from '../pages/case/case.list.page';
import { constants as caseConstants } from '../constants/case.text';
import { constants as auditorConstants } from '../constants/case.auditors.text';
import { CaseViewPage } from '../pages/case/case.view.page';
import { CaseOperation } from '../pages/utils/case.operation';
import HomePage from '../pages/home-page/home.page';
import { CasePage } from '../pages/donation-page/case.page';
import Filters from '../pages/home-page/filters.page';

test.describe('S09 - Actions by Auditors', () => {

    test('A001 - Technical Auditor can approve and send case to Medical Auditor', async ({page, createCase}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 250000);

        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);

        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.technicalAuditor);

        await caseListPage.openEditCaseForm(CaseOperation.CaseId);

        await caseAuditorsPage.clickTrackingButtonPrevRequestsOnIdentity();

        await caseAuditorsPage.openActionsDropDown();
        await caseAuditorsPage.doAuditorAction(auditorConstants.approveAndSendToMedicalAuditorText);
        await caseAuditorsPage.fillInternalNotes(auditorConstants.technicalAuditorInternalNotesText);
        
        await caseAuditorsPage.save();
        await caseAuditorsPage.confirm();

        await caseListPage.verifyCaseRecordStatusById(CaseOperation.CaseId, caseConstants.waitingMedicalAuditor);

        await caseListPage.openCaseViewFormById(CaseOperation.CaseId);
        await caseViewPage.verifyAuditorNotes(auditorConstants.technicalAuditorInternalNotesText);

        await page.close();
    });
    test('A002 - Medical Auditor can approve and send case to Marketing Auditor', async ({page, approveCaseByTechnicalAuditor}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 250000);

        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);
        
        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.medicalAuditor);

        await caseListPage.openEditCaseForm(CaseOperation.CaseId);

        await caseAuditorsPage.openActionsDropDown();
        await caseAuditorsPage.doAuditorAction(auditorConstants.approveAndSendToMarketingAuditorText);
        await caseAuditorsPage.fillInternalNotes(auditorConstants.medicalAuditorInternalNotesText);
        
        await caseAuditorsPage.chooseSpecialty(auditorConstants.specialtyText);
        await caseAuditorsPage.chooseActionType(auditorConstants.actionTypeText);
        await caseAuditorsPage.chooseActionDescription(auditorConstants.actionDescriptionText);
        await caseAuditorsPage.chooseCaseEvaluation(auditorConstants.caseEvaluationText);

        await caseAuditorsPage.save();
        await caseAuditorsPage.confirm();

        await caseListPage.verifyCaseRecordStatusById(CaseOperation.CaseId, caseConstants.waitingMarketingAuditor);

        await caseListPage.openCaseViewFormById(CaseOperation.CaseId);
        await caseViewPage.verifyInfoEnteredByMedicalAuditor();
        await caseViewPage.verifyAuditorNotes(auditorConstants.medicalAuditorInternalNotesText);

        await page.close();
    });
    test('A003 - Marketing Auditor can approve and send case to Final Revision', async ({page, approveCaseByMedicalAuditor}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 250000);

        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);
        
        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.marketingAuditor);

        await caseListPage.openEditCaseForm(CaseOperation.CaseId);

        await caseAuditorsPage.openActionsDropDown();
        await caseAuditorsPage.doAuditorAction(auditorConstants.approveAndSendToFinalRevisionText);

        await caseAuditorsPage.fillStoryDetails();
        await caseAuditorsPage.fillInternalNotes(auditorConstants.marketingAuditorInternalNotesText);
        
        await caseAuditorsPage.save();
        await caseAuditorsPage.confirm();

        await caseListPage.openCaseViewFormById(CaseOperation.CaseId);
        await caseViewPage.verifyCaseStatus(caseConstants.waitingFinalApproval);
        await caseViewPage.verifyStoryInfo();
        await caseViewPage.verifyAuditorNotes(auditorConstants.marketingAuditorInternalNotesText);

        await page.close();
    });
    test('A004 - System Admin can approve and send the case to be ready to publish', async ({page, approveCaseByMarketingAuditor}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 350000);

        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);

        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.systemAdmin);

        await caseListPage.openEditCaseForm(CaseOperation.CaseId);

        await caseAuditorsPage.openActionsDropDown();
        await caseAuditorsPage.doAuditorAction(auditorConstants.approveAndSendToBeReadyToPublishText);

        await caseAuditorsPage.fillInternalNotes(auditorConstants.systemAdminReadyToPublishInternalNotesText);
        
        await caseAuditorsPage.save();
        await caseAuditorsPage.confirm();

        await caseListPage.verifyCaseRecordStatusById(CaseOperation.CaseId, caseConstants.readyToPublish);

        await caseListPage.openCaseViewFormById(CaseOperation.CaseId);
        await caseViewPage.verifyAuditorNotes(auditorConstants.systemAdminReadyToPublishInternalNotesText);

        await page.close();
    });
    test('A005 - System Admin can publish the case', async ({page, sendCaseToBeReadyToPublishBySystemAdmin}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 450000);

        const loginPage = new LoginPage(page);
        const homePage: HomePage = new HomePage(page);
        const navbar: Navbar = new Navbar(page);
        const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
        const caseAuditorsPage:CaseAuditorsPage =new CaseAuditorsPage(page);
        const caseListPage:CaseListPage = new CaseListPage(page);
        const caseViewPage:CaseViewPage = new CaseViewPage(page);
        const casePage:CasePage = new CasePage(page);
        const filtersPage: Filters = new Filters(page);

        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await navbar.clickUserToggleLink();
        await navbar.clickControlPanelBtn();
        await adminProfileMenu.checkOrChangeUserRole(auditorConstants.systemAdmin);

        await caseListPage.openEditCaseForm(CaseOperation.CaseId);

        await caseAuditorsPage.openActionsDropDown();
        await caseAuditorsPage.doAuditorAction(auditorConstants.publishCaseText);

        await caseAuditorsPage.fillInternalNotes(auditorConstants.systemAdminPublishInternalNotesText);
        
        await caseAuditorsPage.save();
        await caseAuditorsPage.confirm();

        await caseListPage.verifyCaseRecordStatusById(CaseOperation.CaseId, caseConstants.published);

        await caseListPage.openCaseViewFormById(CaseOperation.CaseId);
        await caseViewPage.verifyAuditorNotes(auditorConstants.systemAdminPublishInternalNotesText);

        await homePage.open();

        await homePage.openFilters();
        await filtersPage.searchCase(CaseOperation.CaseId);

        await casePage.verifyIfCaseFound(CaseOperation.CaseId, true);

        await page.close();
    });
});