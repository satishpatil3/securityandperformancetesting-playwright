const Logger =
  require('./logger');

class ReportGenerator {

  // =========================================
  // SUMMARY
  // =========================================

  static generateSummary(
    reportData
  ) {

    Logger.header(
      'PERFORMANCE SUMMARY'
    );

    Logger.info(
      'Website:',
      reportData.website
    );

    Logger.info(
      'Load Time:',
      `${reportData.loadTime} ms`
    );

    Logger.info(
      'DOM Complete:',
      `${reportData.navigation.domComplete.toFixed(2)} ms`
    );

    Logger.info(
      'TTFB (Time to First Byte):',
      `${reportData.navigation.responseStart.toFixed(2)} ms`
    );

    Logger.info(
      'DOM Interactive:',
      `${reportData.navigation.domInteractive.toFixed(2)} ms`
    );

    const dnsTime = reportData.navigation.domainLookupEnd - reportData.navigation.domainLookupStart;
    Logger.info(
      'DNS Lookup Time:',
      `${dnsTime.toFixed(2)} ms`
    );

    const tcpTime = reportData.navigation.connectEnd - reportData.navigation.connectStart;
    Logger.info(
      'TCP Connection Time:',
      `${tcpTime.toFixed(2)} ms`
    );

    const sslTime = reportData.navigation.secureConnectionStart > 0
      ? reportData.navigation.connectEnd - reportData.navigation.secureConnectionStart
      : 0;
    Logger.info(
      'SSL Handshake Time:',
      `${sslTime.toFixed(2)} ms`
    );

    Logger.info(
      'First Paint:',
      `${reportData.paint['first-paint'] !== undefined ? reportData.paint['first-paint'].toFixed(2) : 'N/A'} ms`
    );

    Logger.info(
      'First Contentful Paint:',
      `${reportData.paint['first-contentful-paint'] !== undefined ? reportData.paint['first-contentful-paint'].toFixed(2) : 'N/A'} ms`
    );

    Logger.info(
      'JS Heap Used:',
      `${(reportData.browser.JSHeapUsedSize / (1024 * 1024)).toFixed(2)} MB (${reportData.browser.JSHeapUsedSize} bytes)`
    );

    Logger.info(
      'DOM Nodes:',
      reportData.browser.Nodes
    );

    Logger.info(
      'Total Resources:',
      reportData.resources.length
    );

    Logger.info(
      'Network Transfer Size:',
      `${(reportData.navigation.transferSize / 1024).toFixed(2)} KB`
    );

    Logger.info(
      'Encoded Body Size:',
      `${(reportData.navigation.encodedBodySize / 1024).toFixed(2)} KB`
    );

    Logger.info(
      'Decoded Body Size (Uncompressed):',
      `${(reportData.navigation.decodedBodySize / 1024).toFixed(2)} KB`
    );
  }
}

module.exports =
  ReportGenerator;