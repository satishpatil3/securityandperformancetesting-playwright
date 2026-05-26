class Logger {

  // =========================================
  // EXISTING LOGGER METHODS (UNCHANGED)
  // =========================================

  static info(message, data = '') {

    console.log(
      `[INFO] ${message}`,
      data
    );
  }

  static success(message, data = '') {

    console.log(
      `\x1b[32m[SUCCESS]\x1b[0m ${message}`,
      data
    );
  }

  static error(message, data = '') {

    console.error(
      `\x1b[31m[ERROR]\x1b[0m ${message}`,
      data
    );
  }
  
  static warn(message, data = '') {

    console.warn(
      `\x1b[33m[WARN]\x1b[0m ${message}`,
      data
    );
  }

  static header(title) {

    console.log(
      '\n================================================'
    );

    console.log(
      ` ${title.toUpperCase()} `
    );

    console.log(
      '================================================\n'
    );
  }

  static divider() {

    console.log(
      '----------------------------------------'
    );
  }



  // =========================================
  // NEW PERFORMANCE METHODS
  // =========================================

  static performance(metric, value, unit = 'ms') {

    console.log(
      `\x1b[34m[PERFORMANCE]\x1b[0m ${metric}: ${value} ${unit}`
    );
  }

  static metric(name, value) {

    console.log(
      `\x1b[36m[METRIC]\x1b[0m ${name}:`,
      value
    );
  }

  static timing(label, startTime, endTime) {

    const duration =
      endTime - startTime;

    console.log(
      `\x1b[35m[TIMING]\x1b[0m ${label}: ${duration} ms`
    );

    return duration;
  }

  static resource(resourceName, duration) {

    console.log(
      `\x1b[96m[RESOURCE]\x1b[0m ${resourceName} - ${duration.toFixed(2)} ms`
    );
  }

  static summary(title, data = {}) {

    console.log(
      '\n========================================'
    );

    console.log(
      ` ${title.toUpperCase()} `
    );

    console.log(
      '========================================'
    );

    for (const key in data) {

      console.log(
        `${key}:`,
        data[key]
      );
    }

    console.log(
      '========================================\n'
    );
  }



  // =========================================
  // TEST EXECUTION METHODS
  // =========================================

  static testStart(testName) {

    console.log(
      `\n\x1b[44m[TEST START]\x1b[0m ${testName}\n`
    );
  }

  static testEnd(testName) {

    console.log(
      `\n\x1b[42m[TEST END]\x1b[0m ${testName}\n`
    );
  }



  // =========================================
  // SECURITY TESTING METHODS
  // =========================================

  static vulnerability(type, payload = '') {

    console.log(
      `\x1b[41m[VULNERABILITY]\x1b[0m ${type}`,
      payload
    );
  }

  static attack(payload) {

    console.log(
      `\x1b[91m[ATTACK PAYLOAD]\x1b[0m`,
      payload
    );
  }



  // =========================================
  // DEBUGGING METHODS
  // =========================================

  static debug(message, data = '') {

    console.log(
      `\x1b[35m[DEBUG]\x1b[0m ${message}`,
      data
    );
  }

  static json(title, object) {

    console.log(
      `\x1b[95m[JSON]\x1b[0m ${title}`
    );

    console.log(
      JSON.stringify(
        object,
        null,
        2
      )
    );
  }
}

module.exports = Logger;