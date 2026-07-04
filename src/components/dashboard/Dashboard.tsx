import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Globe,
  AlertTriangle,
  FolderOpen,
  Database,
  TrendingUp,
  Activity,
  Eye,
  Clock,
  ArrowRight,
  ChevronRight,
  Target,
  Brain
} from 'lucide-react';
import { StatCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge, RiskBadge, PriorityBadge } from '../ui/Badge';
import { CircularProgress, RiskMeter } from '../ui/Progress';
import type { DashboardStats } from '../../types/database';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

// Mock data for demonstration
const mockStats: DashboardStats = {
  total_investigations: 247,
  active_investigations: 18,
  scam_profiles_tracked: 1523,
  scam_pages_monitored: 892,
  critical_threats: 34,
  high_risk_entities: 156,
  open_cases: 42,
  evidence_items: 3841,
};

const mockRecentProfiles = [
  { id: '1', username: 'scam_trader_xyz', platform: 'instagram', risk_level: 'critical', status: 'active', created_at: new Date().toISOString() },
  { id: '2', username: 'crypto_guru_fake', platform: 'twitter', risk_level: 'high', status: 'under_review', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', username: 'official_support_team', platform: 'telegram', risk_level: 'high', status: 'active', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', username: 'investment_pro_2024', platform: 'facebook', risk_level: 'medium', status: 'suspended', created_at: new Date(Date.now() - 86400000).toISOString() },
];

const mockRecentPages = [
  { id: '1', domain: 'paypa1-secure.com', page_type: 'phishing', risk_level: 'critical', status: 'active' },
  { id: '2', domain: 'amazan-giftcards.net', page_type: 'brand_impersonation', risk_level: 'high', status: 'active' },
  { id: '3', domain: 'crypto-exchange-pro.io', page_type: 'fraudulent_website', risk_level: 'critical', status: 'under_review' },
  { id: '4', domain: 'support-microsoft.online', page_type: 'phishing', risk_level: 'high', status: 'taken_down' },
];

const mockThreatDistribution = [
  { category: 'Phishing', count: 456, percentage: 35 },
  { category: 'Brand Impersonation', count: 312, percentage: 24 },
  { category: 'Financial Fraud', count: 234, percentage: 18 },
  { category: 'Social Engineering', count: 178, percentage: 14 },
  { category: 'Romance Scam', count: 98, percentage: 7 },
  { category: 'Other', count: 45, percentage: 2 },
];

const mockTrendData = [
  { date: 'Mon', scams: 45, resolved: 32 },
  { date: 'Tue', scams: 52, resolved: 41 },
  { date: 'Wed', scams: 38, resolved: 35 },
  { date: 'Thu', scams: 67, resolved: 48 },
  { date: 'Fri', scams: 59, resolved: 52 },
  { date: 'Sat', scams: 34, resolved: 28 },
  { date: 'Sun', scams: 28, resolved: 24 },
];

const mockInvestigations = [
  { id: '1', case_number: 'INV-2024-0142', title: 'Crypto Investment Scam Network', priority: 'critical', status: 'under_investigation', profiles: 12 },
  { id: '2', case_number: 'INV-2024-0141', title: 'Brand Impersonation Campaign', priority: 'high', status: 'open', profiles: 8 },
  { id: '3', case_number: 'INV-2024-0140', title: 'Social Security Refund Scam', priority: 'high', status: 'escalated', profiles: 5 },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats] = useState(mockStats);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Threat Intelligence Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and analyze scam activities in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="cyber" icon={<Brain className="w-4 h-4" />}>
            Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Investigations"
          value={stats.active_investigations}
          icon={<FolderOpen className="w-6 h-6" />}
          variant="primary"
          trend="up"
          change={12}
          changeLabel="vs last week"
        />
        <StatCard
          title="Profiles Tracked"
          value={stats.scam_profiles_tracked.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          variant="cyber"
          trend="up"
          change={8}
          changeLabel="vs last week"
        />
        <StatCard
          title="Pages Monitored"
          value={stats.scam_pages_monitored.toLocaleString()}
          icon={<Globe className="w-6 h-6" />}
          trend="up"
          change={15}
          changeLabel="vs last week"
        />
        <StatCard
          title="Critical Threats"
          value={stats.critical_threats}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="danger"
          trend="down"
          change={-5}
          changeLabel="vs last week"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Distribution */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Threat Distribution</h3>
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {mockThreatDistribution.map((threat, index) => (
              <div key={threat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{threat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{threat.count}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">({threat.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-amber-500' :
                      index === 3 ? 'bg-primary-500' :
                      index === 4 ? 'bg-emerald-500' :
                      'bg-slate-400'
                    }`}
                    style={{ width: `${threat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Score Summary */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Risk Analysis Summary</h3>
          <div className="flex justify-center mb-6">
            <CircularProgress value={72} variant="cyber" size="lg" label="Risk Score" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Critical</span>
              </div>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">{stats.critical_threats}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Risk</span>
              </div>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{stats.high_risk_entities}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resolved</span>
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1,234</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Profiles */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recently Tracked Profiles</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('profiles')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {mockRecentProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">@{profile.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{profile.platform}</span>
                      <StatusBadge status={profile.status} />
                    </div>
                  </div>
                </div>
                <RiskBadge level={profile.risk_level as 'low' | 'medium' | 'high' | 'critical'} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Pages */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recently Monitored Pages</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('pages')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {mockRecentPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{page.domain}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                      {page.page_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={page.status} />
                  <RiskBadge level={page.risk_level as 'low' | 'medium' | 'high' | 'critical'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Investigations */}
      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Active Investigations</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('investigations')}>
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Case ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Profiles</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {mockInvestigations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-primary-600 dark:text-primary-400">{inv.case_number}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-slate-900 dark:text-white">{inv.title}</span>
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={inv.priority as 'low' | 'medium' | 'high' | 'critical'} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{inv.profiles} profiles</span>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('profiles')}
          className="card p-4 flex flex-col items-center justify-center gap-3 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Track New Profile</span>
        </button>
        <button
          onClick={() => onNavigate('pages')}
          className="card p-4 flex flex-col items-center justify-center gap-3 hover:border-cyber-accent dark:hover:border-cyber-accent transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-colors">
            <Globe className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monitor Page</span>
        </button>
        <button
          onClick={() => onNavigate('investigations')}
          className="card p-4 flex flex-col items-center justify-center gap-3 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
            <FolderOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New Investigation</span>
        </button>
        <button
          onClick={() => onNavigate('detection')}
          className="card p-4 flex flex-col items-center justify-center gap-3 hover:border-amber-500 dark:hover:border-amber-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
            <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Analysis</span>
        </button>
      </div>
    </div>
  );
}
