import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Japer Pizza', image: 'pizza1.png', price: 0.008, description: 'Why so serious?' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = { user: { id: 3, name: 'Changyonh Mingzi', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: 'JWT Pizza',
        stores: [
          { id: 1, name: 'Bludhaven' },
        ],
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Japer Pizza', price: 0.008 },
      ],
      storeId: '1',
      franchiseId: 1,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Japer Pizza', price: 0.008 },
        ],
        storeId: '1',
        franchiseId: 1,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });


  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Order now' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Japer Pizza' }).click();
  await expect(page.locator('form')).toContainText('Why so serious?');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByPlaceholder('Password').press('Enter');
  await expect(page.locator('tbody')).toContainText('Japer Pizza');
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByRole('main')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.locator('h3')).toContainText('invalid');
  await page.getByRole('button', { name: 'Close' }).click();

});

test('debug mock', async ({ page }) => {
  
  /////////////////////////////////////////////////////////////////
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('asdf@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByPlaceholder('Password').press('Enter');
  await expect(page.locator('#navbar-dark')).toContainText('Admin');
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  ////////////////////////////////////////////////////////////////////
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('test@test.com');
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('TestCo');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Admin', exact: true }).click();
  //await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
  await expect(page.getByRole('table')).toContainText('TestCo');
  await page.getByRole('row', { name: 'TestCo Testin Testerson Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await expect(page.getByRole('main')).toContainText('TestCo');
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Register', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Register' }).click();
await page.getByPlaceholder('Full name').fill('Billy Jenkins');
await page.getByPlaceholder('Full name').press('Tab');
await page.getByPlaceholder('Email address').fill('Billy@Jenkins.com');
await page.getByPlaceholder('Email address').press('Tab');
await page.getByPlaceholder('Password').fill('bije');
await page.getByRole('button', { name: 'Register' }).click();
await expect(page.locator('#navbar-dark')).toContainText('Logout');
await page.getByRole('link', { name: 'BJ' }).click();
await expect(page.getByRole('main')).toContainText('Billy Jenkins');
await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
await page.getByRole('link', { name: 'Logout' }).click();
});

test('Franchise Page', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByRole('main')).toContainText('Now is the time to get in on the JWT Pizza tsunami. The pizza sells itself. People cannot get enough. Setup your shop and let the pizza fly. Here are all the reasons why you should buy a franchise with JWT Pizza.');
await expect(page.getByRole('main').locator('img')).toBeVisible();
await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
});

test('Create store', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Login' }).click();
await page.getByPlaceholder('Email address').fill('test@test.com');
await page.getByPlaceholder('Email address').press('Tab');
await page.getByPlaceholder('Password').fill('test');
await page.getByPlaceholder('Password').press('Enter');
await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
await page.getByRole('button', { name: 'Create store' }).click();
await page.getByPlaceholder('store name').click();
await page.getByPlaceholder('store name').fill('Bludhaven');
await page.getByRole('button', { name: 'Create' }).click();
await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
await page.getByRole('button', { name: 'Close' }).click();
await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
await page.getByRole('button', { name: 'Close' }).click();
await page.getByRole('link', { name: 'Logout' }).click();
});

test('History', async ({ page }) => {
  await page.goto('http://localhost:5173/history');
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await page.goto('http://localhost:5173/docs');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');
  await expect(page.getByRole('main')).toContainText('[PUT] /api/auth');
  await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' }).locator('span')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('curl -X POST localhost:3000/api/franchise/1/store -H \'Content-Type: application/json\' -d \'{"franchiseId": 1, "name":"SLC"}\' -H \'Authorization: Bearer tttttt\'');
});