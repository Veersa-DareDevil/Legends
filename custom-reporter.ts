import { FullConfig } from '@playwright/test';
import { Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import process from 'process';

interface TestResultData {
  testCaseTitle: string;
  status: string;
  duration: number;
  startTime: string;
  error?: string;
  projectName: string;
  category: string;
  attachments?: { name: string; contentType: string; path?: string }[]; // Added attachments
}

interface CategoryStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  interrupted: number;
  timedOut: number;
}

interface ReportData {
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    interrupted: number;
    timedOut: number;
  };
  categoryStats: { [key: string]: CategoryStats };
  testResults: TestResultData[];
  executionTime: string;
  executionStartDate: Date; // Changed to Date object
  executionEndDate?: Date; // Changed to Date object
}

class CustomReporter implements Reporter {
  private reportData: ReportData = {
    stats: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
    categoryStats: {
      Desktop: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
      Mobile: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
      API: { total: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, timedOut: 0 },
    },
    testResults: [],
    executionTime: '',
    executionStartDate: new Date(), // Initialize with Date object
    executionEndDate: undefined, // Initialize as undefined
  };
  private startTime = Date.now();

  constructor(private config: FullConfig) {}

  onBegin(config: FullConfig, suite: Suite): void {
    this.reportData.executionStartDate = new Date(); // Store Date object
  }

  onTestEnd(testCase: TestCase, result: TestResult): void {
    const project = testCase.parent.project()?.name || 'Unknown';
    let category = ['Desktop', 'Mobile', 'API'].find((c) => project.startsWith(c)) || 'Other';
    if (!this.reportData.categoryStats[category]) {
      this.reportData.categoryStats[category] = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        interrupted: 0,
        timedOut: 0,
      };
    }
    const catStats = this.reportData.categoryStats[category];
    this.reportData.stats.total++;
    catStats.total++;
    if (result.status in this.reportData.stats) {
      (this.reportData.stats as any)[result.status]++;
      (catStats as any)[result.status]++;
    }

