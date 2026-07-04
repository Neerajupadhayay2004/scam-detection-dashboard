import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  Eye,
  Edit,
  Users,
  Globe,
  FileText,
  Activity,
  MessageSquare,
  ArrowRight,
  Target,
  Shield
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StatusBadge, PriorityBadge, Badge } from '../ui/Badge';
import { CircularProgress } from '../ui/Progress';
import type { Investigation, InvestigationStatus, Priority } from '../../types/database';

const statusConfig: Record<InvestigationStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-blue-600 dark:text-blue-400' },
  under_investigation: { label: 'Under Investigation', color: 'text-amber-600 dark:text-amber-400' },
  escalated: { label: 'Escalated', color: 'text-orange-600 dark:text-orange-400' },
  closed: { label: 'Closed', color: 'text-slate-600 dark:text-slate-400' },
  archived: { label: 'Archived', color: 'text-slate-500 dark:text-slate-500' },
};

// Mock data
const mockInvestigations: (Investigation & { profiles_count?: number; pages_count?: number; evidence_count?: number })[] = [
  {
    id: '1',
    case_number: 'INV-2024-0142',
    title: 'Crypto Investment Scam Network',
    description: 'Investigation into a network of social media profiles promoting fraudulent cryptocurrency investment schemes targeting elderly victims.',
    priority: 'critical',
    status: 'under_investigation',
    assigned_to: 'user1',
    created_by: 'user1',
    start_date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
    tags: ['crypto', 'investment', 'social-media'],
    metadata: {},
    profiles_count: 12,
    pages_count: 3,
    evidence_count: 45,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    case_number: 'INV-2024-0141',
    title: 'Brand Impersonation Campaign',
    description: 'Multiple fake websites impersonating major retailers to harvest payment information from online shoppers.',
    priority: 'high',
    status: 'open',
    assigned_to: 'user2',
    created_by: 'user1',
    start_date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    tags: ['phishing', 'brand-impersonation', 'ecommerce'],
    metadata: {},
    profiles_count: 0,
    pages_count: 8,
    evidence_count: 23,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    case_number: 'INV-2024-0140',
    title: 'Romance Scam Operation',
    description: 'Coordinated romance scam operation targeting women over 50 through social media and dating platforms.',
    priority: 'high',
    status: 'escalated',
    assigned_to: 'user1',
    created_by: 'user2',
    start_date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
    tags: ['romance-scam', 'social-media', 'organized'],
    metadata: {},
    profiles_count: 25,
    pages_count: 0,
    evidence_count: 67,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    case_number: 'INV-2024-0139',
    title: 'Tech Support Scam Ring',
    description: 'Fake tech support websites and phone numbers falsely claiming affiliation with Microsoft and Apple.',
    priority: 'medium',
    status: 'under_investigation',
    created_by: 'user1',
    start_date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    tags: ['tech-support', 'phishing', 'elderly-targets'],
    metadata: {},
    profiles_count: 5,
    pages_count: 12,
    evidence_count: 34,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    case_number: 'INV-2024-0138',
    title: 'Social Security Refund Scam',
    description: 'Phone and email scam claiming unclaimed Social Security refunds requiring immediate action.',
    priority: 'medium',
    status: 'closed',
    created_by: 'user2',
    start_date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
    actual_close_date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    tags: ['phone-scam', 'social-security', 'government-impersonation'],
    metadata: {},
    profiles_count: 0,
    pages_count: 0,
    evidence_count: 18,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export function InvestigationManager() {
  const [investigations, setInvestigations] = useState(mockInvestigations);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState<typeof mockInvestigations[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [newInvestigation, setNewInvestigation] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    tags: '',
  });

  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.case_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || inv.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddInvestigation = () => {
    const caseNumber = `INV-2024-${String(investigations.length + 143).padStart(4, '0')}`;
    const investigation = {
      id: String(Date.now()),
      case_number: caseNumber,
      ...newInvestigation,
      status: 'open' as InvestigationStatus,
      tags: newInvestigation.tags.split(',').map(t => t.trim()).filter(Boolean),
      created_by: 'current_user',
      start_date: new Date().toISOString().split('T')[0],
      metadata: {},
      profiles_count: 0,
      pages_count: 0,
      evidence_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInvestigations([investigation, ...investigations]);
    setShowAddModal(false);
    setNewInvestigation({ title: '', description: '', priority: 'medium', tags: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Investigation Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all active investigations</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          New Investigation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = investigations.filter(i => i.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={`card p-4 text-center transition-all ${
                filterStatus === status ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <p className={`text-3xl font-bold ${config.color}`}>{count}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{config.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by case number or title..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'under_investigation', label: 'Under Investigation' },
              { value: 'escalated', label: 'Escalated' },
              { value: 'closed', label: 'Closed' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredInvestigations.length} investigations
          </div>
        </div>
      </div>

      {/* Investigations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Case ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Profiles</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pages</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Evidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Started</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredInvestigations.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedInvestigation(inv);
                    setShowDetails(true);
                  }}
                >
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-primary-600 dark:text-primary-400">{inv.case_number}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{inv.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {inv.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {inv.tags.length > 2 && (
                          <span className="text-xs text-slate-400">+{inv.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={inv.priority as Priority} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      {inv.profiles_count}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <Globe className="w-4 h-4" />
                      {inv.pages_count}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                      {inv.evidence_count}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(inv.start_date).toLocaleDateString()}
                    </span>
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

      {/* Add Investigation Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Investigation" size="lg">
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Investigation title"
            value={newInvestigation.title}
            onChange={(e) => setNewInvestigation({ ...newInvestigation, title: e.target.value })}
          />
          <TextArea
            label="Description"
            placeholder="Describe the investigation scope and objectives..."
            value={newInvestigation.description}
            onChange={(e) => setNewInvestigation({ ...newInvestigation, description: e.target.value })}
          />
          <Select
            label="Priority"
            options={[
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={newInvestigation.priority}
            onChange={(e) => setNewInvestigation({ ...newInvestigation, priority: e.target.value as Priority })}
          />
          <Input
            label="Tags (comma-separated)"
            placeholder="phishing, crypto, social-media"
            value={newInvestigation.tags}
            onChange={(e) => setNewInvestigation({ ...newInvestigation, tags: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAddInvestigation}>Create Investigation</Button>
          </div>
        </div>
      </Modal>

      {/* Investigation Details Modal */}
      {selectedInvestigation && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Investigation Details" size="xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm text-primary-600 dark:text-primary-400">
                    {selectedInvestigation.case_number}
                  </p>
                  <PriorityBadge priority={selectedInvestigation.priority as Priority} />
                  <StatusBadge status={selectedInvestigation.status} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  {selectedInvestigation.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" icon={<Edit className="w-4 h-4" />}>
                  Edit
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedInvestigation.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedInvestigation.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <Users className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedInvestigation.profiles_count}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Profiles</p>
              </div>
              <div className="card p-4 text-center">
                <Globe className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedInvestigation.pages_count}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pages</p>
              </div>
              <div className="card p-4 text-center">
                <FileText className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedInvestigation.evidence_count}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Evidence</p>
              </div>
              <div className="card p-4 text-center">
                <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.floor((Date.now() - new Date(selectedInvestigation.start_date).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Days Open</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Activity Timeline</p>
              <div className="space-y-3 ml-2">
                <div className="timeline-item">
                  <div className="flex items-start gap-3">
                    <Activity className="w-4 h-4 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Investigation Opened</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(selectedInvestigation.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedInvestigation.status !== 'open' && (
                  <div className="timeline-item">
                    <div className="flex items-start gap-3">
                      <Target className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Investigation Started</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Analysis begun on tracked entities
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary" icon={<Users className="w-4 h-4" />}>Add Profile</Button>
              <Button variant="secondary" icon={<Globe className="w-4 h-4" />}>Add Page</Button>
              <Button variant="secondary" icon={<FileText className="w-4 h-4" />}>Add Evidence</Button>
              <Button variant="cyber" icon={<Shield className="w-4 h-4" />}>Generate Report</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
