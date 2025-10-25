import { test } from '../fixtures/loginFixtures';
import { ElementsPage } from '../pages/ElementsPage';
import { MainformListDataSource } from '../types/LeggeraDataSource';

test.describe('📐  Elements page  placeholder, a lot of things to do here 🔨', () => {
    let elementsPage: ElementsPage;
    let dataSource: MainformListDataSource[];

    test.beforeEach(async ({ loggedInUser: { page } }) => {
        elementsPage = new ElementsPage(page);
        const [response] = await Promise.all([
            elementsPage.mainform.APISearchSpy(elementsPage.self, '**/lg2api/elements.php**'),
            elementsPage.navigateToElements()
        ]);

        dataSource = response;
    });

    test('Asserting sort', async ({ browserName }) => {
        test.skip(browserName === 'firefox', '💭 Firefox doesn\'t like sorting, working on it');
        await elementsPage.mainform.table.sortByHeader(3);
        await elementsPage.mainform.expectCorrectListing(dataSource);
    })

    test('Asserting search', async () => {
        const dataSource = await elementsPage.mainform.makeSearch('tri');
        await elementsPage.mainform.expectCorrectListing(dataSource);
    })

    test('Asserting next page', async () => {
        await elementsPage.mainform.paginator.nextButton.click();
        await elementsPage.mainform.expectCorrectListing(dataSource);
    })

    test('Asserting search, next page, and sort', async ({ browserName }) => {
        test.skip(browserName === 'firefox', '💭 Firefox doesn\'t like sorting, working on it');
        const refreshedDataSource = await elementsPage.mainform.makeSearch('icon');
        await elementsPage.mainform.expectCorrectListing(refreshedDataSource);
        await elementsPage.mainform.paginator.nextButton.click();
        await elementsPage.mainform.expectCorrectListing(refreshedDataSource);

        await elementsPage.mainform.table.sortByHeader(3)
        await elementsPage.mainform.expectCorrectListing(refreshedDataSource);
    })
});