/**
 * @fileoverview Performance Analytics API - 性能数据收集和分析
 * @version 1.0.0
 * 收集前端性能指标，生成性能报告和告警
 */

import { NextApiRequest, NextApiResponse } from 'next';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  url: string;
  timestamp: number;
  additional?: Record<string, any>;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalSamples: number;
    timeRange: { start: number; end: number };
    averages: Record<string, number>;
    ratings: Record<string, { good: number; needsImprovement: number; poor: number }>;
  };
  alerts: string[];
}

// 内存存储 (生产环境应使用数据库)
const performanceData: PerformanceMetric[] = [];
const MAX_STORED_METRICS = 10000;

// 性能阈值配置
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  'Critical Resource Load': { good: 1000, poor: 2500 },
  'Interaction Delay': { good: 100, poor: 300 },
  'DNS Lookup': { good: 200, poor: 1000 },
  'TCP Connection': { good: 200, poor: 1000 },
  'Request': { good: 500, poor: 2000 },
  'Response': { good: 500, poor: 2000 }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      return await handleMetricSubmission(req, res);
    } else if (req.method === 'GET') {
      return await handleMetricRetrieval(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Performance API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleMetricSubmission(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const metric: PerformanceMetric = req.body;

  // 验证必要字段
  if (!metric.name || typeof metric.value !== 'number' || !metric.url) {
    return res.status(400).json({ 
      error: 'Invalid metric data',
      required: ['name', 'value', 'url']
    });
  }

  // 添加服务器时间戳
  metric.timestamp = Date.now();

  // 存储指标
  performanceData.push(metric);

  // 维护存储限制
  if (performanceData.length > MAX_STORED_METRICS) {
    performanceData.shift();
  }

  // 检查是否需要发送告警
  const alerts = checkPerformanceAlerts(metric);
  
  if (alerts.length > 0) {
    console.warn(`🚨 Performance Alert for ${metric.url}:`, alerts);
    
    // 这里可以集成告警系统（Slack、邮件等）
    await sendPerformanceAlerts(alerts, metric);
  }

  // 记录关键指标日志
  if (metric.rating === 'poor') {
    console.warn(`📊 Poor performance detected:`, {
      metric: metric.name,
      value: `${metric.value.toFixed(2)}ms`,
      url: metric.url,
      rating: metric.rating
    });
  }

  res.status(200).json({ 
    success: true,
    alerts: alerts.length,
    storedMetrics: performanceData.length
  });
}

async function handleMetricRetrieval(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { 
    url, 
    metric, 
    from, 
    to, 
    limit = '100' 
  } = req.query;

  let filteredMetrics = [...performanceData];

  // 按URL过滤
  if (url && typeof url === 'string') {
    filteredMetrics = filteredMetrics.filter(m => m.url.includes(url));
  }

  // 按指标名称过滤
  if (metric && typeof metric === 'string') {
    filteredMetrics = filteredMetrics.filter(m => m.name === metric);
  }

  // 按时间范围过滤
  const fromTime = from ? parseInt(from as string) : 0;
  const toTime = to ? parseInt(to as string) : Date.now();
  
  filteredMetrics = filteredMetrics.filter(
    m => m.timestamp >= fromTime && m.timestamp <= toTime
  );

  // 限制返回数量
  const limitNum = parseInt(limit as string);
  if (limitNum > 0) {
    filteredMetrics = filteredMetrics
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limitNum);
  }

  // 生成报告
  const report = generatePerformanceReport(filteredMetrics);

  res.status(200).json(report);
}

function checkPerformanceAlerts(metric: PerformanceMetric): string[] {
  const alerts: string[] = [];
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];

  if (!threshold) return alerts;

  // 检查是否超过阈值
  if (metric.value > threshold.poor) {
    alerts.push(`Poor ${metric.name}: ${metric.value.toFixed(2)}ms (threshold: ${threshold.poor}ms)`);
  }

  // 特殊检查逻辑
  if (metric.name === 'LCP' && metric.value > 4000) {
    alerts.push(`Critical LCP performance: ${metric.value.toFixed(2)}ms - User experience severely impacted`);
  }

  if (metric.name === 'CLS' && metric.value > 0.25) {
    alerts.push(`Critical CLS: ${metric.value.toFixed(4)} - Significant layout instability detected`);
  }

  if (metric.name === 'Critical Resource Load' && metric.value > 5000) {
    alerts.push(`Very slow critical resource: ${metric.value.toFixed(2)}ms - May block page rendering`);
  }

  return alerts;
}

