/**
 * @fileoverview Base Page Object
 * @version 1.0.0
 * Foundation class for all page objects with common functionality
 */

import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly url: string;

  // Common selectors across all portals
  protected readonly loadingSpinner = '[data-testid="loading-spinner"]';
  protected readonly errorMessage = '[data-testid="error-message"]';
  protected readonly successMessage = '[data-testid="success-message"]';
  protected readonly modal = '[data-testid="modal"]';
  protected readonly modalClose = '[data-testid="modal-close"]';
  protected readonly confirmButton = '[data-testid="confirm-button"]';
  protected readonly cancelButton = '[data-testid="cancel-button"]';

  // Navigation elements
  protected readonly navigation = '[data-testid="navigation"]';
  protected readonly userMenu = '[data-testid="user-menu"]';
  protected readonly logoutButton = '[data-testid="logout-button"]';

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for loading spinner to disappear
    await this.page.waitForLoadState('networkidle');
    
    try {
      await this.page.waitForSelector(this.loadingSpinner, { 
        state: 'hidden', 
        timeout: 10000 
      });
    } catch {
      // Loading spinner might not be present, continue
    }
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Click an element with retry logic
   */
  async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
    const element = await this.waitForElement(selector, options?.timeout);
    await element.click();
  }

  /**
   * Fill input field with validation
   */
  async fillInput(selector: string, value: string, options?: { 
    clear?: boolean;
    validate?: boolean;
  }): Promise<void> {
    const input = await this.waitForElement(selector);
    
    if (options?.clear !== false) {
      await input.clear();
    }
    
    await input.fill(value);
    
    if (options?.validate !== false) {
      await expect(input).toHaveValue(value);
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    const select = await this.waitForElement(selector);
    await select.selectOption(value);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    const fileInput = await this.waitForElement(selector);
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Wait for success message
   */
  async waitForSuccess(message?: string, timeout: number = 10000): Promise<void> {
    const successElement = await this.waitForElement(this.successMessage, timeout);
    
    if (message) {
      await expect(successElement).toContainText(message);
    }
  }

  /**
   * Wait for error message
   */
  async waitForError(message?: string, timeout: number = 10000): Promise<void> {
    const errorElement = await this.waitForElement(this.errorMessage, timeout);
    
    if (message) {
      await expect(errorElement).toContainText(message);
    }
  }

  /**
   * Close modal if present
   */
  async closeModal(): Promise<void> {
    try {
      const modal = this.page.locator(this.modal);
      if (await modal.isVisible()) {
        await this.clickElement(this.modalClose);
        await modal.waitFor({ state: 'hidden' });
      }
    } catch {
      // Modal might not be present, continue
    }
  }

  /**
   * Confirm action in modal
   */
  async confirmAction(): Promise<void> {
    await this.clickElement(this.confirmButton);
    await this.page.locator(this.modal).waitFor({ state: 'hidden' });
  }

  /**
   * Cancel action in modal
   */
  async cancelAction(): Promise<void> {
    await this.clickElement(this.cancelButton);
    await this.page.locator(this.modal).waitFor({ state: 'hidden' });
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.clickElement(this.userMenu);
    await this.clickElement(this.logoutButton);
    
    // Wait for redirect to login page
    await this.page.waitForURL('**/login');
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify page is loaded correctly
   */
  abstract verifyPageLoaded(): Promise<void>;

  /**
   * Check for console errors
   */
  async checkConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    
    return errors;
  }

  /**
   * Check for network failures
   */
  async checkNetworkFailures(): Promise<string[]> {
    const failures: string[] = [];
    
    this.page.on('response', (response) => {
      if (response.status() >= 400 && response.status() < 600) {
        failures.push(`${response.status()} - ${response.url()}`);
      }
    });
    
    return failures;
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string, timeout: number = 30000): Promise<any> {
    const response = await this.page.waitForResponse(
      (response) => response.url().includes(urlPattern) && response.status() === 200,
      { timeout }
    );
    
    return await response.json();
  }

  /**
   * Simulate slow network
   */
  async setSlowNetwork(): Promise<void> {
    await this.page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
  }

  /**
   * Simulate network failure
   */
  async setNetworkFailure(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, (route) => {
      route.abort('failed');
    });
  }

  /**
   * Clear all routes
   */
  async clearRoutes(): Promise<void> {
    await this.page.unroute('**/*');
  }

  /**
   * Wait for element to be stable (not moving/changing)
   */
  async waitForStableElement(selector: string, timeout: number = 5000): Promise<Locator> {
    const element = this.page.locator(selector);
    
    let previousBoundingBox = await element.boundingBox();
    let stableCount = 0;
    const requiredStableChecks = 5;
    const checkInterval = 100;
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Element ${selector} did not stabilize within ${timeout}ms`));
      }, timeout);
      
      const intervalId = setInterval(async () => {
        try {
          const currentBoundingBox = await element.boundingBox();
          
          if (
            previousBoundingBox && 
            currentBoundingBox &&
            JSON.stringify(previousBoundingBox) === JSON.stringify(currentBoundingBox)
          ) {
            stableCount++;
            if (stableCount >= requiredStableChecks) {
              clearTimeout(timeoutId);
              clearInterval(intervalId);
              resolve(element);
            }
          } else {
            stableCount = 0;
          }
          
          previousBoundingBox = currentBoundingBox;
        } catch (error) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          reject(error);
        }
      }, checkInterval);
    });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Get element text content
   */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Verify element count
   */
  async verifyElementCount(selector: string, expectedCount: number): Promise<void> {
    const elements = this.page.locator(selector);
    await expect(elements).toHaveCount(expectedCount);
  }
}