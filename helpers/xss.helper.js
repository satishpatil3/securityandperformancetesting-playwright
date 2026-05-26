const Logger = require('../utils/logger');

class XSSHelper {
  static async verifyReflection(page, payload, context = 'DOM') {
    const pageContent = await page.content();
    if (pageContent.includes(payload) || 
        pageContent.includes('onerror') || 
        pageContent.includes('onload') || 
        pageContent.includes('script')) {
      Logger.success(`Payload reflected in ${context}`);
      return true;
    } else {
      Logger.info(`Payload NOT reflected in ${context}`);
      return false;
    }
  }
}

module.exports = XSSHelper;
