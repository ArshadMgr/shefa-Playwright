import {Page} from 'playwright';
import {Locator, expect} from "@playwright/test";
import {constants} from '../../constants/case.text';

export class CaseListPage {
    private readonly page: Page;

    private readonly caseTableRecordSelector: string = 'div[data-cy="cases-table"] tbody tr';
    private readonly identityCellSelector: string = 'td div[data-cy="identity"]';
    private readonly statusCellSelector: string = 'td span[data-cy="status"]';
    private readonly viewIconSelector: string = 'div.icon-container i.pi-eye';
    private readonly editCaseIconSelector: string = `td div.icon-container i.pi-pencil`;
    private readonly addInvoiceIconSelector: string = `td div.icon-container i.pi-file`;
    private readonly collectedAmountCellSelector: string = 'td span[data-cy="collected-amount"]';

    constructor(page: Page) {
        this.page = page;
    }
    async verifyFirstCaseRecordExist(){
        const caseRecordLocator = await this.page.locator(this.caseTableRecordSelector).first();
        await expect(caseRecordLocator).toBeVisible();
    }
    async verifyFirstRecordIdentity(){
        const caseRecordLocator = await this.page.locator(this.caseTableRecordSelector).first();

        const caseIdentityCellLocator = await caseRecordLocator.locator(this.identityCellSelector);
        await expect(caseIdentityCellLocator).toBeVisible();
        await expect(caseIdentityCellLocator).toHaveText(constants.visaNumber);
    }
    async verifyFirstCaseRecordStatus(caseStatus: string){
        const caseRecordLocator = await this.page.locator(this.caseTableRecordSelector).first();
        await this.verifyCaseRecordStatus(caseRecordLocator, caseStatus);
    }
    async verifyCaseRecordStatusById(caseId: string, caseStatus: string){
        const caseRecordLocator = await this.getCaseRecordLocator(caseId);
        await this.verifyCaseRecordStatus(caseRecordLocator, caseStatus);
    }
    async verifyCaseRecordStatus(caseRecordLocator: Locator, caseStatus: string){
        await expect(caseRecordLocator).toBeVisible();

        const caseStatusCellLocator = await caseRecordLocator.locator(this.statusCellSelector);
        await expect(caseStatusCellLocator).toBeVisible();
        await expect(caseStatusCellLocator).toHaveText(caseStatus);
    }
    async openFirstCaseViewForm(){
        const caseRecordLocator = await this.page.locator(this.caseTableRecordSelector).first();
        await this.openCaseViewForm(caseRecordLocator);
    }
    async openCaseViewFormById(caseId: string){
        const caseRecordLocator = await this.getCaseRecordLocator(caseId);
        await this.openCaseViewForm(caseRecordLocator);
    }
    async openCaseViewForm(caseRecordLocator: Locator){
        await caseRecordLocator.locator(this.viewIconSelector).click();
    }
    async openEditCaseForm(caseId: string){
        const caseRecordLocator = await this.getCaseRecordLocator(caseId);
        await caseRecordLocator.locator(this.editCaseIconSelector).click();
    }
    async openAddInvoiceForm(caseId: string){
        const caseRecordLocator = await this.getCaseRecordLocator(caseId);
        await caseRecordLocator.locator(this.addInvoiceIconSelector).click();
    }
    async getCaseRecordLocator(caseId: string){
        const caseIdCellSelector = this.getCaseIdCellLocator(caseId);
        const caseRecordLocator = await this.page.locator('tr', { has: this.page.locator(caseIdCellSelector) });
        return caseRecordLocator;
    }
    getCaseIdCellLocator(caseId: string){
        let caseIdCellSelector: string = `td div[data-cy="case-id"]:has-text('${caseId}')`;
        return caseIdCellSelector;
    }
    async verifyCaseRecordCollectedAmountById(caseId: string, collectedAmount: string){
        const caseRecordLocator = await this.getCaseRecordLocator(caseId);
        await this.verifyCaseRecordCollectedAmount(caseRecordLocator, collectedAmount);
    }
    async verifyCaseRecordCollectedAmount(caseRecordLocator: Locator, collectedAmount: string){
        await expect(caseRecordLocator).toBeVisible();

        const caseCollectedAmountCellLocator = await caseRecordLocator.locator(this.collectedAmountCellSelector);
        await expect(caseCollectedAmountCellLocator).toBeVisible();
        await expect(caseCollectedAmountCellLocator).toHaveText(collectedAmount);
    }
}
