const { test, expect } = require('@playwright/test');

const XSSPage = require('../../pages/xss.page');
const PayloadLoader = require('../../utils/payload-loader');
const Logger = require('../../utils/logger');
const DialogHandler = require('../../utils/dialog-handler');
const XSSHelper = require('../../helpers/xss.helper');
const ROUTES = require('../../constants/routes');

test.describe('Master Security Tests', () => {
  let domPayloads = [];
  let reflectedPayloads = [];
  let storedPayloads = [];
  let owaspPayloads = [];

  test.beforeAll(() => {
    domPayloads = PayloadLoader.load('dom-xss.json');
    reflectedPayloads = PayloadLoader.load('reflected-xss.json');
    storedPayloads = PayloadLoader.load('stored-xss.json');
    owaspPayloads = PayloadLoader.load('owasp.json');
  });

  test.describe('DOM XSS', () => {
    test('Hash Fragment', async ({ page }) => {
      DialogHandler.setup(page, 'HASH FRAGMENT XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      
      for (const payload of domPayloads) {
        const encodedPayload = encodeURIComponent(payload);
        Logger.info(`Testing Hash Fragment with: ${payload}`);
        await page.goto(`${ROUTES.BASE_URL}/#/${encodedPayload}`);
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload);
      }
    });

    test('LocalStorage Injection', async ({ page }) => {
      DialogHandler.setup(page, 'LOCALSTORAGE DOM XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      for (const payload of domPayloads) {
        Logger.info(`Testing LocalStorage with: ${payload}`);
        await page.evaluate((xssPayload) => {
          localStorage.setItem('search', xssPayload);
        }, payload);
        await xssPage.reload();
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload);
      }
    });

    test('Search Box Injection', async ({ page }) => {
      DialogHandler.setup(page, 'SEARCH BOX DOM XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      await xssPage.openSearch();
      for (const payload of domPayloads) {
        Logger.info(`Testing Search Box with: ${payload}`);
        await xssPage.search(payload);
        await xssPage.wait(5000);
        await XSSHelper.verifyReflection(page, payload);
        await xssPage.wait(2000);
      }
    });

    test('URL Parameter', async ({ page }) => {
      DialogHandler.setup(page, 'URL PARAMETER XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      for (const payload of domPayloads) {
        const encodedPayload = encodeURIComponent(payload);
        Logger.info(`Testing URL Parameter with: ${payload}`);
        await page.goto(`${ROUTES.BASE_URL}/?search=${encodedPayload}`);
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload);
      }
    });
  });

  test.describe('Reflected XSS', () => {
    test('Combined Reflected XSS Tests', async ({ page }) => {
      DialogHandler.setup(page, 'COMBINED REFLECTED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      for (const payload of reflectedPayloads) {
        const encodedPayload = encodeURIComponent(payload);
        Logger.info(`Testing Error Page Reflection with: ${payload}`);
        await page.goto(`${ROUTES.BASE_URL}/error?msg=${encodedPayload}`);
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload, 'Error Page');

        Logger.info(`Testing Search URL Reflection with: ${payload}`);
        await page.goto(`${ROUTES.BASE_URL}/#/search?q=${encodedPayload}`);
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload, 'Search Page');
      }
    });

    test('Header Based Reflection', async ({ browser }) => {
      for (const payload of reflectedPayloads) {
        Logger.info(`Testing Header Reflection with: ${payload}`);
        const context = await browser.newContext({
          userAgent: payload,
          extraHTTPHeaders: { referer: payload }
        });
        const attackPage = await context.newPage();
        DialogHandler.setup(attackPage, 'HEADER-BASED XSS');
        
        const xssPage = new XSSPage(attackPage);
        await xssPage.gotoBase();
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(attackPage, payload);
        await context.close();
      }
    });

    test('Reflected Login', async ({ page }) => {
      DialogHandler.setup(page, 'LOGIN XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      for (const payload of reflectedPayloads) {
        Logger.info(`Testing Login Reflection with: ${payload}`);
        await xssPage.goto(ROUTES.LOGIN);
        await xssPage.login(payload, '123');
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload);
      }
    });

    test('Reflected Search', async ({ page }) => {
      DialogHandler.setup(page, 'REFLECTED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();

      await xssPage.openSearch();
      for (const payload of reflectedPayloads) {
        Logger.info(`Testing Reflected Search with: ${payload}`);
        await xssPage.search(payload);
        await xssPage.wait(5000);
        await XSSHelper.verifyReflection(page, payload);
        await xssPage.wait(3000);
      }
    });
  });

  test.describe('Stored XSS', () => {
    test('Support Chat', async ({ page }) => {
      DialogHandler.setup(page, 'CHAT STORED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.CHATBOT);
      await xssPage.wait(5000);
      
      for (const payload of storedPayloads) {
        Logger.info(`Testing Support Chat with: ${payload}`);
        await xssPage.sendChatMessage(payload);
        await xssPage.wait(5000);
        await XSSHelper.verifyReflection(page, payload);
        await xssPage.wait(3000);
      }
    });

    test('Feedback Form', async ({ page }) => {
      DialogHandler.setup(page, 'STORED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.CONTACT);

      for (const payload of storedPayloads) {
        Logger.info(`Testing Feedback Form with: ${payload}`);
        await xssPage.submitFeedback(payload, 5);
        await xssPage.wait(3000);
      }
    });

    test('Product Review', async ({ page }) => {
      DialogHandler.setup(page, 'STORED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.LOGIN);
      await xssPage.login('jim@juice-sh.op', 'ncc-1701');
      await xssPage.wait(3000);

      await page.locator('text=Apple Juice').click();
      await xssPage.wait(2000);

      const payload = `<img src=x onerror=alert('stored-review')>`;
      await xssPage.submitProductReview(payload);
      await xssPage.reload();
      await xssPage.wait(3000);
      await XSSHelper.verifyReflection(page, payload);
    });

    test('User Profile', async ({ page }) => {
      DialogHandler.setup(page, 'PROFILE STORED XSS');
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.LOGIN);
      await xssPage.login('jim@juice-sh.op', 'ncc-1701');
      await xssPage.wait(3000);

      await page.locator('#navbarAccount').click();
      await page.locator('button[aria-label="Go to user profile"]').click();
      await xssPage.wait(3000);

      for (const payload of storedPayloads) {
        Logger.info(`Testing User Profile with: ${payload}`);
        await xssPage.updateProfileUsername(payload);
        await xssPage.reload();
        await xssPage.wait(3000);
        await XSSHelper.verifyReflection(page, payload);
      }
    });
  });

  test.describe('OWASP Top 10', () => {
    test('Authentication Failures', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.LOGIN);

      const invalidAttempts = [
        { email: 'admin@test.com', password: 'wrongpass' },
        { email: 'test@test.com', password: '123456' },
        { email: 'demo@demo.com', password: 'password' }
      ];

      for (const creds of invalidAttempts) {
        await xssPage.login(creds.email, creds.password);
        await xssPage.waitForNetworkIdle();
        if (!page.url().includes('/login')) {
          await xssPage.logout();
        }
      }
      
      const content = await page.content();
      if (content.toLowerCase().includes('too many requests')) {
        Logger.success('Brute-force protection detected');
      }
    });

    test('Broken Access Control', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.ADMINISTRATION);
      
      const content = await page.content();
      if (content.includes('Administration')) {
        Logger.warn('Access control vulnerability found');
      }
    });

    test('Cryptographic Failures', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      
      const localStorageData = await page.evaluate(() => {
        return { token: localStorage.getItem('token'), bid: localStorage.getItem('bid') };
      });
      Logger.info('LocalStorage Data:', localStorageData);
    });

    test('Injection Testing', async ({ browser }) => {
      for (const payload of owaspPayloads) {
        const context = await browser.newContext();
        const page = await context.newPage();
        DialogHandler.setup(page, 'XSS ALERT');
        
        const xssPage = new XSSPage(page);
        await xssPage.gotoBase();
        await xssPage.goto(ROUTES.LOGIN);
        await xssPage.login(payload, payload);
        await xssPage.waitForNetworkIdle();

        if (!page.url().includes('/login')) {
          Logger.warn(`Authentication bypassed using payload: ${payload}`);
        }
        await context.close();
      }
    });

    test('Insecure Design', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto(ROUTES.LOGIN);

      const weakCredentials = [
        { email: 'admin@juice-sh.op', password: 'admin' },
        { email: 'test@test.com', password: '123456' },
        { email: 'demo@demo.com', password: 'password' }
      ];

      for (const creds of weakCredentials) {
        await xssPage.login(creds.email, creds.password);
        await xssPage.waitForNetworkIdle();
        if (!page.url().includes('/login')) {
          Logger.warn('Weak credential login succeeded');
          await xssPage.logout();
        }
      }
    });

    test('Integrity Failures', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      
      const scriptSources = await page.locator('script').evaluateAll(elements => elements.map(script => script.src));
      const integrityScripts = await page.locator('script[integrity]').count();
      Logger.info(`Scripts using integrity attribute: ${integrityScripts}`);
    });

    test('Logging and Monitoring Failures', async ({ page }) => {
      page.on('console', msg => Logger.info('Console Log:', msg.text()));
      page.on('pageerror', err => Logger.error('Page Error:', err.message));
      
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.goto('/#/invalid-page');
      await xssPage.goto(ROUTES.LOGIN);
      
      for (let i = 0; i < 3; i++) {
        await xssPage.login('admin@test.com', 'wrongpassword');
        await xssPage.waitForNetworkIdle();
      }
    });

    test('Security Misconfiguration', async ({ page }) => {
      const response = await page.goto(ROUTES.BASE_URL);
      const headers = response.headers();
      
      if (!headers['x-frame-options']) Logger.warn('Missing X-Frame-Options');
      if (!headers['content-security-policy']) Logger.warn('Missing CSP');
      if (!headers['strict-transport-security']) Logger.warn('Missing HSTS');
    });

    test('Software Supply Chain Failures', async ({ page }) => {
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      
      const libraries = ['angular', 'rxjs', 'zone.js', 'ngx', 'material', 'bootstrap', 'jquery'];
      const content = (await page.content()).toLowerCase();
      
      for (const lib of libraries) {
        if (content.includes(lib)) Logger.info(`${lib} detected`);
      }
    });

    test('SSRF', async ({ page }) => {
      const payloads = ['http://localhost', 'http://127.0.0.1', 'http://example.com', 'file:///etc/passwd'];
      page.on('request', req => Logger.info('Outgoing Request:', req.url()));
      
      const xssPage = new XSSPage(page);
      await xssPage.gotoBase();
      await xssPage.wait(3000);
      
      await xssPage.openSearch();
      for (const payload of payloads) {
        await xssPage.search(payload);
        await xssPage.wait(5000);
        
        const pageContent = await page.content();
        if (pageContent.toLowerCase().includes('error')) {
          Logger.success('Application handled payload safely');
        } else {
          Logger.warn('No visible SSRF behavior detected');
        }
        await xssPage.wait(3000);
      }
    });
  });

  test.describe('Universal Website Cookie Security Testing', () => {
    test('Cookie Security Audit', async ({ page, context, request }) => {
      const TARGET_URL = 'https://www.amazon.in';
      Logger.header('UNIVERSAL COOKIE SECURITY TESTING');
      Logger.info('Testing URL:', TARGET_URL);

      const response = await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);

      const cookies = await context.cookies();
      Logger.info('Total Cookies Found:', cookies.length);

      if (cookies.length > 0) {
        for (const cookie of cookies) {
          let issues = [];
          if (!cookie.httpOnly) issues.push('Missing HttpOnly');
          if (!cookie.secure) issues.push('Missing Secure');
          if (cookie.sameSite === 'None') issues.push('SameSite=None');
          if (issues.length > 0) {
            Logger.warn(`Cookie: ${cookie.name} | Issues: ${issues.join(', ')}`);
          }
        }
      }

      try {
        const apiResponse = await request.get(TARGET_URL);
        const headers = apiResponse.headers();
        Logger.info('Strict-Transport-Security:', headers['strict-transport-security'] || 'NOT FOUND');
      } catch (e) {
        Logger.error('Unable to Fetch Security Headers');
      }
      
      if (response) {
        Logger.info('Status Code:', response.status());
      }
    });
  });
});
