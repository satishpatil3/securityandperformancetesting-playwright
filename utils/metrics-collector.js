const Logger =
  require('./logger');

class MetricsCollector {

  // =========================================
  // CHROME DEVTOOLS METRICS
  // =========================================

  static async collectBrowserMetrics(
    page
  ) {

    const client =
      await page.context()
        .newCDPSession(page);

    await client.send(
      'Performance.enable'
    );

    const performanceMetrics =
      await client.send(
        'Performance.getMetrics'
      );

    const metrics = {};

    for (
      const metric
      of performanceMetrics.metrics
    ) {

      metrics[
        metric.name
      ] = metric.value;
    }

    return metrics;
  }



  // =========================================
  // NAVIGATION TIMING
  // =========================================

  static async collectNavigationMetrics(
    page
  ) {

    return await page.evaluate(() => {

      const navigation =
        performance.getEntriesByType(
          'navigation'
        )[0];

      return {

        startTime:
          navigation.startTime,

        domComplete:
          navigation.domComplete,

        domInteractive:
          navigation.domInteractive,

        responseStart:
          navigation.responseStart,

        responseEnd:
          navigation.responseEnd,

        loadEventEnd:
          navigation.loadEventEnd,

        redirectCount:
          navigation.redirectCount,

        transferSize:
          navigation.transferSize,

        encodedBodySize:
          navigation.encodedBodySize,

        decodedBodySize:
          navigation.decodedBodySize
      };
    });
  }



  // =========================================
  // PAINT METRICS
  // =========================================

  static async collectPaintMetrics(
    page
  ) {

    return await page.evaluate(() => {

      const paints =
        performance.getEntriesByType(
          'paint'
        );

      const metrics = {};

      paints.forEach(entry => {

        metrics[
          entry.name
        ] = entry.startTime;
      });

      return metrics;
    });
  }



  // =========================================
  // RESOURCE METRICS
  // =========================================

  static async collectResourceMetrics(
    page
  ) {

    return await page.evaluate(() => {

      const resources =
        performance.getEntriesByType(
          'resource'
        );

      return resources.map(resource => ({

        name:
          resource.name,

        duration:
          resource.duration,

        initiatorType:
          resource.initiatorType,

        transferSize:
          resource.transferSize
      }));
    });
  }



  // =========================================
  // AVERAGE CALCULATION
  // =========================================

  static calculateAverage(
    values
  ) {

    if (
      !values.length
    ) {

      return 0;
    }

    const total =
      values.reduce(
        (sum, current) =>
          sum + current,
        0
      );

    return total / values.length;
  }



  // =========================================
  // PRINT METRICS
  // =========================================

  static printMetrics(
    metrics
  ) {

    Logger.header(
      'PERFORMANCE METRICS'
    );

    for (
      const key
      in metrics
    ) {

      Logger.info(
        `${key}:`,
        metrics[key]
      );
    }
  }
}

module.exports =
  MetricsCollector;