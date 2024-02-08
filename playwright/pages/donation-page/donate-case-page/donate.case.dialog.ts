import {Page} from 'playwright';
import {expect} from "@playwright/test";
import {constants} from '../../../constants/donation.text';
import {constants as paymentConstants} from '../../../constants/payment.text';
import {constants as auditorsConstants} from '../../../constants/case.auditors.text';
import { General } from '../../utils/general';

export class DonateCaseDialog {
    private readonly page: Page;
    private readonly general: General;

    private readonly paymentSuccessDialogSelector:string ='[data-cy="payment-success-dialog"]';
    private readonly paymentSuccessMessageSelector:string ='div[data-cy="payment-success-message"]';
    private readonly checkCirclSymbolSelector:string ='i.pi-check-circle';
    private readonly thanksMessageSelector:string ='div[data-cy="thanks-message"]';
    private readonly totalDonationMessageSelector:string ='div[data-cy="total-donation-message"]';
    private readonly donationAmountSelector:string ='div[data-cy="donation-amount"]';
    private readonly shareWithOthersMessageSelector:string ='div[data-cy="share-with-others-message"]';
    private readonly shareWithOthersInputSelector:string ='div[data-cy="share-with-others"] input';
    private readonly shareWithOthersButtonSelector:string ='div[data-cy="share-with-others"] button';
    private readonly successNotificationSelector:string ='div.p-toast-message-success';
    private readonly successNotificationMessageSelector:string ='span.p-toast-message-text';
    private readonly referenceNumberLabelSelector:string ='div[data-cy="reference-number-label"]';
    private readonly referenceNumberSelector:string ='div[data-cy="reference-number"]';
    private readonly dateAndTimeLabelSelector:string ='div[data-cy="date-time-label"]';
    private readonly dateAndTimeSelector:string ='div[data-cy="date-time"]';
    private readonly paymentMethodLabelSelector:string ='div[data-cy="payment-method-label"]';
    private readonly paymentMethodSelector:string ='div[data-cy="payment-method"]';
    private readonly caseIdLabelSelector:string ='div[data-cy="case-id-label"]';
    private readonly caseIdSelector:string ='div[data-cy="case-id"]';
    private readonly donationSpecialtyLabelSelector:string ='div[data-cy="donation-specialty-label"]';
    private readonly donationSpecialtySelector:string ='div[data-cy="donation-specialty"]';
    private readonly caseDetailsLabelSelector:string ='div[data-cy="case-details-label"]';
    private readonly caseDetailsLinkSelector:string ='a[data-cy="case-details-link"]';
    private readonly homePageSelector:string ='button[data-cy="home-page"]';

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }
    async verifyDonateSuccessfully(){
        await expect(this.page.locator(this.paymentSuccessDialogSelector)).toBeVisible();
        await expect(this.page.locator(this.checkCirclSymbolSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.paymentSuccessMessageSelector, constants.paymentSuccessMessage);
    }
    async verifyDonateSuccessfullyDialogFields(baseUrl: string | undefined, caseId: string, remainingAmount: string | null){
        await this.verifyDonateSuccessfully();
        await this.verifyDonationAmount();
        await this.verifyShareCaseWithOthers();
        await this.verifyCaseLabelsAndFields();
        await this.verifyHomeLink();
        await this.verifyCaseInfo(baseUrl, caseId, remainingAmount);
    }
    async verifyDonationAmount(){
        await this.general.verifyVisibilityAndTextContent(this.thanksMessageSelector, constants.donationThanksMessage);
        await this.general.verifyVisibilityAndTextContent(this.totalDonationMessageSelector, constants.totalDonationMessage);
        await expect(this.page.locator(this.donationAmountSelector)).toBeVisible();
    }
    async verifyShareCaseWithOthers(){
        await this.general.verifyVisibilityAndTextContent(this.shareWithOthersMessageSelector, constants.shareWithOthersMessage);
        await expect(this.page.locator(this.shareWithOthersInputSelector)).toBeVisible();
        await expect(this.page.locator(this.shareWithOthersButtonSelector)).toBeVisible();
    }
    async verifyCaseLabelsAndFields(){
        await this.general.verifyVisibilityAndTextContent(this.referenceNumberLabelSelector, constants.referenceNumberText);
        await expect(this.page.locator(this.referenceNumberSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.dateAndTimeLabelSelector, constants.dateAndTimeText);
        await expect(this.page.locator(this.dateAndTimeSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.paymentMethodLabelSelector, constants.paymentMethodText);
        await expect(this.page.locator(this.paymentMethodSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.caseIdLabelSelector, constants.caseIdText);
        await expect(this.page.locator(this.caseIdSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.donationSpecialtyLabelSelector, constants.donationSpecialty);
        await expect(this.page.locator(this.donationSpecialtySelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.caseDetailsLabelSelector, constants.caseDetailsText);
        await this.general.verifyVisibilityAndTextContent(this.caseDetailsLinkSelector, constants.caseDetailsLinkText);
    }
    async verifyHomeLink(){
        await this.general.verifyVisibilityAndTextContent(this.homePageSelector, constants.homePageText);
    }
    async verifyCaseInfo(baseUrl: string | undefined, caseId: string, remainingAmount: string | null){
        await expect(this.page.locator(this.donationAmountSelector)).toHaveText(remainingAmount?.replace(',', '') + "ر.س");

        const caseUrl = baseUrl + constants.completedCasesUrl;
        await expect(this.page.locator(this.shareWithOthersInputSelector)).toHaveValue(caseUrl);

        await expect(this.page.locator(this.paymentMethodSelector)).toHaveText(paymentConstants.VisaPaymentMethod);

        await expect(this.page.locator(this.caseIdSelector)).toHaveText(caseId.toString());

        await expect(this.page.locator(this.donationSpecialtySelector)).toHaveText(auditorsConstants.specialtyText);

        await expect(this.page.locator(this.caseDetailsLinkSelector)).toHaveAttribute('href', caseUrl);
    }
    async goToHomePage(){
        await this.page.locator(this.homePageSelector).click();
    }
}