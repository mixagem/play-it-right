import { expect } from '@playwright/test';

import { test } from '../fixtures/loginFixtures';
import { WizardPage } from '../pages/WizardPage';
import { locales } from '../fixtures/locales';
import { MainformListDataSource } from '../types/LeggeraDataSource';
import { createMockPage } from '../helpers/testingAPI.helper';

test.describe('🧙‍  Wizard page', () => {
    let wizardPage: WizardPage;
    let dataSource: MainformListDataSource[];

    test.beforeEach(async ({ loggedInUser: { page } }) => {
        wizardPage = new WizardPage(page);
        await wizardPage.navigateToWizard()
    });

    test('New page via cloud (work in progress 🔨)', async ({ loggedInUser: { testUser } }) => {
        await test.step('No records round', async ({ }) => {
            await wizardPage.getFromCloudRadio.click();
            await wizardPage.stepper.clickNextButton();
            await expect(wizardPage.stepper.self.locator('lg2-no-records')).toBeVisible();
        })

        await test.step('Cloud records default state', async () => {
            await createMockPage(testUser.username, 3);
            await wizardPage.stepper.clickPreviousButton();

            const [response] = await Promise.all([
                wizardPage.APISearchSpy(),
                wizardPage.stepper.clickNextButton(),
            ])
            dataSource = response;

            await expect(await wizardPage.stepper.nextButton()).toBeDisabled();
            await wizardPage.cloudRecordsTable.expectNoRowsToBeSelected();
            await wizardPage.search.expectToBeEmpty();
            await wizardPage.search.expectActionButton();

            await wizardPage.cloudRecordsTable.clickRow(1);
            await wizardPage.cloudRecordsTable.expectRowsToBeSelected([1]);
            await expect(await wizardPage.stepper.nextButton()).toBeEnabled();

            await wizardPage.cloudRecordsTable.clickRow(2);
            await wizardPage.cloudRecordsTable.expectRowsToBeSelected([2]);

            await wizardPage.cloudRecordsTable.clickRow(2);
            await wizardPage.cloudRecordsTable.expectNoRowsToBeSelected();
            await expect(await wizardPage.stepper.nextButton()).toBeDisabled();

            dataSource = await wizardPage.makeSearch('scam');
            await wizardPage.expectCorrectListing(dataSource);

            dataSource = await wizardPage.makeSearch('');
            await wizardPage.expectCorrectListing(dataSource);
        });

        await test.step('Import page from cloud', async () => {

            await wizardPage.cloudRecordsTable.clickRow(1);
            await wizardPage.stepper.clickNextButton();
        })

        await test.step('Go back and pick a diffrent page', async () => {
            await wizardPage.stepper.clickPreviousButton();
            await wizardPage.cloudRecordsTable.clickRow(2);
            await wizardPage.stepper.clickNextButton();

            await wizardPage.stepper.clickNextButton();
        })

        await test.step('Verifying page content', async () => {
            await wizardPage.navigateToEditorButton.click();
            await wizardPage.self.page().locator('#live-preview-container mat-spinner').waitFor({ state: 'hidden', timeout: 15000 });
            console.warn('🔨 todo: assert da página (através do h1, e da imagem)')
        });
    })

    test('New page via MILO import (file explorer)', async () => {
        await test.step('First import', async () => {
            await wizardPage.importMILORadio.click();
            await wizardPage.stepper.clickNextButton();
            await wizardPage.pickWithExplorer('demo.milo');
            await expect(await wizardPage.stepper.nextButton()).toBeEnabled();

            await wizardPage.stepper.clickNextButton();
            await wizardPage.applicationAutocomplete.expectValue('School Greenboard');
            await wizardPage.pageTitleInput.expectValue('MILO file');
        });

        await test.step('Go back and re-upload a diffrent file', async () => {
            await wizardPage.stepper.clickPreviousButton();
            await wizardPage.pickWithExplorer('demo2.milo');
            await wizardPage.stepper.expectDisabledTab(3); // playwright was going too fast, this asserting is serving as an waitFor basically.
            await wizardPage.stepper.clickNextButton();
            await wizardPage.applicationAutocomplete.expectValue('PHC GO HelpCenter');
            await wizardPage.pageTitleInput.expectValue('my demo MILO file');
        })

        await test.step('Verifying page content', async () => {
            await wizardPage.stepper.clickNextButton();
            await wizardPage.navigateToEditorButton.click();
            await wizardPage.self.page().locator('#live-preview-container mat-spinner').waitFor({ state: 'hidden', timeout: 15000 });
            console.warn('🔨 todo: assert da página (através do h1, e da imagem)')
        });
    })

    test('❌ New page via MILO import (drag and drop)', async () => {
        test.skip(true, 'my simulateNativeFileDrop() is not working 😢')

        await wizardPage.importMILORadio.click();
        await wizardPage.stepper.clickNextButton();
        await wizardPage.simulateNativeFileDrop(wizardPage.self.page(), 'ngx-file-drop > div', 'PlayWright/fixtures/demo.milo');
        await wizardPage.stepper.clickNextButton();
        await wizardPage.stepper.clickNextButton();
        await wizardPage.navigateToEditorButton.click();
        await wizardPage.self.page().locator('#live-preview-container mat-spinner').waitFor({ state: 'hidden', timeout: 15000 });
    })

    test('Wizard default state', async () => {
        await wizardPage.stepper.expectNumberOfTabs(3);
        await wizardPage.stepper.expectDisabledTab(2);
        await expect(wizardPage.fromScratchRadio).toBeChecked();
        await wizardPage.stepper.expectToBeOnTab(1)
        await expect(wizardPage.mainform.headerTitle).toHaveText(locales.wizardHeader.en)
        await expect(await wizardPage.stepper.nextButton()).toBeEnabled()
    });

    test('Number of wizard steps behaviour', async () => {
        await wizardPage.importMILORadio.click()
        await wizardPage.stepper.expectNumberOfTabs(4);
        await wizardPage.fromScratchRadio.click()
        await wizardPage.stepper.expectNumberOfTabs(3);
        await wizardPage.getFromCloudRadio.click()
        await wizardPage.stepper.expectNumberOfTabs(4);
    })


    test('Wizard business rules', async () => {
        await test.step('Application & Page - default state', async () => {
            await wizardPage.stepper.clickNextButton()
            await wizardPage.stepper.expectToBeOnTab(2)
            await expect(await wizardPage.stepper.nextButton()).toBeDisabled();
            await wizardPage.applicationAutocomplete.expectToBeEmpty()
            await wizardPage.applicationAutocomplete.expectToBeEnabled()
            await wizardPage.pageTitleInput.expectToBeEmpty()
            await wizardPage.pageTitleInput.expectToBeEnabled()
        })

        await test.step('Application & Page - business rules', async () => {
            await wizardPage.applicationAutocomplete.pickOption(2)
            await wizardPage.applicationAutocomplete.expectValue('PHC GO HelpCenter')
            await wizardPage.applicationAutocomplete.expectToBeDisabled();
            await expect(await wizardPage.stepper.nextButton()).toBeDisabled();

            await wizardPage.pageTitleInput.fill('touch my PIPELINE readme')
            await expect(await wizardPage.stepper.nextButton()).toBeEnabled();

            await wizardPage.applicationAutocomplete.actionButton.click()
            await expect(await wizardPage.stepper.nextButton()).toBeDisabled();
            await wizardPage.applicationAutocomplete.expectToBeEnabled();
        })

        await test.step('Result step - business rules', async () => {
            await wizardPage.applicationAutocomplete.pickOption(1)
            await wizardPage.stepper.clickNextButton()

            await wizardPage.stepper.expectToBeOnTab(3)
            await expect(wizardPage.navigateToEditorButton).toBeEnabled()
            await expect(wizardPage.restartWizardButton).toBeEnabled()
            await expect(await wizardPage.stepper.prevButton()).toBeEnabled()
        })
    })

    test('Previous step + Reset wizard button behaviour', async () => {
        await test.step('Previous step', async () => {
            await wizardPage.stepper.clickNextButton()
            await wizardPage.stepper.clickPreviousButton()
            await wizardPage.stepper.expectToBeOnTab(1)

            await wizardPage.stepper.clickNextButton()
            await wizardPage.applicationAutocomplete.openAutocomplete()
            await wizardPage.applicationAutocomplete.pickOption(1)
            await wizardPage.pageTitleInput.fill('touch my PIPELINE readme')
            await wizardPage.stepper.clickNextButton()
            await wizardPage.stepper.clickPreviousButton()
            await wizardPage.stepper.expectToBeOnTab(2)
        })

        await test.step('Reset wizard', async () => {
            await wizardPage.stepper.clickNextButton()
            await wizardPage.restartWizardButton.click()
            await wizardPage.stepper.expectToBeOnTab(1)
            await wizardPage.stepper.clickNextButton()
            await wizardPage.applicationAutocomplete.expectToBeEmpty()
            await wizardPage.pageTitleInput.expectToBeEmpty()
        })
    })

    test('Create new page from scratch', async () => {
        await wizardPage.stepper.clickNextButton()
        await wizardPage.applicationAutocomplete.openAutocomplete()
        await wizardPage.applicationAutocomplete.pickOption(2)
        await wizardPage.pageTitleInput.fill('touch my PIPELINE readme')
        await wizardPage.stepper.clickNextButton()
    })

});