import { Locator, expect } from '@playwright/test';

import { expectToContainText } from '../../helpers/playwright.helper';

export class MatTabGroup {
    readonly self: Locator;

    readonly currentTab: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.currentTab = this.self.getByRole('tab', { selected: true });
    }

    /** 
     * Clicks on the selected tab. 
     * @param {string} needle String or order number used to find a matching tab.
     */
    async clickTab(needle: string | number) {
        const tab: Locator = await this.getTab(needle);
        await tab.click();
    }

    /** 
     * Asserts the number of tabs.
     * @param {string} count Number of tabs to assert against.
     */
    async expectNumberOfTabs(count: number) {
        await expect(this.self.getByRole('tab')).toHaveCount(count);
    }

    /** 
     * Asserts the title of a tab.
     * @param {string} title Text used to verify that the tab displays the expected title.
     * @param {number} order Order number of the tab to assert the title of. \
     * If not provided, the currentTab\'s title will be used to assert against. 
     */
    async expectTabTitle(title: string, order: number = -1) {
        const tabTitle: Locator = order === -1
            ? this.currentTab
            : await this.getTab(order);

        await expectToContainText(tabTitle, title);
    }

    /** 
     * Asserts if we are on a expected tab.
     * @param {number} order Order number of the tab to assert user\'s current location.
     */
    async expectToBeOnTab(order: number) {
        const currentStep: Locator = this.currentTab;
        const matchingStep: Locator = await this.getTab(order);
        const matchingID: string = await matchingStep.getAttribute('id') ?? '';
        await expect(currentStep).toHaveAttribute('id', matchingID);
    }

    /** 
     * Asserts if we a tab is disabled.
     * @param {number} order Order number of the tab.
     */
    async expectDisabledTab(order: number) {
        await expect(await this.getTab(order)).toBeDisabled();
    }

    /** 
     * Fetches the Locator for the content of the current tab.
     * @return {Promise<Locator>} Tab content Locator.
     */
    async getContent(): Promise<Locator> {
        const ID: string = await this.currentTab.getAttribute('aria-controls') ?? '';
        return this.self.locator(`#${ID}`);
    }
    
    /**
     * Fetches the Locator of a tab.
     * @param {string | number} needle String or order number used to find a matching tab.
     * @return {Promise<Locator>} Tab Locator.
     */
    private async getTab(needle: string | number): Promise<Locator> {
        switch (typeof needle) {
            case 'string': return this.self.getByRole('tab', { name: new RegExp(`${needle}`) }).first();
            case 'number': return this.self.getByRole('tab').nth(needle - 1);
            default:
                throw new Error(`Unexpected typeof "${typeof needle}" @ MatTabGroupComponent.ts`);
        }
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Fetches the Locator of a tab icon.
     * @param {string | number} needle Text or order number used to find a matching tab.
     * @return {Promise<Locator>} Tab icon Locator.
     */
    private async getTabIcon(needle: string | number): Promise<Locator> {
        const tab: Locator = await this.getTab(needle);
        return tab.locator('mat-icon');
    }
}