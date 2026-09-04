/// <reference types="node" />
import { test, expect } from '@playwright/test';
import path from 'path';

const ingredientsHarPath = path.join(__dirname, 'hars/ingredients.har');
const userHarPath = path.join(__dirname, 'hars/user.har');
const orderHarPath = path.join(__dirname, 'hars/order.har');

const mockAccessToken = 'Bearer mock-access-token-12345';
const mockRefreshToken = 'mock-refresh-token-67890';

test.describe('Тестирование страницы конструктора бургера', () => {
 test.beforeEach(async ({ page, context }) => {
  await page.routeFromHAR(ingredientsHarPath, {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR(userHarPath, {
    url: '**/api/auth/user',
    update: false
  });

  await page.routeFromHAR(orderHarPath, {
    url: '**/api/orders',
    update: false
  });

  await context.addInitScript((tokens) => {
    window.localStorage.setItem('accessToken', tokens.accessToken);
    window.localStorage.setItem('refreshToken', tokens.refreshToken);
  }, {
    accessToken: 'mock-access-token-12345',
    refreshToken: 'mock-refresh-token-67890'
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token-12345',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('text=Соберите бургер')).toBeVisible({ timeout: 15000 });
});
  test.describe('Добавление ингредиентов в конструктор', () => {
    test('должен добавить булку в конструктор', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: /Добавить/i });
      await addButtons.first().click();
      
      await expect(page.locator('text=Краторная булка N-200i (верх)')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Краторная булка N-200i (низ)')).toBeVisible({ timeout: 5000 });
    });

    test('должен добавить начинку в конструктор', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: /Добавить/i });
      await addButtons.nth(1).click();
      
      const constructor = page.locator('[class*="burger-constructor"], [class*="constructor"]');
      await expect(constructor.locator('text=Биокотлета из марсианской Магнолии')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Модальное окно ингредиента', () => {
  test('должен открыть модальное окно при клике на ингредиент', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
    await expect(page.locator('text=Детали ингредиента')).toBeVisible({ timeout: 5000 });
  });

  test('должен закрыть модальное окно по клику на крестик', async ({ page }) => {
  await page.locator('text=Краторная булка N-200i').first().click();
  await expect(page.locator('text=Детали ингредиента')).toBeVisible({ timeout: 5000 });

  await page.locator('#modals button').filter({ has: page.locator('svg') }).first().click();
  await expect(page.locator('text=Детали ингредиента')).not.toBeVisible({ timeout: 5000 });
});

test('должен закрыть модальное окно по клику на оверлей', async ({ page }) => {
  await page.locator('text=Краторная булка N-200i').first().click();
  await expect(page.locator('text=Детали ингредиента')).toBeVisible({ timeout: 5000 });
  await page.mouse.click(50, 650);
  await expect(page.locator('text=Детали ингредиента')).not.toBeVisible({ timeout: 5000 });
});

  test('должен отображать данные именно того ингредиента, по которому произошел клик', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
    
    const modal = page.locator('#modals');
    await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('text=420')).toBeVisible({ timeout: 5000 });
  });
});

  test.describe('Создание заказа', () => {
    test('должен создать заказ, показать модалку с номером и очистить конструктор', async ({ page }) => {
      const addButtons = page.getByRole('button', { name: /Добавить/i });
      await addButtons.first().click();
      await addButtons.nth(2).click();

      await expect(page.locator('text=Краторная булка N-200i (верх)')).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(page.locator('text=45212')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('text=Краторная булка N-200i (верх)')).not.toBeVisible({ timeout: 5000 });
      
      await page.keyboard.press('Escape');
      await expect(page.locator('text=45212')).not.toBeVisible({ timeout: 5000 });
    });
  });
});