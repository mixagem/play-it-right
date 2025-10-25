import { Page, Locator } from 'playwright';

import { AppMenuComponent } from '../components/AppMenuComponent';
import { MenuEntry } from '../types/MenuEntry';

export class EditorPage {
    readonly page: Page;
    readonly self: Locator;

    readonly monacoEditor: Locator;

    // ---- Imports
    readonly menu: AppMenuComponent;

    constructor(page: Page) {
        this.page = page;
        this.self = this.page.locator('lg2-leggera-editor');

        this.monacoEditor = this.self.locator('.monaco-editor textarea.inputarea');

        this.menu = new AppMenuComponent(this.page.locator('lg2-menu'));
    }

    /**
     * Navigate to editor page (.../leggera2/editor).
     */
    async navigateToEditor() {
        await this.menu.navigate(MenuEntry.Editor);
        await this.page.waitForURL(/\/editor/);
    }

    /**
     * Wait for the monaco editor to finish loading.
     */
    async waitForMonaco() {
        await this.self.locator('#live-preview-container mat-spinner').waitFor({ state: 'hidden', timeout: 15000 });
    }
}