    this.reportData.testResults.push({
      testCaseTitle: testCase.title,
      status: result.status,
      duration: result.duration,
      startTime: new Date(result.startTime).toLocaleString(), // Keep string for table details
      error: result.errors.map((e) => e.message).join('\n') || undefined,
      projectName: project,
      category,
      attachments: result.attachments.map((att) => ({
        name: att.name,
        contentType: att.contentType,
        path: att.path, // Include the path to the attachment
      })),
    });
  }

  async onEnd(): Promise<void> {
    this.reportData.executionTime = this.formatTime(Date.now() - this.startTime);
    this.reportData.executionEndDate = new Date(); // Store Date object
    this.reportData.testResults.sort((a, b) =>
      a.testCaseTitle === b.testCaseTitle
        ? a.projectName.localeCompare(b.projectName)
        : a.testCaseTitle.localeCompare(b.testCaseTitle),
    );
    const reportsDir = path.join(process.cwd(), 'reports');
    const attachmentsDir = path.join(reportsDir, 'attachments');
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.mkdirSync(attachmentsDir, { recursive: true });

    // Copy attachments to the reports directory
    for (const result of this.reportData.testResults) {
      if (result.attachments) {
        for (const att of result.attachments) {
          if (att.path) {
            const sourcePath = att.path;
            const fileName = path.basename(sourcePath);
            const destinationPath = path.join(attachmentsDir, fileName);
            try {
              fs.copyFileSync(sourcePath, destinationPath);
              // Update the attachment path in the report data to the new location
              att.path = path.join('attachments', fileName);
              console.log(
                `Copied attachment from ${sourcePath} to ${destinationPath}, updated path in report data to ${att.path}`,
              );
            } catch (error) {
              console.error(`Failed to copy attachment ${sourcePath} to ${destinationPath}: ${error}`);
            }
          }
        }
      }
    }

    const reportFile = path.join(reportsDir, 'custom-report.html');
    fs.writeFileSync(reportFile, this.renderHtml());
    console.log(`Report generated at ${reportFile}`);
  }

  private formatTime(ms: number): string {
    const s = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((ms / 60000) % 60)
      .toString()
      .padStart(2, '0');
    const h = Math.floor(ms / 3600000)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private stripAnsiCodes(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  }

  private renderHtml(): string {
    const { stats, categoryStats, testResults, executionTime, executionStartDate, executionEndDate } = this.reportData; // Updated variable names
    const cats = Object.keys(categoryStats);
    const catData = cats.map((c) => categoryStats[c]);

    return `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <title>Legend: RealMadrid Test Report</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  <style>
    .chart-box { position: relative; width: 100%; height: 300px; } /* Adjusted height */
    .chart-box canvas { width: 100% !important; height: 100% !important; } /* Keep important for now */
    .category-separator { border-top: 1px solid #dee2e6; } /* Custom thinner border */
  </style>
</head><body class="bg-light">
  <div class="container-fluid py-4"> <!-- Changed to container-fluid -->
    <h1 class="text-center mb-5">Legend: RealMadrid Test Report</h1>

    <!-- Summary -->
    <div class="row justify-content-center mb-4"> <!-- Adjusted margin-bottom -->
      <div class="col-12 col-md-10 col-lg-8"> <!-- Adjusted column classes for wider summary -->
        <div class="card shadow"> <!-- Added shadow class, removed p-4 for card-body padding -->
          <div class="card-header bg-dark text-white text-center"> <!-- Styled card header -->
            <h2 class="h5 mb-0">Summary</h2> <!-- Removed mb-3 -->
          </div>
          <div class="card-body p-4"> <!-- Added padding to card body -->
            <table class="table table-striped table-bordered text-center mb-0"> <!-- Added table-striped -->
              <tbody>
                <tr><th>Total</th><td>${stats.total}</td></tr>
                <tr><th>Passed</th><td>${stats.passed}</td></tr>
                <tr><th>Failed</th><td>${stats.failed}</td></tr>
                <tr><th>Skipped</th><td>${stats.skipped}</td></tr>
                <tr><th>Interrupted</th><td>${stats.interrupted}</td></tr>
                <tr><th>Timed Out</th><td>${stats.timedOut}</td></tr>
                <tr><th>Date</th><td>${executionStartDate.toLocaleDateString()}</td></tr> <!-- Display only date -->
                <tr><th>Start Time</th><td>${executionStartDate.toLocaleTimeString()}</td></tr> <!-- Display only time -->
                <tr><th>End Time</th><td>${executionEndDate ? executionEndDate.toLocaleTimeString() : '-'}</td></tr> <!-- Display only time -->
                <tr><th>Duration</th><td>${executionTime}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header bg-dark text-white text-center">Overall Results</div> <!-- Styled card header -->
          <div class="card-body chart-box p-1">
            <canvas id="overallChart"></canvas>
          </div>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4">
        ${cats
          .map(
            (c, i) => `
        <div class="col">
          <div class="card h-100 shadow"> <!-- Added shadow class -->
            <div class="card-header bg-dark text-white text-center">${c} Results</div> <!-- Styled card header -->
            <div class="card-body chart-box p-1">
              <canvas id="chart-${c}"></canvas>
            </div>
          </div>
        </div>
        `,
          )
          .join('')}
      </div>
    </div>

    <!-- Test Details -->
    <div class="card shadow"> <!-- Added shadow class -->
      <div class="card-body">
        <h2 class="h5 text-center mb-3">Test Details</h2>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark"> <!-- Added table-dark class -->
              <tr>
                <th>Test Case</th>
                <th>Category</th>
                <th>Project</th>
                <th>Status</th>
                <th>Duration(s)</th> <!-- Changed header to seconds -->
                <th>Start Time</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                const groupedResults = new Map<string, TestResultData[]>();
                testResults.forEach((result) => {
                  if (!groupedResults.has(result.testCaseTitle)) {
                    groupedResults.set(result.testCaseTitle, []);
                  }
                  groupedResults.get(result.testCaseTitle)!.push(result);
                });

                let tableRowsHtml = '';
                let previousCategory = '';

                groupedResults.forEach((results, testCaseTitle) => {
                  results.forEach((r, index) => {
                    const statusClass =
                      r.status === 'passed'
                        ? 'bg-success'
                        : r.status === 'failed'
                          ? 'bg-danger'
                          : r.status === 'skipped'
                            ? 'bg-warning'
                            : 'bg-secondary'; // Use badge background colors
                    const capitalizedStatus = r.status.charAt(0).toUpperCase() + r.status.slice(1); // Capitalize first letter
                    const durationInSeconds = (r.duration / 1000).toFixed(2); // Convert ms to seconds and format

                    let rowClass = '';
                    if (index === 0 && r.category !== previousCategory && previousCategory !== '') {
                      rowClass = 'category-separator'; // Use custom class for thinner border
                    }
                    previousCategory = r.category;

                    tableRowsHtml += `
                    <tr class="${rowClass}">
                      ${index === 0 ? `<td rowspan="${results.length}" class="align-middle table-secondary"><strong>${testCaseTitle}</strong></td>` : ''}
                      <td>${r.category}</td>
                      <td>${r.projectName}</td>
                      <td><span class="badge ${statusClass}">${capitalizedStatus}</span></td> <!-- Use Bootstrap badge and capitalized status -->
                      <td>${durationInSeconds}</td> <!-- Display duration in seconds -->
                      <td>${r.startTime}</td>
                      <td>
                        ${r.error ? `<pre>${this.stripAnsiCodes(r.error)}</pre>` : '-'}
                        ${
                          r.attachments && r.attachments.length > 0
                            ? `
                          <div>
                            <strong>Attachments:</strong>
                            ${r.attachments
                              .map((att) => {
                                if (att.path) {
                                  const fileName = path.basename(att.path);
                                  return `<a href="${att.path}" target="_blank">${att.name || fileName}</a>`;
                                }
                                return '';
                              })
                              .join(' | ')}
                          </div>
                        `
                            : ''
                        }
                      </td>
                    </tr>
                    `;
                  });
                });
                return tableRowsHtml;
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
    // Category charts
    ${cats
      .map(
        (c, i) => `
    new Chart(document.getElementById('chart-${c}').getContext('2d'), { type:'pie', data:{ labels:['Passed','Failed','Skipped','Interrupted','Timed Out'], datasets:[{ data:[${catData[i].passed},${catData[i].failed},${catData[i].skipped},${catData[i].interrupted},${catData[i].timedOut}], backgroundColor:['#4CAF50','#F44336','#FF9800','#9E9E9E','#9C27B0'], borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'}, datalabels:{color:'#fff'} }} });
    `,
      )
      .join('')}
  </script>
</body></html>`;
  }
}

export default CustomReporter;
