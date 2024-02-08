import {Page} from 'playwright';
import { General } from '../utils/general';
import {constants} from '../../constants/case.text';

export class CaseCharityPage {
    private readonly page: Page;
    private readonly general: General;

    private readonly invoiceNumberSelector: string = `span[data-cy="invoice-number"] input`;
    private readonly amountSelector: string = `span[data-cy="amount"] input`;
    private readonly invoiveSelector: string = `div[data-cy="invoice-file"] input`;
    private readonly notesSelector: string = `span[data-cy="notes"] textarea`;
    private readonly hospitalDataCy: string = 'hospital';
    private readonly submitSelector: string = 'button[data-cy="submit"]';

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }

    async addInvoice(){
        await this.page.locator(this.invoiceNumberSelector).fill(constants.invoiceNumber);
        await this.page.locator(this.amountSelector).fill(constants.financialCost);
        await this.page.locator(this.invoiceNumberSelector).fill(constants.invoiceNumber);
        await this.page.setInputFiles(this.invoiveSelector, constants.invoiceFilePath);
        await this.page.locator(this.notesSelector).fill(constants.invoiceNotes);
        await this.chooseHospital();
        await this.page.locator(this.submitSelector).click();
    }
    async chooseHospital(){
        await this.general.clickOnDropDown(this.hospitalDataCy)
        await this.general.chooseDropDownOptionHasText(constants.hospital);
    }
}