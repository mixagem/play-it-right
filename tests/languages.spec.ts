
import { expect } from '@playwright/test';
import { locales } from '../fixtures/locales';

import { test } from '../fixtures/loginFixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LeggeraLanguages } from '../types/LeggeraLanguages';
import { MenuEntry } from '../types/MenuEntry';
import { expectToContainText } from '../helpers/playwright.helper';

type LocaleCategory = {
    [key: string]: LocaleEntry;
};

type LocaleEntry = {
    locator: string;
} & {
        [key in LeggeraLanguages]: string | RegExp;
    };

test.describe('🌍 Languages', async () => {
    let dashboardPage: DashboardPage
    test.beforeEach(async ({ editorReady }) => {
        dashboardPage = new DashboardPage(editorReady.page)
    });

    test('Dashboard ', async ({ page }) => {

        await dashboardPage.menu.navigate(MenuEntry.Dashboard)

        const dashboardLocales: LocaleCategory = locales.dashboard;

        for (const lang of Object.values(LeggeraLanguages)) {
            await dashboardPage.header.changeLanguage(lang);
            await dashboardPage.header.languagePickerWrapper.waitFor({ state: 'hidden', timeout: 5000 });

            for (const label of Object.keys(dashboardLocales)) {
                if ((await page.locator(dashboardLocales[label].locator).isHidden())) {
                    console.log('skipping element due to visibility: ' + label)
                    continue
                };
                await expect(page.locator(dashboardLocales[label].locator)).toHaveText(dashboardLocales[label][lang]);
            }
        }
    })

    test('Menu', async ({ page }) => {
        const menuLocales: LocaleCategory = locales.menu;

        await dashboardPage.menu.toolboxEntry.click();
        for (const lang of Object.values(LeggeraLanguages)) {
            await dashboardPage.header.changeLanguage(lang);
            await dashboardPage.header.languagePickerWrapper.waitFor({ state: 'hidden', timeout: 5000 });

            for (const label of Object.keys(menuLocales)) {
                if ((await page.locator(menuLocales[label].locator).isHidden())) {
                    console.log('skipping element due to visibility: ' + label)
                    continue
                }
                await expectToContainText(page.locator(menuLocales[label].locator), menuLocales[label][lang])
            }
        }
    })
})