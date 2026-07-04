import React, { useState } from 'react';
import {
  Target,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Network,
  Link,
  Hash,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';

// Mock pattern data
const mockPatterns = [
  {
    id: '1',
    name: 'Guaranteed Returns Pattern',
    type: 'keyword',
    description: 'Profiles promising guaranteed investment returns',
    occurrence_count: 1245,
    confidence_score: 94,
    keywords: ['guaranteed', 'returns', 'investment', 'profit'],
    related_entities: 89,
    first_detected: new Date(Date.now() - 86400000 * 30).toISOString(),
    last_detected: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Brand Impersonation Pattern',
    type: 'visual',
    description: 'Fake profiles using official logos and branding',
    occurrence_count: 567,
    confidence_score: 89,
    keywords: ['official', 'support', 'verification'],
    related_entities: 34,
    first_detected: new Date(Date.now() - 86400000 * 15).toISOString(),
    last_detected: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Urgency Pressure Pattern',
    type: 'behavior',
    description: 'Messages creating artificial urgency',
    occurrence_count: 892,
    confidence_score: 91,
    keywords: ['act now', 'limited time', 'urgent', 'expires'],
    related_entities: 67,
    first_detected: new Date(Date.now() - 86400000 * 20).toISOString(),
    last_detected: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Typosquatting Domain Pattern',
    type: 'domain',
    description: 'Domains mimicking legitimate brands',
    occurrence_count: 234,
    confidence_score: 97,
    keywords: ['paypa1', 'amaz0n', 'micros0ft'],
    related_entities: 45,
    first_detected: new Date(Date.now() - 86400000 * 45).toISOString(),
    last_detected: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Military Romance Pattern',
    type: 'behavior',
    description: 'Profiles claiming military deployment',
    occurrence_count: 456,
    confidence_score: 86,
    keywords: ['military', 'deployed', 'contractor', 'overseas'],
    related_entities: 23,
    first_detected: new Date(Date.now() - 86400000 * 60).toISOString(),
    last_detected: new Date().toISOString(),
  },
];

const networkData = [
  { source: 'Profile A', target: 'Domain X', type: 'links_to' },
  { source: 'Profile A', target: 'Profile B', type: 'similar' },
  { source: 'Profile B', target: 'Domain X', type: 'links_to' },
  { source: 'Profile B', target: 'Profile C', type: 'similar' },
  { source: 'Domain X', target: 'Email Y', type: 'uses' },
  { source: 'Profile C', target: 'Domain Z', type: 'links_to' },
];

export function PatternAnalysis() {
  const [patterns, setPatterns] = useState(mockPatterns);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || pattern.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pattern Analysis</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Identify and analyze scam patterns across tracked entities</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{patterns.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Patterns</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {patterns.reduce((sum, p) => sum + p.occurrence_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Occurrences</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(patterns.reduce((sum, p) => sum + p.confidence_score, 0) / patterns.length)}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Confidence</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Network className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {patterns.reduce((sum, p) => sum + p.related_entities, 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Related Entities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search patterns..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'keyword', label: 'Keyword Patterns' },
              { value: 'visual', label: 'Visual Patterns' },
              { value: 'behavior', label: 'Behavioral Patterns' },
              { value: 'domain', label: 'Domain Patterns' },
              { value: 'network', label: 'Network Patterns' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patterns List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPatterns.map((pattern) => (
            <div key={pattern.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{pattern.name}</h3>
                    <Badge variant="default" className="capitalize">{pattern.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{pattern.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pattern.occurrence_count.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">occurrences</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Confidence</p>
                  <ProgressBar value={pattern.confidence_score} variant={pattern.confidence_score >= 90 ? 'success' : 'warning'} />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{pattern.confidence_score}%</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {pattern.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Network Visualization */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-500" />
            Network Correlations
          </h3>
          <div className="space-y-3">
            {networkData.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-slate-600 dark:text-slate-400">{link.source}</span>
                <Link className="w-3 h-3 text-slate-400" />
                <span className="text-slate-900 dark:text-white">{link.target}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 btn-secondary text-sm">
            View Full Network
          </button>
        </div>
      </div>
    </div>
  );
}
