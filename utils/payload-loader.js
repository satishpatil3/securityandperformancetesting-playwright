const fs = require('fs');
const path = require('path');

class PayloadLoader {
  static load(fileName) {
    const filePath = path.join(__dirname, '..', 'fixtures', 'payloads', fileName);
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(rawData);
    }
    throw new Error(`Payload file not found: ${filePath}`);
  }
}

module.exports = PayloadLoader;
