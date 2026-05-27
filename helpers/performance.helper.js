const Logger =
  require('../utils/logger');

const MetricsCollector =
  require('../utils/metrics-collector');

const ReportGenerator =
  require('../utils/report-generator');

class PerformanceHelper {

  // =========================================
  // PAGE LOAD MEASUREMENT
  // =========================================

  static async measurePageLoad(
    page,
    url
  ) {

    const startTime =
      Date.now();

    try {

      Logger.testStart(
        `Performance Audit - ${url}`
      );

      Logger.info(
        'Opening URL:',
        url
      );

      await page.goto(url, {

        waitUntil:
          'domcontentloaded',

        timeout: 60000
      });

      await page.waitForLoadState(
        'load'
      );

      const endTime =
        Date.now();

      const loadTime =
        endTime - startTime;

      Logger.performance(
        'Total Page Load Time',
        loadTime
      );

      return loadTime;

    } catch (error) {

      Logger.error(
        `Page Load Failed for ${url}`,
        error.message
      );

      return 0;
    }
  }



  // =========================================
  // BROWSER METRICS
  // =========================================

  static async collectMetrics(
    page
  ) {

    return await MetricsCollector
      .collectBrowserMetrics(
        page
      );
  }



  // =========================================
  // COMPLETE PERFORMANCE AUDIT
  // =========================================

  static async runFullAudit(
    page,
    url
  ) {

    Logger.header(
      `FULL PERFORMANCE AUDIT - ${url}`
    );

    // PAGE LOAD

    const loadTime =
      await this.measurePageLoad(
        page,
        url
      );



    // BROWSER METRICS

    const browserMetrics =
      await MetricsCollector
        .collectBrowserMetrics(
          page
        );



    // NAVIGATION METRICS

    const navigationMetrics =
      await MetricsCollector
        .collectNavigationMetrics(
          page
        );



    // PAINT METRICS

    const paintMetrics =
      await MetricsCollector
        .collectPaintMetrics(
          page
        );



    // RESOURCE METRICS

    const resourceMetrics =
      await MetricsCollector
        .collectResourceMetrics(
          page
        );



    Logger.header(
      'PERFORMANCE METRICS'
    );

    Logger.metric(
      'JS Heap Used',
      `${(browserMetrics.JSHeapUsedSize / (1024 * 1024)).toFixed(2)} MB (${browserMetrics.JSHeapUsedSize} bytes)`
    );

    Logger.metric(
      'DOM Nodes',
      browserMetrics.Nodes
    );

    Logger.metric(
      'Task Duration',
      browserMetrics.TaskDuration
    );

    Logger.performance(
      'DOM Complete',
      `${navigationMetrics.domComplete.toFixed(2)} ms`
    );

    Logger.performance(
      'TTFB (Time to First Byte)',
      `${navigationMetrics.responseStart.toFixed(2)} ms`
    );

    Logger.performance(
      'DOM Interactive',
      `${navigationMetrics.domInteractive.toFixed(2)} ms`
    );

    const dnsTime = navigationMetrics.domainLookupEnd - navigationMetrics.domainLookupStart;
    Logger.performance(
      'DNS Lookup Time',
      `${dnsTime.toFixed(2)} ms`
    );

    const tcpTime = navigationMetrics.connectEnd - navigationMetrics.connectStart;
    Logger.performance(
      'TCP Connection Time',
      `${tcpTime.toFixed(2)} ms`
    );

    const sslTime = navigationMetrics.secureConnectionStart > 0
      ? navigationMetrics.connectEnd - navigationMetrics.secureConnectionStart
      : 0;
    Logger.performance(
      'SSL Handshake Time',
      `${sslTime.toFixed(2)} ms`
    );

    Logger.performance(
      'First Paint',
      `${paintMetrics['first-paint'] !== undefined ? paintMetrics['first-paint'].toFixed(2) : 'N/A'} ms`
    );

    Logger.performance(
      'First Contentful Paint',
      `${paintMetrics['first-contentful-paint'] !== undefined ? paintMetrics['first-contentful-paint'].toFixed(2) : 'N/A'} ms`
    );

    Logger.info(
      'Total Resources:',
      resourceMetrics.length
    );

    Logger.info(
      'Network Transfer Size:',
      `${(navigationMetrics.transferSize / 1024).toFixed(2)} KB`
    );

    Logger.info(
      'Encoded Body Size:',
      `${(navigationMetrics.encodedBodySize / 1024).toFixed(2)} KB`
    );

    Logger.info(
      'Decoded Body Size (Uncompressed):',
      `${(navigationMetrics.decodedBodySize / 1024).toFixed(2)} KB`
    );



    // REPORT DATA

    const reportData = {

      website: url,

      loadTime,

      browser:
        browserMetrics,

      navigation:
        navigationMetrics,

      paint:
        paintMetrics,

      resources:
        resourceMetrics
    };



    // REPORT GENERATION

    ReportGenerator
      .generateSummary(
        reportData
      );



    Logger.testEnd(
      `Performance Audit - ${url}`
    );



    return {

      loadTime,

      browserMetrics,

      navigationMetrics,

      paintMetrics,

      resourceMetrics
    };
  }
}

module.exports =
  PerformanceHelper;