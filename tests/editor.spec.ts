import { test } from '../fixtures/loginFixtures';
import { EditorPage } from '../pages/EditorPage';

test.describe('✏️  Editor page', () => {
    let editorPage: EditorPage;

    test.beforeEach(async ({ editorReady: { page } }) => {
        editorPage = new EditorPage(page);
    })

    test('Monaco manip', async () => {
        await editorPage.waitForMonaco();
        await editorPage.monacoEditor.focus();

        await editorPage.page.keyboard.press('Control+A');
        await editorPage.page.keyboard.press('Delete');
        await editorPage.page.keyboard.type('Cidália és buéda loka');
        await editorPage.page.keyboard.press('Enter');
        await editorPage.page.keyboard.press('Enter');
        await editorPage.page.waitForTimeout(2000);
        await editorPage.page.keyboard.type(`<img src="https://i.pinimg.com/474x/76/07/0e/76070e6cc69658c4b3422daccf69f74c.jpg">`);
        await editorPage.page.waitForTimeout(2000);
    })

})

