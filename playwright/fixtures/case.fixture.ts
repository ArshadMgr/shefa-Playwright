import { test as base } from '@playwright/test';
import { CaseOperation } from '../pages/utils/case.operation';
import LoginPage from '../pages/utils/login.page';
import HomePage from '../pages/home-page/home.page';
import { Navbar } from '../pages/utils/navbar';
import { credentials } from '../constants/credentails';
import { AdminProfileMenu } from '../pages/admin/profile.menu';
import {constants as auditorConstants} from '../constants/case.auditors.text';
import {constants as apiConstants} from '../constants/case.api.text';
import {constants as caseConstants} from '../constants/case.text';
import { General } from '../pages/utils/general';
import {constants as generalConstants} from '../constants/general.text';

// Declare the types of your fixtures.
type MyFixtures = {
  createCase: CaseOperation,
  approveCaseByTechnicalAuditor: CaseOperation,
  approveCaseByMedicalAuditor: CaseOperation,
  approveCaseByMarketingAuditor: CaseOperation,
  sendCaseToBeReadyToPublishBySystemAdmin: CaseOperation,
  publishCaseBySystemAdmin: CaseOperation
};

export const test = base.extend<MyFixtures>({
  createCase: [ async ({ page }, use) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const navbar: Navbar = new Navbar(page);

    await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);
    await homePage.verifyCarouselVisible();
        
    const caseOperation: CaseOperation = new CaseOperation(page);
    await caseOperation.addNewCaseByAPIs();

    await navbar.clickUserToggleLink();
    await navbar.logout();   

    // Use the fixture value in the test.
    await use(caseOperation);
  }, { timeout: 150000 }],
  approveCaseByTechnicalAuditor: [ async ({ page, createCase }, use) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const navbar: Navbar = new Navbar(page);
    const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);

    await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
    await homePage.verifyCarouselVisible();

    await navbar.clickUserToggleLink();
    await navbar.clickControlPanelBtn();
    await adminProfileMenu.checkOrChangeUserRole(auditorConstants.technicalAuditor);

    const caseOperation: CaseOperation = new CaseOperation(page);

    const caseObj = await caseOperation.getCaseDetailsByAPIs();

    const phases = [
      {
          "story_title": null,
          "story_photo": null,
          "story_content": null
      }
    ];
    await caseOperation.doActionByAuditorByAPIs(caseObj, apiConstants.waitingMedicalAuditorApprovalStatus, auditorConstants.technicalAuditorInternalNotesText, phases);

    await navbar.clickUserToggleLink();
    await navbar.logout(); 

    await use(caseOperation);
  }, { timeout: 150000 }],
  approveCaseByMedicalAuditor: [ async ({ page, approveCaseByTechnicalAuditor }, use) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const navbar: Navbar = new Navbar(page);
    const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);

    await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
    await homePage.verifyCarouselVisible();

    await navbar.clickUserToggleLink();
    await navbar.clickControlPanelBtn();
    await adminProfileMenu.checkOrChangeUserRole(auditorConstants.medicalAuditor);

    const caseOperation: CaseOperation = new CaseOperation(page);

    const caseObj = await caseOperation.getCaseDetailsByAPIs();

    const phases = [
      {
          "story_title": null,
          "story_photo": null,
          "story_content": null
      }
    ];
    await caseOperation.doActionByAuditorByAPIs(caseObj, apiConstants.waitingMarketingAuditorApprovalStatus, auditorConstants.medicalAuditorInternalNotesText, phases, apiConstants.specialty, apiConstants.actionType, apiConstants.actionDescription, apiConstants.evaluation);

    await navbar.clickUserToggleLink();
    await navbar.logout(); 

    await use(caseOperation);
  }, { timeout: 150000 }]
,
approveCaseByMarketingAuditor: [ async ({ page, approveCaseByMedicalAuditor }, use) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const navbar: Navbar = new Navbar(page);
    const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);
  
    await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
    await homePage.verifyCarouselVisible();
  
    await navbar.clickUserToggleLink();
    await navbar.clickControlPanelBtn();
    await adminProfileMenu.checkOrChangeUserRole(auditorConstants.marketingAuditor);
  
    const caseOperation: CaseOperation = new CaseOperation(page);
  
    const caseObj = await caseOperation.getCaseDetailsByAPIs();
  
    const phases = caseObj.medical_information.phases;
  
    phases[0].amount = caseConstants.financialCost;
    phases[0].story_title = auditorConstants.storyTitleText;
    phases[0].story_content = auditorConstants.shownStoryText;
  
    const general: General = new General(page);
    phases[0].story_photo = general.convertfileToBase64String(auditorConstants.storyPhotoFilePath, generalConstants.pngImgbase64Text);
    
    await caseOperation.doActionByAuditorByAPIs(caseObj, apiConstants.waitingFinalApprovalStatus, auditorConstants.marketingAuditorInternalNotesText, phases);
  
    await navbar.clickUserToggleLink();
    await navbar.logout(); 
  
    await use(caseOperation);
}, { timeout: 250000 }]
,
sendCaseToBeReadyToPublishBySystemAdmin: [ async ({ page, approveCaseByMarketingAuditor }, use) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const navbar: Navbar = new Navbar(page);
  const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);

  await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
  await homePage.verifyCarouselVisible();

  await navbar.clickUserToggleLink();
  await navbar.clickControlPanelBtn();
  await adminProfileMenu.checkOrChangeUserRole(auditorConstants.systemAdmin);

  const caseOperation: CaseOperation = new CaseOperation(page);

  const caseObj = await caseOperation.getCaseDetailsByAPIs();

  const phases = caseObj.medical_information.phases;

  phases[0].amount = caseConstants.financialCost;
  phases[0].initialImageLoaded = true;

  await caseOperation.doActionByAuditorByAPIs(caseObj, apiConstants.readyToBePublishedStatus, auditorConstants.systemAdminReadyToPublishInternalNotesText, phases);

  await navbar.clickUserToggleLink();
  await navbar.logout(); 

  await use(caseOperation);
}, { timeout: 350000 }]
,
publishCaseBySystemAdmin: [ async ({ page, sendCaseToBeReadyToPublishBySystemAdmin }, use) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const navbar: Navbar = new Navbar(page);
  const adminProfileMenu: AdminProfileMenu = new AdminProfileMenu(page);

  await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
  await homePage.verifyCarouselVisible();

  await navbar.clickUserToggleLink();
  await navbar.clickControlPanelBtn();
  await adminProfileMenu.checkOrChangeUserRole(auditorConstants.systemAdmin);

  const caseOperation: CaseOperation = new CaseOperation(page);

  const caseObj = await caseOperation.getCaseDetailsByAPIs();

  const phases = caseObj.medical_information.phases;

  phases[0].amount = caseConstants.financialCost;
  phases[0].initialImageLoaded = true;

  await caseOperation.doActionByAuditorByAPIs(caseObj, apiConstants.publishedStatus, auditorConstants.systemAdminPublishInternalNotesText, phases);

  await navbar.clickUserToggleLink();
  await navbar.logout(); 

  await use(caseOperation);
}, { timeout: 450000 }]
});