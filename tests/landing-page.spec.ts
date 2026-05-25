import { test, expect } from '@playwright/test';

test('Should verify that our custom landing page responds and loads branding', async ({ page }) => {
  // Go to the local development server
  await page.goto('http://localhost:3000/');

  // Confirm our custom branding is visible on screen
  const branding = page.getByText('🎁 PermanentGift');
  await expect(branding).toBeVisible();
});