import {test} from '@playwright/test';
import {Page} from 'playwright';
import {Navbar} from "../pages/utils/navbar";
import LoginPage from '../pages/utils/login.page';
import { credentials } from '../constants/credentails';
import { DonorProfileMenu } from '../pages/donor/profile.menu';
import { MyAccountPage } from '../pages/donor/my.account.page';

test.describe('S05 - Donor Profile', () => {
    test('DP001 - Donor can see my account page', async ({page}) => {
        const loginPage = new LoginPage(page);
        const navbar: Navbar = new Navbar(page);
        const donorProfileMenu: DonorProfileMenu = new DonorProfileMenu(page);
        const myAccountPage: MyAccountPage = new MyAccountPage(page);


        await loginPage.loginAsDonor(credentials.donor.phoneNumber, credentials.donor.otpCode);

        await navbar.clickUserToggleLink();
        await navbar.clickMyAccountBtn();
        await donorProfileMenu.clickMyAccount();

        await myAccountPage.verifyAllFields();

        await page.close();
    });
});
