# Playwright Security Testing Framework

This project is an enterprise-grade automated security testing framework built with [Playwright](https://playwright.dev/). It is designed to evaluate web applications (specifically targeting vulnerable applications like OWASP Juice Shop) for severe security vulnerabilities without modifying the actual business logic or relying on cumbersome, duplicated code.

## 🚀 Quick Start / Installation

Follow these steps to set up the vulnerable target (Juice Shop) and execute the Playwright security framework against it.

### Step 1: Set up OWASP Juice Shop
The tests are specifically designed to run against a local instance of OWASP Juice Shop running on port 3000.
```bash
# Clone the Juice Shop repository
git clone https://github.com/juice-shop/juice-shop.git

# Navigate into the directory
cd juice-shop

# Install dependencies
npm install

# Start the application
npm start
```
*Juice Shop should now be running at `http://localhost:3000`.*

### Step 2: Set up the Playwright Framework
Open a **new terminal window** and navigate to this testing framework directory.
```bash
# Navigate to the playwright testing framework
cd playwright-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Step 3: Run the Security Tests
With Juice Shop running in the background, you can now trigger the security scans.
```bash
# Run all security tests across all vectors
npx playwright test

# To run a specific category (e.g. DOM XSS only)
npx playwright test -g "DOM XSS"

# To view the visual HTML report after execution
npx playwright show-report
```

---
## 🏗️ Project Flow & Architecture

The framework is structured using the **Page Object Model (POM)** pattern to maximize scalability, maintainability, and reusability. 

### The Flow
1. **Test Initialization**: You run `npx playwright test`. Playwright reads the `playwright.config.js` to determine settings like `baseURL` and parallelization.
2. **Setup**: The master spec file (`tests/security/master-security.spec.js`) is executed. 
3. **Payload Loading**: The `utils/payload-loader.js` fetches malicious inputs from `fixtures/payloads/*.json`.
4. **Execution**: The framework loops through each vulnerability category (DOM XSS, Stored XSS, Reflected XSS, etc.). For each test:
   - The `pages/xss.page.js` utilizes standard `helpers/navigation.helper.js` and `constants/locators.js` to interact with the UI flawlessly.
   - Malicious payloads are injected into various vectors (headers, search boxes, chatbots, local storage).
   - Dialogs (alerts) triggered by XSS execution are caught gracefully by `utils/dialog-handler.js`.
5. **Validation**: `helpers/xss.helper.js` examines the DOM and page content to see if the application securely sanitized the payload or reflected it insecurely.
6. **Logging**: Instead of raw terminal logs, `utils/logger.js` formats the output elegantly into `[INFO]`, `[SUCCESS]`, `[WARN]`, and `[ERROR]`.

---

## 📁 Directory Structure Breakdown

How each folder interacts and supports the framework:

### 1. `tests/`
**What it does:** Contains the actual execution specs.
**How it helps:** Instead of 20+ scattered files, everything is neatly organized inside `tests/security/master-security.spec.js`. This is the brain of the operation that orchestrates the data (payloads) and actions (POM).

### 2. `pages/`
**What it does:** Contains the Page Object Models (`base.page.js`, `xss.page.js`).
**How it helps:** It abstracts away Playwright's `page.locator()` syntax. If the UI changes, you only update the POM files, completely eliminating the need to update your test logic.

### 3. `helpers/`
**What it does:** Contains functional flow logic (`navigation.helper.js`, `xss.helper.js`).
**How it helps:** Centralizes repeating testing logic, like automatically finding and closing pesky "Welcome Popups" or checking if an XSS payload actually successfully injected itself into the DOM structure.

### 4. `utils/`
**What it does:** Contains independent utility scripts (`logger.js`, `dialog-handler.js`, `payload-loader.js`).
**How it helps:** Gives superpowers to the framework. `dialog-handler.js` automatically prevents unhandled browser alerts from crashing the tests, while `logger.js` ensures your terminal outputs are color-coded and highly readable. 

### 5. `constants/`
**What it does:** Hardcodes strings, routes, and locators (`routes.js`, `locators.js`).
**How it helps:** Extracts "magic strings" from the codebase. If Juice Shop changes its login route from `/#/login` to `/auth`, you only change it in `routes.js`.

### 6. `fixtures/`
**What it does:** Stores external data sets (`payloads/*.json`).
**How it helps:** Divides application code from testing data. Security engineers can simply drop new payload lists into the JSON files without needing to understand the Javascript architecture.

---

## 📊 Security Execution Results

Below is the output log mapped into tables for each of the core security categories executed during the latest test run against the target application.

### 1. DOM XSS Testing

| Attack Vector | Payload Evaluated | Result Status | XSS Alert Executed |
| :--- | :--- | :--- | :---: |
| **Hash Fragment** | `<img src=x onerror=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **Hash Fragment** | `<svg onload=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **Hash Fragment** | `<script>alert(1)</script>` | 🔴 Reflected in DOM | ❌ No |
| **LocalStorage** | `<img src=x onerror=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **LocalStorage** | `<svg onload=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **LocalStorage** | `<script>alert(1)</script>` | 🔴 Reflected in DOM | ❌ No |
| **Search Box** | `<img src=x onerror=alert('dom')>` | 🔴 Reflected in DOM | ✅ Yes |
| **Search Box** | `<svg onload=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **Search Box** | `<script>alert(1)</script>` | 🔴 Reflected in DOM | ❌ No |
| **URL Parameter** | `<img src=x onerror=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **URL Parameter** | `<svg onload=alert('dom')>` | 🔴 Reflected in DOM | ❌ No |
| **URL Parameter** | `<script>alert(1)</script>` | 🔴 Reflected in DOM | ❌ No |

---

### 2. Reflected XSS Testing

| Attack Vector | Payload Evaluated | Result Status | XSS Alert Executed |
| :--- | :--- | :--- | :---: |
| **Error Page** | `<script>alert(1)</script>` | 🔴 Reflected in Error Page | ❌ No |
| **Error Page** | `<img src=x onerror=alert(1)>` | 🔴 Reflected in Error Page | ❌ No |
| **Error Page** | `<svg onload=alert(1)>` | 🔴 Reflected in Error Page | ❌ No |
| **Error Page** | `"><img src=x onerror=alert(1)>` | 🔴 Reflected in Error Page | ❌ No |
| **Search URL** | `<script>alert(1)</script>` | 🔴 Reflected in Search Page | ❌ No |
| **Search URL** | `<img src=x onerror=alert(1)>` | 🔴 Reflected in Search Page | ✅ Yes |
| **Search URL** | `<svg onload=alert(1)>` | 🔴 Reflected in Search Page | ❌ No |
| **Search URL** | `"><img src=x onerror=alert(1)>` | 🔴 Reflected in Search Page | ✅ Yes |
| **HTTP Header** | All 4 Payloads | 🔴 Reflected in DOM | ❌ No |
| **Login Input** | All 4 Payloads | 🔴 Reflected in DOM | ❌ No |
| **Search Box** | `<script>alert(1)</script>` | 🔴 Reflected in DOM | ❌ No |
| **Search Box** | `<img src=x onerror=alert(1)>` | 🔴 Reflected in DOM | ✅ Yes |
| **Search Box** | `<svg onload=alert(1)>` | 🔴 Reflected in DOM | ❌ No |
| **Search Box** | `"><img src=x onerror=alert(1)>` | 🔴 Reflected in DOM | ✅ Yes |

---

### 3. Stored XSS Testing

| Attack Vector | Payload Evaluated | Result Status | XSS Alert Executed |
| :--- | :--- | :--- | :---: |
| **Support Chat** | `<img src=x onerror=alert('stored')>` | 🔴 Reflected in DOM | ❌ No |
| **Support Chat** | `<svg onload=alert('stored')>` | 🔴 Reflected in DOM | ❌ No |
| **Support Chat** | `<script>alert('stored')</script>` | 🔴 Reflected in DOM | ❌ No |
| **Feedback Form**| `<img src=x onerror=alert('stored')>` | 🟡 Handled / Completed | ❌ No |
| **Feedback Form**| `<svg onload=alert('stored')>` | 🟡 Handled / Completed | ❌ No |
| **Feedback Form**| `<script>alert('stored')</script>`| 🟡 Handled / Completed | ❌ No |
| **Product Review**| `<img src=x onerror=alert('stored-review')>`| 🔴 Reflected in DOM | ❌ No |
| **User Profile** | `<img src=x onerror=alert('stored')>` | 🔴 Reflected in DOM | ❌ No |
| **User Profile** | `<svg onload=alert('stored')>` | 🔴 Reflected in DOM | ❌ No |
| **User Profile** | `<script>alert('stored')</script>` | 🔴 Reflected in DOM | ❌ No |

---

### 4. OWASP Top 10 Testing

| OWASP Vulnerability | Vector / Context | Execution Result |
| :--- | :--- | :--- |
| **Authentication Failures** | Brute Force Protection | ✅ Pass (Protection detected successfully) |
| **Broken Access Control** | Administration Endpoint | 🔴 Failed (Access control vulnerability found) |
| **Cryptographic Failures** | LocalStorage Data | 🟡 Token: null, Bid: null |
| **Injection** | Login Payload (`' OR 1=1 --`) | 🔴 Failed (Authentication Bypassed) |
| **Insecure Design** | Weak Credential Access | ✅ Pass (Handled securely) |
| **Integrity Failures** | Subresource Integrity (SRI) | 🔴 Failed (0 Scripts using integrity attribute) |
| **Logging & Monitoring** | Network Response Logs | 🟡 Detected (401 Unauthorized Server Responses) |
| **Security Misconfig.** | Response Headers | 🔴 Failed (Missing CSP & HSTS Headers) |
| **Supply Chain Failures** | Third Party Dependencies | 🟡 Detected (Angular, Material) |
| **SSRF** | Search Parameter Forgery | ✅ Pass (Handled payloads safely) |

### 5. Universal Cookie Security Testing

**Target URL:** `https://www.amazon.in`  
**Total Cookies Scanned:** 33  
**Strict-Transport-Security (HSTS):** NOT FOUND

| Cookie Name | HttpOnly | Secure | SameSite |
| :--- | :---: | :---: | :---: |
| `aws-waf-token` | ❌ | ✅ | Lax |
| `session-id` | ❌ | ✅ | Lax |
| `session-id-time` | ❌ | ✅ | Lax |
| `i18n-prefs` | ❌ | ❌ | Lax |
| `lc-acbin` | ❌ | ❌ | Lax |
| `csm-hit` | ❌ | ❌ | Lax |
| `rxc` | ❌ | ❌ | Lax |
| `ad-id` | ✅ | ✅ | None |
| `ad-privacy` | ✅ | ✅ | None |
| `__bpn_uid` | ❌ | ✅ | None |
| `__ur_dc` | ❌ | ✅ | None |
| `__bpn_puid` | ❌ | ✅ | None |
| `pid` | ❌ | ✅ | None |
| `TestIfCookieP` | ❌ | ✅ | None |
| `CMID` | ❌ | ✅ | None |
| `CMPS` | ❌ | ✅ | None |
| `CMPRO` | ❌ | ✅ | None |
| `tuuid` *(2 instances)* | ✅ | ✅ | None |
| `tuuid_lu` *(2 instances)* | ✅ | ✅ | None |
| `XANDR_PANID` | ❌ | ✅ | None |
| `uuid2` | ✅ | ✅ | None |
| `cnx_userId` | ❌ | ✅ | None |
| `um` | ✅ | ✅ | None |
| `umeh` | ✅ | ✅ | None |
| `c` | ❌ | ✅ | None |
| `anj` | ✅ | ✅ | None |
| `AFFICHE_W` | ❌ | ✅ | None |
| `uids` | ✅ | ✅ | None |
| `cids` | ✅ | ✅ | None |
| `zc` | ❌ | ✅ | None |
| `csync` | ❌ | ✅ | None |

---

> *Tests were successfully passed using Playwright Chromium with 1 worker instance.*
