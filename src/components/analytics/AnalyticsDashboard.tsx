import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Target,
  Users,
  Globe,
  AlertTriangle,
  Brain,
  LineChart,
  PieChart
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';
import { Card } from '../ui/Card';
import { CircularProgress, ProgressBar } from '../ui/Progress';

// Mock trend data
const trendData = [
  { month: 'Jan', scams: 234, resolved: 189 },
  { month: 'Feb', scams: 289, resolved: 245 },
  { month: 'Mar', scams: 312, resolved: 278 },
  { month: 'Apr', scams: 278, resolved: 256 },
  { month: 'May', scams: 345, resolved: 312 },
  { month: 'Jun', scams: 402, resolved: 367 },
];

const categoryData = [
  { name: 'Phishing', value: 35, color: '#ef4444' },
  { name: 'Investment Scams', value: 25, color: '#f59e0b' },
  { name: 'Romance Scams', value: 18, color: '#ec4899' },
  { name: 'Tech Support', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 10, color: '#6b7280' },
];

const predictionData = [
  { category: 'Crypto Scams', current: 234, predicted: 312, trend: 'up' },
  { category: 'AI-Generated Scams', current: 45, predicted: 189, trend: 'up' },
  { category: 'Deepfake Videos', current: 12, predicted: 78, trend: 'up' },
  { category: 'Traditional Phishing', current: 567, predicted: 523, trend: 'down' },
];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Predictive analytics and trend forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
              { value: '1y', label: 'Last Year' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-3 h-3" />
              -12%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">1,863</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detected Scams</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">94.2%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detection Accuracy</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <TrendingUp className="w-3 h-3" />
              +23%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">4.2s</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response Time</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">12.4K</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Profiles Protected</p>
        </div>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary-500" />
              Scam Activity Trend
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Detected
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Resolved
              </span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-4 h-48 px-4">
            {trendData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end h-32">
                  <div
                    className="flex-1 bg-red-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.scams / 420) * 100}%` }}
                    title={`Detected: ${data.scams}`}
                  />
                  <div
                    className="flex-1 bg-emerald-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.resolved / 420) * 100}%` }}
                    title={`Resolved: ${data.resolved}`}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary-500" />
            Category Distribution
          </h3>

          <div className="flex justify-center mb-6">
            <CircularProgress value={100} size="lg" showValue={false} />
          </div>

          <div className="space-y-3">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{cat.name}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            AI-Predicted Trends
          </h3>
          <span className="px-3 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            Next 30 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictionData.map((pred, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pred.category}</span>
                {pred.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{pred.current}</p>
                </div>
                <div className="text-slate-400">→</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Predicted</p>
                  <p className={`text-lg font-bold ${pred.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {pred.predicted}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={(pred.predicted / pred.current) * 50}
                  variant={pred.trend === 'up' ? 'danger' : 'success'}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-500" />
          AI-Generated Insights
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
            <p className="font-medium text-red-700 dark:text-red-400">High Alert: Crypto Investment Scams Surging</p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              Detected 34% increase in cryptocurrency-related scams targeting users aged 25-45. Recommend enhanced monitoring for keywords related to "guaranteed returns" and "crypto investment".
            </p>
          </div>
          <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10">
            <p className="font-medium text-amber-700 dark:text-amber-400">Emerging Trend: AI-Generated Content</p>
            <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
              Scammers are increasingly using AI-generated text and images to create more convincing profile photos and messages. Detection models have been updated to identify these patterns.
            </p>
          </div>
          <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10">
            <p className="font-medium text-emerald-700 dark:text-emerald-400">Success: Tech Support Scams Declining</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
              Coordinated takedown efforts have resulted in 28% decrease in tech support scams. Continue monitoring for new domains and phone numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
