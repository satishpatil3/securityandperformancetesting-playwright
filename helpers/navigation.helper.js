const Logger = require('../utils/logger');
const LOCATORS = require('../constants/locators');

class NavigationHelper {
  constructor(page) {
    this.page = page;
  }

  async closeWelcomePopup() {
    const dismissButton = this.page.locator(LOCATORS.DISMISS_BUTTON);
    if (await dismissButton.isVisible()) {
      Logger.info('Closing welcome popup...');
      await dismissButton.click();
    }
  }

  async navigateAndClosePopup(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForSelector(LOCATORS.DISMISS_BUTTON, { state: 'visible', timeout: 5000 });
      await this.closeWelcomePopup();
      Logger.success('Startup popup closed');
    } catch (e) {
      Logger.info('No welcome popup detected or already closed.');
    }
  }
}

module.exports = NavigationHelper;
