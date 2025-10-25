import { Locator, expect } from '@playwright/test';

export class SnackbarComponent {
    readonly self: Locator;

    readonly emoji: Locator;
    readonly dismissButton: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.emoji = this.self.locator('.mdc-button__label');
        this.dismissButton = this.self.locator('button');
    }

    /**
     * Waits for the snackbar to be shown.
     * @param {number} timeout time (in ms) until playwright throws an timeout error (default 5000).
     */
    async waitForVisible(timeout: number = 5000) {
        await this.self.waitFor({ state: 'visible', timeout });
    }

    /**
     * Waits for the snackbar to be hidden.
     * @param {number} timeout time (in ms) until playwright throws an timeout error (default 5000).
     */
    async waitForInvisible(timeout: number = 5000) {
        await this.self.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Asserts snackbar\'s message and emoji.
     */
    async expectSnackbar(message: string | RegExp, emoji: string, timeout: number = 5000) {
        await this.waitForVisible(timeout);
        await expect(this.self).toHaveText(new RegExp(message));
        await expect(this.emoji).toHaveText(emoji);
    }

    /**
     * Dismisses the snanckbar.
     */
    async dismissSnackbar() {
        await this.waitForVisible();
        await this.dismissButton.click();
        await this.waitForInvisible();
    }
}
