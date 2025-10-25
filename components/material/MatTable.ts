import { Locator, expect } from '@playwright/test';

export class MatTableComponent {
    readonly self: Locator;

    readonly selectAllCheckbox: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.selectAllCheckbox = this.self.locator('th input');
    }

    /**
     * Clicks on a table column header, sorting the table data according to the header selected.
     * @param {string | number} needle String or order number used to find a matching column in the table header.
     */
    async sortByHeader(needle: string | number) {
        const header: Locator = await this.getHeader(needle);
        await header.click();
    }

    /**
     * Clicks on a table row.
     * @param {string | number} needle String or order number used to find a matching table row.
     */
    async clickRow(needle: string | number) {
        const row: Locator = await this.getTableRow(needle);
        await row.click();
    }

    /**
     * Clicks on a table row\'s checkbox.
     * @param {string | number} needle String or order number used to find a matching table row.
     */
    async selectRow(needle: string | number) {
        const row = await this.getTableRow(needle);
        await row.locator('mat-checkbox').click();
    }

    /** 
     * Fetches an table row Locator matching the provided needle.
     * @param {string | number} needle String or order number used to find a matching table row.
     * @return {Promise<Locator>} Row Locator.
     */
    private async getTableRow(needle: string | number): Promise<Locator> {
        switch (typeof needle) {
            case 'string': return this.self.locator('tbody').getByRole('row', { name: new RegExp(`${needle}`) }).first();
            case 'number': return this.self.locator('tbody').getByRole('row').nth(needle - 1);
            default:
                throw new Error(`Unexpected typeof "${typeof needle}" @ MatTableComponent.ts`);
        }
    }

    /** 
     * Fetches an table column header Locator matching the provided needle.
     * @param {string | number} needle String or order number used to find a matching table row.
     * @return {Promise<Locator>} Header Locator.
     */
    private async getHeader(needle: string | number): Promise<Locator> {
        switch (typeof needle) {
            case 'string': return this.self.getByRole('columnheader', { name: new RegExp(`${needle}`) }).first();
            case 'number': return this.self.getByRole('columnheader').nth(needle - 1);
            default:
                throw new Error(`Unexpected typeof "${typeof needle}" @ MatTableComponent.ts`);
        }
    }

    /** 
     * Asserts if rows are selected.
     * @param {(string | number)[]} orders Oorder numbers used to find a matching row. 
     */
    async expectRowsToBeSelected(orders: number[]) {
        const allRows: Locator = this.self.locator('tbody').getByRole('row');

        for (let i = 0; i < (await allRows.count()); i++) {
            const row: Locator = await this.getTableRow(i);
            orders.includes(i)
                ? await expect(row.locator('>td input')).toBeChecked()
                : await expect(row.locator('>td input')).not.toBeChecked()
        }
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Asserts if all rows are selected.
     */
    async expectAllRowsToBeSelected() {
        console.log('🔨 method not tested - expectAllRowsToBeSelected()')
        await expect(this.selectAllCheckbox).toBeChecked();

        const allRows: Locator = this.self.getByRole('row');
        for (let i = 0; i < (await allRows.count()); i++) {
            const row: Locator = allRows.nth(i);
            await expect(row.locator('>td input')).toBeChecked();
        }
    }

    /** 
     * Asserts if no rows are selected.
     */
    async expectNoRowsToBeSelected() {
        const allRows: Locator = this.self.locator('tbody').getByRole('row');
        for (let i = 0; i < (await allRows.count()); i++) {
            const row: Locator = allRows.nth(i);
            await expect(row.locator('>td input')).not.toBeChecked();
        }
    }
}