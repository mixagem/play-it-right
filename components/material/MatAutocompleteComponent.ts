import { Locator } from '@playwright/test';

import { expectImage } from '../../helpers/playwright.helper';
import { MatFormFieldComponent } from './MatFormFieldComponent';

export class MatAutocompleteComponent extends MatFormFieldComponent {
    constructor(self: Locator) {
        super(self);
    }

    /** 
     * Asserts if an option has an image.
     * @param {string | number} needle String or order number used to find a matching option in the autocomplete.
     */
    async expectOptionWithImage(needle: string | number) {
        const option: Locator = await this.getOption(needle);
        await expectImage(option);
    }

    /** 
     *  If autocomplete wrapper is hidden, we click on the autocomplete input to trigger the overlay.
     */
    async openAutocomplete() {
        const wrapper: Locator = await this.getAutocompleteWrapper();
        const isWrapperHidden: boolean = await wrapper.isHidden();
        if (isWrapperHidden) await this.self.locator('input').click();
    }

    /** 
     * Picks an option matching the provided needle (automatically triggers autocomplete overlay if needed).
     * @param {string | number} needle String or order number used to find a matching option in the autocomplete.
     */
    async pickOption(needle: string | number) {
        const option: Locator = await this.getOption(needle);
        await option.click();
    }

    /** 
     * Picks an option at random (automatically triggers autocomplete overlay if needed).
     */
    async randomPick() {
        await this.openAutocomplete();
        const wrapper: Locator = await this.getAutocompleteWrapper();
        const numberOfOptions: number = await wrapper.getByRole('option').count();
        const randomGeneratedNumber: number = Math.floor(Math.random() * numberOfOptions);
        await this.pickOption(randomGeneratedNumber);
    }

    /** 
     * Fetches an option Locator matching the provided needle (automatically triggers autocomplete overlay if needed).
     * @param {string | number} needle String or order number used to find a matching option in the autocomplete.
     * @return {Promise<Locator>} Option Locator.
     */
    private async getOption(needle: string | number): Promise<Locator> {
        await this.openAutocomplete();
        const wrapper: Locator = await this.getAutocompleteWrapper();

        switch (typeof needle) {
            case 'string':
                const option: Locator = wrapper.getByRole('option', { name: new RegExp(`\/${needle}\/`) }).first();
                return option;

            case 'number':
                const options: Locator = wrapper.getByRole('option');
                return options.nth(needle - 1);

            default:
                throw new Error(`Unexpected typeof "${typeof needle}" @ MatAutocompleteComponent.ts`);
        }
    }

    /** 
     * Fetches the autocomplete\'s wrapper Locator.
     * @return {Promise<Locator>} Autocomplete\'s wrapper Locator.
     */
    private async getAutocompleteWrapper(): Promise<Locator> {
        return this.self.page().getByRole('listbox');
    }
}