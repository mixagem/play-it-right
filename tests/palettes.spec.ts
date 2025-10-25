import { test, expect, BrowserContext, Page, Locator } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { expectBGColor, expectFillColor } from '../helpers/playwright.helper';
import { BackgroundSVGComponent } from '../components/BackgroundSVGComponent';
import { ExpectedSVGPalette, ExpectedSVGPaletteAnon, ExpectedSVGPaletteError } from '../fixtures/palettes';

test.describe.serial('🎨  Colors & Animations', () => {
    let page: Page;
    let loginPage: LoginPage;
    let backgroundSVGComponent: BackgroundSVGComponent;

    test.beforeAll(async ({ browser }) => {
        const context: BrowserContext = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(page);
        backgroundSVGComponent = new BackgroundSVGComponent(page.locator('lg2-landing-page'));

        await loginPage.goToAppRoot()
    });

    test('Startup Logo', async () => {
        await expectFillColor(loginPage.startupLogo.locator('span > svg path:first-of-type'), 'rgb(0, 0, 0)');
        await expectFillColor(loginPage.startupLogo.locator('div > svg path:first-of-type'), 'rgb(0, 0, 0)');

        await expect(loginPage.startupLogo).toBeVisible();
        await expect(loginPage.startupLogo).toBeHidden();
        await expect(loginPage.loginLogo).toBeVisible();
    });

    test('Default palette', async () => {
        await expectDefaultPalette(loginPage, backgroundSVGComponent);
    });

    test('Bad login palette', async () => {
        await test.step('Bad login logo fill', async () => {
            await loginPage.login({ username: 'x', password: 'x' });
            await expectFillColor(loginPage.loginLogo.locator('span > svg path:first-of-type'), 'rgb(255, 255, 255)');
            await expectFillColor(loginPage.loginLogo.locator('div > svg path:first-of-type'), 'rgb(255, 255, 255)');
        })

        const testCases: PaletteTestCase[] = [
            { locator: backgroundSVGComponent.svgShapeOutTop, color: ExpectedSVGPaletteError['out-top'] },
            { locator: backgroundSVGComponent.svgShapeInTop, color: ExpectedSVGPaletteError['in-top'] },
            { locator: backgroundSVGComponent.svgShapeOutBottom, color: ExpectedSVGPaletteError['out-bottom'] },
            { locator: backgroundSVGComponent.svgShapeInBottom, color: ExpectedSVGPaletteError['in-bottom'] }
        ];

        for (const { locator, color } of testCases) {
            const className: string = await locator.getAttribute('class') ?? ''
            await test.step(`Bad login shape ${className}`, async () => {
                await expectFillColor(locator, color);
            });
        }

        await test.step('Bad login background color', async () => {
            await expectBGColor(backgroundSVGComponent.svgShapeBG, ExpectedSVGPalette['background']);
        });
    })

    test('Reverting to default from bad login', async () => {
        await expectDefaultPalette(loginPage, backgroundSVGComponent);
    })

    test('Anon login palette', async () => {
        await test.step('Anon logo fill', async () => {
            await loginPage.goToAnonSectionButton.click();
            await expectFillColor(loginPage.loginLogo.locator('span > svg path:first-of-type'), 'rgb(255, 255, 255)');
            await expectFillColor(loginPage.loginLogo.locator('div > svg path:first-of-type'), 'rgb(255, 255, 255)');
        })

        const testCases: PaletteTestCase[] = [
            { locator: backgroundSVGComponent.svgShapeOutTop, color: ExpectedSVGPaletteAnon['out-top'] },
            { locator: backgroundSVGComponent.svgShapeInTop, color: ExpectedSVGPaletteAnon['in-top'] },
            { locator: backgroundSVGComponent.svgShapeOutBottom, color: ExpectedSVGPaletteAnon['out-bottom'] },
            { locator: backgroundSVGComponent.svgShapeInBottom, color: ExpectedSVGPaletteAnon['in-bottom'] }
        ];

        for (const { locator, color } of testCases) {
            const className: string = await locator.getAttribute('class') ?? ''
            await test.step(`Anon shape ${className}`, async () => {
                await expectFillColor(locator, color);
            });
        }

        await test.step('Anon background color', async () => {
            await expectBGColor(backgroundSVGComponent.svgShapeBG, ExpectedSVGPaletteAnon['background']);
        });
    })

    test('Reverting to default from anon login', async () => {
        await loginPage.goBackButton.click();
        await expectDefaultPalette(loginPage, backgroundSVGComponent);
    })

    test.afterAll(async () => {
        await page.context().close();
    });
})

interface PaletteTestCase {
    locator: Locator;
    color: string;
}

async function expectDefaultPalette(loginPage: LoginPage, backgroundSVGComponent: BackgroundSVGComponent) {
    await test.step('Default logo fill', async () => {
        await expectFillColor(loginPage.loginLogo.locator('span > svg path:first-of-type'), 'rgb(0, 0, 0)');
        await expectFillColor(loginPage.loginLogo.locator('div > svg path:first-of-type'), 'rgb(0, 0, 0)');
    })

    const testCases: PaletteTestCase[] = [
        { locator: backgroundSVGComponent.svgShapeOutTop, color: ExpectedSVGPalette['out-top'] },
        { locator: backgroundSVGComponent.svgShapeInTop, color: ExpectedSVGPalette['in-top'] },
        { locator: backgroundSVGComponent.svgShapeOutBottom, color: ExpectedSVGPalette['out-bottom'] },
        { locator: backgroundSVGComponent.svgShapeInBottom, color: ExpectedSVGPalette['in-bottom'] }
    ];

    for (const { locator, color } of testCases) {
        const className: string = await locator.getAttribute('class') ?? ''
        await test.step(`Default shape ${className}`, async () => {
            await expectFillColor(locator, color);
        });
    }

    await test.step('Default background color', async () => {
        await expectBGColor(backgroundSVGComponent.svgShapeBG, ExpectedSVGPalette['background']);
    });
}