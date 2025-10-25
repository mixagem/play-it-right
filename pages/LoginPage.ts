const { BUILD_NUMBER } = process.env;
import { Page, Locator } from '@playwright/test';

import { SnackbarComponent } from '../components/SnackbarComponent';
import { AppHeaderComponent } from '../components/AppHeaderComponent';
import { AnonUser } from '../types/AnonUser';
import { TestUser } from '../types/TestUser';
import { MatFormFieldComponent } from '../components/material/MatFormFieldComponent';

export class LoginPage {
    readonly page: Page;
    readonly self: Locator;

    // ---- Logos
    readonly startupLogo: Locator;
    readonly loginLogo: Locator;

    // ---- Login card
    readonly loginSection: Locator;
    readonly usernameInput: MatFormFieldComponent;
    readonly passwordInput: MatFormFieldComponent;
    readonly showPasswordButton: Locator;
    readonly cookieCheckbox: Locator;
    readonly loginButton: Locator;
    readonly goToAnonSectionButton: Locator;

    // ---- Anon card
    readonly anonSection: Locator;
    readonly anonPic: Locator;
    readonly generatedAnonID: Locator;
    readonly generatedAnonToken: Locator;
    readonly copyToClipboardButton: Locator;
    readonly continueAsAnonButton: Locator;
    readonly anonTokenInput: Locator;
    readonly loginWithTokenButton: Locator;
    readonly goBackButton: Locator;
    readonly genNewAnonUserButton: Locator;

    // ---- Imports 
    readonly snackbar: SnackbarComponent;
    readonly header: AppHeaderComponent;

    constructor(page: Page) {
        this.page = page;
        this.self = this.page.locator('lg2-landing-page');

        this.startupLogo = this.self.locator('lg2-mi-infinity#startup-logo');
        this.loginLogo = this.self.locator('lg2-mi-infinity#login-logo');

        this.loginSection = this.self.locator('lg2-login-card');
        this.usernameInput = new MatFormFieldComponent(this.loginSection.locator('mat-form-field:has(input[formcontrolname="username"])')); 
        this.passwordInput = new MatFormFieldComponent(this.loginSection.locator('mat-form-field:has(input[formcontrolname="password"])'));
        this.showPasswordButton = this.loginSection.locator('#show-password-button');
        this.cookieCheckbox = this.loginSection.locator('#keep-me-logged > mat-checkbox input');
        this.loginButton = this.loginSection.locator('#login-button');
        this.goToAnonSectionButton = this.loginSection.locator('#anon-section-button');

        this.anonSection = this.self.locator('lg2-anon-login');
        this.anonPic = this.anonSection.locator('#picture-frame');
        this.generatedAnonID = this.anonSection.locator('p span:last-of-type');
        this.generatedAnonToken = this.anonSection.locator('#token > span:last-of-type');
        this.copyToClipboardButton = this.anonSection.locator('#token button');
        this.continueAsAnonButton = this.anonSection.locator('#main-action');
        this.anonTokenInput = this.anonSection.locator('mat-form-field input');
        this.loginWithTokenButton = this.anonSection.locator('mat-form-field .mat-mdc-form-field-icon-suffix');
        this.goBackButton = this.anonSection.locator('#actions > button:first-of-type');
        this.genNewAnonUserButton = this.anonSection.locator('#actions > button:last-of-type');

        this.snackbar = new SnackbarComponent(this.page.locator('lg2-app-snack'));
        this.header = new AppHeaderComponent(this.page.locator('lg2-header'));
    }

    /**
     * Navigate to leggera2\'s root page (.../leggera2/).
     */
    async goToAppRoot() {
        await this.page.goto(`/${BUILD_NUMBER ?? 0}/leggera2/`);
    }

    /**
     * Navigate to leggera2's root page (.../leggera2/) and waits for animations to finish.
     */
    async appStart() {
        await this.goToAppRoot();
        await this.loginLogo.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Fills the username and passwords fields. If wantCookie, cookie checkbox is checked. Finally, the login button is pressed.
     * @param {TestUser} userObj TestUser object with user info.
     * @param {boolean} wantCookie If true, cookie is going to be stored on login.
     * Fills the username and password fields, 
     * if wantCookie is true said checkbox is also clicked, 
     * and then clicks on the login button.
     */
    async login(userObj: TestUser, wantCookie: boolean = false) {
        await this.usernameInput.fill(userObj.username);
        await this.passwordInput.fill(userObj.password);
        if (wantCookie) await this.cookieCheckbox.click();
        await this.loginButton.click();
    }

    /**
     * Fills the anon token field, then the login with anon token button is pressed. 
     * @param {string} token Token to login with.
     */
    async anonLogin(token: string) {
        await this.anonTokenInput.fill(token);
        await this.loginWithTokenButton.click();
    }

    /**
     * Obtains the generated anon user info.
     * @return {Promise<AnonUser>} AnonUser object.
     */
    async getAnonInfo(): Promise<AnonUser> {
        const id = await this.generatedAnonID.textContent() ?? '';
        const token = await this.generatedAnonToken.textContent() ?? '';
        return { id, token }
    }
}