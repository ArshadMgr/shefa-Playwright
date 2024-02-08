import {test} from '../fixtures/case.fixture';
import {expect} from '@playwright/test';
import HomePage from "../pages/home-page/home.page";
import {Page} from 'playwright';
import {CasePage} from "../pages/donation-page/case.page";
import Filters from "../pages/home-page/filters.page";
import {Navbar} from "../pages/utils/navbar";
import {DonateCasePage} from "../pages/donation-page/donate-case-page/donate.case.page";
import {TopAmbassadorsPage} from "../pages/top.ambassadors.page";
import {CampaignPage} from "../pages/donation-page/campaign.page";
import {WaqfListCasePage} from "../pages/donation-page/waqf.page";
import {ZakatOptionsPage} from "../pages/donation-page/zakat/zakat.options.page";
import {AllCaseDonationPage} from "../pages/donation-page/all.case.donation.page";
import { WhoWeArePage } from '../pages/who.we.are.page';
import { CaseOperation } from '../pages/utils/case.operation';

test.describe('S01 - Homepage', () => {
    test('HP001 - Visitor can see homepage items', async ({page}: {
        page: Page
    }) => {
        const homePage: HomePage = new HomePage(page);
        const caseCard: CasePage = new CasePage(page);
        const filtersModal: Filters = new Filters(page);

        await homePage.open();
        await homePage.verifyCarouselVisible();

        await homePage.openFilters();
        await filtersModal.verifyAllFiltersAreVisible();
        await homePage.closeFilters();

        await caseCard.verifyAllCardsAreVisible();

        await expect(page.locator(homePage.donationsAmount)).toBeVisible();
        await expect(page.locator(homePage.numberOfCompletedCases)).toBeVisible();
        await expect(page.locator(homePage.topAmbassadors)).toBeVisible();
        await expect(page.locator(homePage.majorDonors)).toBeVisible();
        await expect(page.locator(homePage.healthInitiatives)).toBeVisible();

        await homePage.verifyPartnersLogosVisible();
        await homePage.verifyFooterLinks();

        await page.close();
    });

    test('HP002 - Visitor can see cases page', async ({page, publishCaseBySystemAdmin}, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 550000);

        const homePage: HomePage = new HomePage(page);
        const donateCasePage: DonateCasePage = new DonateCasePage(page);
        const caseCard: CasePage = new CasePage(page);
        const navbar: Navbar = new Navbar(page);

        await homePage.open();
        await homePage.verifyCarouselVisible();
        await navbar.clickCasesLink();
        await caseCard.waitForPageLoad();
        await caseCard.verifyAllCardsAreVisible();

        await caseCard.openLastPage();
        
        await caseCard.clickDonateCaseButton(CaseOperation.CaseId);

        await donateCasePage.waitForPageLoad();
        await donateCasePage.areAllFieldsVisible();

        await page.close();
    });

    test('HP003 - Visitor can see the donation paths', async ({page}: {
        page: Page
    }) => {
        const homePage: HomePage = new HomePage(page);
        const topAmbassadorsPage: TopAmbassadorsPage = new TopAmbassadorsPage(page);
        const campaignPage: CampaignPage = new CampaignPage(page);
        const waqfPage: WaqfListCasePage = new WaqfListCasePage(page);
        const zakatOptionsPage: ZakatOptionsPage = new ZakatOptionsPage(page);
        const allCaseDonationPage: AllCaseDonationPage = new AllCaseDonationPage(page);
        const navbar: Navbar = new Navbar(page);

        await homePage.open();
        await homePage.verifyCarouselVisible();
        await navbar.clickTopAmbassadorsLink();
        await topAmbassadorsPage.waitForPageLoad();
        await navbar.clickCampaignsLink();
        await campaignPage.waitForPageLoad();
        await campaignPage.verifyAllCardsAreVisible();
        await navbar.clickWaqfLink();
        await waqfPage.waitForPageLoad();
        await waqfPage.verifyAllCardsAreVisible();
        await navbar.clickZakatLink();
        await zakatOptionsPage.waitForPageLoad();
        await navbar.clickAllCasesDonationLink();
        await allCaseDonationPage.waitForPageLoad();

        await page.close();
    });

    test('HP004 - Visitor can see who we are page', async ({page}) => {
        const homePage: HomePage = new HomePage(page);
        const whoWeArePage: WhoWeArePage = new WhoWeArePage(page);
        const navbar: Navbar = new Navbar(page);

        await homePage.open();
        await navbar.clickWhoWeAreLink();

        await whoWeArePage.verifyMainHeader();
        await whoWeArePage.verifyAboutShefa();
        await whoWeArePage.verifyAboutusImg();
        await whoWeArePage.verifyShefaObjectives();
        await whoWeArePage.verifyShefaPros();

        await page.close();
    });
});