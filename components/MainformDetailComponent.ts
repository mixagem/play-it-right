import { Locator, Response } from '@playwright/test';

import { MatTabGroup } from './material/MatTabGroup';
import { MainformDetailsDataSource } from '../types/LeggeraDataSource';

export class MainformDetailsComponent {
    readonly self: Locator;

    // ---- Header
    readonly title: Locator;

    // ---- Header actions
    readonly deleteButton: Locator;
    readonly cloneButton: Locator;
    readonly editButton: Locator;
    readonly closeDialogButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly cancelDeleteButton: Locator;

    // ---- Imports
    readonly tabs: MatTabGroup;

    constructor(self: Locator) {
        this.self = self;

        this.title = this.self.locator('.title');

        this.deleteButton = this.self.getByTestId('mainformDetailDeleteButton');
        this.cloneButton = this.self.getByTestId('mainformDetailClonebutton');
        this.editButton = this.self.getByTestId('mainformDetailEditButton');
        this.closeDialogButton = this.self.getByTestId('mainformDetailCloseDialogButton');
        this.confirmDeleteButton = this.self.getByTestId('mainformDetailConfirmDeleteButton');
        this.cancelDeleteButton = this.self.getByTestId('mainformDetailCancelDeleteButton');

        this.tabs = new MatTabGroup(this.self.locator('mat-tab-group'));
    }


    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Intersects the API call, returning the (parsed) backend response.  
     * @param {Locator} locator MainformDetails Locator.
     * @param {string} endpoint API endpoint to spy.
     * @return {Promise<MainformDetailsDataSource>} Parsed backend response.
     */
    async APIFilterSpy(locator: Locator, endpoint: string): Promise<MainformDetailsDataSource> {
        console.log('🔨 method not tested - APIFilterSpy()')
        const response: Response = await locator.page().waitForResponse(endpoint);
        const parse = await response.json();
        return parse as MainformDetailsDataSource;
    }
}