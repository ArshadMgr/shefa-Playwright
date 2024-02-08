import {Page} from 'playwright';
import {expect} from "@playwright/test";
import {constants} from '../../constants/payment.text';
import { General } from '../utils/general';

export class PaymentPage {
    private readonly page: Page;
    private readonly general: General;

    private readonly cardTypeLabelSelector: string= 'div[name="wpwl-label-paymentBrand"]';
    private readonly cardTypeSelector: string= 'select[name="paymentBrand"]';
    private readonly visaImgSelector: string= 'div.wpwl-brand-VISA';
    private readonly cardNumberLabelSelector: string = 'div[name="wpwl-label-card.number"]';
    private readonly cardNumberIframeSelector:string = 'iframe[name="card.number"]';
    private readonly cardNumberSelector: string = 'input[name="card.number"]';
    private readonly cardExpiryDateLabelSelector: string = 'div.wpwl-label-expiry';
    private readonly cardExpiryDateSelector: string = 'input.wpwl-control-expiry';
    private readonly cardHolderNameLabelSelector: string = 'div[name="wpwl-label-card.holder"]';
    private readonly cardHolderNameSelector: string = 'input[name="card.holder"]';
    private readonly verificationCodeLabelSelector: string = 'div[name="wpwl-label-card.cvv"]';
    private readonly verificationCodeIframeSelector:string = 'iframe[name="card.cvv"]';
    private readonly verificationCodeSelector: string = 'input[name="card.cvv"]';
    private readonly payNowSelector:string = 'button.wpwl-button-pay';

    private readonly transactionPayIframeSelector:string = 'iframe.wpwl-target'
    private readonly transactionPaySelector:string = 'input[value="Pay"]';
    
    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }

    async verifyAllFields(){
        await this.general.verifyVisibilityAndTextContent(this.cardTypeLabelSelector, constants.cardTypeText);
        await expect(this.page.locator(this.cardTypeSelector)).toBeVisible();
        await expect(this.page.locator(this.visaImgSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.cardNumberLabelSelector, constants.cardNumberText);
        await expect(this.page.frameLocator(this.cardNumberIframeSelector).locator(this.cardNumberSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.cardExpiryDateLabelSelector, constants.cardExpiryDateText);
        await expect(this.page.locator(this.cardExpiryDateSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.cardHolderNameLabelSelector, constants.cardHolderNameText);
        await expect(this.page.locator(this.cardHolderNameSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.verificationCodeLabelSelector, constants.cardVerificationCodeText);
        await expect(this.page.frameLocator(this.verificationCodeIframeSelector).locator(this.verificationCodeSelector)).toBeVisible();
        await this.general.verifyVisibilityAndTextContent(this.payNowSelector, constants.payNowText);
    }
    async pay(){
        await this.page.frameLocator(this.cardNumberIframeSelector).locator(this.cardNumberSelector).fill(constants.cardNumber);
        await this.page.locator(this.cardExpiryDateSelector).fill(constants.cardExpiryDate);
        await this.page.locator(this.cardHolderNameSelector).fill(constants.cardHolderName);
        await this.page.frameLocator(this.verificationCodeIframeSelector).locator(this.verificationCodeSelector).fill(constants.cardVerificationCode);
        await this.page.locator(this.payNowSelector).click();

        await this.page.frameLocator(this.transactionPayIframeSelector).locator(this.transactionPaySelector).click();
    }
}