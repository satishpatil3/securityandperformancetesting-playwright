const NavigationHelper = require('../helpers/navigation.helper');
const ROUTES = require('../constants/routes');

class BasePage {
  constructor(page) {
    this.page = page;
    this.nav = new NavigationHelper(page);
  }

  async gotoBase() {
    await this.nav.navigateAndClosePopup(ROUTES.BASE_URL);
  }

  async goto(path) {
    await this.page.goto(`${ROUTES.BASE_URL}${path}`);
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
  
  async getPageContent() {
    return await this.page.content();
  }

  async reload() {
    await this.page.reload();
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;
