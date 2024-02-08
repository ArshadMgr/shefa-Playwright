import {test} from '@playwright/test';
import LoginPage from "../pages/utils/login.page";
import HomePage from "../pages/home-page/home.page";
import {Page} from 'playwright';
import { credentials } from '../constants/credentails';

test.describe('S03 - Login', () => {
    test('LOG001 - Login as an admin', async ({page}: {
        page: Page
    }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.loginAsAdmin(credentials.admin.phoneNumber, credentials.admin.password);
        await homePage.verifyCarouselVisible();
    });

    test('LOG002 - Login as a donor', async ({page}: {
        page: Page
    }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.loginAsDonor(credentials.donor.phoneNumber, credentials.donor.otpCode);
        
        await homePage.verifyCarouselVisible();
    });

    test('LOG003 - Login as a charity', async ({page}: {
        page: Page
    }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.loginAsCharity(credentials.charity.phoneNumber, credentials.charity.password);
        await homePage.verifyCarouselVisible();
    });
});
