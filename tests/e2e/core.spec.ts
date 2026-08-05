import { test, expect } from '@playwright/test';

test.describe('Core Storefront Flows', () => {
  test('homepage should load and contain key sections', async ({ page }) => {
    await page.goto('/');
    
    // Check Design System / Homepage title
    await expect(page.locator('h1')).toContainText('Fleur & Co.');
    
    // Check navigation links
    await expect(page.getByRole('link', { name: 'Collections' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Occasions' })).toBeVisible();
  });

  test('shop page should display products', async ({ page }) => {
    await page.goto('/shop');
    
    await expect(page.locator('h1')).toContainText('The Collection');
    
    // Check if at least one product card is rendered
    const products = page.locator('text=Rs.');
    await expect(products.first()).toBeVisible();
  });

  test('admin route should redirect to login', async ({ page }) => {
    // Should be intercepted by middleware
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
