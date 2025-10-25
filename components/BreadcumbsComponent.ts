import { Locator } from '@playwright/test';

import { expectToContainText } from '../helpers/playwright.helper';

export class BreadcumbsComponent {
    readonly self: Locator;

    readonly historyIcon: Locator;

    constructor(self: Locator) {
        this.self = self;
        this.historyIcon = this.self.locator('> mat-icon');
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Fetches a breadcumb Locator matching the provided needle.
     * @param {string | number} needle String or order number used to find a matching breadcumb.
     * @returns {Promise<Locator>} 
     */

    private async breadcumb(needle: string | number): Promise<Locator> {
        console.log('🔨 method not tested - breadcumb()')
        return this.self;

        switch (typeof needle) {
            case 'number':
            case 'string':
            default:
                throw new Error(`Unexpected typeof "${typeof needle}" @ BreadcumbsComponent.ts`);


        }
        // v0: return this.self.locator(`span:nth-of-type(${needle})`)
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Clicks on a breadcumb matching the provided needle.
     * @param {string | number} needle String or order number used to find a matching breadcumb.
     */
    async click(needle: string | number) {
        console.log('🔨 method not tested - click()')
        const breadcumb: Locator = await this.breadcumb(needle);
        await breadcumb.click();
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Assert breadcumb\' title.
     * @param {string} title Title to assert.
     * @param {number} order Order number of the breadcumb to assert against.
     */
    async expectTitle(title: string, order: number) {
        console.log('🔨 method not tested - expectTitle()')
        const breadcumb: Locator = await this.breadcumb(order);
        await expectToContainText(breadcumb, title);
    }
}