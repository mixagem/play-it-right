import { Page, Locator } from 'playwright';

import { AppMenuComponent } from '../components/AppMenuComponent';
import { MainFormListComponent } from '../components/MainformListComponent';
import { MenuEntry } from '../types/MenuEntry';

export class ElementsPage {
    readonly page: Page;
    readonly self: Locator;

    // ---- Imports 
    readonly menu: AppMenuComponent;
    readonly mainform: MainFormListComponent;

    constructor(page: Page) {
        this.page = page;
        this.self = this.page.locator('lg2-elements-list');

        this.menu = new AppMenuComponent(this.page.locator('lg2-menu'));
        this.mainform = new MainFormListComponent(this.self.locator('lg2-mainform-list'));
    }

    /**
     * Navigate to elements page (.../leggera2/elements).
     */
    async navigateToElements() {
        await this.menu.navigate(MenuEntry.Elements);
        await this.page.waitForURL(/\/elements/);
    }
}