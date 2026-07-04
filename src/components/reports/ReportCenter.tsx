import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Shield,
  Users,
  Globe,
  TrendingUp,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, TextArea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge, StatusBadge } from '../ui/Badge';
import type { Report, ReportType } from '../../types/database';

const reportTypeConfig: Record<ReportType, { icon: React.ReactNode; label: string }> = {
  intelligence: { icon: <Shield className="w-4 h-4" />, label: 'Intelligence Report' },
  investigation: { icon: <Target className="w-4 h-4" />, label: 'Investigation Report' },
  executive_summary: { icon: <BarChart3 className="w-4 h-4" />, label: 'Executive Summary' },
  risk_assessment: { icon: <AlertTriangle className="w-4 h-4" />, label: 'Risk Assessment' },
  pattern_analysis: { icon: <TrendingUp className="w-4 h-4" />, label: 'Pattern Analysis' },
};

// Mock data
const mockReports: (Report & { author_name?: string })[] = [
  {
    id: '1',
    report_type: 'intelligence',
    title: 'Q1 2024 Threat Intelligence Report',
    summary: 'Comprehensive analysis of emerging scam trends and threat actor methodologies observed in Q1 2024.',
    status: 'published',
    version: 2,
    tags: ['quarterly', 'threat-intelligence', 'trends'],
    content: {},
    author: 'user1',
    author_name: 'Sarah Johnson',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '2',
    report_type: 'investigation',
    title: 'INV-2024-0142 Case Summary',
    summary: 'Detailed investigation report for the Crypto Investment Scam Network case including profiles, evidence, and recommended actions.',
    status: 'approved',
    version: 1,
    tags: ['investigation', 'crypto', 'network'],
    content: {},
    author: 'user2',
    author_name: 'Michael Chen',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '3',
    report_type: 'executive_summary',
    title: 'Weekly Scam Activity Overview',
    summary: 'Executive summary of scam activity detected and mitigated during the past week.',
    status: 'published',
    version: 1,
    tags: ['weekly', 'executive', 'summary'],
    content: {},
    author: 'user1',
    author_name: 'Sarah Johnson',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '4',
    report_type: 'pattern_analysis',
    title: 'Brand Impersonation Pattern Analysis',
    summary: 'Analysis of common patterns across brand impersonation scams targeting financial institutions.',
    status: 'review',
    version: 1,
    tags: ['pattern-analysis', 'brand-impersonation', 'financial'],
    content: {},
    author: 'user3',
    author_name: 'Emily Davis',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '5',
    report_type: 'risk_assessment',
    title: 'Enterprise Risk Assessment - Q1 2024',
    summary: 'Quarterly enterprise risk assessment for organizational exposure to scam-related threats.',
    status: 'draft',
    version: 1,
    tags: ['risk', 'quarterly', 'enterprise'],
    content: {},
    author: 'user2',
    author_name: 'Michael Chen',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
  },
];

export function ReportCenter() {
  const [reports, setReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const [newReport, setNewReport] = useState({
    report_type: 'intelligence' as ReportType,
    title: '',
    summary: '',
    tags: '',
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.report_type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateReport = () => {
    const report = {
      id: String(Date.now()),
      ...newReport,
      status: 'draft',
      version: 1,
      tags: newReport.tags.split(',').map(t => t.trim()).filter(Boolean),
      content: {},
      author: 'current_user',
      author_name: 'Current User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    };
    setReports([report, ...reports]);
    setShowCreateModal(false);
    setNewReport({ report_type: 'intelligence', title: '', summary: '', tags: '' });
  };

  const statusColors: Record<string, string> = {
    draft: 'text-slate-500 dark:text-slate-400',
    review: 'text-amber-600 dark:text-amber-400',
    approved: 'text-primary-600 dark:text-primary-400',
    published: 'text-emerald-600 dark:text-emerald-400',
    archived: 'text-slate-400 dark:text-slate-500',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    review: 'In Review',
    approved: 'Approved',
    published: 'Published',
    archived: 'Archived',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Report Center</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and manage intelligence reports</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Create Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusLabels).map(([status, label]) => {
          const count = reports.filter(r => r.status === status).length;
          return (
            <div
              key={status}
              className={`card p-4 text-center cursor-pointer transition-all ${
                filterStatus === status ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
            >
              <p className={`text-3xl font-bold ${statusColors[status]}`}>{count}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search reports..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'intelligence', label: 'Intelligence' },
              { value: 'investigation', label: 'Investigation' },
              { value: 'executive_summary', label: 'Executive Summary' },
              { value: 'risk_assessment', label: 'Risk Assessment' },
              { value: 'pattern_analysis', label: 'Pattern Analysis' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="card p-5 hover:border-primary-500/50 transition-colors cursor-pointer group"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  {reportTypeConfig[report.report_type].icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {reportTypeConfig[report.report_type].label}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-medium ${statusColors[report.status]}`}>
                      {statusLabels[report.status]}
                    </span>
                    <span className="text-xs text-slate-400">v{report.version}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} onClick={(e) => e.stopPropagation()}>
              </Button>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{report.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{report.summary}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {report.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{report.author_name}</span>
              <span>{new Date(report.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Report" size="lg">
        <div className="space-y-4">
          <Select
            label="Report Type"
            options={Object.entries(reportTypeConfig).map(([value, { label }]) => ({ value, label }))}
            value={newReport.report_type}
            onChange={(e) => setNewReport({ ...newReport, report_type: e.target.value as ReportType })}
          />
          <Input
            label="Title"
            placeholder="Report title"
            value={newReport.title}
            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
          />
          <TextArea
            label="Summary"
            placeholder="Brief summary of the report..."
            value={newReport.summary}
            onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
          />
          <Input
            label="Tags (comma-separated)"
            placeholder="tag1, tag2, tag3"
            value={newReport.tags}
            onChange={(e) => setNewReport({ ...newReport, tags: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleCreateReport}>Create Report</Button>
          </div>
        </div>
      </Modal>

      {/* Report Details */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Report Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                {reportTypeConfig[selectedReport.report_type].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedReport.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <Badge>{reportTypeConfig[selectedReport.report_type].label}</Badge>
                  <span className={`text-sm font-medium ${statusColors[selectedReport.status]}`}>
                    {statusLabels[selectedReport.status]}
                  </span>
                  <span className="text-xs text-slate-400">Version {selectedReport.version}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedReport.summary}</p>

            <div className="flex flex-wrap gap-2">
              {selectedReport.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Author</p>
                <p className="font-medium text-slate-900 dark:text-white">{selectedReport.author_name}</p>
              </div>
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date(selectedReport.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>Edit</Button>
              <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Download PDF</Button>
              <Button variant="cyber" icon={<Eye className="w-4 h-4" />}>View Full Report</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
