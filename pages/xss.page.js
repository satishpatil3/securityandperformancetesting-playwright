const BasePage = require('./base.page');
const LOCATORS = require('../constants/locators');
const Logger = require('../utils/logger');

class XSSPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async openSearch() {
    const searchButton = this.page.locator(LOCATORS.SEARCH_BUTTON);
    await searchButton.waitFor({ state: 'visible', timeout: 10000 });
    await searchButton.click();
    
    const searchBox = this.page.locator(LOCATORS.SEARCH_BOX);
    await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  }

  async search(query) {
    const searchBox = this.page.locator(LOCATORS.SEARCH_BOX);
    await searchBox.fill('');
    await searchBox.fill(query);
    await searchBox.press('Enter');
  }

  async login(email, password) {
    await this.page.locator(LOCATORS.EMAIL_INPUT).fill(email);
    await this.page.locator(LOCATORS.PASSWORD_INPUT).fill(password);
    await this.page.locator(LOCATORS.LOGIN_BUTTON).click();
  }

  async logout() {
    await this.page.locator(LOCATORS.NAVBAR_ACCOUNT).click();
    await this.page.locator(LOCATORS.LOGOUT_BUTTON).click();
  }

  async sendChatMessage(message) {
    const chatInput = this.page.locator(LOCATORS.CHAT_TEXTAREA);
    await chatInput.waitFor({ state: 'visible', timeout: 15000 });
    await chatInput.fill('');
    await chatInput.fill(message);
    await chatInput.press('Enter');
  }

  async submitFeedback(comment, rating = 5) {
    await this.page.locator(LOCATORS.COMMENT_TEXTAREA).fill(comment);
    
    const captchaLocator = this.page.locator(LOCATORS.CAPTCHA_TEXT);
    await captchaLocator.waitFor({ state: 'visible', timeout: 10000 });
    
    let captchaText = '';
    let captchaAnswer;
    for (let i = 0; i < 10; i++) {
      captchaText = await captchaLocator.textContent();
      if (captchaText && captchaText.trim() !== '') {
        try {
          captchaAnswer = eval(captchaText);
          if (captchaAnswer !== undefined && !Number.isNaN(captchaAnswer)) break;
        } catch (e) {
          // ignore eval errors and retry
        }
      }
      await this.page.waitForTimeout(500);
    }

    await this.page.locator(LOCATORS.CAPTCHA_INPUT).fill(String(captchaAnswer));
    
    await this.page.locator(LOCATORS.RATING_SLIDER).evaluate(el => {
      el.value = rating;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await this.page.locator(LOCATORS.SUBMIT_BUTTON).click();
  }

  async updateProfileUsername(username) {
    const usernameField = this.page.locator(LOCATORS.USERNAME_INPUT);
    await usernameField.waitFor({ state: 'visible' });
    await usernameField.fill('');
    await usernameField.fill(username);
    await this.page.locator(LOCATORS.SET_USERNAME_BUTTON).click();
  }

  async submitProductReview(review) {
    const reviewTextarea = this.page.locator(LOCATORS.CHAT_TEXTAREA); // uses textarea
    await reviewTextarea.scrollIntoViewIfNeeded();
    await reviewTextarea.fill(review);
    await this.page.locator(LOCATORS.SUBMIT_REVIEW_BUTTON).click();
  }
}

module.exports = XSSPage;
