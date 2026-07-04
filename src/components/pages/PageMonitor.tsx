import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  RefreshCw,
  AlertOctagon,
  Building,
  Link,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StatusBadge, RiskBadge, Badge } from '../ui/Badge';
import { CircularProgress, RiskMeter } from '../ui/Progress';
import type { ScamPage, RiskLevel, PageType } from '../../types/database';

const pageTypeLabels: Record<PageType, string> = {
  phishing: 'Phishing',
  fake_business: 'Fake Business',
  brand_impersonation: 'Brand Impersonation',
  scam_ad: 'Scam Advertisement',
  fraudulent_website: 'Fraudulent Website',
  other: 'Other',
};

// Mock data
const mockPages: ScamPage[] = [
  {
    id: '1',
    url: 'https://paypa1-secure.com/login',
    domain: 'paypa1-secure.com',
    page_type: 'phishing',
    title: 'PayPal - Login',
    description: 'Login to your PayPal account',
    ssl_info: { valid: false, issuer: 'Unknown', expires: '2024-01-01' },
    whois_data: { registrar: 'Unknown', created: '2024-01-15', country: 'Unknown' },
    reputation_score: 12,
    risk_level: 'critical',
    threat_indicators: ['typosquatting', 'login_form', 'brand_impersonation', 'ssl_invalid'],
    first_seen: new Date(Date.now() - 86400000).toISOString(),
    status: 'active',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '2',
    url: 'https://amazan-giftcards.net/promo',
    domain: 'amazan-giftcards.net',
    page_type: 'brand_impersonation',
    title: 'Amazon Gift Card Giveaway',
    description: 'Claim your free Amazon gift card today!',
    ssl_info: { valid: true, issuer: 'Let\'s Encrypt', expires: '2024-06-01' },
    whois_data: { registrar: 'NameCheap', created: '2024-01-20', country: 'US' },
    reputation_score: 8,
    risk_level: 'critical',
    threat_indicators: ['brand_impersonation', 'free_offers', 'data_collection'],
    first_seen: new Date(Date.now() - 172800000).toISOString(),
    status: 'active',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '3',
    url: 'https://crypto-exchange-pro.io/trade',
    domain: 'crypto-exchange-pro.io',
    page_type: 'fraudulent_website',
    title: 'Crypto Exchange Pro - Trade Crypto',
    description: 'Professional cryptocurrency trading platform',
    ssl_info: { valid: true, issuer: 'CloudFlare', expires: '2024-12-01' },
    whois_data: { registrar: 'GoDaddy', created: '2023-12-01', country: 'US' },
    reputation_score: 25,
    risk_level: 'critical',
    threat_indicators: ['financial_fraud', 'deposit_scam', 'fake_testimonials'],
    first_seen: new Date(Date.now() - 259200000).toISOString(),
    status: 'under_review',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '4',
    url: 'https://support-microsoft.online/ticket',
    domain: 'support-microsoft.online',
    page_type: 'phishing',
    title: 'Microsoft Support - Ticket System',
    description: 'Submit your support ticket',
    ssl_info: { valid: false, issuer: 'Self-signed', expires: '2025-01-01' },
    whois_data: { registrar: 'Unknown', created: '2024-02-01', country: 'Unknown' },
    reputation_score: 18,
    risk_level: 'high',
    threat_indicators: ['tech_support_scam', 'brand_impersonation', 'urgency_pressure'],
    first_seen: new Date(Date.now() - 345600000).toISOString(),
    status: 'taken_down',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '5',
    url: 'https://lottery-winner-claim.com/verify',
    domain: 'lottery-winner-claim.com',
    page_type: 'scam_ad',
    title: 'Claim Your Lottery Prize',
    description: 'You have won! Verify your identity to claim.',
    ssl_info: { valid: true, issuer: 'Comodo', expires: '2024-08-01' },
    whois_data: { registrar: 'PDR', created: '2024-01-05', country: 'IN' },
    reputation_score: 5,
    risk_level: 'high',
    threat_indicators: ['lottery_scam', 'identity_theft', 'fee_demand'],
    first_seen: new Date(Date.now() - 432000000).toISOString(),
    status: 'active',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
];

export function PageMonitor() {
  const [pages, setPages] = useState(mockPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ScamPage | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [newPage, setNewPage] = useState({
    url: '',
    page_type: 'phishing' as PageType,
    description: '',
  });

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || page.page_type === filterType;
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddPage = () => {
    const url = new URL(newPage.url);
    const page: ScamPage = {
      id: String(Date.now()),
      url: newPage.url,
      domain: url.hostname,
      page_type: newPage.page_type,
      description: newPage.description,
      ssl_info: { valid: false },
      whois_data: {},
      reputation_score: 0,
      risk_level: 'medium',
      threat_indicators: [],
      first_seen: new Date().toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
      created_by: 'current_user',
      updated_at: new Date().toISOString(),
      metadata: {},
    };
    setPages([page, ...pages]);
    setShowAddModal(false);
    setNewPage({ url: '', page_type: 'phishing', description: '' });
  };

  const domainAge = (whoisData: Record<string, string>) => {
    if (!whoisData.created) return 'Unknown';
    const created = new Date(whoisData.created);
    const now = new Date();
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Scam Page Monitor</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and analyze suspicious websites and phishing pages</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Monitor Page
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {pages.filter(p => p.status === 'active').length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Threats</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {pages.filter(p => p.status === 'taken_down').length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Taken Down</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {pages.filter(p => p.status === 'under_review').length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Under Review</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pages.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Monitored</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by domain or title..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'phishing', label: 'Phishing' },
              { value: 'brand_impersonation', label: 'Brand Impersonation' },
              { value: 'fraudulent_website', label: 'Fraudulent Website' },
              { value: 'scam_ad', label: 'Scam Advertisement' },
              { value: 'fake_business', label: 'Fake Business' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'taken_down', label: 'Taken Down' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
          <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Page Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">SSL</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Days Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredPages.map((page) => {
                const daysActive = Math.floor(
                  (new Date().getTime() - new Date(page.first_seen).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr
                    key={page.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedPage(page);
                      setShowDetails(true);
                    }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{page.domain}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                            {page.title || page.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="default">{pageTypeLabels[page.page_type]}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {(page.ssl_info as { valid: boolean }).valid ? (
                          <>
                            <Lock className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">Valid</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-600 dark:text-red-400">Invalid</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RiskBadge level={page.risk_level} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm ${daysActive > 30 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {daysActive} days
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(page.url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPage(page);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Page Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Monitor New Page" size="md">
        <div className="space-y-4">
          <Input
            label="Page URL"
            placeholder="https://suspicious-site.com"
            value={newPage.url}
            onChange={(e) => setNewPage({ ...newPage, url: e.target.value })}
          />
          <Select
            label="Page Type"
            options={[
              { value: 'phishing', label: 'Phishing' },
              { value: 'brand_impersonation', label: 'Brand Impersonation' },
              { value: 'fraudulent_website', label: 'Fraudulent Website' },
              { value: 'scam_ad', label: 'Scam Advertisement' },
              { value: 'fake_business', label: 'Fake Business' },
              { value: 'other', label: 'Other' },
            ]}
            value={newPage.page_type}
            onChange={(e) => setNewPage({ ...newPage, page_type: e.target.value as PageType })}
          />
          <Input
            label="Description (Optional)"
            placeholder="Brief description of the suspicious activity"
            value={newPage.description}
            onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAddPage}>Start Monitoring</Button>
          </div>
        </div>
      </Modal>

      {/* Page Details Modal */}
      {selectedPage && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Page Analysis" size="xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedPage.domain}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPage.url}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge>{pageTypeLabels[selectedPage.page_type]}</Badge>
                    <StatusBadge status={selectedPage.status} />
                    <RiskBadge level={selectedPage.risk_level} />
                  </div>
                </div>
              </div>
              <a
                href={selectedPage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Page
              </a>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Risk Score */}
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Risk Assessment</p>
                <div className="flex justify-center">
                  <CircularProgress
                    value={100 - selectedPage.reputation_score}
                    size="md"
                    variant={selectedPage.risk_level === 'critical' ? 'danger' : 'warning'}
                  />
                </div>
                <RiskMeter score={100 - selectedPage.reputation_score} />
              </div>

              {/* SSL Info */}
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">SSL Certificate</p>
                <div className="flex items-center gap-3">
                  {(selectedPage.ssl_info as { valid: boolean }).valid ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">Valid SSL</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Expires: {(selectedPage.ssl_info as { expires?: string }).expires || 'N/A'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Unlock className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-red-600 dark:text-red-400">Invalid/No SSL</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">High risk indicator</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Domain Info */}
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Domain Info</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Age</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {domainAge(selectedPage.whois_data as Record<string, string>)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Registrar</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {(selectedPage.whois_data as { registrar?: string }).registrar || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Country</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {(selectedPage.whois_data as { country?: string }).country || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Indicators */}
            {selectedPage.threat_indicators && (selectedPage.threat_indicators as string[]).length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detected Threat Indicators</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedPage.threat_indicators as string[]).map((indicator, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 capitalize flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {indicator.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary">Take Down Request</Button>
              <Button variant="secondary">Create Investigation</Button>
              <Button variant="cyber">Deep Analysis</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
