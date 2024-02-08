import {Page} from 'playwright';
import { General } from '../utils/general';
import { constants as auditorConstants } from '../../constants/case.auditors.text';
import {constants} from '../../constants/case.text';

export class CaseAuditorsPage {
    private readonly page: Page;
    private readonly general: General;

    private readonly trackingButtonPrevRequestsOnIdentitySelector: string = `button[data-cy="tracking-btn"]`;
    private readonly actionsDropDownSelector: string = `div[data-cy="action-drop-down"] span.p-inputtext`;

    private readonly internalNotesSelector: string = `div[data-cy="internal-notes"] textarea`;
    private readonly saveBtnSelector: string = `button[data-cy="save-btn"]`;
    private readonly confirmBtnSelector: string = `button[data-cy="confirm-btn"]`;

    private readonly specialtyDataCy: string = 'specialty';
    private readonly actionTypeDataCy: string = 'action-type';
    private readonly actionDescriptionDataCy: string = 'action-description';
    private readonly caseEvaluationDataCy: string = 'case-evaluation';

    private readonly storyTitleSelector: string = `span[data-cy="story-title"] input`;
    private readonly storyPhotoInputSelector: string = `div[data-cy="story-photo"] input`;
    private readonly shownStorySelector: string = `div[data-cy="shown-story"] textarea`;

    private readonly invoiceNumberSelector: string = `span[data-cy="invoice-number"] input`;
    private readonly amountSelector: string = `span[data-cy="amount"] input`;
    private readonly invoiveSelector: string = `div[data-cy="invoice-file"]`;
    private readonly hospitalDataCy: string = 'hospital';

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }
    async clickTrackingButtonPrevRequestsOnIdentity(){
        await this.page.locator(this.trackingButtonPrevRequestsOnIdentitySelector).click();
    }
    async openActionsDropDown(){
        await this.page.locator(this.actionsDropDownSelector).scrollIntoViewIfNeeded({timeout: 7000});
        await this.page.locator(this.actionsDropDownSelector).click();
    }
    async doAuditorAction(auditorAction: string){
        await this.general.chooseDropDownOptionHasText(auditorAction);
    }
    async fillInternalNotes(notes: string){
        await this.page.locator(this.internalNotesSelector).fill(notes)
    }
    async save(){
        await this.page.locator(this.saveBtnSelector).click();
    }
    async confirm(){
        await this.page.locator(this.confirmBtnSelector).click();
    }
    async chooseSpecialty(specialty: string){
        await this.general.clickOnDropDown(this.specialtyDataCy)
        await this.general.chooseDropDownOptionHasText(specialty);
    }
    async chooseActionType(actionType: string){
        await this.general.clickOnDropDown(this.actionTypeDataCy)
        await this.general.chooseDropDownOptionHasText(actionType);
    }
    async chooseActionDescription(actionDescription: string){
        await this.general.clickOnDropDown(this.actionDescriptionDataCy)
        await this.general.chooseDropDownOptionHasText(actionDescription);
    }
    async chooseCaseEvaluation(caseEvaluation: string){
        await this.general.clickOnDropDown(this.caseEvaluationDataCy);
        await this.general.chooseDropDownOptionHasText(caseEvaluation);
    }
    async fillStoryDetails(){
        await this.page.locator(this.storyTitleSelector).fill(auditorConstants.storyTitleText);
        await this.page.setInputFiles(this.storyPhotoInputSelector, auditorConstants.storyPhotoFilePath);
        await this.page.locator(this.shownStorySelector).fill(auditorConstants.shownStoryText);
    }
    async verifyInvoiceInfo(){
        await this.general.verifyVisibilityAndValue(this.invoiceNumberSelector, constants.invoiceNumber);
        await this.general.verifyVisibilityAndValue(this.amountSelector, constants.financialCost);
        await this.general.verifyDropDownSelectedValue(this.hospitalDataCy, constants.hospital);
        await this.general.verifyVisibilityAndContainTextContent(this.invoiveSelector, constants.invoiceFileName);
    }
}