import { test, expect } from '../fixtures/testFixtures';
import { createUniqueUser, createUser } from '../utils/testDataFactory';
import users from '../testdata/users.json';

test.describe('Authentication journeys @smoke @regression', () => {
  test('TC01 - Register a new user, verify session, then logout', async ({
    homePage,
    loginPage,
    signupPage,
  }) => {
    const user = createUniqueUser();
    // const user = createUser();
    await homePage.gotoHome();
    await homePage.goToSignupLogin();
    await loginPage.expectLoaded();
    await loginPage.startSignup(user.name, user.email);

    await signupPage.expectAccountInfoForm();
    await signupPage.completeRegistration(user);
    await signupPage.expectAccountCreated();
    await signupPage.continueAfterAccountCreated();

    await homePage.expectLoggedInAs(user.name);
    await homePage.logout();
    await loginPage.expectLoaded();
  });
});
