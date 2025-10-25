import { Locator, expect, Response } from '@playwright/test';

import { MatTableComponent } from './material/MatTable';
import { MatFormFieldComponent } from './material/MatFormFieldComponent';
import { MatPaginatorComponent } from './material/MatPaginator';
import { sortByProperty } from '../helpers/playwright.helper';
import { TableOrderConfig } from '../types/TableOrderConfig';
import { MainformListDataSource } from '../types/LeggeraDataSource';

export class MainFormListComponent {
    readonly self: Locator;

    // ---- Header
    readonly header: Locator;
    readonly headerIcon: Locator;
    readonly headerTitle: Locator;

    // ---- Header actions
    readonly addNewButton: Locator;
    readonly deleteButton: Locator;
    readonly downloadButton: Locator;

    // ---- Imports
    readonly table: MatTableComponent;
    readonly search: MatFormFieldComponent;
    readonly paginator: MatPaginatorComponent;

    constructor(self: Locator) {
        this.self = self;

        this.header = this.self.locator('#mainform-list-header');
        this.headerIcon = this.header.locator('mat-icon:first-of-type');
        this.headerTitle = this.header.locator('h1');
        this.addNewButton = this.header.getByTestId('mainformListAddNewButton');
        this.deleteButton = this.header.getByTestId('mainformListDeleteButton');
        this.downloadButton = this.header.getByTestId('mainformListDownloadButton');

        this.table = new MatTableComponent(this.self.locator('table'));
        this.search = new MatFormFieldComponent(this.self.page().locator('#search-box'));
        this.paginator = new MatPaginatorComponent(this.self.locator('mat-paginator'));
    }

    /** 
     * Intersects the API call, returning the (parsed) backend response.  
     * @param {Locator} locator MainformList Locator.
     * @param {string} endpoint API endpoint to spy.
     * @return {Promise<MainformListDataSource[]>} Parsed backend response.
     */
    async APISearchSpy(locator: Locator, endpoint: string): Promise<MainformListDataSource[]> {
        const response: Response = await locator.page().waitForResponse(endpoint);
        const parse = await response.json();
        return parse['dataSource'] as MainformListDataSource[];
    }

    /**
     * Executes a mainform search.
     * @param needle Text to filter the results.
     * @returns 
     */
    async makeSearch(needle: string): Promise<MainformListDataSource[]> {
        await this.search.fill('');
        const context: string = this.self.page().url().split('/').at(-1)!; // 🚅🚅🚅🚅 😂
        const [response] = await Promise.all([
            this.APISearchSpy(this.self, `**/lg2api/${context}.php**`),
            this.search.fill(needle)
        ])
        return response;
    }

    /** 
     * Assert the currently shown records are correct (taking into account to the filter and sorting set). 
     * @param originalDataSource Datasource previous state. - We apply the sort and slice operations to this data source, and then compare it to what is being rendered. 
     */
    async expectCorrectListing(originalDataSource: MainformListDataSource[]) {
        // sorting the data
        const sorting: TableOrderConfig | null = await this.getSortConfig();
        let sortedData: MainformListDataSource[] = structuredClone(originalDataSource);
        if (sorting) {
            const { col, sort } = sorting;
            sortedData = sortByProperty(originalDataSource, col, sort === 'ascending');
        }

        // slicing the data
        const slicedData: MainformListDataSource[] = await this.slicer(sortedData);

        // matching the data
        const match: boolean = await this.compareDataSource(slicedData);
        expect(match).toBeTruthy();
    }

    /**
     * Compares a (ordered and sliced) dataSource to what is being currently being rendered.  
     * @param dataSource Ordered and sliced dataSource to be used. 
     * @returns {boolean} Retuns true is there was a 100% match. Else, return false.
     */
    private async compareDataSource(dataSource: MainformListDataSource[]): Promise<boolean> {
        const allHeaders: Locator = this.self.locator('thead').getByRole('row')
            .locator('> th:not(:first-of-type)')
        const allRows: Locator = this.self.locator('tbody').getByRole('row');

        for (let i = 0; i < (await allRows.count()); i++) {
            const row: Locator = allRows.nth(i);
            const allCells = row.locator('> td:not(:first-of-type)')

            for (let k = 0; k < (await allCells.count()); k++) {
                const headCell: Locator = allHeaders.nth(k);

                const header: keyof MainformListDataSource = (await headCell.getAttribute('mat-sort-header')) as keyof MainformListDataSource;
                const cell: Locator = allCells.nth(k);
                const match: boolean = dataSource[i][header] === await cell.textContent();
                if (!match) return false;
            }
        }
        return true;
    }

    /**
     * Returns the sort configuration currently applied to the table. Returns null if no ordering is applied.
     * @returns {Promise<TableOrderConfig | null>} cfg.col has the key of the columns used in the sort. \
     * cfg.sort has the sort direction.  
     */
    private async getSortConfig(): Promise<TableOrderConfig | null> {
        const isTableOrdered: boolean = await this.isTableCurrentlySorted();
        if (!isTableOrdered) return null;

        const header: Locator = this.self.locator('[role="columnheader"][aria-sort]:not([aria-sort="none"])');
        const propertyName: string = await header.getAttribute('mat-sort-header') ?? '';

        const col: keyof MainformListDataSource = propertyName as keyof MainformListDataSource;
        const sort: string = await header.getAttribute('aria-sort') ?? '';

        return { col, sort };
    }

    /** 
     * Checks if is there any sorting applied on the table data.
     */
    private async isTableCurrentlySorted(): Promise<boolean> {
        const header = this.self.locator('[role="columnheader"][aria-sort]:not([aria-sort="none"])');
        return !!(await header.count())
    }

    /** 
     * Slices a dataSource according to the paginator settings.
     * @param {MainformListDataSource[]} dataSource DataSource to be sliced;
     */
    private async slicer(dataSource: MainformListDataSource[]): Promise<MainformListDataSource[]> {
        const index: number = (await this.paginator.parsePaginatorLabel()).firstRecord;
        const pageSize: number = await this.paginator.getSize();
        return dataSource.slice(index - 1, index - 1 + pageSize);
    }
}
