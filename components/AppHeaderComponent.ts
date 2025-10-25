import { Locator } from "playwright";
import { LeggeraLanguages } from "../types/LeggeraLanguages";
import { LeggeraThemes } from "../types/LeggeraThemes";

export class AppHeaderComponent {
    readonly self: Locator;

    // ---- Anon menu
    readonly anonMenuSection: Locator;
    readonly renewAnonLicenceButton: Locator;
    readonly trialClock: Locator;

    // ---- User menu
    readonly userMenuSection: Locator;
    readonly languagePicker: Locator;
    readonly themePicker: Locator;
    readonly logoutButton: Locator;

    // ---- Theme picker
    readonly themePickerWrapper: Locator;
    readonly themeLuigi: Locator;
    readonly themeSonic: Locator;

    // ---- Language picker
    readonly languagePickerWrapper: Locator;
    readonly languagePT: Locator;
    readonly languageEN: Locator;
    readonly languageES: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.anonMenuSection = this.self.locator('lg2-anon-menu');
        this.renewAnonLicenceButton = this.anonMenuSection.getByTestId('renewAnonLicenseButton');
        this.trialClock = this.anonMenuSection.getByTestId('trialClock');

        this.userMenuSection = this.self.locator('lg2-user-menu');
        this.languagePicker = this.userMenuSection.getByTestId('languagePicker');
        this.themePicker = this.userMenuSection.getByTestId('themePicker');
        this.logoutButton = this.userMenuSection.getByTestId('logoutButton');

        this.themePickerWrapper = this.self.page().locator('.theme-menu-wrapper');
        this.themeLuigi = this.themePickerWrapper.getByTestId('luigiTheme');
        this.themeSonic = this.themePickerWrapper.getByTestId('sonicTheme');

        this.languagePickerWrapper = this.self.page().locator('.lang-menu-wrapper');
        this.languagePT = this.languagePickerWrapper.locator('#pt-lang');
        this.languageEN = this.languagePickerWrapper.locator('#uk-lang');
        this.languageES = this.languagePickerWrapper.locator('#es-lang');
    }

    /**
     * Changes the app's theme to the specified value.
     * @param {LeggeraThemes} theme Theme to apply to the app.
    */
    async changeTheme(theme: LeggeraThemes) {
        const isThemePickerWrapperHidden = await this.themePickerWrapper.isHidden();
        if (isThemePickerWrapperHidden) await this.themePicker.click();

        const themeMap: Record<LeggeraThemes, ThemeAction> = {
            [LeggeraThemes.Luigi]: async () => { await this.themeLuigi.click(); },
            [LeggeraThemes.Sonic]: async () => { await this.themeSonic.click(); },
        }

        await themeMap[theme]();
    }

    /** 
     * Changes the app's language to the specified value.
     * @param {LeggeraLanguages} language Language to apply to the app.
     */
    async changeLanguage(language: LeggeraLanguages) {
        const islanguagePickerWrapperHidden = await this.languagePickerWrapper.isHidden();
        if (islanguagePickerWrapperHidden) await this.languagePicker.click();

        const languageMap: Record<LeggeraLanguages, ThemeAction> = {
            [LeggeraLanguages.Portuguese]: async () => { await this.languagePT.click(); },
            [LeggeraLanguages.Spanish]: async () => { await this.languageES.click(); },
            [LeggeraLanguages.English]: async () => { await this.languageEN.click(); },
        }
        await languageMap[language]();
    }
}


type ThemeAction = () => Promise<void>;