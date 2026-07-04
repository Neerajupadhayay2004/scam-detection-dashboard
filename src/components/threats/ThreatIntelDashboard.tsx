import React, { useState } from 'react';
import {
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  Link,
  Hash,
  Search,
  Filter,
  Plus,
  Eye,
  Shield,
  TrendingUp,
  Database,
  Clock,
  Target,
  Activity,
  AlertOctagon,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, TextArea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge, RiskBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import type { ThreatIndicator, IndicatorType } from '../../types/database';

const indicatorTypeConfig: Record<IndicatorType, { icon: React.ReactNode; label: string }> = {
  domain: { icon: <Globe className="w-4 h-4" />, label: 'Domain' },
  ip: { icon: <Database className="w-4 h-4" />, label: 'IP Address' },
  email: { icon: <Mail className="w-4 h-4" />, label: 'Email' },
  phone: { icon: <Phone className="w-4 h-4" />, label: 'Phone' },
  keyword: { icon: <Hash className="w-4 h-4" />, label: 'Keyword' },
  url_pattern: { icon: <Link className="w-4 h-4" />, label: 'URL Pattern' },
  hash: { icon: <Hash className="w-4 h-4" />, label: 'Hash' },
  behavior: { icon: <Activity className="w-4 h-4" />, label: 'Behavior' },
};

// Mock data
const mockIndicators: ThreatIndicator[] = [
  {
    id: '1',
    indicator_type: 'domain',
    value: 'paypa1-secure.com',
    description: 'Typosquatting domain targeting PayPal users',
    severity: 'critical',
    confidence: 98,
    source: 'Automated Detection',
    first_seen: new Date(Date.now() - 86400000).toISOString(),
    last_seen: new Date().toISOString(),
    occurrence_count: 234,
    tags: ['phishing', 'paypal', 'typosquatting'],
    is_active: true,
    created_by: 'system',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    related_investigations: [],
  },
  {
    id: '2',
    indicator_type: 'email',
    value: 'support@paypa1-secure.com',
    description: 'Email associated with phishing campaign',
    severity: 'critical',
    confidence: 95,
    source: 'Threat Intelligence Feed',
    first_seen: new Date(Date.now() - 172800000).toISOString(),
    last_seen: new Date(Date.now() - 3600000).toISOString(),
    occurrence_count: 89,
    tags: ['phishing', 'email', 'paypal'],
    is_active: true,
    created_by: 'system',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    related_investigations: [],
  },
  {
    id: '3',
    indicator_type: 'keyword',
    value: 'guaranteed returns',
    description: 'Common financial scam keyword pattern',
    severity: 'high',
    confidence: 87,
    source: 'AI Pattern Detection',
    first_seen: new Date(Date.now() - 259200000).toISOString(),
    last_seen: new Date().toISOString(),
    occurrence_count: 1245,
    tags: ['crypto', 'investment', 'financial-scam'],
    is_active: true,
    created_by: 'system',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    related_investigations: [],
  },
  {
    id: '4',
    indicator_type: 'phone',
    value: '+1-800-XXX-XXXX',
    description: 'Phone number used in tech support scam',
    severity: 'high',
    confidence: 92,
    source: 'User Report',
    first_seen: new Date(Date.now() - 345600000).toISOString(),
    last_seen: new Date(Date.now() - 86400000).toISOString(),
    occurrence_count: 67,
    tags: ['tech-support', 'phone', 'elderly-targets'],
    is_active: true,
    created_by: 'user1',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    related_investigations: [],
  },
  {
    id: '5',
    indicator_type: 'domain',
    value: 'crypto-exchange-pro.io',
    description: 'Domain hosting fraudulent cryptocurrency platform',
    severity: 'critical',
    confidence: 96,
    source: 'Domain Analysis',
    first_seen: new Date(Date.now() - 432000000).toISOString(),
    last_seen: new Date().toISOString(),
    occurrence_count: 178,
    tags: ['crypto', 'fraud', 'investment'],
    is_active: true,
    created_by: 'system',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    related_investigations: [],
  },
];

export function ThreatIntelDashboard() {
  const [indicators, setIndicators] = useState(mockIndicators);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<ThreatIndicator | null>(null);

  const [newIndicator, setNewIndicator] = useState({
    indicator_type: 'domain' as IndicatorType,
    value: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    tags: '',
  });

  const filteredIndicators = indicators.filter(ind => {
    const matchesSearch = ind.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || ind.indicator_type === filterType;
    const matchesSeverity = filterSeverity === 'all' || ind.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleAddIndicator = () => {
    const indicator: ThreatIndicator = {
      id: String(Date.now()),
      ...newIndicator,
      confidence: 0,
      source: 'Manual Entry',
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      occurrence_count: 1,
      tags: newIndicator.tags.split(',').map(t => t.trim()).filter(Boolean),
      is_active: true,
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
      related_investigations: [],
    };
    setIndicators([indicator, ...indicators]);
    setShowAddModal(false);
    setNewIndicator({ indicator_type: 'domain', value: '', description: '', severity: 'medium', tags: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            Threat Intelligence
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor threat indicators and intelligence feeds</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Indicator
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {indicators.filter(i => i.severity === 'critical').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Critical</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {indicators.filter(i => i.severity === 'high').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">High Severity</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {indicators.reduce((sum, i) => sum + i.occurrence_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Hits</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{indicators.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Indicators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search indicators..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'domain', label: 'Domains' },
              { value: 'ip', label: 'IP Addresses' },
              { value: 'email', label: 'Emails' },
              { value: 'phone', label: 'Phone Numbers' },
              { value: 'keyword', label: 'Keywords' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Severities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          />
        </div>
      </div>

      {/* Indicators Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Occurrences</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredIndicators.map((ind) => (
                <tr
                  key={ind.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedIndicator(ind)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                        {indicatorTypeConfig[ind.indicator_type].icon}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {indicatorTypeConfig[ind.indicator_type].label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm text-primary-600 dark:text-primary-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {ind.value}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {ind.description}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <RiskBadge level={ind.severity as 'low' | 'medium' | 'high' | 'critical'} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={ind.confidence} size="sm" variant={ind.confidence >= 80 ? 'success' : 'warning'} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{ind.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {ind.occurrence_count.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(ind.last_seen).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Indicator Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Threat Indicator" size="md">
        <div className="space-y-4">
          <Select
            label="Indicator Type"
            options={Object.entries(indicatorTypeConfig).map(([value, { label }]) => ({ value, label }))}
            value={newIndicator.indicator_type}
            onChange={(e) => setNewIndicator({ ...newIndicator, indicator_type: e.target.value as IndicatorType })}
          />
          <Input
            label="Value"
            placeholder={newIndicator.indicator_type === 'domain' ? 'example.com' : 'Enter value...'}
            value={newIndicator.value}
            onChange={(e) => setNewIndicator({ ...newIndicator, value: e.target.value })}
          />
          <TextArea
            label="Description"
            placeholder="Describe this threat indicator..."
            value={newIndicator.description}
            onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
          />
          <Select
            label="Severity"
            options={[
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={newIndicator.severity}
            onChange={(e) => setNewIndicator({ ...newIndicator, severity: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
          />
          <Input
            label="Tags (comma-separated)"
            placeholder="phishing, crypto, financial"
            value={newIndicator.tags}
            onChange={(e) => setNewIndicator({ ...newIndicator, tags: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAddIndicator}>Add Indicator</Button>
          </div>
        </div>
      </Modal>

      {/* Indicator Details */}
      {selectedIndicator && (
        <Modal
          isOpen={!!selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
          title="Indicator Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                {indicatorTypeConfig[selectedIndicator.indicator_type].icon}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedIndicator.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {indicatorTypeConfig[selectedIndicator.indicator_type].label}
                </p>
              </div>
              <div className="ml-auto">
                <RiskBadge level={selectedIndicator.severity as 'low' | 'medium' | 'high' | 'critical'} />
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedIndicator.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Confidence</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedIndicator.confidence}%</p>
                <ProgressBar value={selectedIndicator.confidence} className="mt-2" />
              </div>
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Occurrences</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedIndicator.occurrence_count.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedIndicator.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">First Seen</span>
                <span className="text-slate-900 dark:text-white">{new Date(selectedIndicator.first_seen).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Last Seen</span>
                <span className="text-slate-900 dark:text-white">{new Date(selectedIndicator.last_seen).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Source</span>
                <span className="text-slate-900 dark:text-white">{selectedIndicator.source}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary" icon={<Shield className="w-4 h-4" />}>Add to Blocklist</Button>
              <Button variant="cyber" icon={<Target className="w-4 h-4" />}>Create Investigation</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
