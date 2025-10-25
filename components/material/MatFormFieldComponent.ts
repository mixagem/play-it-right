import { Locator, expect } from '@playwright/test';

import { expectNotToHaveThisClass, expectToContainText, expectToHaveThisClass } from '../../helpers/playwright.helper';

export class MatFormFieldComponent {
    readonly self: Locator;

    readonly title: Locator;
    readonly input: Locator;
    readonly actionButton: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.input = this.self.locator('input');
        this.title = this.self.locator('mat-label');
        this.actionButton = this.self.locator('mat-icon');
    }

    async fill(value: string) {
        await this.input.fill('');
        await this.input.fill(value);
    }

    async expectToBeEmpty() { await expect(this.input).toBeEmpty(); }
    async expectValue(value: string) { await expect(this.input).toHaveValue(value); }
    async expectToBeDisabled() { await expect(this.input).toBeDisabled(); }
    async expectToBeEnabled() { await expect(this.input).toBeEnabled(); }

    /**
     * Asserts if the formfield is of text type.
     */
    async expectTextField() {
        await expect(this.input).toHaveAttribute('type', 'text');
    }

    /**
     * Asserts if the formfield is of password type.
     */
    async expectPasswordField() {
        await expect(this.input).toHaveAttribute('type', 'password');
    }

    /** 
     * Asserts if the formfield is required.
     */
    async expectToBeRequired() {
        await expect(this.self.locator('.mat-mdc-form-field-required-marker')).toBeVisible();
    }

    /** 
     * Asserts if the formfield is not required.
     */
    async expectNotToBeRequired() {
        await expect(this.self.locator('.mat-mdc-form-field-required-marker')).toBeHidden();
    }

    /** 
     * Asserts if the formfield\'s action button is visible.
     */
    async expectActionButton() { await expect(this.actionButton).toBeVisible(); }

    /** 
     * Asserts if the formfield\'s action button is in its warning state.
     */
    async expectValidatorIcon() { await expectToHaveThisClass(this.actionButton, 'validator-warning'); }

    /** 
     * Asserts if the formfield is in a current invalid state.
     */
    async expectToBeInErrorState() { await expectToHaveThisClass(this.self, 'mat-form-field-invalid'); }

    
    /** 
     * Asserts if the formfield is not in an invalid state.
     */
    async expectNotToBeInErrorState() { await expectNotToHaveThisClass(this.self, 'mat-form-field-invalid'); }

    /** 
     * Asserts if a tooltip is present when hovering the action button, and that it has the provided text.
     * @param {string} locale Text used to verify that the tooltip displays the expected value.
     */
    async expectErrorTooltip(locale: string) {
        await this.actionButton.hover();
        const tooltipLocator: Locator = await this.getErrorTooltipWrapper();
        await expectToContainText(tooltipLocator, locale);
    }

    /** 
     * Fetches the Locator for the tooltip wrapper.
     * @return {Promise<Locator>} Tooltip\'s wrapper Locator.
     */
    private async getErrorTooltipWrapper(): Promise<Locator> {
        return this.self.page().locator('mat-tooltip-component');
    }
}