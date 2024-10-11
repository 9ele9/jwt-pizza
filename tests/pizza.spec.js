import { test, expect } from 'playwright-test-coverage';

//MOCKED (sorta)
test('static requests', async ({ page }) => {
  await page.route('*/**/api/docs', async (route) => {
    const loginRes = { 
        version: '20240518.154317',
        endpoints: [
          {
            method: 'POST',
            path: '/api/auth',
            description: 'Register a new user',
            example: `curl -X POST localhost:3000/api/auth -d '{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json'`,
            response: { user: { id: 2, name: 'pizza diner', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'tttttt' },
          },
          {
            method: 'PUT',
            path: '/api/auth',
            description: 'Login existing user',
            example: `curl -X PUT localhost:3000/api/auth -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json'`,
            response: { user: { id: 1, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'tttttt' },
          },
          {
            method: 'PUT',
            path: '/api/auth/:userId',
            requiresAuth: true,
            description: 'Update user',
            example: `curl -X PUT localhost:3000/api/auth/1 -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'`,
            response: { id: 1, name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
          },
          {
            method: 'DELETE',
            path: '/api/auth',
            requiresAuth: true,
            description: 'Logout a user',
            example: `curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'`,
            response: { message: 'logout successful' },
          },
          {
            method: 'GET',
            path: '/api/order/menu',
            description: 'Get the pizza menu',
            example: `curl localhost:3000/api/order/menu`,
            response: [{ id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' }],
          },
          {
            method: 'PUT',
            path: '/api/order/menu',
            requiresAuth: true,
            description: 'Add an item to the menu',
            example: `curl -X PUT localhost:3000/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Student", "description": "No topping, no sauce, just carbs", "image":"pizza9.png", "price": 0.0001 }'  -H 'Authorization: Bearer tttttt'`,
            response: [{ id: 1, title: 'Student', description: 'No topping, no sauce, just carbs', image: 'pizza9.png', price: 0.0001 }],
          },
          {
            method: 'GET',
            path: '/api/order',
            requiresAuth: true,
            description: 'Get the orders for the authenticated user',
            example: `curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'`,
            response: { dinerId: 4, orders: [{ id: 1, franchiseId: 1, storeId: 1, date: '2024-06-05T05:14:40.000Z', items: [{ id: 1, menuId: 1, description: 'Veggie', price: 0.05 }] }], page: 1 },
          },
          {
            method: 'POST',
            path: '/api/order',
            requiresAuth: true,
            description: 'Create a order for the authenticated user',
            example: `curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}'  -H 'Authorization: Bearer tttttt'`,
            response: { order: { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Veggie', price: 0.05 }], id: 1 }, jwt: '1111111111' },
          },
          {
            method: 'GET',
            path: '/api/franchise',
            description: 'List all the franchises',
            example: `curl localhost:3000/api/franchise`,
            response: [{ id: 1, name: 'pizzaPocket', stores: [{ id: 1, name: 'SLC' }] }],
          },
          {
            method: 'GET',
            path: '/api/franchise/:userId',
            requiresAuth: true,
            description: `List a user's franchises`,
            example: `curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'`,
            response: [{ id: 2, name: 'pizzaPocket', admins: [{ id: 4, name: 'pizza franchisee', email: 'f@jwt.com' }], stores: [{ id: 4, name: 'SLC', totalRevenue: 0 }] }],
          },
          {
            method: 'POST',
            path: '/api/franchise',
            requiresAuth: true,
            description: 'Create a new franchise',
            example: `curl -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt' -d '{"name": "pizzaPocket", "admins": [{"email": "f@jwt.com"}]}'`,
            response: { name: 'pizzaPocket', admins: [{ email: 'f@jwt.com', id: 4, name: 'pizza franchisee' }], id: 1 },
          },
          {
            method: 'DELETE',
            path: '/api/franchise/:franchiseId',
            requiresAuth: true,
            description: `Delete a franchises`,
            example: `curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'`,
            response: { message: 'franchise deleted' },
          },
          {
            method: 'POST',
            path: '/api/franchise/:franchiseId/store',
            requiresAuth: true,
            description: 'Create a new franchise store',
            example: `curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{"franchiseId": 1, "name":"SLC"}' -H 'Authorization: Bearer tttttt'`,
            response: { id: 1, franchiseId: 1, name: 'SLC' },
          },
          {
            method: 'DELETE',
            path: '/api/franchise/:franchiseId/store/:storeId',
            requiresAuth: true,
            description: `Delete a store`,
            example: `curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'`,
            response: { message: 'store deleted' },
          },
        ]
      }
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loginRes });
  });
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');

  await page.goto('http://localhost:5173/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('Now is the time to get in on the JWT Pizza tsunami. The pizza sells itself. People cannot get enough. Setup your shop and let the pizza fly. Here are all the reasons why you should buy a franchise with JWT Pizza.');
  await expect(page.getByRole('main').locator('img')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
  
  await page.goto('http://localhost:5173/history');
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await page.goto('http://localhost:5173/docs');
  //mock the call to /api/docs so that it returns all of the database endpoints in json form
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');
  await expect(page.getByRole('main')).toContainText('[PUT] /api/auth');
  await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' }).locator('span')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('curl -X POST localhost:3000/api/franchise/1/store -H \'Content-Type: application/json\' -d \'{"franchiseId": 1, "name":"SLC"}\' -H \'Authorization: Bearer tttttt\'');

});

//MOCKED
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

//MOCKED
test('create franchise', async ({ page }) => {
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
          
        ],
        admins: [{ id: 4, name: 'pizza franchisee', email: 'f@jwt.com' }],
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });


  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByPlaceholder('Password').press('Enter');
  await expect(page.locator('#navbar-dark')).toContainText('Admin');
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByPlaceholder('franchise name')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Cancel' }).click();
});

test('Register', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = {
      "name": "Billy Jenkins",
      "email": "Billy@Jenkins.com",
      "password": "bije"
    };
    const loginRes = {
      "user": {
        "name": "Billy Jenkins",
        "email": "Billy@Jenkins.com",
        "roles": [
          {
            "role": "diner"
          }
        ],
        "id": 43
      },
      "token": "abcdef"
    }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "dinerId": 44,
      "orders": [],
      "page": 1
    };
    expect(route.request().method()).toBe('GET');
    //expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });
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
//await page.getByRole('link', { name: 'Logout' }).click();
});

test('Create store', async ({ page }) => {
  await page.route('*/**/api/franchise/*', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "Gooberdal",
        "admins": [
          {
            "id": 2,
            "name": "Testin Testerson",
            "email": "test@test.com"
          }
        ],
        "stores": [
          {
            "id": 42,
            "name": "Testville",
            "totalRevenue": 0
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = {
      "email": "test@test.com",
      "password": "test"
    };
    const loginRes = {
      "user": {
        "id": 2,
        "name": "Testin Testerson",
        "email": "test@test.com",
        "roles": [
          {
            "role": "diner"
          },
          {
            "objectId": 1,
            "role": "franchisee"
          }
        ]
      },
      "token": "abcdef"
      };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('test@test.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('test');
  await page.getByPlaceholder('Password').press('Enter');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('TestCo.');
  await expect(page.getByRole('heading')).toContainText('Create store');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  //await expect(page.getByRole('row', {name:'Year Profit Costs Franchise'})).toContainText('Franchise');

  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Gooberdal');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
});