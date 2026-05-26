const { test } =
  require('@playwright/test');

const PerformanceHelper =
  require('../../helpers/performance.helper');

const Logger =
  require('../../utils/logger');

const THRESHOLDS =
  require('../../constants/performance-thresholds');

test.describe(
  'Performance Testing Suite',
  () => {

  const websites = [

    'https://www.google.com',

    'https://www.amazon.in',

    'https://www.wikipedia.org'
  ];

  for (const website of websites) {

    test(
      `Performance Audit - ${website}`,
      async ({ page }) => {

      Logger.header(
        `Testing ${website}`
      );

      const results =
        await PerformanceHelper
          .runFullAudit(
            page,
            website
          );

      // Threshold Validation

      if (
        results.loadTime >
        THRESHOLDS.MAX_LOAD_TIME
      ) {

        Logger.warn(
          `Slow Page Load: ${results.loadTime} ms`
        );

      } else {

        Logger.success(
          `Good Page Load Time`
        );
      }

      if (
        results.browserMetrics.Nodes >
        THRESHOLDS.MAX_DOM_NODES
      ) {

        Logger.warn(
          'Too Many DOM Nodes'
        );
      }

      if (
        results.browserMetrics.JSHeapUsedSize >
        THRESHOLDS.MAX_JS_HEAP_SIZE
      ) {

        Logger.warn(
          'High JS Heap Usage'
        );
      }

      Logger.testEnd(
        `Performance Audit - ${website}`
      );
    });
  }
});