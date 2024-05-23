import { test, expect, APIResponse, chromium } from '@playwright/test';
import user from './fixtures/user.json';

test.beforeEach(async ({ page, context }) => {
  const userObject: string = JSON.stringify(JSON.parse(JSON.stringify(user)));

  await page.goto('http://localhost:3000/');

  await page.evaluate(() => window.localStorage);

  await page.evaluate(() => window.localStorage.clear);

  await page.evaluate(
    (userValue: string) => window.localStorage.setItem('auth', userValue),
    userObject,
  );

  await page.evaluate(() =>
    window.localStorage.setItem(
      '@backstage/core:SignInPage:provider',
      'google-auth-provider',
    ),
  );
});
test('User should be able to login and deploy an express application to cluster on google cloud', async ({
  page,
  context,
}) => {
  const browser = await chromium.launch({ headless: false });

  await page.route('**/api/auth/**', async route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(JSON.parse(JSON.stringify(user))),
    });
  });

  await page.goto('http://localhost:3000/catalog');

  await page.pause();

  await page.route('**/api/scaffolder/**', async route => {
    route.fulfill({
      status: 200,
    });
  });

  // await new Promise(() => {});
});
