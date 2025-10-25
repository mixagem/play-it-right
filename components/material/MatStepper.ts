import { Locator } from '@playwright/test';

import { MatTabGroup } from './MatTabGroup';

export class MatStepperComponent extends MatTabGroup {
    constructor(self: Locator) {
        super(self);
    }

    async clickNextButton() {
        const nxtBtn: Locator = await this.nextButton();
        await nxtBtn.click();
    }

    async clickPreviousButton() {
        const prevBtn: Locator = await this.prevButton();
        await prevBtn.click();
    }

    /**
     * Fetches the Locator for the current step\'s next button.
     * @return {Promise<Locator>} Next step button Locator.
     */
    async nextButton(): Promise<Locator> {
        const tabContent = await this.getContent();
        return tabContent.locator('.mat-stepper-next');
    }

    /**
     * Fetches the Locator for the current step\'s previous button.
     * @return {Promise<Locator>} Previous step button Locator.
     */
    async prevButton(): Promise<Locator> {
        const tabContent = await this.getContent();
        return tabContent.locator('.mat-stepper-previous');
    }
}