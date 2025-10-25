import fs from "fs";
import path from "path";
import { Page, Locator, Response, expect } from '@playwright/test';

import { AppMenuComponent } from '../components/AppMenuComponent';
import { MatStepperComponent } from '../components/material/MatStepper';
import { MatFormFieldComponent } from '../components/material/MatFormFieldComponent';
import { MatAutocompleteComponent } from '../components/material/MatAutocompleteComponent';
import { MainFormListComponent } from '../components/MainformListComponent';
import { MenuEntry } from "../types/MenuEntry";
import { MatTableComponent } from "../components/material/MatTable";
import { MainformListDataSource } from "../types/LeggeraDataSource";
import { MatPaginatorComponent } from "../components/material/MatPaginator";

export class WizardPage {
  readonly page: Page;
  readonly self: Locator;

  readonly stepper: MatStepperComponent;

  // ---- Page origin
  readonly fromScratchRadio: Locator;
  readonly getFromCloudRadio: Locator;
  readonly importMILORadio: Locator;

  // ---- .MILO import
  readonly fileDropZone: Locator;
  readonly fileImportButton: Locator;

  // ---- Cloud import
  readonly noRecordsLabel: Locator;
  readonly cloudRecordsTable: MatTableComponent;
  readonly search: MatFormFieldComponent;
  readonly paginator: MatPaginatorComponent;

  // ---- Page details
  readonly applicationAutocomplete: MatAutocompleteComponent;
  readonly pageTitleInput: MatFormFieldComponent;

  // ---- Result 
  readonly navigateToEditorButton: Locator;
  readonly restartWizardButton: Locator;

  // ---- Imports
  readonly menu: AppMenuComponent;
  readonly mainform: MainFormListComponent;

  constructor(page: Page) {
    this.page = page;
    this.self = this.page.locator('lg2-wizard');

    this.stepper = new MatStepperComponent(this.self.locator('mat-stepper'));

    this.fromScratchRadio = this.self.getByTestId('fromScratch').locator('input');
    this.importMILORadio = this.self.getByTestId('miloImport').locator('input');
    this.getFromCloudRadio = this.self.getByTestId('cloudImport').locator('input');

    this.noRecordsLabel = this.page.locator('lg2-no-records');
    this.cloudRecordsTable = new MatTableComponent(this.self.locator('table'));
    this.search = new MatFormFieldComponent(this.self.locator('lg2-paginator-filter > mat-form-field'));
    this.paginator = new MatPaginatorComponent(this.self.locator('mat-paginator'));

    this.fileDropZone = this.self.locator('ngx-file-drop > div');
    this.fileImportButton = this.self.locator('ngx-file-drop button');

    this.applicationAutocomplete = new MatAutocompleteComponent(this.self.locator('mat-form-field:has(input[formcontrolname="application"])'));
    this.pageTitleInput = new MatFormFieldComponent(this.self.locator('mat-form-field:has(input[formcontrolname="name"])'));

    this.navigateToEditorButton = this.self.getByTestId('finishWizard');
    this.restartWizardButton = this.self.getByTestId('resetWizard');

    this.menu = new AppMenuComponent(this.page.locator('lg2-menu'));
    this.mainform = new MainFormListComponent(this.self.locator('lg2-mainform-list'));
  }

  /**
   * Navigate to wizard page (.../leggera2/wizard).
   */
  async navigateToWizard() {
    await this.menu.navigate(MenuEntry.Wizard);
    await this.menu.click(MenuEntry.Wizard);
    await this.page.waitForURL(/\/wizard/);
  }

  /**
   * Mocks picking a file with file explorer.
   */
  async pickWithExplorer(file: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.fileImportButton.click(),
    ]);

    await fileChooser.setFiles(`fixtures/files/${file}`);
  }

  /** 
  * Intersects the API call, returning the (parsed) backend response.  
  * @return {Promise<MainformListDataSource[]>} Parsed backend response.
  */
  async APISearchSpy(): Promise<MainformListDataSource[]> {
    const response: Response = await this.self.page().waitForResponse('**/lg2api/pages.php**');
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
    const [response] = await Promise.all([
      this.APISearchSpy(),
      this.search.fill(needle)
    ])
    return response;
  }

  /**
   * Assert the currently shown records are correct (taking into account to the filter and sorting set). 
   * @param originalDataSource Datasource previous state. - We apply the sort and slice operations to this data source, and then compare it to what is being rendered. 
   */
  async expectCorrectListing(originalDataSource: MainformListDataSource[]) {
    // slicing the data
    const slicedData: MainformListDataSource[] = await this.slicer(originalDataSource);

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

        // ❌ this table has no sort, this locator wont do it 
        const header: keyof MainformListDataSource = (await headCell.getAttribute('data-testid')) as keyof MainformListDataSource;

        const cell: Locator = allCells.nth(k);
        const match: boolean = dataSource[i][header] === (await cell.textContent())!.trim();
        if (!match) return false;
      }
    }
    return true;
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


  /**
   * 🔫 method not working - Mocks droping a file on the drop zone.
   * @param {Page} page
   * @param {string} dropZoneSelector
   * @param {string} localFilePath
   * @param {string} mimeType
   */
  async simulateNativeFileDrop(
    page: Page,
    dropZoneSelector: string,
    localFilePath: string,
    mimeType: string = 'application/octet-stream'
  ) {
    throw new Error('🔫 bad method: simulateNativeFileDrop()');
    const absolutePath = path.resolve(localFilePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at path: ${absolutePath}`);
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const fileName = path.basename(absolutePath);
    const fileArray = Array.from(fileBuffer);

    await page.evaluate(
      ({ selector, name, type, array }) => {
        const targetElement = document.querySelector(selector);
        if (!targetElement) throw new Error(`Target element not found: ${selector}`);

        const uint8Array = new Uint8Array(array);
        const blob = new Blob([uint8Array], { type });
        const file = new File([blob], name, { type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        targetElement.dispatchEvent(
          new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer })
        );
        targetElement.dispatchEvent(
          new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer })
        );
      },
      {
        selector: dropZoneSelector,
        name: fileName,
        type: mimeType,
        array: fileArray,
      }
    );
  }
}