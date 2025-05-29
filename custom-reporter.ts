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
  stats: CategoryStats // Overall stats
  websiteStats: { [key: string]: WebsiteStats } // Stats per website
  testResults: TestResultData[] // Flat list of all test results
  executionTime: string
  executionStartDate: Date
  executionEndDate?: Date
}

class CustomReporter implements Reporter {
  private reportData: ReportData = {
    stats: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
    websiteStats: {}, // Initialize as empty object
    testResults: [],
    executionTime: '',
    executionStartDate: new Date(),
    executionEndDate: undefined,
  }
  private startTime = Date.now()

  constructor(private config: FullConfig) { }

  private getDisplayName(name: string): string {
    const nameMap: { [key: string]: string } = {
      'realMadrid': 'Real Madrid',
      'indianaUniversity': 'Indiana University',
      'desktopUI': 'Desktop UI',
      'mobileUI': 'Mobile UI',
      'apiSpecs': 'API',
      'adminUI': 'Admin UI',
      'Unknown': 'Unknown Website',
      'Other': 'Other Category',
    };
    return nameMap[name] || name; // Return mapped name or original if not found
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.reportData.executionStartDate = new Date()
  }

  onTestEnd(testCase: TestCase, result: TestResult): void {
    const filePath = testCase.location.file
    const pathParts = filePath.split(path.sep) // Use path.sep for OS compatibility
    const specsIndex = pathParts.findIndex(part => part === 'specs')
    let website = 'Unknown'
    let category = 'Other'

    if (specsIndex !== -1 && specsIndex + 2 < pathParts.length) {
      website = pathParts[specsIndex + 1]
      category = pathParts[specsIndex + 2]
    }

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
    this.reportData.stats.total++
    if (result.status in this.reportData.stats) {
      ; (this.reportData.stats as any)[result.status]++
    }

    // Update website stats
    const websiteStats = this.reportData.websiteStats[website].stats
    websiteStats.total++
    if (result.status in websiteStats) {
      ; (websiteStats as any)[result.status]++
    }

    // Update category stats for the website
    const categoryStats = this.reportData.websiteStats[website].categoryStats[category]
    categoryStats.total++
    if (result.status in categoryStats) {
      ; (categoryStats as any)[result.status]++
    }

    this.reportData.testResults.push({
      testCaseTitle: testCase.title,
      status: result.status,
      duration: result.duration,
      startTime: new Date(result.startTime).toLocaleString(),
      error: result.errors.map((e) => e.message).join('\n') || undefined,
      website, // Store website
      category, // Store category
      attachments: result.attachments.map((att) => ({
        name: att.name,
        contentType: att.contentType,
        path: att.path,
      })),
    })
  }

  async onEnd(): Promise<void> {
    this.reportData.executionTime = this.formatTime(Date.now() - this.startTime)
    this.reportData.executionEndDate = new Date()

    // Sort test results by website, then category, then test case title
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

    // Copy attachments to the reports directory
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

    const jsonReportPath = path.join(reportsDir, 'custom-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(this.reportData, null, 2));
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
      testResults,
      executionTime,
      executionStartDate,
      executionEndDate,
    } = this.reportData
    const websites = Object.keys(websiteStats)

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
      .map(
        (website, websiteIndex) => {
          const websiteTotal = websiteStats[website].stats.total;
          // Only render the website section if there are tests for this website
          if (websiteTotal === 0) {
            return ''; // Don't render anything for this website
          }

          const categoriesWithTests = Object.keys(websiteStats[website].categoryStats)
            .filter(category => websiteStats[website].categoryStats[category].total > 0);

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
                const catStats = websiteStats[website].categoryStats[category];
                return `
                  <div class="col">
                    <div class="card h-100 shadow">
                      <div class="card-header bg-dark text-white text-center">${this.getDisplayName(category)} Results</div>
                      <div class="card-body chart-box p-1">
                        ${catStats.total > 0 ? `<canvas id="chart-${website}-${category}"></canvas>` : `<p class="text-muted">0 tests run</p>`}
                      </div>
                    </div>
                  </div>
                  `;
              })
              .join('')}
          </div>
        </div>
      </div>
    </div>
    `;
        }
      )
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

                testResults.forEach((r, index) => {
                  const statusClass =
                    r.status === 'passed'
                      ? 'bg-success'
                      : r.status === 'failed'
                        ? 'bg-danger'
                        : r.status === 'skipped'
                          ? 'bg-warning'
                          : 'bg-secondary'
                  const capitalizedStatus = r.status.charAt(0).toUpperCase() + r.status.slice(1)
                  const durationInSeconds = (r.duration / 1000).toFixed(2)

                  let rowClass = ''
                  if (r.website !== previousWebsite && previousWebsite !== '') {
                    rowClass += ' website-separator'
                  } else if (r.category !== previousCategory && previousCategory !== '') {
                     rowClass += ' category-separator'
                  }
                  previousWebsite = r.website
                  previousCategory = r.category


                  tableRowsHtml += `
                    <tr class="${rowClass}">
                      <td>${this.getDisplayName(r.website)}</td>
                      <td>${this.getDisplayName(r.category)}</td>
                      <td>${r.testCaseTitle}</td>
                      <td><span class="badge ${statusClass}">${capitalizedStatus}</span></td>
                      <td>${durationInSeconds}</td>
                      <td>${r.startTime}</td>
                      <td>
                        ${r.error ? `<pre>${this.stripAnsiCodes(r.error)}</pre>` : '-'}
                        ${r.attachments && r.attachments.length > 0
                          ? `
                            <div>
                              <strong>Attachments:</strong>
                              ${r.attachments
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
      .map(
        (website) =>
          Object.keys(websiteStats[website].categoryStats)
            .map((category) => {
              const catStats = websiteStats[website].categoryStats[category];
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
                `;
              }
              return ''; // Don't generate chart script if total is 0
            })
            .join('\n')
      )
      .join('\n')}
  </script>
</body></html>`
  }
}

export default CustomReporter
