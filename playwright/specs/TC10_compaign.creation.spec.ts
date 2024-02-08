import {test} from '@playwright/test';
import LoginPage from "../pages/utils/login.page";
import HomePage from "../pages/home-page/home.page";
import {Page} from 'playwright';
import { credentials } from '../constants/credentails';
import { General } from '../pages/utils/general';
import {Navbar} from "../pages/utils/navbar";
import {CreateCompaign} from '../pages/compaign/compaign.create.page';
import { constants } from '../constants/campaign.text';


test('TC10 - Login as a donor and create companign', async ({page}: {
    page: Page
}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const generalPage = new General(page);
    const Navigation = new Navbar(page);
    const createCompaign = new CreateCompaign(page);
    

     await loginPage.loginAsDonor(credentials.donor.phoneNumber, credentials.donor.otpCode);
     await Navigation.navCampaignTab();
     await createCompaign.clickOnCreateCompaignBtn();
     //await createCompaign.choseCompanignType(constants.campaignType)
     //await createCompaign.choseCompaignName(constants.campaignName)
     //await createCompaign.typeInBenefactorName(constants.benefactorName)
     //await createCompaign.typeTargetAmount(constants.targetAmount);
     //await createCompaign.interval(constants.interval)
     //await createCompaign.confirmationBtn_click()
   

     await page.getByLabel('إغلاق').click();

    

    
    const pageText = await page.content();
    console.log('Case Status: ongoing?:', pageText.includes("مستمرة"));
    console.log('Campaign Type: Healthy stop?:', pageText.includes("وقف صحي"));
    


});


