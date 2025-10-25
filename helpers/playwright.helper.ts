import { Locator, Page, TestInfo, expect } from '@playwright/test';
import { MainformListDataSource } from '../types/LeggeraDataSource';


// --------------------------------------------------------------------
//                           🆘 helpers
// --------------------------------------------------------------------

/**
 * Check the clipboard content.
 * @param {Page} page Playwright's page object.
 * @return {Promise<string>} Clipboard content.
 */
export async function getClipboardContent(page: Page): Promise<string> {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    return await page.evaluate(async () => await navigator.clipboard.readText());
}

/**
 * Asserts if an element has a certain class (not exclsuively).\
 * \
 * Usage: expectToHaveThisClass(element, "horse") will return true for an element with a classList like "correct horse battery".
 * @param {Locator} locator Element's locator.
 * @param {string} className Class to assert against.
 */
export async function expectToHaveThisClass(locator: Locator, className: string) {
    await expect(locator).toHaveClass(new RegExp(`\\b${className}\\b`));
}

/** 
 * Asserts if an element\'s classList doesn't include a certain class.\
 * \
 * Usage: Given the element follow element el: "\<element class="battery correct horse">
 * 
 * el.not.ToHaveClass("horse") would return true, because "battery correct horse" !== "horse".
 * 
 * expectNotToHaveThisClass(el, "horse") however would return false, because ["battery", "correct", "horse"] includes "horse".
 * @param {Locator} locator Element's locator.
 * @param {string} className Class to assert against.
 */
export async function expectNotToHaveThisClass(locator: Locator, className: string) {
    await expect(locator).not.toHaveClass(new RegExp(`\\b${className}\\b`));
}

/**
 * Asserts an element's fill color.
 */
export async function expectFillColor(locator: Locator, color: string) {
    await expect(locator).toHaveCSS('fill', color);
}

/**
 * Asserts an element's background color.
 */
export async function expectBGColor(locator: Locator, color: string) {
    await expect(locator).toHaveCSS('background-color', color);
}

/**
 * Asserts if an element contains certain text (not exclsuively).\
 * \
 * Usage: expectToContainText("horse") will return true for a element whose text look like "correct horse battery".
 * @param {Locator} locator Element's locator.
 * @param {string} text Text to assert against.
 */
export async function expectToContainText(locator: Locator, text: string | RegExp) {
    await expect(locator).toHaveText(new RegExp(text));
}

/**
 * Asserts if an img element was loaded correctly.
 */
export async function expectImage(locator: Locator) {
    const evaluation = await locator.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(evaluation).toBeTruthy();
}

/**
 * Asserts if an element has background image and, and that it was loaded correctly.
 */
export async function expectBackgroundImage(locator: Locator) {
    const evaluation: boolean = await locator.evaluate(async el => {
        const styles = window.getComputedStyle(el);
        const match = styles.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/); // url("https://example.com/bg.jpg") || url('image.png')
        if (!match) return false;

        const url = match[1];
        try {
            const response = await fetch(url, { method: 'HEAD' }); // checking if image exists
            return response.ok;
        } catch {
            return false;
        }
    });

    expect(evaluation).toBeTruthy();
}

/**
 * Asserts if a (material) checkbox is indeterminate.
 */
export async function expectToBeIndeterminated(locator: Locator) {
    await expect(locator).not.toBeChecked();
    await expect(locator).toHaveJSProperty('indeterminate', true);
}

/**
 * Asserts if a (material) checkbox is not indeterminate.
 */
export async function expectNotToBeIndeterminated(locator: Locator) {
    await expect(locator).toHaveJSProperty('indeterminate', false);
}

/**
* Sorts an array of objects by a given property.
* @param arr The array of objects to sort.
* @param prop The property key to sort by.
* @param asc Whether to sort ascending (default) or descending.
* @returns A new sorted array.
*/
export function sortByProperty<T, K extends keyof T>(
    arr: T[],
    prop: K,
    asc: boolean = true
): T[] {

    return [...arr].sort((a, b) => {
        const valA = a[prop];
        const valB = b[prop];

        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
    });
}


/**
 * Reads the value all local storage items.
 * @param {Page} page Playwright\'s page object.
 * @return {Promise<string | null>} value stored (null if key not found).
 */
export async function getAllLocalStorage(page: Page): Promise<Record<string, string | null>> {
    return await page.evaluate(() => {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                // Read the value for the key and store it
                data[key] = localStorage.getItem(key);
            }
        }
        return data; // This object is returned to the Node.js context
    });
}

// --------------------------------------------------------------------
//                   🔨 not yet in use / to be tested
// --------------------------------------------------------------------


/** 🔨 Placeholder / Scaffolding - needs testing 
 * Takes a screen capture and adds it to the testInfo object.
 * @param {Page} page Playwright\'s page object.
 * @param {TestInfo} testInfo Playwright\'s testInfo object.
 * @param {string} description Screenshot description.
 */
export async function takeCapture(
    page: Page,
    testInfo: TestInfo,
    description: string = 'Screenshot' + (new Date().getTime())) {
    console.log('🔨 method not tested - takeCapture()')

    const screenshotBuffer = await page.screenshot({ fullPage: false });
    await testInfo.attach(description, {
        body: screenshotBuffer,
        contentType: 'image/png',
    });
}

/** 🔨 Placeholder / Scaffolding - needs testing 
 * Reads the value of a local storage item.
 * @param {Page} page Playwright\'s page object.
 * @param {string} storageKey Local storage key whose item is to be read.
 * @return {Promise<string | null>} value stored (null if key not found).
 */
export async function getLocalStorageValue(page: Page, storageKey: string): Promise<string | null> {
    return await page.evaluate((key) => { return localStorage.getItem(key) }, storageKey);
}


/** 🔨 Placeholder / Scaffolding - needs testing 
 * Reads the value of a local storage item.
 * @param {Page} page Playwright\'s page object.
 * @param {string} storageKey Local storage key whose item is to be written.
 * @param {string} value Data to be save in storage.
 */
export async function setLocalStorageValue(page: Page, storageKey: string, value: string) {
    console.log('🔨 method not tested - setLocalStorageValue()')
    await page.evaluate(() => { localStorage.setItem(storageKey, value); });
}

/** 🔨 Placeholder / Scaffolding - needs testing 
* Filters an array of according to the provided needle.
* @param {MainformListDataSource[]} dataSource Array to be filtered.
* @param {(keyof MainformListDataSource)[]} keys Property keys used in the filtering.
* @param {string} needle String to be used in the filtering.
* @returns {MainformListDataSource[]} A new filtered array.
*/
export function filterData(
    dataSource: MainformListDataSource[],
    keys: (keyof MainformListDataSource)[],
    needle: string
): MainformListDataSource[] {
    console.log('🔨 method not tested - filterData()')
    return dataSource.filter(entry => {
        for (const filter of keys) {
            if (filter in entry && entry[filter].includes(needle)) return true;
        };
        return false
    })
}