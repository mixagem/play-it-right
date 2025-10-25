import { expect } from '@playwright/test';

import { test } from '../fixtures/loginFixtures';
import { getClipboardContent, expectToContainText, expectBackgroundImage } from '../helpers/playwright.helper';
import { LoginPage } from '../pages/LoginPage';
import { expireCookie, expireTrial } from '../helpers/testingAPI.helper';
import { snackbarMessages } from '../fixtures/snackbarMessages';
import { AnonUser } from '../types/AnonUser';

test.describe('🔐  Login page', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ fastStart: { page } }) => {
        loginPage = new LoginPage(page);
    });

    test('Page title', async () => {
        await expect(loginPage.self.page()).toHaveTitle('Leggera 2');
    });

    test('Login form business rules', async () => {
        await test.step('Default state', async () => {
            await loginPage.usernameInput.expectToBeEmpty();
            await loginPage.usernameInput.expectToBeRequired();
            await loginPage.usernameInput.expectNotToBeInErrorState();

            await loginPage.passwordInput.expectToBeEmpty();
            await loginPage.passwordInput.expectPasswordField();
            await loginPage.passwordInput.expectToBeRequired();
            await loginPage.passwordInput.expectNotToBeInErrorState();

            await expect(loginPage.cookieCheckbox).not.toBeChecked();
            await expect(loginPage.loginButton).toBeDisabled();
        })

        await test.step('Password missing', async () => {
            await loginPage.usernameInput.fill('Joe');
            await expect(loginPage.loginButton).toBeDisabled();
        })

        await test.step('Username missing', async () => {
            await loginPage.usernameInput.fill('');
            await loginPage.passwordInput.fill('x');
            await expect(loginPage.loginButton).toBeDisabled();
        })

        await test.step('Login button enabled', async () => {
            await loginPage.usernameInput.fill('Joe');
            await expect(loginPage.loginButton).toBeEnabled();
        })

        await test.step('Login button disabled (after being available)', async () => {
            await loginPage.usernameInput.fill('');
            await loginPage.passwordInput.fill('');
            await expect(loginPage.loginButton).toBeDisabled();
        })

        await test.step('Show/Hide password toggle', async () => {
            await loginPage.showPasswordButton.click();
            await loginPage.passwordInput.expectTextField();
            await loginPage.showPasswordButton.click();
            await loginPage.passwordInput.expectPasswordField();
        })

        await test.step('Form fields error state', async () => {
            await loginPage.usernameInput.expectToBeInErrorState();
            await loginPage.passwordInput.expectToBeInErrorState();
            await loginPage.showPasswordButton.click();
            await loginPage.passwordInput.expectTextField();
            await loginPage.showPasswordButton.click();
            await loginPage.passwordInput.expectPasswordField();
        })
    });

    test('Valid login', { tag: '@smoke' }, async ({ fastStart: { testUser } }) => {
        await loginPage.login(testUser);
        await loginPage.snackbar.expectSnackbar(snackbarMessages.validLogin.locale.en, snackbarMessages.validLogin.emoji);
    });

    test('Invalid login', async ({ fastStart: { testUser } }) => {
        interface SnackbarTestCase {
            username: string;
            password: string;
            message: string;
            emoji: string;
        }

        const testCases: SnackbarTestCase[] = [
            { username: "'bobby ;tables user", password: 'security101', message: snackbarMessages.wrongSyntaxUsername.locale.en, emoji: snackbarMessages.wrongSyntaxUsername.emoji },
            { username: 'nonExistingUser', password: 'CorrectHorseBatteryStaple', message: snackbarMessages.invalidCredentials.locale.en, emoji: snackbarMessages.invalidCredentials.emoji },
            { username: testUser.username, password: 'GoodUserbadPassowrd', message: snackbarMessages.invalidCredentials.locale.en, emoji: snackbarMessages.invalidCredentials.emoji }
        ];

        for (const { username, password, message, emoji } of testCases) {
            await test.step(`Login with username: ${username}`, async () => {
                await loginPage.login({ username, password });
                await loginPage.snackbar.expectSnackbar(message, emoji);
                await loginPage.snackbar.dismissSnackbar();
            })
        }
    });

    test('Cookie login', { tag: '@smoke' }, async ({ fastStart: { testUser } }) => {
        await loginPage.login(testUser, true);
        await loginPage.snackbar.expectSnackbar(snackbarMessages.validLogin.locale.en, snackbarMessages.validLogin.emoji);
        await loginPage.self.page().reload();
        await loginPage.snackbar.expectSnackbar(snackbarMessages.cookieLogin.locale.en, snackbarMessages.cookieLogin.emoji);
    });

    test('Expired cookie', async ({ fastStart: { testUser } }) => {
        await test.step('Auth error due to cookie mismatch', async () => {
            await loginPage.login(testUser);
            await loginPage.snackbar.dismissSnackbar();
            await expireCookie(testUser.username);
            await loginPage.snackbar.expectSnackbar(snackbarMessages.authError.locale.en, snackbarMessages.authError.emoji, 12000); // extended timeout due to backend polling interval (10sec)
            await loginPage.snackbar.dismissSnackbar();
        })

        await test.step('Log in attempt with expired cookie', async () => {
            await loginPage.login(testUser, true);
            await loginPage.snackbar.dismissSnackbar();
            await expireCookie(testUser.username);
            await loginPage.self.page().reload();
            await loginPage.snackbar.expectSnackbar(snackbarMessages.expiredCookie.locale.en, snackbarMessages.expiredCookie.emoji);
        })
    });

    test('Locked account after 4th wrong attempt', async ({ fastStart: { testUser } }) => {
        for (let i = 0; i < 3; i++) {
            await loginPage.login({ username: testUser.username, password: 'x' });
            await loginPage.snackbar.dismissSnackbar();
        }

        await loginPage.login({ username: testUser.username, password: 'x' });
        await loginPage.snackbar.expectSnackbar(snackbarMessages.accountLocked.locale.en, snackbarMessages.accountLocked.emoji);
    });

    test('Anon login form business rules', async () => {
        let anonUser: AnonUser = { id: '', token: '' };

        await test.step('Acessing anon login form', async () => {
            await loginPage.goToAnonSectionButton.click();
            anonUser = await loginPage.getAnonInfo();

            await expect(loginPage.loginSection).toBeHidden();
            await expect(loginPage.anonSection).toBeVisible();
        })

        await test.step('Default form state ', async () => {
            await expect(loginPage.generatedAnonID).not.toHaveText('');
            await expect(loginPage.generatedAnonToken).not.toHaveText('');
            await expectToContainText(loginPage.continueAsAnonButton, anonUser.id);
            await expect(loginPage.anonTokenInput).toBeEmpty();
            await expectBackgroundImage(loginPage.anonPic);
        })

        await test.step('Copy token to clipboard', async () => {
            await loginPage.copyToClipboardButton.click();
            await loginPage.snackbar.expectSnackbar(snackbarMessages.tokenCopiedToClipboard.locale.en, snackbarMessages.tokenCopiedToClipboard.emoji);
            if (true) { }
            else {
                // 🤔 clipboard api not exposed in headless runs
                const clipboardContent: string = await getClipboardContent(loginPage.self.page());
                expect(clipboardContent).toBe(anonUser.token);
            }
        })

        await test.step('Generate new anon user', async () => {
            await loginPage.genNewAnonUserButton.click();
            await expect(loginPage.generatedAnonID).not.toHaveText(anonUser.id!);
            await expect(loginPage.generatedAnonToken).not.toHaveText(anonUser.token!);
        })

        await test.step('Back to main login section', async () => {
            await loginPage.goBackButton.click();
            await expect(loginPage.anonSection).toBeHidden();
            await expect(loginPage.loginSection).toBeVisible();
        })
    });

    test('🐛 Valid anon login', async () => {
        let token: string;

        await test.step('Continue as anon', async () => {
            await loginPage.goToAnonSectionButton.click();
            token = (await loginPage.getAnonInfo()).token;
            await loginPage.continueAsAnonButton.click();  // ❌ app is firing anon login snackbar twice - playwright is trippin (good!)
            await loginPage.self.page().waitForTimeout(200)
            await loginPage.snackbar.expectSnackbar(snackbarMessages.validLogin.locale.en, snackbarMessages.validLogin.emoji);
        })

        await test.step('Cookie login (after continue as anon)', async () => {
            await loginPage.self.page().reload();
            await loginPage.snackbar.expectSnackbar(snackbarMessages.cookieLogin.locale.en, snackbarMessages.cookieLogin.emoji);
            await loginPage.snackbar.dismissSnackbar();
        })

        await test.step('(Manually) login with token', async () => {
            await loginPage.header.logoutButton.click();
            await loginPage.snackbar.dismissSnackbar();
            await loginPage.goToAnonSectionButton.click();
            await loginPage.anonLogin(token);
            await loginPage.snackbar.expectSnackbar(snackbarMessages.validLogin.locale.en, snackbarMessages.validLogin.emoji);
        })

        await test.step('Cookie login (after manually logging in with token)', async () => {
            await loginPage.self.page().reload();
            await loginPage.snackbar.expectSnackbar(snackbarMessages.cookieLogin.locale.en, snackbarMessages.cookieLogin.emoji);
        })
    });

    test('🐛 Invalid anon login', async () => {
        await loginPage.goToAnonSectionButton.click();
        const { id, token } = await loginPage.getAnonInfo();

        interface AnonTestCase {
            stepTitle: string,
            token: string,
            expectedSnackbar: { message: string, emoji: string }
        }

        const testCases: AnonTestCase[] =
            [{ stepTitle: 'Blank Token', token: '', expectedSnackbar: { message: snackbarMessages.badToken.locale.en, emoji: snackbarMessages.badToken.emoji } },
            { stepTitle: 'Invalid syntax token', token: "'bobby ;tables token", expectedSnackbar: { message: snackbarMessages.badToken.locale.en, emoji: snackbarMessages.badToken.emoji } },
            { stepTitle: 'Non-existing token', token: ''.padStart(30, 'x'), expectedSnackbar: { message: snackbarMessages.expiredToken.locale.en, emoji: snackbarMessages.expiredToken.emoji } }]

        for (const { stepTitle, token, expectedSnackbar } of testCases) {
            await test.step(stepTitle, async () => {
                await loginPage.anonLogin(token);
                await loginPage.snackbar.expectSnackbar(expectedSnackbar.message, expectedSnackbar.emoji);
                await loginPage.snackbar.dismissSnackbar();
            })
        }

        await test.step('Expired token', async () => {
            await loginPage.continueAsAnonButton.click();  // ❌ app is firing anon login snackbar twice - playwright is trippin (good!)
            await loginPage.snackbar.dismissSnackbar();
            await expireTrial(id);
            await loginPage.header.logoutButton.click();
            await loginPage.snackbar.dismissSnackbar();
            await expect(loginPage.loginSection).toBeVisible();
            await loginPage.goToAnonSectionButton.click();
            await loginPage.anonLogin(token);
            await loginPage.snackbar.expectSnackbar(snackbarMessages.expiredToken.locale.en, snackbarMessages.expiredToken.emoji);
        })
    });
})