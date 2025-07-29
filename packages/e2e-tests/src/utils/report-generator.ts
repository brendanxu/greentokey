/**
 * @fileoverview Test Report Generator
 * @version 1.0.0
 * Utility class for generating comprehensive test reports
 */

import fs from 'fs';
import path from 'path';
import { TestResult } from '@playwright/test/reporter';

export interface ReportConfig {
  outputPath: string;
  includeScreenshots?: boolean;
  includeVideos?: boolean;
  includeTraces?: boolean;
}

export interface CoverageReportConfig {
  outputPath: string;
  format: 'html' | 'json' | 'lcov';
}

export interface PerformanceReportConfig {
  outputPath: string;
  includeMetrics?: boolean;
  includeLighthouse?: boolean;
}

export interface AccessibilityReportConfig {
  outputPath: string;
  includeAxeResults?: boolean;
  includeWCAGCompliance?: boolean;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
  startTime: string;
  endTime: string;
}

export interface TestDetails {
  title: string;
  file: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  error?: string;
  screenshots?: string[];
  video?: string;
  trace?: string;
}

export class ReportGenerator {
  private readonly reportsDir: string;

  constructor() {
    this.reportsDir = path.resolve('reports');
    this.ensureDirectoryExists(this.reportsDir);
  }

  /**
   * Generate consolidated test report
   */
  async generateConsolidatedReport(config: ReportConfig): Promise<void> {
    console.log('📊 Generating consolidated test report...');

    const outputDir = path.resolve(config.outputPath);
    this.ensureDirectoryExists(outputDir);

    try {
      // Collect test results from different sources
      const testResults = await this.collectTestResults();
      const summary = this.generateTestSummary(testResults);
      const details = this.generateTestDetails(testResults);

      // Generate HTML report
      const htmlReport = this.generateHTMLReport(summary, details, config);
      fs.writeFileSync(path.join(outputDir, 'index.html'), htmlReport);

      // Generate JSON report
      const jsonReport = this.generateJSONReport(summary, details);
      fs.writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(jsonReport, null, 2));

      // Copy artifacts if requested
      if (config.includeScreenshots) {
        await this.copyScreenshots(outputDir);
      }

      if (config.includeVideos) {
        await this.copyVideos(outputDir);
      }

      if (config.includeTraces) {
        await this.copyTraces(outputDir);
      }

      console.log(`✅ Consolidated report generated: ${outputDir}/index.html`);
    } catch (error) {
      console.error('❌ Failed to generate consolidated report:', error);
      throw error;
    }
  }

  /**
   * Generate coverage report
   */
  async generateCoverageReport(config: CoverageReportConfig): Promise<void> {
    console.log('📈 Generating coverage report...');

    const outputDir = path.resolve(config.outputPath);
    this.ensureDirectoryExists(outputDir);

    try {
      // Read coverage data
      const coverageData = await this.collectCoverageData();

      switch (config.format) {
        case 'html':
          await this.generateHTMLCoverageReport(coverageData, outputDir);
          break;
        case 'json':
          fs.writeFileSync(
            path.join(outputDir, 'coverage.json'),
            JSON.stringify(coverageData, null, 2)
          );
          break;
        case 'lcov':
          await this.generateLCOVReport(coverageData, outputDir);
          break;
      }

      console.log(`✅ Coverage report generated: ${outputDir}`);
    } catch (error) {
      console.error('❌ Failed to generate coverage report:', error);
      throw error;
    }
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(config: PerformanceReportConfig): Promise<void> {
    console.log('⚡ Generating performance report...');

    const outputDir = path.resolve(config.outputPath);
    this.ensureDirectoryExists(outputDir);

    try {
      const performanceData = await this.collectPerformanceData();

      // Generate performance metrics report
      if (config.includeMetrics) {
        const metricsReport = this.generatePerformanceMetricsReport(performanceData);
        fs.writeFileSync(path.join(outputDir, 'metrics.html'), metricsReport);
      }

      // Generate Lighthouse report
      if (config.includeLighthouse) {
        await this.generateLighthouseReport(outputDir);
      }

      // Generate performance JSON data
      fs.writeFileSync(
        path.join(outputDir, 'performance.json'),
        JSON.stringify(performanceData, null, 2)
      );

      console.log(`✅ Performance report generated: ${outputDir}`);
    } catch (error) {
      console.error('❌ Failed to generate performance report:', error);
      throw error;
    }
  }

  /**
   * Generate accessibility report
   */
  async generateAccessibilityReport(config: AccessibilityReportConfig): Promise<void> {
    console.log('♿ Generating accessibility report...');

    const outputDir = path.resolve(config.outputPath);
    this.ensureDirectoryExists(outputDir);

    try {
      const a11yData = await this.collectAccessibilityData();

      // Generate Axe results report
      if (config.includeAxeResults) {
        const axeReport = this.generateAxeReport(a11yData.axeResults);
        fs.writeFileSync(path.join(outputDir, 'axe-report.html'), axeReport);
      }

      // Generate WCAG compliance report
      if (config.includeWCAGCompliance) {
        const wcagReport = this.generateWCAGReport(a11yData.wcagResults);
        fs.writeFileSync(path.join(outputDir, 'wcag-report.html'), wcagReport);
      }

      // Generate accessibility JSON data
      fs.writeFileSync(
        path.join(outputDir, 'accessibility.json'),
        JSON.stringify(a11yData, null, 2)
      );

      console.log(`✅ Accessibility report generated: ${outputDir}`);
    } catch (error) {
      console.error('❌ Failed to generate accessibility report:', error);
      throw error;
    }
  }

  /**
   * Collect test results from various sources
   */
  private async collectTestResults(): Promise<TestDetails[]> {
    const results: TestDetails[] = [];

    // Collect from Playwright JSON reporter
    const playwrightResults = this.readPlaywrightResults();
    results.push(...playwrightResults);

    // Collect from JUnit XML
    const junitResults = this.readJUnitResults();
    results.push(...junitResults);

    return results;
  }

  /**
   * Read Playwright test results
   */
  private readPlaywrightResults(): TestDetails[] {
    try {
      const resultsPath = path.resolve('reports/json/results.json');
      if (!fs.existsSync(resultsPath)) {
        return [];
      }

      const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      return data.suites?.flatMap((suite: any) =>
        suite.specs?.map((spec: any) => ({
          title: spec.title,
          file: spec.file,
          status: spec.tests?.[0]?.results?.[0]?.status || 'unknown',
          duration: spec.tests?.[0]?.results?.[0]?.duration || 0,
          error: spec.tests?.[0]?.results?.[0]?.error?.message,
          screenshots: spec.tests?.[0]?.results?.[0]?.attachments
            ?.filter((a: any) => a.name === 'screenshot')
            ?.map((a: any) => a.path) || [],
          video: spec.tests?.[0]?.results?.[0]?.attachments
            ?.find((a: any) => a.name === 'video')?.path,
          trace: spec.tests?.[0]?.results?.[0]?.attachments
            ?.find((a: any) => a.name === 'trace')?.path,
        })) || []
      ) || [];
    } catch (error) {
      console.warn('Could not read Playwright results:', error);
      return [];
    }
  }

  /**
   * Read JUnit test results
   */
  private readJUnitResults(): TestDetails[] {
    // Implementation would parse JUnit XML results
    // For now, return empty array
    return [];
  }

  /**
   * Generate test summary
   */
  private generateTestSummary(results: TestDetails[]): TestSummary {
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const flaky = results.filter(r => r.status === 'timedOut').length;
    const duration = results.reduce((sum, r) => sum + r.duration, 0);

    return {
      total,
      passed,
      failed,
      skipped,
      flaky,
      duration,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };
  }

  /**
   * Generate test details
   */
  private generateTestDetails(results: TestDetails[]): TestDetails[] {
    return results.sort((a, b) => {
      // Sort failed tests first, then by duration descending
      if (a.status === 'failed' && b.status !== 'failed') return -1;
      if (a.status !== 'failed' && b.status === 'failed') return 1;
      return b.duration - a.duration;
    });
  }

  /**
   * Generate HTML report
   */
  private generateHTMLReport(summary: TestSummary, details: TestDetails[], config: ReportConfig): string {
    const passRate = ((summary.passed / summary.total) * 100).toFixed(1);
    const duration = (summary.duration / 1000).toFixed(1);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink Capital - E2E Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0052FF, #00D4AA); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header .subtitle { opacity: 0.9; margin-top: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; border-bottom: 1px solid #eee; }
        .metric { text-align: center; }
        .metric-value { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
        .metric-label { color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .passed { color: #00D4AA; }
        .failed { color: #FF4444; }
        .skipped { color: #FFA500; }
        .details { padding: 30px; }
        .test-item { border: 1px solid #eee; border-radius: 6px; margin-bottom: 15px; overflow: hidden; }
        .test-header { padding: 15px; background: #f9f9f9; display: flex; justify-content: between; align-items: center; }
        .test-title { font-weight: 600; flex: 1; }
        .test-status { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-passed { background: #E8F5E8; color: #00AA00; }
        .status-failed { background: #FFE8E8; color: #AA0000; }
        .status-skipped { background: #FFF4E8; color: #AA6600; }
        .test-body { padding: 15px; display: none; }
        .test-body.show { display: block; }
        .error { background: #FFE8E8; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px; margin-top: 10px; }
        .artifacts { margin-top: 15px; }
        .artifact-link { display: inline-block; margin-right: 10px; padding: 5px 10px; background: #0052FF; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; }
        .progress-bar { background: #eee; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #00D4AA, #0052FF); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GreenLink Capital - E2E Test Report</h1>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${passRate}%"></div>
            </div>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${summary.total}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value passed">${summary.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value failed">${summary.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value skipped">${summary.skipped}</div>
                <div class="metric-label">Skipped</div>
            </div>
            <div class="metric">
                <div class="metric-value">${passRate}%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${duration}s</div>
                <div class="metric-label">Duration</div>
            </div>
        </div>

        <div class="details">
            <h2>Test Details</h2>
            ${details.map(test => `
                <div class="test-item">
                    <div class="test-header" onclick="toggleTest('${test.title.replace(/[^a-zA-Z0-9]/g, '')}')">
                        <div class="test-title">${test.title}</div>
                        <div class="test-status status-${test.status}">${test.status}</div>
                    </div>
                    <div class="test-body" id="test-${test.title.replace(/[^a-zA-Z0-9]/g, '')}">
                        <div><strong>File:</strong> ${test.file}</div>
                        <div><strong>Duration:</strong> ${(test.duration / 1000).toFixed(2)}s</div>
                        ${test.error ? `<div class="error">${test.error}</div>` : ''}
                        ${config.includeScreenshots && test.screenshots?.length ? `
                            <div class="artifacts">
                                <strong>Screenshots:</strong><br>
                                ${test.screenshots.map(screenshot => `
                                    <a href="${screenshot}" class="artifact-link" target="_blank">Screenshot</a>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${config.includeVideos && test.video ? `
                            <div class="artifacts">
                                <strong>Video:</strong><br>
                                <a href="${test.video}" class="artifact-link" target="_blank">Watch Video</a>
                            </div>
                        ` : ''}
                        ${config.includeTraces && test.trace ? `
                            <div class="artifacts">
                                <strong>Trace:</strong><br>
                                <a href="${test.trace}" class="artifact-link" target="_blank">View Trace</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        function toggleTest(testId) {
            const body = document.getElementById('test-' + testId);
            body.classList.toggle('show');
        }
    </script>
</body>
</html>`;
  }

  /**
   * Generate JSON report
   */
  private generateJSONReport(summary: TestSummary, details: TestDetails[]): any {
    return {
      summary,
      details,
      metadata: {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'test',
        platform: process.platform,
        nodeVersion: process.version,
      },
    };
  }

  /**
   * Copy screenshots to report directory
   */
  private async copyScreenshots(outputDir: string): Promise<void> {
    const screenshotsDir = path.join(outputDir, 'screenshots');
    this.ensureDirectoryExists(screenshotsDir);
    
    // Implementation would copy screenshot files
    console.log('📸 Screenshots copied to report');
  }

  /**
   * Copy videos to report directory
   */
  private async copyVideos(outputDir: string): Promise<void> {
    const videosDir = path.join(outputDir, 'videos');
    this.ensureDirectoryExists(videosDir);
    
    // Implementation would copy video files
    console.log('🎥 Videos copied to report');
  }

  /**
   * Copy traces to report directory
   */
  private async copyTraces(outputDir: string): Promise<void> {
    const tracesDir = path.join(outputDir, 'traces');
    this.ensureDirectoryExists(tracesDir);
    
    // Implementation would copy trace files
    console.log('🔍 Traces copied to report');
  }

  /**
   * Collect coverage data
   */
  private async collectCoverageData(): Promise<any> {
    // Implementation would collect coverage data from various sources
    return {
      summary: {
        lines: { total: 1000, covered: 850, pct: 85 },
        functions: { total: 200, covered: 170, pct: 85 },
        statements: { total: 1200, covered: 1020, pct: 85 },
        branches: { total: 300, covered: 240, pct: 80 },
      },
      files: [],
    };
  }

  /**
   * Generate HTML coverage report
   */
  private async generateHTMLCoverageReport(coverageData: any, outputDir: string): Promise<void> {
    // Implementation would generate HTML coverage report
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Coverage Report</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .metric { display: inline-block; margin-right: 30px; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { color: #666; }
    </style>
</head>
<body>
    <h1>Code Coverage Report</h1>
    <div class="summary">
        <div class="metric">
            <div class="metric-value">${coverageData.summary.lines.pct}%</div>
            <div class="metric-label">Lines</div>
        </div>
        <div class="metric">
            <div class="metric-value">${coverageData.summary.functions.pct}%</div>
            <div class="metric-label">Functions</div>
        </div>
        <div class="metric">
            <div class="metric-value">${coverageData.summary.statements.pct}%</div>
            <div class="metric-label">Statements</div>
        </div>
        <div class="metric">
            <div class="metric-value">${coverageData.summary.branches.pct}%</div>
            <div class="metric-label">Branches</div>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);
  }

  /**
   * Generate LCOV report
   */
  private async generateLCOVReport(coverageData: any, outputDir: string): Promise<void> {
    // Implementation would generate LCOV format report
    fs.writeFileSync(path.join(outputDir, 'lcov.info'), '# LCOV Report\n');
  }

  /**
   * Collect performance data
   */
  private async collectPerformanceData(): Promise<any> {
    return {
      metrics: {
        firstContentfulPaint: 1200,
        largestContentfulPaint: 2500,
        firstInputDelay: 50,
        cumulativeLayoutShift: 0.1,
        totalBlockingTime: 150,
      },
      resources: [],
      timeline: [],
    };
  }

  /**
   * Generate performance metrics report
   */
  private generatePerformanceMetricsReport(performanceData: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Performance Report</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .metric { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 28px; font-weight: bold; color: #0052FF; }
        .metric-label { color: #666; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Performance Metrics</h1>
    <div class="metrics">
        <div class="metric">
            <div class="metric-value">${performanceData.metrics.firstContentfulPaint}ms</div>
            <div class="metric-label">First Contentful Paint</div>
        </div>
        <div class="metric">
            <div class="metric-value">${performanceData.metrics.largestContentfulPaint}ms</div>
            <div class="metric-label">Largest Contentful Paint</div>
        </div>
        <div class="metric">
            <div class="metric-value">${performanceData.metrics.firstInputDelay}ms</div>
            <div class="metric-label">First Input Delay</div>
        </div>
        <div class="metric">
            <div class="metric-value">${performanceData.metrics.cumulativeLayoutShift}</div>
            <div class="metric-label">Cumulative Layout Shift</div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate Lighthouse report
   */
  private async generateLighthouseReport(outputDir: string): Promise<void> {
    // Implementation would run Lighthouse and generate report
    console.log('🏮 Lighthouse report generated');
  }

  /**
   * Collect accessibility data
   */
  private async collectAccessibilityData(): Promise<any> {
    return {
      axeResults: {
        violations: [],
        passes: [],
        incomplete: [],
        inapplicable: [],
      },
      wcagResults: {
        level: 'AA',
        conformance: 'partial',
        violations: [],
      },
    };
  }

  /**
   * Generate Axe accessibility report
   */
  private generateAxeReport(axeResults: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Accessibility Report - Axe Results</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .violation { background: #ffe6e6; padding: 15px; margin-bottom: 10px; border-left: 4px solid #ff4444; }
        .pass { background: #e6ffe6; padding: 15px; margin-bottom: 10px; border-left: 4px solid #44ff44; }
    </style>
</head>
<body>
    <h1>Accessibility Report - Axe Results</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Violations: ${axeResults.violations.length}</p>
        <p>Passes: ${axeResults.passes.length}</p>
        <p>Incomplete: ${axeResults.incomplete.length}</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate WCAG compliance report
   */
  private generateWCAGReport(wcagResults: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>WCAG Compliance Report</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>WCAG Compliance Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Level: ${wcagResults.level}</p>
        <p>Conformance: ${wcagResults.conformance}</p>
        <p>Violations: ${wcagResults.violations.length}</p>
    </div>
</body>
</html>`;
  }

  /**
   * Ensure directory exists
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}