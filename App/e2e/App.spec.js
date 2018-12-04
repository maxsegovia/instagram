describe('App Tests', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
        await device.launchApp({permissions: {
            notifications: 'YES',
            photos: 'YES',
            camera: 'YES',
            location: 'always'
        }});
    });

    //unit test
    it('should have header', async () => {
        await expect(element(by.id('header'))).toBeVisible();
    });

    //integration test
    it('should have form screen', async () => {
        await waitFor(element(by.id('form'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('loginLabel'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('usernameInput'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('passwordInput'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('loginButton'))).toBeVisible().withTimeout(2000);
    });

    //automatic login
    it('should automatic login', async () => {
        await waitFor(element(by.id('loginLabel'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('usernameInput'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('passwordInput'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('loginButton'))).toBeVisible().withTimeout(2000);
        await element(by.id('usernameInput')).typeText('maxsegoviamtz@gmail.com');
        await element(by.id('passwordInput')).typeText('1234567');
        await element(by.id('loginButton')).tap();
    });

    //automatic navigation
    it('should automatic navigation profile', async () => {
        await waitFor(element(by.id('profileTab'))).toBeVisible().withTimeout(2000);
        await element(by.id('profileTab')).tap();
    });

    //automatic post
    it('should automatic navigation profile', async () => {
        await waitFor(element(by.id('postTab'))).toBeVisible().withTimeout(2000);
        await element(by.id('postTab')).tap();

        await waitFor(element(by.id('galleryButton'))).toBeVisible().withTimeout(2000);
        await element(by.id('galleryButton')).tap();

        await waitFor(element(by.id('imageButton0'))).toBeVisible().withTimeout(2000);
        await element(by.id('imageButton0')).tap();

        await waitFor(element(by.id('postInput'))).toBeVisible().withTimeout(2000);
        await element(by.id('postInput')).typeText('Automatic Post');

        await waitFor(element(by.id('postButton'))).toBeVisible().withTimeout(2000);
        await element(by.id('postButton')).tap();
    });
})
