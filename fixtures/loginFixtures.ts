import { Page, test as base } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { createTestUsers } from '../helpers/testingAPI.helper';
import { WizardPage } from '../pages/WizardPage';
import { AppMenuComponent } from '../components/AppMenuComponent';
import { TestUser } from '../types/TestUser';
import { MenuEntry } from '../types/MenuEntry';

export const test = base.extend<LoginFixtures>({
    testUser: async ({ }, use) => {
        const username = (await createTestUsers(1))[0];
        const password = '1';
        await use({ username, password });
    },

    // startup animations skip
    fastStart: async ({ page, testUser }, use) => {
        const landingPage = new LoginPage(page);
        await landingPage.appStart();
        await use({ page, testUser });
    },

    // registered user fresh login to dashboard
    loggedInUser: async ({ page, testUser }, use) => {
        const landingPage = new LoginPage(page);
        await landingPage.goToAppRoot();
        await landingPage.login(testUser, true);
        await landingPage.snackbar.dismissSnackbar();
        await use({ page, testUser });
    },

    // anon user fresh login to dashboard
    loggedInAnon: async ({ page }, use) => {
        const landingPage = new LoginPage(page);
        await landingPage.goToAppRoot();
        await landingPage.goToAnonSectionButton.click();
        await landingPage.continueAsAnonButton.click();
        await landingPage.snackbar.dismissSnackbar();
        await use(page);
    },

    // registered user fresh login + fresh new page + navigate to editor
    editorReady: async ({ loggedInUser }, use) => {
        const { page, testUser } = loggedInUser;
        const menu = new AppMenuComponent(page.locator('lg2-menu'));
        await menu.navigate(MenuEntry.Wizard);
        const wizardPage = new WizardPage(page);
        await wizardPage.stepper.clickNextButton()
        await wizardPage.applicationAutocomplete.openAutocomplete()
        await wizardPage.applicationAutocomplete.pickOption(2)
        await wizardPage.pageTitleInput.fill('touch my PIPELINE readme')
        await wizardPage.stepper.clickNextButton()
        await wizardPage.navigateToEditorButton.click()
        await use({ page, testUser });
    }
});

type LoginFixtures = {
    fastStart: { page: Page; testUser: TestUser };
    loggedInUser: { page: Page; testUser: TestUser };
    loggedInAnon: Page;
    testUser: TestUser;
    editorReady: { page: Page; testUser: TestUser };
};