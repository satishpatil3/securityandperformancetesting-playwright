const Logger = require('./logger');

class DialogHandler {
  static setup(page, vulnerabilityType) {
    page.on('dialog', async dialog => {
      Logger.header(`${vulnerabilityType} FOUND`);
      Logger.error(`Alert Message: ${dialog.message()}`);
      await dialog.dismiss();
    });
  }
}

module.exports = DialogHandler;
