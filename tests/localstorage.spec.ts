import { BrowserContext, Page, expect } from '@playwright/test';

import { test } from '../fixtures/loginFixtures';
import { LoginPage } from '../pages/LoginPage';
import { WizardPage } from '../pages/WizardPage';
import { TestUser } from '../types/TestUser';
import { createTestUsers } from '../helpers/testingAPI.helper';
import { AppMenuComponent } from '../components/AppMenuComponent';
import { AppHeaderComponent } from '../components/AppHeaderComponent';
import { LeggeraLanguages } from '../types/LeggeraLanguages';
import { LeggeraThemes } from '../types/LeggeraThemes';
import { MenuEntry } from '../types/MenuEntry';
import { LocalStorageKeys } from '../types/LocalStorageKeys';

test.describe.serial('💾 Local storage', async () => {
    let page: Page;
    let loginPage: LoginPage;
    let user: TestUser;
    let menu: AppMenuComponent;
    let header: AppHeaderComponent;
    let wizardPage: WizardPage;

    test.beforeAll(async ({ browser }) => {
        const context: BrowserContext = await browser.newContext();
        page = await context.newPage();
        user = { username: (await createTestUsers(1))[0], password: "1" };
        loginPage = new LoginPage(page);
        await loginPage.goToAppRoot();
    });

    test('placeholder (very much alpha, much work to do here 🔨)', async () => {
        // default local storage
        let localStorageLength = await page.evaluate(() => localStorage.length);
        expect(localStorageLength).toBe(0);


        // after login - no cookie (theme, lang)
        await loginPage.login(user);
        await page.waitForFunction(() => localStorage.length !== 0);
        let currentStorage = await page.evaluate(() => localStorage);
        expect(currentStorage.getItem(LocalStorageKeys.theme)).toBe(LeggeraThemes.Luigi)
        expect(currentStorage.getItem(LocalStorageKeys.language)).toBe(LeggeraLanguages.English)


        // after login - cookie (theme, lang, cookie)
        await page.reload();
        await loginPage.login(user, true);
        await page.waitForFunction(() => localStorage.length !== 2);
        currentStorage = await page.evaluate(() => localStorage);
        expect(currentStorage.getItem(LocalStorageKeys.cookie)).toBeTruthy()


        menu = new AppMenuComponent(page.locator('lg2-menu'));
        header = new AppHeaderComponent(page.locator('lg2-header'));


        // changing language to PT
        await header.changeLanguage(LeggeraLanguages.Portuguese)
        await page.waitForFunction(() => localStorage.getItem('LEGGERA_LANGUAGE') === LeggeraLanguages.Portuguese);
        expect(currentStorage.getItem(LocalStorageKeys.language)).toBe(LeggeraLanguages.Portuguese) // trocar por assert de texto no dashboard
        currentStorage = await page.evaluate(() => localStorage);



        // changing language to ES
        await header.languagePickerWrapper.waitFor({ state: 'hidden', timeout: 5000 })
        await header.changeLanguage(LeggeraLanguages.Spanish)
        await page.waitForFunction(() => localStorage.getItem('LEGGERA_LANGUAGE') === LeggeraLanguages.Spanish);
        expect(currentStorage.getItem(LocalStorageKeys.language)).toBe(LeggeraLanguages.Spanish)// trocar por assert de texto no dashboard
        currentStorage = await page.evaluate(() => localStorage);


        // changing language to EN
        await header.languagePickerWrapper.waitFor({ state: 'hidden', timeout: 5000 })
        await header.changeLanguage(LeggeraLanguages.English)
        await page.waitForFunction(() => localStorage.getItem('LEGGERA_LANGUAGE') === LeggeraLanguages.English);
        expect(currentStorage.getItem(LocalStorageKeys.language)).toBe(LeggeraLanguages.Spanish)// trocar por assert de texto no dashboard
        currentStorage = await page.evaluate(() => localStorage);


        // changing theme to Sonic
        await header.changeTheme(LeggeraThemes.Sonic)
        await page.waitForFunction(() => localStorage.getItem('LEGGERA_THEME') === LeggeraThemes.Sonic);
        expect(currentStorage.getItem(LocalStorageKeys.theme)).toBe(LeggeraThemes.Sonic) // trocar por assert no thema
        currentStorage = await page.evaluate(() => localStorage);


        // changing theme back to Luigi
        await header.themePickerWrapper.waitFor({ state: 'hidden', timeout: 5000 })
        await header.changeTheme(LeggeraThemes.Luigi)
        await page.waitForFunction(() => localStorage.getItem('LEGGERA_THEME') === LeggeraThemes.Luigi);
        expect(currentStorage.getItem(LocalStorageKeys.theme)).toBe(LeggeraThemes.Luigi) // trocar por assert no thema
        currentStorage = await page.evaluate(() => localStorage);



        // navigating to wizard (to trigger breadcumbs)
        await menu.navigate(MenuEntry.Wizard);
        await page.waitForFunction(() => localStorage.length !== 3);
        expect(currentStorage.getItem(LocalStorageKeys.breadcumbs)).toBeTruthy()
        //adicionar assert nas breadcumbs 
        currentStorage = await page.evaluate(() => localStorage);


        // asserting page on the result page
        wizardPage = new WizardPage(page);
        await wizardPage.stepper.clickNextButton();
        await wizardPage.applicationAutocomplete.randomPick();
        await wizardPage.pageTitleInput.fill('oh yes');
        await wizardPage.stepper.clickNextButton();
        await page.waitForFunction(() => localStorage.length !== 4);
        expect(currentStorage.getItem(`${LocalStorageKeys.currentPage}${user.username}`)).toBeTruthy()
        // adicionar assert da entrada do menu passar estar visivel
        currentStorage = await page.evaluate(() => localStorage);


        // navigate to elements to trigger another breadcumb
        await menu.navigate(MenuEntry.Editor);
        // wait for breadcumb to pop ? timeout500 was herer
        currentStorage = await page.evaluate(() => localStorage);
        //assert breadcumbs
        await page.reload();


        //assert final apos reaload
        await header.changeLanguage(LeggeraLanguages.Spanish)
        await header.changeTheme(LeggeraThemes.Sonic)
        // limpar cache
        await page.reload();
        // assert bg = default, idioma = en, login - no


        await loginPage.login(user, true);
        // assert bg = somin, idioma = es
        expect(currentStorage.getItem(LocalStorageKeys.language)).toBe(LeggeraLanguages.Spanish)
        expect(currentStorage.getItem(LocalStorageKeys.theme)).toBe(LeggeraThemes.Luigi)
        // assert as cookies foram guardadas todas de um bez

    })
})