const { BUILD_NUMBER, DEPLOY_URL } = process.env;
import fetch from 'node-fetch';

/** 
 * API call to create test users.
 * @param {number} numberOfUsers Number of test users to create.
 * @returns {Promise<string[]>} Array of usernames returned by the API.
 */
export async function createTestUsers(numberOfUsers: number): Promise<string[]> {
    const endpoint: string = getAPIURL(`/createTestUsers.php?users=${numberOfUsers}&echo=true`);
    const result: TestAPIResponse = await makeAPICall(endpoint);
    return result.data!;
}

/**
 * API call to create mock pages (authored by the provided user).
 * @param {string} user Username of the author of the page.
 * @param {number} pages Number of mock pages to create.
 */
export async function createMockPage(user: string, pages: number = 1) {
    const endpoint: string = getAPIURL(`/createMockPage.php?user=${user}&pages=${pages}`);
    await makeAPICall(endpoint);
}

/** 
 * Expires the cookie of an user.
 * @param {string} user Username of the user whose cookie is to expire.
 */
export async function expireCookie(user: string) {
    const endpoint: string = getAPIURL(`/expireCookie.php?user=${user}`);
    await makeAPICall(endpoint);
}

/** 
 * Expires the trial of an anon user.
 * @param {string} user Username of the anon user whose trial is to expire.
 */
export async function expireTrial(user: string) {
    const endpoint: string = getAPIURL(`/expireTrial.php?user=${user}`);
    await makeAPICall(endpoint);
}

/** 
 * Leggera2 testing API URL factory.
 * @param {string} endpoint Enpoint to call.
 * @returns {string} Complete URL to the enpoint, built according to the detected environment.
 */
function getAPIURL(endpoint: string): string {
    return `${DEPLOY_URL}/${BUILD_NUMBER || '0'}/lg2api/tests${endpoint}`;
}

/** 
 * Leggera2 testing API call.
 * @param {string} endpoint Endpoint to call.
 * @returns {Promise<TestAPIResponse>} API respose.
 */
async function makeAPICall(endpoint: string): Promise<TestAPIResponse> {
    const response = await fetch(endpoint, { method: 'GET' });
    const result: TestAPIResponse = await response.json() as TestAPIResponse;
    if (!result.ok) throw new Error(`Leggera2 testing API Error. Response: ${JSON.stringify(result)}`);
    return result;
}

interface TestAPIResponse {
    ok: boolean,
    data?: string[]
}