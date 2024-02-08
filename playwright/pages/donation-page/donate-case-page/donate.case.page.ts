import {Page} from 'playwright';
import {expect} from "@playwright/test";
import { DonateCaseDialog } from './donate.case.dialog';
import { CasePage } from '../case.page';
import { CaseListPage } from '../../case/case.list.page';
import { constants as caseConstants } from '../../../constants/case.text';
import HomePage from '../../home-page/home.page';
import Filters from '../../home-page/filters.page';

export class DonateCasePage {

    private readonly page: Page;
    private remainingAmount: string| null;
    
    private readonly headerSelector: string = `h2[data-cy="donate-case-card-header"]`;
    private readonly donate10sarSelector: string = `div[data-cy="donate-10-sar"]`;
    private readonly donate50sarSelector: string = `div[data-cy="donate-50-sar"]`;
    private readonly donate100sarSelector: string = `div[data-cy="donate-100-sar"]`;
    private readonly donateRemainingAmountSelector: string = `div[data-cy="donate-remaining-amount"]`;
    private readonly donationAmountInput: string = `[data-cy="donation-amount"] input`;
    private readonly donorMobileInput: string = `input[data-cy="donor-mobile"]`;
    private readonly onBehalfDonationCheckbox: string = `div[data-cy="on-behalf-donation-checkbox"]`;
    private readonly donorName: string = `input[data-cy="donor-name"]`;
    private readonly giftedMobileNumber: string = `input[data-cy="gifted-mobile-number"]`;
    private readonly payByCardImage: string = `img[data-cy="pay-by-credit-card"]`;
    private readonly privacyPolicyLink: string = `span[data-cy="privacy-policy-link"]`;
    private readonly donateButton: string = `button[data-cy="donate-button"]`;
    private readonly shareIcon: string = `.share-icon`;
    private readonly charityImage: string = `img[data-cy="charity-image"]`;
    private readonly caseIdSelector: string = `span[data-cy="case-id"]`;
    private readonly areaName: string = `span[data-cy="area-name"]`;
    private readonly specialityNameSelector: string = `span[data-cy="speciality-name"]`;
    private readonly progressBar: string = `div[data-cy="progress-bar"]`;
    private readonly remainingAmountSelector: string = `div[data-cy="remaining-amount"]`;
    private readonly collectedAmount: string = `div[data-cy="collected-amount"]`;
    private readonly numberOfVisits: string = `div[data-cy="number-of-visits"]`;
    private readonly numberOfDonors: string = `div[data-cy="number-of-donors"]`;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.headerSelector)).toBeVisible();
    }
    async areAllFieldsVisible(): Promise<void> {
        const selectors = [
            this.headerSelector,
            this.donate10sarSelector,
            this.donate50sarSelector,
            this.donate100sarSelector,
            this.donateRemainingAmountSelector,
            this.donationAmountInput,
            this.donorMobileInput,
            this.onBehalfDonationCheckbox,
            this.donorName,
            this.giftedMobileNumber,
            this.payByCardImage,
            this.privacyPolicyLink,
            this.donateButton,
            this.shareIcon,
            this.charityImage,
            this.caseIdSelector,
            this.areaName,
            this.specialityNameSelector,
            this.progressBar,
            this.remainingAmountSelector,
            this.collectedAmount,
            this.numberOfVisits,
            this.numberOfDonors
        ];

        await this.page.locator(this.onBehalfDonationCheckbox).click();
        for (const selector of selectors) {
            await expect(this.page.locator(selector)).toBeVisible();
        }
    }
    async donateCase(){ 
        await this.page.locator(this.donateRemainingAmountSelector).click();
        this.remainingAmount = await this.page.locator(this.donationAmountInput).inputValue();
        await this.page.locator(this.donateButton).click();
    }
    async verifyDonateSuccessfullyDonor(caseId: string){
       const donateCaseDialog: DonateCaseDialog = new DonateCaseDialog(this.page);
       await donateCaseDialog.verifyDonateSuccessfully();

       await donateCaseDialog.goToHomePage();
       
       const homePage = new HomePage(this.page);
       const filtersPage: Filters = new Filters(this.page);

       await homePage.openFilters();
       await filtersPage.searchCase(caseId.toString());

       const casePage:CasePage = new CasePage(this.page);
       await casePage.verifyIfCaseFound(caseId, false);
    }
    async verifyDonateSuccessfullyDialogFields(baseUrl: string | undefined, caseId: string){
        const donateCaseDialog: DonateCaseDialog = new DonateCaseDialog(this.page);
        await donateCaseDialog.verifyDonateSuccessfullyDialogFields(baseUrl, caseId, this.remainingAmount);
     }
     async verifyDonateSuccessfullyCharity(caseId: string){
        const caseListPage:CaseListPage = new CaseListPage(this.page);
        
        await caseListPage.verifyCaseRecordStatusById(caseId, caseConstants.waitingInvoice);
        await caseListPage.verifyCaseRecordCollectedAmountById(caseId, caseConstants.collectedAmount);
     }
}
