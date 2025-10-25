import { Locator } from '@playwright/test';
import { MenuEntry } from '../types/MenuEntry';

export class AppMenuComponent {
    readonly self: Locator;

    // ---- Menu wrappers
    readonly closeMenuWrapper: Locator;
    readonly openMenuWrapper: Locator;

    // ---- Open / close menu button
    readonly openMenuButton: Locator;
    readonly closeMenuButton: Locator;

    // ---- Closed menu entries
    readonly dashboardClosedEntry: Locator;
    readonly constructorClosedEntry: Locator;
    readonly cloudClosedEntry: Locator;
    readonly toolboxClosedEntry: Locator;

    // ---- Open menu entries
    readonly dashboardEntry: Locator;
    readonly constructorEntry: Locator;
    readonly wizardEntry: Locator;
    readonly editorEntry: Locator;
    readonly exportEntry: Locator;
    readonly cloudEntry: Locator;
    readonly toolboxEntry: Locator;
    readonly applicationsEntry: Locator;
    readonly collectionsEntry: Locator;
    readonly elementsEntry: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.closeMenuWrapper = this.self.locator('#closed-menu-wrapper');
        this.openMenuWrapper = this.self.locator('#open-menu-wrapper');

        this.openMenuButton = this.closeMenuWrapper.locator('.menu-toggler');
        this.closeMenuButton = this.openMenuWrapper.locator('.menu-toggler');

        this.dashboardClosedEntry = this.closeMenuWrapper.getByTestId('dashboardClosedEntry');
        this.constructorClosedEntry = this.closeMenuWrapper.getByTestId('constructorClosedEntry');
        this.cloudClosedEntry = this.closeMenuWrapper.getByTestId('cloudClosedEntry');
        this.toolboxClosedEntry = this.closeMenuWrapper.getByTestId('toolboxClosedEntry');

        this.dashboardEntry = this.openMenuWrapper.getByTestId('dashboardEntry');
        this.constructorEntry = this.openMenuWrapper.getByTestId('constructorEntry');
        this.wizardEntry = this.openMenuWrapper.getByTestId('wizardEntry');
        this.editorEntry = this.openMenuWrapper.getByTestId('editorEntry');
        this.exportEntry = this.openMenuWrapper.getByTestId('exportEntry');
        this.cloudEntry = this.openMenuWrapper.getByTestId('cloudEntry');
        this.toolboxEntry = this.openMenuWrapper.getByTestId('toolboxEntry');
        this.applicationsEntry = this.openMenuWrapper.getByTestId('applicationsEntry');
        this.collectionsEntry = this.openMenuWrapper.getByTestId('collectionsEntry');
        this.elementsEntry = this.openMenuWrapper.getByTestId('elementsEntry');
    }

    /** 
     * Click on the menu entry matching the provided value. Takes into account if menu is closed, and if the entry is hidden behind colapsible.
     * @param {MenuEntry} entry Value use to find a matching menu entry.
     */
    async navigate(entry: MenuEntry) {
        const isMenuClosed: boolean = await this.closeMenuWrapper.isVisible();
        if (isMenuClosed) this.openMenuButton.click();

        const menuEntryLocator: MenuEntryLocator = this.getMenuEntry(entry);

        const isEntryBehindColapsable: boolean = await menuEntryLocator.open.isHidden();
        if (isEntryBehindColapsable) { await menuEntryLocator.parent!.click(); }

        await menuEntryLocator.open.click();
    }

    /**
     * This function 1 is limited to 1 click only on the menu. For a chain of clicks, check navigate(). 
     * 
     * Click on the menu entry matching the provided value. If menu is closed, and the entry provided is not a parent category (hidden when menu is closed), the click is forwarded to the parent entry. 
     *  
     * E.g. When menu closed, if click('Wizard'), the menu opens and the Constructor category is expanded (but we don't end up clicking on the Wizard option itself). 
     * @param entry 
     */
    async click(entry: MenuEntry) {
        const isMenuClosed: boolean = await this.closeMenuWrapper.isVisible();
        const menuEntryLocator: MenuEntryLocator = this.getMenuEntry(entry);

        isMenuClosed
            ? await (menuEntryLocator.closed ?? menuEntryLocator.parent!).click()
            : await menuEntryLocator.open.click();

        await menuEntryLocator.open.click();
    }

    /**
     * Maps MenuEntry to their respective (both menu open and menu closed) Locators. 
     *  
     * If an entry is not a parent category, they do not have their own closed menu Locators, and so the "closed" property is replaced by the parent "property" (which holds the Locator for the parent category). 
     * @param {MenuEntry} entry 
     * @returns {MenuEntryLocator}
     */
    private getMenuEntry(entry: MenuEntry): MenuEntryLocator {
        const menuMap: Record<MenuEntry, MenuEntryLocator> = {
            [MenuEntry.Dashboard]: { open: this.dashboardEntry, closed: this.dashboardClosedEntry },
            [MenuEntry.Constructor]: { open: this.constructorEntry, closed: this.constructorClosedEntry },
            [MenuEntry.Wizard]: { open: this.wizardEntry, parent: this.constructorEntry, },
            [MenuEntry.Editor]: { open: this.editorEntry, parent: this.constructorEntry },
            [MenuEntry.Export]: { open: this.exportEntry, parent: this.constructorEntry },
            [MenuEntry.Cloud]: { open: this.cloudEntry, closed: this.cloudClosedEntry },
            [MenuEntry.Toolbox]: { open: this.toolboxEntry, closed: this.toolboxClosedEntry },
            [MenuEntry.Applications]: { open: this.applicationsEntry, parent: this.toolboxEntry },
            [MenuEntry.Collections]: { open: this.collectionsEntry, parent: this.toolboxEntry },
            [MenuEntry.Elements]: { open: this.elementsEntry, parent: this.toolboxEntry }
        };

        return menuMap[entry];
    }
}

interface MenuEntryLocator {
    open: Locator,
    closed?: Locator,
    parent?: Locator
}