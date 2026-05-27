const { test } =require('@playwright/test');
const PerformanceHelper =require('../../helpers/performance.helper');
const Logger =require('../../utils/logger');
const THRESHOLDS =require('../../constants/performance-thresholds');

test.describe('Performance Testing Suite',() => {

  test(
    'Performance Audit',
    async ({ page, baseURL }) => {

    const targetUrl = baseURL || 'http://localhost:3000';

    Logger.header(
      `Testing ${targetUrl}`
    );

    const results =
      await PerformanceHelper
        .runFullAudit(
          page,
          targetUrl
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
      `Performance Audit - ${targetUrl}`
    );
  });
});