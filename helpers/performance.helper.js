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



    // LOGGING

    Logger.header(
      'PERFORMANCE METRICS'
    );

    Logger.metric(
      'JS Heap Used',
      browserMetrics.JSHeapUsedSize
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
      navigationMetrics.domComplete
    );

    Logger.performance(
      'First Paint',
      paintMetrics['first-paint']
    );

    Logger.performance(
      'First Contentful Paint',
      paintMetrics[
        'first-contentful-paint'
      ]
    );

    Logger.info(
      'Total Resources:',
      resourceMetrics.length
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
      .generateJSONReport(
        url,
        reportData
      );

    ReportGenerator
      .generateSimpleHTMLReport(
        url,
        reportData
      );

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