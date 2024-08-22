import { test, expect } from "@playwright/test";
import { default as request } from 'axios'

request.interceptors.response.use(undefined, (error) => {
    // convert http error to a nice object we can easily get key info from, and output in logs / test report
    return Promise.reject({
        baseURL: error?.config?.baseURL,
        method: error?.config?.method,
        endpoint: error?.config?.url,
        request: error?.config?.data,
        errorCode: `${error?.response?.status} ${error?.response?.statusText}`,
        errorMessage: error?.response?.data?.error?.message
            ?? error?.response?.data?.errors
            ?? error?.response?.data
            ?? error?.message
    });
});

test('issue happens when request is inside expect.poll', async () => {
    await expect.poll(async () => {
        return request.get('https://www.fwoeifhwefwf.com/efhjio2wfhejilfuhwf');
    }).toMatchObject({ something: 'idk' });
});

test('issue does not happen when request is outside expect.poll', async () => {
    const res = await request.get('https://www.fwoeifhwefwf.com/efhjio2wfhejilfuhwf');
    await expect.poll(async () => {
        return res;
    }).toMatchObject({ something: 'idk' });
});
