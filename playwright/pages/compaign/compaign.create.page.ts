
import {Page} from 'playwright';
import { General } from '../utils/general';
import { Init } from 'v8';


export class CreateCompaign {

    private readonly companignTypeDataCy: string = 'companign-type';
    private readonly copaignNameDataCy: string='compaign-name'
    private readonly benefactorNameSelector: string='span[data-cy="benefactor-name"] input'
    private readonly targetamountselector: string = 'span[id="target"] input'
    private readonly intervalselector: string= 'span[id="interval"] input'
    private readonly toBeSureBtn: string= 'تأكيد'
    
    
    private readonly createBtn: string = 'button[data-cy=create-companign-btn]';
    private readonly page: Page;
    private readonly general: General;

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }


 async clickOnCreateCompaignBtn(){

        await this.page.locator(this.createBtn).click();

    }

async choseCompanignType(companignType: string){

    await this.general.clickOnDropDown(this.companignTypeDataCy);
    await this.general.chooseDropDownOptionHasText(companignType);
}

async choseCompaignName(compaignName: string){
    await this.general.clickOnDropDown(this.copaignNameDataCy)
    await this.general.chooseDropDownOptionHasText(compaignName)
}

async typeInBenefactorName(benefactorName: string){
    await this.page.locator(this.benefactorNameSelector).fill(benefactorName)
}

async typeTargetAmount(targetAmount: string){

    await this.page.locator(this.targetamountselector).fill(targetAmount)

}

async interval(intervalParam: string){
    await this.page.locator(this.intervalselector).fill(intervalParam)
}

async confirmationBtn_click(){
    await this.page.getByLabel(this.toBeSureBtn).click()


}




}