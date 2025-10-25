import { Page, Locator } from '@playwright/test';

// import { SnackbarComponent } from '../components/SnackbarComponent';
import { AppHeaderComponent } from '../components/AppHeaderComponent';
// import { BreadcumbsComponent } from '../components/BreadcumbsComponent';
import { AppMenuComponent } from '../components/AppMenuComponent';

export class DashboardPage {
    readonly page: Page;
    readonly self: Locator;

    // ---- User picture
    readonly userPic: Locator;

    // ---- Greetings & dashboard actions 
    readonly dashboardActions: Locator;
    readonly greetingsTitle: Locator;
    readonly whatAmIDoingText: Locator;
    readonly goToEditorButton: Locator;
    readonly exportPageButton: Locator;
    readonly createNewPage: Locator;

    // ---- Snapshots 
    readonly snapshotSection: Locator;
    readonly timeSpentOnLeggeraSnapshot: Locator;
    readonly elementsCreatedSnapshot: Locator;
    readonly pagesSavedSnapshot: Locator;

    // ---- Clock & Agenda
    readonly todaySection: Locator;
    readonly clockWidget: Locator;
    readonly weekdayWidget: Locator;
    readonly dateWidget: Locator;
    
    // ---- Imports
    // readonly snackbar: SnackbarComponent;
    readonly header: AppHeaderComponent;
    readonly menu: AppMenuComponent;
    // readonly breadcumbs: BreadcumbsComponent;

    constructor(page: Page) {
        this.page = page;
        this.self = this.page.locator('lg2-dashboard');

        this.userPic = this.self.locator('#user-picture');

        this.dashboardActions = this.self.locator('#dashboard-actions');
        this.greetingsTitle = this.dashboardActions.locator('>h1');
        this.whatAmIDoingText = this.dashboardActions.locator('>p');
        this.goToEditorButton = this.dashboardActions.getByTestId('goToEditorButton');
        this.exportPageButton = this.dashboardActions.getByTestId('exportPageButton');
        this.createNewPage = this.dashboardActions.getByTestId('createNewPage');

        this.snapshotSection = this.self.locator('#snapshots');
        this.timeSpentOnLeggeraSnapshot = this.snapshotSection.getByTestId('DASHBOARD.SNAPSHOT.TICKS');
        this.elementsCreatedSnapshot = this.snapshotSection.getByTestId('DASHBOARD.SNAPSHOT.ELEMENTS');
        this.pagesSavedSnapshot = this.snapshotSection.getByTestId('DASHBOARD.SNAPSHOT.PAGES');

        this.todaySection = this.self.locator('#now');
        this.clockWidget = this.todaySection.locator('#clock');
        this.weekdayWidget = this.todaySection.locator('#weekday');
        this.dateWidget = this.todaySection.locator('#date');

        // this.snackbar = new SnackbarComponent(this.page.locator('lg2-app-snack'));
        this.header = new AppHeaderComponent(this.page.locator('lg2-header'));
        this.menu = new AppMenuComponent(this.page.locator('lg2-menu'));
        // this.breadcumbs = new BreadcumbsComponent(this.page.locator('lg2-breadcumbs'));
    }
}