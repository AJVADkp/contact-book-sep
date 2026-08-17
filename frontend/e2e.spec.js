import { test, expect } from '@playwright/test';

test.describe('Contact Book E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Clear any previous state
        await page.goto('http://localhost:5174/login');
        await page.evaluate(() => localStorage.clear());
    });

    test('Full End-to-End User Flow', async ({ page }) => {
        const testEmail = `testuser_${Date.now()}@example.com`;
        const testPassword = 'TestPassword123!';

        // 1. Registration Flow
        await page.goto('http://localhost:5174/register');
        await expect(page.locator('h2')).toContainText('Create an account');
        
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button[type="submit"]');

        // Should redirect to contacts page after registration
        await expect(page).toHaveURL('http://localhost:5174/');
        await expect(page.locator('h2.sidebar-title')).toContainText('Contacts');

        // Logout
        await page.click('#logout-btn');
        await expect(page).toHaveURL('http://localhost:5174/login');

        // 2. Login Flow
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button[type="submit"]');
        
        await expect(page).toHaveURL('http://localhost:5174/');

        // 3. Create a Contact
        await page.click('#create-contact-btn');
        await expect(page.locator('.form-title')).toContainText('New Contact');
        
        const contactName = 'John Playwright';
        await page.fill('#contact-name', contactName);
        await page.fill('#contact-email', 'john.p@example.com');
        await page.fill('#contact-phone', '555-0198');
        await page.fill('#contact-company', 'Playwright Inc');
        
        await page.click('#save-contact-btn');

        // Verify toast and contact in list
        await expect(page.locator('.toast')).toContainText('Contact created successfully');
        await expect(page.locator('.contact-name').filter({ hasText: contactName })).toBeVisible();

        // 4. Edit Contact
        await page.click(`.contact-item:has-text("${contactName}")`);
        await page.click('#edit-contact-btn');
        
        const updatedName = 'John Playwright Updated';
        await page.fill('#contact-name', updatedName);
        await page.click('#save-contact-btn');
        
        await expect(page.locator('.toast')).toContainText('Contact updated successfully');
        await expect(page.locator('.detail-name')).toContainText(updatedName);

        // 5. Search Contact
        await page.fill('#search-contacts', 'Updated');
        // Wait for debounce
        await page.waitForTimeout(500); 
        const contactItems = await page.locator('.contact-item').count();
        expect(contactItems).toBe(1);

        // 6. Delete Contact
        await page.click(`.contact-item:has-text("${updatedName}")`);
        
        // Click delete which opens custom modal
        await page.click('#delete-contact-btn');

        // Click confirm in the custom modal
        await page.click('#modal-confirm-btn');

        await expect(page.locator('.toast')).toContainText('Contact deleted successfully');
        
        // Wait for debounce on fetch after delete
        await page.waitForTimeout(500); 
        await expect(page.locator('.contact-name').filter({ hasText: updatedName })).toHaveCount(0);
        
        // Ensure empty state or another record shows, since we just deleted the only one matching the search
        await expect(page.locator('.empty-state-title').first()).toBeVisible();

        // 7. Logout again to finalize
        await page.click('#logout-btn');
        await expect(page).toHaveURL('http://localhost:5174/login');
    });
});