async function sendPerformanceAlerts(alerts: string[], metric: PerformanceMetric): Promise<void> {
  // 这里可以集成真实的告警系统
  try {
    // Slack 通知 (示例)
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackPayload = {
        text: `🚨 Performance Alert - ${metric.url}`,
        attachments: [
          {
            color: 'danger',
            fields: [
              {
                title: 'Metric',
                value: metric.name,
                short: true
              },
              {
                title: 'Value',
                value: `${metric.value.toFixed(2)}ms`,
                short: true
              },
              {
                title: 'Rating',
                value: metric.rating,
                short: true
              },
              {
                title: 'URL',
                value: metric.url,
                short: true
              }
            ],
            text: alerts.join('\n')
          }
        ]
      };

      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload)
      });
    }

    // 邮件通知 (示例)
    if (process.env.SENDGRID_API_KEY && alerts.some(alert => alert.includes('Critical'))) {
      // 仅对严重性能问题发送邮件
      console.log('📧 Would send email alert for critical performance issue');
      // 实际邮件发送逻辑
    }

  } catch (error) {
    console.error('Failed to send performance alerts:', error);
  }
}

function generatePerformanceReport(metrics: PerformanceMetric[]): PerformanceReport {
  if (metrics.length === 0) {
    return {
      metrics: [],
      summary: {
        totalSamples: 0,
        timeRange: { start: 0, end: 0 },
        averages: {},
        ratings: {}
      },
      alerts: []
    };
  }

  // 计算时间范围
  const timestamps = metrics.map(m => m.timestamp);
  const timeRange = {
    start: Math.min(...timestamps),
    end: Math.max(...timestamps)
  };

  // 按指标名称分组
  const metricGroups = metrics.reduce((groups, metric) => {
    if (!groups[metric.name]) {
      groups[metric.name] = [];
    }
    groups[metric.name].push(metric);
    return groups;
  }, {} as Record<string, PerformanceMetric[]>);

  // 计算平均值
  const averages: Record<string, number> = {};
  Object.entries(metricGroups).forEach(([name, groupMetrics]) => {
    averages[name] = groupMetrics.reduce((sum, m) => sum + m.value, 0) / groupMetrics.length;
  });

  // 计算评级分布
  const ratings: Record<string, { good: number; needsImprovement: number; poor: number }> = {};
  Object.entries(metricGroups).forEach(([name, groupMetrics]) => {
    const ratingCounts = groupMetrics.reduce(
      (counts, m) => {
        counts[m.rating === 'needs-improvement' ? 'needsImprovement' : m.rating]++;
        return counts;
      },
      { good: 0, needsImprovement: 0, poor: 0 }
    );
    ratings[name] = ratingCounts;
  });

  // 生成告警
  const alerts: string[] = [];
  Object.entries(averages).forEach(([metricName, avgValue]) => {
    const threshold = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
    if (threshold && avgValue > threshold.poor) {
      alerts.push(`Average ${metricName} (${avgValue.toFixed(2)}ms) exceeds poor threshold (${threshold.poor}ms)`);
    }
  });

  // 检查整体性能趋势
  const recentMetrics = metrics
    .filter(m => m.timestamp > Date.now() - 300000) // 最近5分钟
    .sort((a, b) => b.timestamp - a.timestamp);

  if (recentMetrics.length >= 5) {
    const recentPoorCount = recentMetrics.slice(0, 5).filter(m => m.rating === 'poor').length;
    if (recentPoorCount >= 3) {
      alerts.push('Performance degradation detected: 3+ poor ratings in last 5 samples');
    }
  }

  return {
    metrics: metrics.sort((a, b) => b.timestamp - a.timestamp),
    summary: {
      totalSamples: metrics.length,
      timeRange,
      averages,
      ratings
    },
    alerts
  };
}

// 导出用于测试的函数
export { checkPerformanceAlerts, generatePerformanceReport };