import { FullConfig } from '@playwright/test'
import { Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter'
import fs from 'fs'
import path from 'path'
import process from 'process'

interface TestResultData {
  testCaseTitle: string
  status: string
  duration: number
  startTime: string
  error?: string
  website: string // Added website
  category: string
  attachments?: { name: string; contentType: string; path?: string }[]
}

interface CategoryStats {
  total: number
  passed: number
  failed: number
  skipped: number
  interrupted: number
  timedOut: number
}

interface WebsiteStats {
  stats: CategoryStats // Stats for the entire website
  categoryStats: { [key: string]: CategoryStats }
}

interface ReportData {
  stats: CategoryStats // Overall stats - calculated in onEnd
  websiteStats: { [key: string]: WebsiteStats } // Stats per website - calculated in onEnd
  testResults: TestResultData[] // Flat list of final test results - populated in onEnd
  allTestResults: Map<string, TestResultData[]> // Store all results per test case ID
  executionTime: string // Calculated in onEnd
  executionStartDate: Date
  executionEndDate?: Date // Calculated in onEnd
}

class CustomReporter implements Reporter {
  private reportData: ReportData = {
    stats: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
    websiteStats: {},
    testResults: [],
    allTestResults: new Map(), // Initialize the map to store all results including retries
    executionTime: '',
    executionStartDate: new Date(),
    executionEndDate: undefined,
  }
  private startTime = Date.now()

  constructor(private config: FullConfig) {}

  private getDisplayName(name: string): string {
    const nameMap: { [key: string]: string } = {
      realMadrid: 'Real Madrid',
      indianaUniversity: 'Indiana University',
      desktopUI: 'Desktop UI',
      mobileUI: 'Mobile UI',
      apiSpecs: 'API',
      adminUI: 'Admin UI',
      Unknown: 'Unknown Website',
      Other: 'Other Category',
    }
    return nameMap[name] || name // Return mapped name or original if not found
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.reportData.executionStartDate = new Date()
  }

  onTestEnd(testCase: TestCase, result: TestResult): void {
    const filePath = testCase.location.file
    const pathParts = filePath.split(path.sep) // Use path.sep for OS compatibility
    const specsIndex = pathParts.findIndex((part) => part === 'specs')
    let website = 'Unknown'
    let category = 'Other'

    if (specsIndex !== -1 && specsIndex + 2 < pathParts.length) {
      website = pathParts[specsIndex + 1]
      category = pathParts[specsIndex + 2]
    }

    const resultData: TestResultData = {
      testCaseTitle: testCase.title,
      status: result.status,
      duration: result.duration,
      startTime: new Date(result.startTime).toLocaleString(),
      error: result.errors.map((e) => e.message).join('\n') || undefined,
      website,
      category,
      attachments: result.attachments.map((att) => ({
        name: att.name,
        contentType: att.contentType,
        path: att.path,
      })),
    }

    // Store the result for this test case ID. Do not update stats or final results here.
    if (!this.reportData.allTestResults.has(testCase.id)) {
      this.reportData.allTestResults.set(testCase.id, [])
    }
    this.reportData.allTestResults.get(testCase.id)!.push(resultData)
  }

  async onEnd(): Promise<void> {
    this.reportData.executionTime = this.formatTime(Date.now() - this.startTime)
    this.reportData.executionEndDate = new Date()

    // Clear previous stats and final results before recalculating
    this.reportData.stats = { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 };
    this.reportData.websiteStats = {};
    this.reportData.testResults = []; // This will now store ONLY the final result for each test case

    // Process all results to get final results and calculate stats
    this.reportData.allTestResults.forEach((results, testCaseId) => {
      // Find the final result for this test case (the last attempt)
      const finalResult = results[results.length - 1]

      // Determine the final status: 'passed' if any attempt passed, otherwise the status of the last attempt
      const finalStatus = results.some(r => r.status === 'passed') ? 'passed' : finalResult.status;

      // Update stats based on the final status of the test case
      const website = finalResult.website;
      const category = finalResult.category;

      // Initialize website stats if not exists
      if (!this.reportData.websiteStats[website]) {
        this.reportData.websiteStats[website] = {
          stats: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
          categoryStats: {},
        }
      }

      // Initialize category stats for the website if not exists
      if (!this.reportData.websiteStats[website].categoryStats[category]) {
        this.reportData.websiteStats[website].categoryStats[category] = {
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          interrupted: 0,
          timedOut: 0,
        }
      }

      // Update overall stats
      this.reportData.stats.total++;
      if (finalStatus in this.reportData.stats) {
        (this.reportData.stats as any)[finalStatus]++;
      }

      // Update website stats
      const websiteStats = this.reportData.websiteStats[website].stats;
      websiteStats.total++;
      if (finalStatus in websiteStats) {
        (websiteStats as any)[finalStatus]++;
      }

      // Update category stats for the website
      const categoryStats = this.reportData.websiteStats[website].categoryStats[category];
      categoryStats.total++;
      if (finalStatus in categoryStats) {
        (categoryStats as any)[finalStatus]++;
      }

      // Add ONLY the final result for this test case to the testResults array for the table
      this.reportData.testResults.push(finalResult);
    });


    // Sort the final test results by website, then category, then test case title
    this.reportData.testResults.sort((a, b) => {
      if (a.website !== b.website) {
        return a.website.localeCompare(b.website)
      }
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      return a.testCaseTitle.localeCompare(b.testCaseTitle)
    })

    const reportsDir = path.join(process.cwd(), 'reports')
    const attachmentsDir = path.join(reportsDir, 'attachments')
    fs.mkdirSync(reportsDir, { recursive: true })
    fs.mkdirSync(attachmentsDir, { recursive: true })

    // Copy attachments to the reports directory (from all attempts now)
    for (const result of this.reportData.testResults) {
      if (result.attachments) {
        for (const att of result.attachments) {
          if (att.path) {
            const sourcePath = att.path
            const fileName = path.basename(sourcePath)
            const destinationPath = path.join(attachmentsDir, fileName)
            try {
              fs.copyFileSync(sourcePath, destinationPath)
              att.path = path.join('attachments', fileName)
              console.log(
                `Copied attachment from ${sourcePath} to ${destinationPath}, updated path in report data to ${att.path}`,
              )
            } catch (error) {
              console.error(
                `Failed to copy attachment ${sourcePath} to ${destinationPath}: ${error}`,
              )
            }
          }
        }
      }
    }

    const reportFile = path.join(reportsDir, 'custom-report.html')
    fs.writeFileSync(reportFile, this.renderHtml())
    console.log(`Report generated at ${reportFile}`)

    const jsonReportPath = path.join(reportsDir, 'custom-report.json')
    // Save the full data including all attempts to the JSON report
    const jsonReportData = {
        ...this.reportData,
        // Convert Map to a plain object for JSON serialization
        allTestResults: Object.fromEntries(this.reportData.allTestResults),
        // testResults now contains ALL results for the table
    };
    fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReportData, null, 2))
  }

  private formatTime(ms: number): string {
    const s = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((ms / 60000) % 60)
      .toString()
      .padStart(2, '0')
    const h = Math.floor(ms / 3600000)
      .toString()
      .padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  private stripAnsiCodes(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      '',
    )
  }

  private renderHtml(): string {
    const {
      stats,
      websiteStats,
      testResults, // This now contains ALL results for the table
      executionTime,
      executionStartDate,
      executionEndDate,
    } = this.reportData
    const websites = Object.keys(websiteStats)

    // Create a map to track attempt numbers for each test case title
    const attemptMap = new Map<string, number>();

    return `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <title>Test Report</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  <style>
    .chart-box { position: relative; width: 100%; height: 300px; }
    .chart-box canvas { width: 100% !important; height: 100% !important; }
    .category-separator { border-top: 1px solid #dee2e6; }
    .website-separator { border-top: 3px solid #000; margin-top: 30px; padding-top: 20px; } /* Thicker separator for websites */
  </style>
</head><body class="bg-light">
  <div class="container-fluid py-4">
    <h1 class="text-center mb-5">Legend : Automation Test Report</h1>

    <!-- Overall Summary -->
    <div class="row justify-content-center mb-4">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow">
          <div class="card-header bg-dark text-white text-center">
            <h2 class="h5 mb-0">Overall Test Results Summary</h2>
          </div>
          <div class="card-body p-4">
            <table class="table table-striped table-bordered text-center mb-0">
              <tbody>
                <tr><th>Total</th><td>${stats.total}</td></tr>
                <tr><th>Passed</th><td>${stats.passed}</td></tr>
                <tr><th>Failed</th><td>${stats.failed}</td></tr>
                <tr><th>Skipped</th><td>${stats.skipped}</td></tr>
                <tr><th>Interrupted</th><td>${stats.interrupted}</td></tr>
                <tr><th>Timed Out</th><td>${stats.timedOut}</td></tr>
                <tr><th>Date</th><td>${executionStartDate.toLocaleDateString()}</td></tr>
                <tr><th>Start Time</th><td>${executionStartDate.toLocaleTimeString()}</td></tr>
                <tr><th>End Time</th><td>${executionEndDate ? executionEndDate.toLocaleTimeString() : '-'}</td></tr>
                <tr><th>Duration</th><td>${executionTime}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Overall Chart -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header bg-dark text-white text-center">Overall Test Results</div>
          <div class="card-body chart-box p-1">
            <canvas id="overallChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    ${websites
      .map((website, websiteIndex) => {
        const websiteTotal = websiteStats[website].stats.total
        // Only render the website section if there are tests for this website
        if (websiteTotal === 0) {
          return '' // Don't render anything for this website
        }

        const categoriesWithTests = Object.keys(websiteStats[website].categoryStats).filter(
          (category) => websiteStats[website].categoryStats[category].total > 0,
        )

        return `
    <div class="${websiteIndex > 0 ? 'website-separator' : ''}">
      <h2 class="text-center mb-4">${this.getDisplayName(website)}</h2>

      <!-- Website Summary -->
      <div class="row justify-content-center mb-4">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-secondary text-white text-center">
              <h3 class="h6 mb-0">${this.getDisplayName(website)} Summary</h3>
            </div>
            <div class="card-body p-4">
              <table class="table table-striped table-bordered text-center mb-0">
                <tbody>
                  <tr><th>Total</th><td>${websiteStats[website].stats.total}</td></tr>
                  <tr><th>Passed</th><td>${websiteStats[website].stats.passed}</td></tr>
                  <tr><th>Failed</th><td>${websiteStats[website].stats.failed}</td></tr>
                  <tr><th>Skipped</th><td>${websiteStats[website].stats.skipped}</td></tr>
                  <tr><th>Interrupted</th><td>${websiteStats[website].stats.interrupted}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Website Category Charts -->
      <div class="row justify-content-center mb-5">
        <div class="col-12">
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">
            ${Object.keys(websiteStats[website].categoryStats)
              .map((category) => {
                const catStats = websiteStats[website].categoryStats[category]
                return `
                  <div class="col">
                    <div class="card h-100 shadow">
                      <div class="card-header bg-dark text-white text-center">${this.getDisplayName(category)} Results</div>
                      <div class="card-body chart-box p-1">
                        ${catStats.total > 0 ? `<canvas id="chart-${website}-${category}"></canvas>` : `<p class="text-muted">0 tests run</p>`}
                      </div>
                    </div>
                  </div>
                  `
              })
              .join('')}
          </div>
        </div>
      </div>
    </div>
    `
      })
      .join('')}


    <!-- Test Details -->
    <div class="card shadow">
      <div class="card-body">
        <h2 class="h5 text-center mb-3">Test Details</h2>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>Website</th>
                <th>Category</th>
                <th>Test Case</th>
                <th>Attempt</th> <!-- Added Attempt column -->
                <th>Status</th>
                <th>Duration(s)</th>
                <th>Start Time</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let tableRowsHtml = ''
                let previousWebsite = ''
                let previousCategory = ''

                // Iterate through allTestResults to get the last result and attempt count for each test case ID
                const sortedTestCases = Array.from(this.reportData.allTestResults.entries()).sort(([idA, resultsA], [idB, resultsB]) => {
                    const lastResultA = resultsA[resultsA.length - 1];
                    const lastResultB = resultsB[resultsB.length - 1];
                    if (lastResultA.website !== lastResultB.website) {
                        return lastResultA.website.localeCompare(lastResultB.website);
                    }
                    if (lastResultA.category !== lastResultB.category) {
                        return lastResultA.category.localeCompare(lastResultB.category);
                    }
                    return lastResultA.testCaseTitle.localeCompare(lastResultB.testCaseTitle);
                });


                sortedTestCases.forEach(([testCaseId, results]) => {
                  const lastResult = results[results.length - 1];
                  const attempts = results.length;

                  const statusClass =
                    lastResult.status === 'passed'
                      ? 'bg-success'
                      : lastResult.status === 'failed'
                        ? 'bg-danger'
                        : lastResult.status === 'skipped'
                          ? 'bg-warning'
                          : 'bg-secondary'
                  const capitalizedStatus = lastResult.status.charAt(0).toUpperCase() + lastResult.status.slice(1)
                  const durationInSeconds = (lastResult.duration / 1000).toFixed(2)

                  let rowClass = ''
                  if (lastResult.website !== previousWebsite && previousWebsite !== '') {
                    rowClass += ' website-separator'
                  } else if (lastResult.category !== previousCategory && previousCategory !== '') {
                    rowClass += ' category-separator'
                  }

                  previousWebsite = lastResult.website
                  previousCategory = lastResult.category


                  tableRowsHtml += `
                    <tr class="${rowClass}">
                      <td>${this.getDisplayName(lastResult.website)}</td>
                      <td>${this.getDisplayName(lastResult.category)}</td>
                      <td>${lastResult.testCaseTitle}</td>
                      <td>${attempts}</td> <!-- Display number of attempts -->
                      <td><span class="badge ${statusClass}">${capitalizedStatus}</span></td>
                      <td>${durationInSeconds}</td>
                      <td>${lastResult.startTime}</td>
                      <td>
                        ${lastResult.error ? `<pre>${this.stripAnsiCodes(lastResult.error)}</pre>` : '-'}
                        ${
                          lastResult.attachments && lastResult.attachments.length > 0
                            ? `
                            <div>
                              <strong>Attachments:</strong>
                              ${lastResult.attachments
                                .map((att) => {
                                  if (att.path) {
                                    const fileName = path.basename(att.path)
                                    return `<a href="${att.path}" target="_blank">${att.name || fileName}</a>`
                                  }
                                  return ''
                                })
                                .join(' | ')}
                            </div>
                          `
                            : ''
                        }
                      </td>
                    </tr>
                    `
                })
                return tableRowsHtml
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    Chart.register(ChartDataLabels);
    // Overall chart
    new Chart(document.getElementById('overallChart').getContext('2d'), {
      type: 'pie', data: { labels:['Passed','Failed','Skipped','Interrupted','Timed Out'], datasets:[{ data:[${stats.passed},${stats.failed},${stats.skipped},${stats.interrupted},${stats.timedOut}], backgroundColor:['#4CAF50','#F44336','#FF9800','#9E9E9E','#9C27B0'], borderWidth:2 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'top'}, datalabels:{color:'#fff'} }}
    });
    // Website and Category charts
    ${websites
      .map((website) =>
        Object.keys(websiteStats[website].categoryStats)
          .map((category) => {
            const catStats = websiteStats[website].categoryStats[category]
            if (catStats.total > 0) {
              return `
                new Chart(document.getElementById('chart-${website}-${category}').getContext('2d'), {
                  type:'pie',
                  data:{
                    labels:['Passed','Failed','Skipped','Interrupted','Timed Out'],
                    datasets:[{
                      data:[${catStats.passed},${catStats.failed},${catStats.skipped},${catStats.interrupted},${catStats.timedOut}],
                      backgroundColor:['#4CAF50','#F44336','#FF9800','#9E9E9E','#9C27B0'],
                      borderWidth:2
                    }]
                  },
                  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'}, datalabels:{color:'#fff'} }}
                });
                `
            }
            return '' // Don't generate chart script if total is 0
          })
          .join('\n'),
      )
      .join('\n')}
  </script>
</body></html>`
  }
}

export default CustomReporter
