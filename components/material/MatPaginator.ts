import { Locator } from '@playwright/test';

import { MatAutocompleteComponent } from './MatAutocompleteComponent';

export class MatPaginatorComponent {
    readonly self: Locator;

    readonly sizeLength: Locator;

    readonly options: MatAutocompleteComponent;

    readonly nextButton: Locator;
    readonly prevButton: Locator;

    constructor(self: Locator) {
        this.self = self;

        this.sizeLength = this.self.locator('.mat-mdc-select-value-text')

        this.options = new MatAutocompleteComponent(this.self.locator('mat-form-field'));
        this.prevButton = this.self.locator('.mat-mdc-paginator-navigation-previous');
        this.nextButton = this.self.locator('.mat-mdc-paginator-navigation-next');
    }

    /**
     * Returrns parsed information about the mat-paginator 
     * @returns {Promise<PaginatorParse>} parse.firstRecord has the index number of the first record shown.\
     * parse.totalRecords has the number of records on the table.
     */
    async parsePaginatorLabel(): Promise<PaginatorParse> {
        const label: string = await this.self.locator('.mat-mdc-paginator-range-label').textContent() ?? '';
        const firstRecord: number = Number(label.trim().split("-")[0]);
        const totalRecords: number = Number(label.trim().split(" ").at(-1));
        return { firstRecord, totalRecords }
    }

    /** 🔨 Placeholder / Scaffolding - needs testing 
     * Picks an paginator option, updating the number of entries shown in the table it is linked to. 
     * @param {PaginatorSize} size Number of entries to be shown.
     */
    async pickSize(size: PaginatorSize) {
        console.log('🔨 method not tested - pickSize()')
        // to do
        // await this.options.pickOption(size.toString());
    }

    /** 
     * Returns the number of records currently shown per page. 
     * @return {Promise<number>} Number of entries per page.
     */
    async getSize(): Promise<number> {
        return Number(await this.sizeLength.textContent());
    }
}

type PaginatorSize = 1 | 5 | 10 | 25;

interface PaginatorParse {
    firstRecord: number,
    totalRecords: number
}