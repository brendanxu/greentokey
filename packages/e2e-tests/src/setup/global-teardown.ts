/**
 * @fileoverview Global Test Teardown
 * @version 1.0.0
 * Cleanup test environment and generate final reports
 */

import { FullConfig } from '@playwright/test';
import { DatabaseHelper } from '../helpers/database-helper';
import { ReportGenerator } from '../utils/report-generator';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // 1. Clean up test data
    await cleanupTestData();
    
    // 2. Generate comprehensive test reports
    await generateTestReports();
    
    // 3. Clean up temporary files
    await cleanupTempFiles();
    
    // 4. Archive test artifacts
    await archiveTestArtifacts();
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw in teardown to avoid masking test failures
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');
  
  try {
    const dbHelper = new DatabaseHelper();
    await dbHelper.cleanTestData();
    
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error);
  }
}

async function generateTestReports() {
  console.log('📊 Generating comprehensive test reports...');
  
  try {
    const reportGenerator = new ReportGenerator();
    
    // Generate consolidated test report
    await reportGenerator.generateConsolidatedReport({
      outputPath: 'reports/consolidated',
      includeScreenshots: true,
      includeVideos: true,
      includeTraces: true,
    });
    
    // Generate coverage report
    await reportGenerator.generateCoverageReport({
      outputPath: 'reports/coverage',
      format: 'html',
    });
    
    // Generate performance report
    await reportGenerator.generatePerformanceReport({
      outputPath: 'reports/performance',
      includeMetrics: true,
      includeLighthouse: true,
    });
    
    // Generate accessibility report
    await reportGenerator.generateAccessibilityReport({
      outputPath: 'reports/accessibility',
      includeAxeResults: true,
      includeWCAGCompliance: true,
    });
    
    console.log('✅ Test reports generated successfully');
  } catch (error) {
    console.error('❌ Test report generation failed:', error);
  }
}

async function cleanupTempFiles() {
  console.log('🧽 Cleaning up temporary files...');
  
  try {
    const tempDirs = [
      'test-results/temp',
      'test-results/auth-states',
      'allure-results/temp',
    ];
    
    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️ Cleaned ${dir}`);
      }
    }
    
    console.log('✅ Temporary files cleanup completed');
  } catch (error) {
    console.error('❌ Temporary files cleanup failed:', error);
  }
}

async function archiveTestArtifacts() {
  console.log('📦 Archiving test artifacts...');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = `archives/test-run-${timestamp}`;
    
    // Create archive directory
    if (!fs.existsSync('archives')) {
      fs.mkdirSync('archives', { recursive: true });
    }
    fs.mkdirSync(archiveDir, { recursive: true });
    
    // Archive important artifacts
    const artifactsToArchive = [
      'reports',
      'test-results',
      'allure-results',
    ];
    
    for (const artifact of artifactsToArchive) {
      if (fs.existsSync(artifact)) {
        const source = path.resolve(artifact);
        const destination = path.resolve(archiveDir, artifact);
        
        // Copy directory recursively
        await copyDir(source, destination);
        console.log(`📦 Archived ${artifact}`);
      }
    }
    
    // Generate manifest file
    const manifest = {
      timestamp,
      testRun: {
        environment: process.env.NODE_ENV || 'test',
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
        browser: 'chromium, firefox, webkit',
        platform: process.platform,
        nodeVersion: process.version,
      },
      artifacts: artifactsToArchive.filter(artifact => fs.existsSync(artifact)),
    };
    
    fs.writeFileSync(
      path.join(archiveDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`✅ Test artifacts archived to ${archiveDir}`);
  } catch (error) {
    console.error('❌ Test artifacts archiving failed:', error);
  }
}

async function copyDir(src: string, dest: string) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      await copyDir(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

export default globalTeardown;