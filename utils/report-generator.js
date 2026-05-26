const fs =
  require('fs');

const path =
  require('path');

const Logger =
  require('./logger');

class ReportGenerator {

  // =========================================
  // JSON REPORT
  // =========================================

  static generateJSONReport(
    website,
    reportData
  ) {

    const reportsDir =
      path.join(
        __dirname,
        '..',
        'reports',
        'performance'
      );

    if (
      !fs.existsSync(
        reportsDir
      )
    ) {

      fs.mkdirSync(
        reportsDir,
        {
          recursive: true
        }
      );
    }

    const fileName =
      website
        .replace(
          /https?:\/\//,
          ''
        )
        .replace(
          /[^\w]/g,
          '_'
        );

    const filePath =
      path.join(
        reportsDir,
        `${fileName}_report.json`
      );

    fs.writeFileSync(

      filePath,

      JSON.stringify(
        reportData,
        null,
        2
      )
    );

    Logger.success(
      `JSON Report Generated: ${filePath}`
    );
  }



  // =========================================
  // HTML REPORT
  // =========================================

  static generateSimpleHTMLReport(
    website,
    reportData
  ) {

    const reportsDir =
      path.join(
        __dirname,
        '..',
        'reports',
        'performance'
      );

    const fileName =
      website
        .replace(
          /https?:\/\//,
          ''
        )
        .replace(
          /[^\w]/g,
          '_'
        );

    const filePath =
      path.join(
        reportsDir,
        `${fileName}_report.html`
      );

    const html = `

      <html>

      <head>

        <title>
          Performance Report
        </title>

      </head>

      <body>

        <h1>
          Performance Report
        </h1>

        <h2>
          ${website}
        </h2>

        <table
          border="1"
          cellpadding="10"
        >

          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>

          <tr>
            <td>Load Time</td>
            <td>${reportData.loadTime}</td>
          </tr>

          <tr>
            <td>DOM Complete</td>
            <td>${reportData.navigation.domComplete}</td>
          </tr>

          <tr>
            <td>First Paint</td>
            <td>${reportData.paint['first-paint']}</td>
          </tr>

          <tr>
            <td>
              First Contentful Paint
            </td>

            <td>
              ${reportData.paint['first-contentful-paint']}
            </td>
          </tr>

          <tr>
            <td>
              JS Heap Used
            </td>

            <td>
              ${reportData.browser.JSHeapUsedSize}
            </td>
          </tr>

          <tr>
            <td>
              DOM Nodes
            </td>

            <td>
              ${reportData.browser.Nodes}
            </td>
          </tr>

        </table>

      </body>

      </html>
    `;

    fs.writeFileSync(
      filePath,
      html
    );

    Logger.success(
      `HTML Report Generated: ${filePath}`
    );
  }



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
      reportData.loadTime
    );

    Logger.info(
      'DOM Complete:',
      reportData.navigation.domComplete
    );

    Logger.info(
      'First Paint:',
      reportData.paint['first-paint']
    );

    Logger.info(
      'First Contentful Paint:',
      reportData.paint[
        'first-contentful-paint'
      ]
    );

    Logger.info(
      'JS Heap Used:',
      reportData.browser.JSHeapUsedSize
    );

    Logger.info(
      'DOM Nodes:',
      reportData.browser.Nodes
    );

    Logger.info(
      'Total Resources:',
      reportData.resources.length
    );
  }
}

module.exports =
  ReportGenerator;