import React, { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  Filter,
  Upload,
  Image,
  FileText,
  Link,
  MessageSquare,
  Video,
  File,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Trash2,
  Shield,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge, StatusBadge } from '../ui/Badge';
import type { Evidence, EvidenceType, VerificationStatus } from '../../types/database';

const evidenceTypeIcons: Record<EvidenceType, React.ReactNode> = {
  screenshot: <Image className="w-4 h-4" />,
  url: <Link className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  note: <MessageSquare className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  log_file: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  other: <File className="w-4 h-4" />,
};

const verificationStatusConfig: Record<VerificationStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pending Review', icon: <Clock className="w-4 h-4" />, color: 'text-amber-600 dark:text-amber-400' },
  verified: { label: 'Verified', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400' },
  disputed: { label: 'Disputed', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-orange-600 dark:text-orange-400' },
  rejected: { label: 'Rejected', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 dark:text-red-400' },
};

// Mock data
const mockEvidence: Evidence[] = [
  {
    id: '1',
    evidence_type: 'screenshot',
    title: 'Profile Bio Screenshot',
    description: 'Screenshot showing suspicious bio claiming guaranteed returns',
    file_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    tags: ['bio', 'crypto', 'guaranteed-returns'],
    verification_status: 'verified',
    chain_of_custody: [{ user: 'Admin', action: 'Collected', timestamp: '2024-01-15T10:30:00Z' }],
    metadata: { fileSize: '245KB', fileType: 'PNG' },
    created_by: 'user1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    evidence_type: 'url',
    title: 'Phishing Domain URL',
    description: 'Domain identified as typosquatting PayPal',
    content: 'https://paypa1-secure.com/login',
    tags: ['phishing', 'typosquatting', 'paypal'],
    verification_status: 'verified',
    chain_of_custody: [{ user: 'Analyst', action: 'Collected', timestamp: '2024-01-14T14:20:00Z' }],
    metadata: {},
    created_by: 'user1',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    evidence_type: 'document',
    title: 'WHOIS Report',
    description: 'Domain registration information showing suspicious details',
    file_url: '/documents/whois_report.pdf',
    tags: ['whois', 'domain', 'registration'],
    verification_status: 'pending',
    chain_of_custody: [{ user: 'Analyst', action: 'Uploaded', timestamp: '2024-01-13T09:15:00Z' }],
    metadata: { fileSize: '1.2MB', fileType: 'PDF' },
    created_by: 'user1',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    evidence_type: 'note',
    title: 'Investigator Notes',
    description: 'Notes on communication patterns observed in suspected romance scam account',
    content: 'Subject uses military contractor persona, claims to be deployed overseas. Requests for wire transfers start after 2 weeks of building trust. Multiple victims identified with similar MO.',
    tags: ['romance-scam', 'military', 'wire-transfer'],
    verification_status: 'verified',
    chain_of_custody: [{ user: 'Detective', action: 'Created', timestamp: '2024-01-12T16:45:00Z' }],
    metadata: {},
    created_by: 'user1',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    evidence_type: 'image',
    title: 'Profile Photo Analysis',
    description: 'Reverse image search shows photo stolen from legitimate Instagram account',
    file_url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
    tags: ['stolen-photo', 'identity-theft', 'catfish'],
    verification_status: 'disputed',
    chain_of_custody: [{ user: 'Analyst', action: 'Collected', timestamp: '2024-01-11T11:30:00Z' }],
    metadata: { fileSize: '458KB', fileType: 'JPEG' },
    created_by: 'user1',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function EvidenceCenter() {
  const [evidence, setEvidence] = useState(mockEvidence);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [newEvidence, setNewEvidence] = useState({
    evidence_type: 'screenshot' as EvidenceType,
    title: '',
    description: '',
    content: '',
    tags: '',
  });

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.evidence_type === filterType;
    const matchesStatus = filterStatus === 'all' || item.verification_status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddEvidence = () => {
    const item: Evidence = {
      id: String(Date.now()),
      evidence_type: newEvidence.evidence_type,
      title: newEvidence.title,
      description: newEvidence.description,
      content: newEvidence.content,
      tags: newEvidence.tags.split(',').map(t => t.trim()).filter(Boolean),
      verification_status: 'pending',
      chain_of_custody: [],
      metadata: {},
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEvidence([item, ...evidence]);
    setShowAddModal(false);
    setNewEvidence({ evidence_type: 'screenshot', title: '', description: '', content: '', tags: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Evidence Collection Center</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage investigation evidence with chain of custody</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Evidence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{evidence.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Items</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {evidence.filter(e => e.verification_status === 'verified').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Verified</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {evidence.filter(e => e.verification_status === 'pending').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {evidence.filter(e => e.verification_status === 'disputed' || e.verification_status === 'rejected').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search evidence..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'screenshot', label: 'Screenshots' },
              { value: 'url', label: 'URLs' },
              { value: 'document', label: 'Documents' },
              { value: 'image', label: 'Images' },
              { value: 'note', label: 'Notes' },
              { value: 'video', label: 'Videos' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'verified', label: 'Verified' },
              { value: 'disputed', label: 'Disputed' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item) => {
          const statusConfig = verificationStatusConfig[item.verification_status];
          return (
            <div
              key={item.id}
              className="card overflow-hidden hover:border-primary-500/50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedEvidence(item);
                setShowDetails(true);
              }}
            >
              {/* Evidence Preview */}
              {item.file_url && (item.evidence_type === 'screenshot' || item.evidence_type === 'image') && (
                <div className="h-32 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {evidenceTypeIcons[item.evidence_type]}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                      {item.evidence_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
                    {statusConfig.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{item.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {[item.verification_status]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Evidence Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Evidence" size="lg">
        <div className="space-y-4">
          <Select
            label="Evidence Type"
            options={[
              { value: 'screenshot', label: 'Screenshot' },
              { value: 'url', label: 'URL' },
              { value: 'document', label: 'Document' },
              { value: 'image', label: 'Image' },
              { value: 'note', label: 'Note' },
              { value: 'video', label: 'Video' },
              { value: 'other', label: 'Other' },
            ]}
            value={newEvidence.evidence_type}
            onChange={(e) => setNewEvidence({ ...newEvidence, evidence_type: e.target.value as EvidenceType })}
          />
          <Input
            label="Title"
            placeholder="Evidence title"
            value={newEvidence.title}
            onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
          />
          <TextArea
            label="Description"
            placeholder="Describe this evidence..."
            value={newEvidence.description}
            onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
          />
          {(newEvidence.evidence_type === 'url' || newEvidence.evidence_type === 'note') && (
            <TextArea
              label="Content"
              placeholder={newEvidence.evidence_type === 'url' ? 'Enter URL...' : 'Enter notes...'}
              value={newEvidence.content}
              onChange={(e) => setNewEvidence({ ...newEvidence, content: e.target.value })}
            />
          )}
          <Input
            label="Tags (comma-separated)"
            placeholder="phishing, suspicious, investigation"
            value={newEvidence.tags}
            onChange={(e) => setNewEvidence({ ...newEvidence, tags: e.target.value })}
          />
          {(newEvidence.evidence_type === 'screenshot' || newEvidence.evidence_type === 'document' || newEvidence.evidence_type === 'image' || newEvidence.evidence_type === 'video') && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Drag and drop files, or click to browse</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Max file size: 50MB</p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAddEvidence}>Add Evidence</Button>
          </div>
        </div>
      </Modal>

      {/* Evidence Details Modal */}
      {selectedEvidence && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Evidence Details" size="lg">
          <div className="space-y-6">
            {/* Preview */}
            {selectedEvidence.file_url && (selectedEvidence.evidence_type === 'screenshot' || selectedEvidence.evidence_type === 'image') && (
              <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img src={selectedEvidence.file_url} alt={selectedEvidence.title} className="w-full" />
              </div>
            )}

            {/* Type & Status */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                {evidenceTypeIcons[selectedEvidence.evidence_type]}
              </div>
              <div>
                <Badge variant="default">{selectedEvidence.evidence_type.replace('_', ' ')}</Badge>
              </div>
              <div className={`flex items-center gap-2 ${verificationStatusConfig[selectedEvidence.verification_status].color}`}>
                {verificationStatusConfig[selectedEvidence.verification_status].icon}
                <span className="text-sm font-medium">
                  {verificationStatusConfig[selectedEvidence.verification_status].label}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedEvidence.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedEvidence.description}</p>
            </div>

            {/* Content */}
            {selectedEvidence.content && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                  {selectedEvidence.content}
                </p>
              </div>
            )}

            {/* Tags */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedEvidence.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Chain of Custody */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Chain of Custody
              </p>
              <div className="space-y-2">
                {(selectedEvidence.chain_of_custody as Array<{ user: string; action: string; timestamp: string }>).map((entry, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.action}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {entry.user}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary" icon={<CheckCircle className="w-4 h-4" />}>Verify</Button>
              <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Download</Button>
              <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
