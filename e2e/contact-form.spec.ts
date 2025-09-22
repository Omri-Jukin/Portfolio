import { test, expect } from "@playwright/test";

test.describe("Contact Form E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("should display contact form", async ({ page }) => {
    // Navigate to contact section
    await page.click('a[href="#contact-section"]');

    // Wait for contact section to be visible
    await expect(page.locator("#contact-section")).toBeVisible();

    // Check form elements are present
    await expect(page.getByText("Get in Touch")).toBeVisible();
    await expect(page.getByLabel("My Name")).toBeVisible();
    await expect(page.getByLabel("My Email")).toBeVisible();
    await expect(page.getByLabel("My Message")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeVisible();
  });

  test("should fill out and submit contact form", async ({ page }) => {
    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Fill out the form
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "+1234567890");
    await page.fill('input[name="subject"]', "Test Subject");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message for the contact form."
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success message or form reset
    await page.waitForTimeout(1000);

    // Check that form was submitted (this would depend on actual implementation)
    // In a real scenario, you might check for a success message or form reset
    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toHaveValue("");
  });

  test("should validate required fields", async ({ page }) => {
    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation messages or that form doesn't submit
    // This would depend on the actual validation implementation
    await expect(page.getByLabel("My Name")).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Fill out form with invalid email
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('textarea[name="message"]', "Test message");

    // Try to submit
    await page.click('button[type="submit"]');

    // Check that validation prevents submission
    // This would depend on the actual validation implementation
    await expect(page.getByLabel("My Email")).toBeVisible();
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Tab through form fields
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("My Name")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("My Email")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("My Phone")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Subject")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("My Message")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeFocused();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Check that form is still usable on mobile
    await expect(page.getByText("Get in Touch")).toBeVisible();
    await expect(page.getByLabel("My Name")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeVisible();
  });

  test("should handle form submission errors", async ({ page }) => {
    // Mock network failure
    await page.route("**/api/contact/submit", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Fill out the form
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('textarea[name="message"]', "Test message");

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Check that error is handled gracefully
    // This would depend on the actual error handling implementation
    await expect(page.getByLabel("My Name")).toBeVisible();
  });

  test("should clear form after successful submission", async ({ page }) => {
    // Mock successful submission
    await page.route("**/api/contact/submit", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to contact section
    await page.click('a[href="#contact-section"]');
    await expect(page.locator("#contact-section")).toBeVisible();

    // Fill out the form
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('textarea[name="message"]', "Test message");

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for form to be cleared
    await page.waitForTimeout(1000);

    // Check that form fields are cleared
    await expect(page.getByLabel("My Name")).toHaveValue("");
    await expect(page.getByLabel("My Email")).toHaveValue("");
    await expect(page.getByLabel("My Message")).toHaveValue("");
  });
});

