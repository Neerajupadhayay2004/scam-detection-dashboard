import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  ExternalLink,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Video
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StatusBadge, RiskBadge } from '../ui/Badge';
import { CircularProgress } from '../ui/Progress';
import { Card } from '../ui/Card';
import type { ScamProfile, RiskLevel } from '../../types/database';

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  telegram: <MessageCircle className="w-4 h-4" />,
  tiktok: <Video className="w-4 h-4" />,
};

// Mock data
const mockProfiles: ScamProfile[] = [
  {
    id: '1',
    username: 'crypto_investment_pro',
    profile_url: 'https://instagram.com/crypto_investment_pro',
    platform: 'instagram',
    display_name: 'Crypto Investment Pro',
    bio: 'Helping you achieve financial freedom through crypto investments. DM for guaranteed returns!',
    followers_count: 12500,
    following_count: 234,
    posts_count: 89,
    verified_status: false,
    risk_score: 92,
    risk_level: 'critical',
    status: 'active',
    threat_indicators: ['guaranteed_returns', 'financial_keywords', 'new_account'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '2',
    username: 'official_paypal_support',
    profile_url: 'https://twitter.com/official_paypal_support',
    platform: 'twitter',
    display_name: 'PayPal Customer Support',
    bio: 'Official PayPal support account. For account issues, contact us immediately.',
    followers_count: 892,
    following_count: 12,
    posts_count: 3,
    verified_status: false,
    risk_score: 88,
    risk_level: 'critical',
    status: 'active',
    threat_indicators: ['brand_impersonation', 'fake_support', 'urgency_keywords'],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '3',
    username: 'singles_dating_match',
    profile_url: 'https://facebook.com/singles_dating_match',
    platform: 'facebook',
    display_name: 'Sarah Johnson',
    bio: 'Looking for serious relationships. Military contractor working overseas.',
    followers_count: 567,
    following_count: 1234,
    posts_count: 12,
    verified_status: false,
    risk_score: 76,
    risk_level: 'high',
    status: 'under_review',
    threat_indicators: ['romance_scam_indicators', 'military_persona', 'few_posts'],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '4',
    username: 'forex_trading_master',
    profile_url: 'https://telegram.me/forex_trading_master',
    platform: 'telegram',
    display_name: 'FOREX Trading Master',
    bio: 'Professional trader with 10 years experience. Join our premium group for signals!',
    followers_count: 45000,
    following_count: 0,
    posts_count: 523,
    verified_status: false,
    risk_score: 65,
    risk_level: 'high',
    status: 'active',
    threat_indicators: ['trading_signals', 'premium_channel', 'financial_promises'],
    created_at: new Date(Date.now() - 345600000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
  {
    id: '5',
    username: 'support_microsoft_teams',
    profile_url: 'https://linkedin.com/in/support_microsoft_teams',
    platform: 'linkedin',
    display_name: 'Microsoft Teams Support',
    bio: 'Technical support specialist for Microsoft Teams',
    followers_count: 234,
    following_count: 1567,
    posts_count: 2,
    verified_status: false,
    risk_score: 81,
    risk_level: 'critical',
    status: 'suspended',
    threat_indicators: ['brand_impersonation', 'fake_support', 'low_engagement'],
    created_at: new Date(Date.now() - 432000000).toISOString(),
    created_by: 'user1',
    updated_at: new Date().toISOString(),
    metadata: {},
  },
];

export function ProfileTracker() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ScamProfile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [newProfile, setNewProfile] = useState({
    username: '',
    profile_url: '',
    platform: 'instagram',
    display_name: '',
    bio: '',
  });

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || profile.platform === filterPlatform;
    const matchesRisk = filterRisk === 'all' || profile.risk_level === filterRisk;
    return matchesSearch && matchesPlatform && matchesRisk;
  });

  const handleAddProfile = () => {
    const profile: ScamProfile = {
      id: String(Date.now()),
      ...newProfile,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      verified_status: false,
      risk_score: Math.floor(Math.random() * 40) + 40,
      risk_level: 'medium',
      status: 'active',
      threat_indicators: [],
      created_at: new Date().toISOString(),
      created_by: 'current_user',
      updated_at: new Date().toISOString(),
      metadata: {},
    };
    setProfiles([profile, ...profiles]);
    setShowAddModal(false);
    setNewProfile({ username: '', profile_url: '', platform: 'instagram', display_name: '', bio: '' });
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Scam Profile Tracker</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and track suspicious social media profiles</p>
        </div>
        <Button variant="cyber" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Profile
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by username or name..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Platforms' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'telegram', label: 'Telegram' },
              { value: 'tiktok', label: 'TikTok' },
            ]}
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Risk Levels' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredProfiles.length} profiles found
          </div>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className="card p-5 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all cursor-pointer group"
            onClick={() => {
              setSelectedProfile(profile);
              setShowDetails(true);
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {profile.display_name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">@{profile.username}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    {platformIcons[profile.platform] || <Users className="w-4 h-4" />}
                    <span className="capitalize">{profile.platform}</span>
                  </div>
                </div>
              </div>
              <CircularProgress value={profile.risk_score} size="sm" variant={profile.risk_level === 'critical' ? 'danger' : profile.risk_level === 'high' ? 'warning' : 'default'} showValue={false} />
            </div>

            {profile.display_name && (
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{profile.display_name}</p>
            )}

            {profile.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{profile.bio}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>{profile.followers_count.toLocaleString()} followers</span>
              <span>{profile.posts_count} posts</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={profile.status} />
                <RiskBadge level={profile.risk_level} showScore score={profile.risk_score} />
              </div>
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {profile.threat_indicators && profile.threat_indicators.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap gap-1">
                  {(profile.threat_indicators as string[]).slice(0, 3).map((indicator, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    >
                      {indicator.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {(profile.threat_indicators as string[]).length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      +{(profile.threat_indicators as string[]).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Profile Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Track New Profile" size="md">
        <div className="space-y-4">
          <Input
            label="Username"
            placeholder="@username"
            value={newProfile.username}
            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
          />
          <Input
            label="Profile URL"
            placeholder="https://instagram.com/username"
            value={newProfile.profile_url}
            onChange={(e) => setNewProfile({ ...newProfile, profile_url: e.target.value })}
          />
          <Select
            label="Platform"
            options={[
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'telegram', label: 'Telegram' },
              { value: 'tiktok', label: 'TikTok' },
            ]}
            value={newProfile.platform}
            onChange={(e) => setNewProfile({ ...newProfile, platform: e.target.value })}
          />
          <Input
            label="Display Name (Optional)"
            placeholder="Account holder's displayed name"
            value={newProfile.display_name}
            onChange={(e) => setNewProfile({ ...newProfile, display_name: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAddProfile}>Add Profile</Button>
          </div>
        </div>
      </Modal>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Profile Details" size="lg">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                {selectedProfile.display_name?.charAt(0) || selectedProfile.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">@{selectedProfile.username}</h3>
                  {selectedProfile.display_name && (
                    <span className="text-slate-500 dark:text-slate-400">| {selectedProfile.display_name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {platformIcons[selectedProfile.platform]}
                  <span className="capitalize text-sm">{selectedProfile.platform}</span>
                  <StatusBadge status={selectedProfile.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{selectedProfile.followers_count.toLocaleString()} followers</span>
                  <span>{selectedProfile.following_count.toLocaleString()} following</span>
                  <span>{selectedProfile.posts_count} posts</span>
                </div>
              </div>
              <a
                href={selectedProfile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </a>
            </div>

            {/* Risk Analysis */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Risk Score</p>
                <div className="flex items-center gap-4">
                  <CircularProgress value={selectedProfile.risk_score} size="md" />
                  <div>
                    <p className={`text-3xl font-bold ${getRiskColor(selectedProfile.risk_level)}`}>
                      {selectedProfile.risk_score}%
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{selectedProfile.risk_level} Risk</p>
                  </div>
                </div>
              </div>
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Verification Status</p>
                <div className="flex items-center gap-2">
                  <Shield className={`w-8 h-8 ${selectedProfile.verified_status ? 'text-primary-500' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedProfile.verified_status ? 'Verified' : 'Not Verified'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedProfile.verified_status ? 'Platform verified this account' : 'No verification badge detected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedProfile.bio && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  {selectedProfile.bio}
                </p>
              </div>
            )}

            {/* Threat Indicators */}
            {selectedProfile.threat_indicators && (selectedProfile.threat_indicators as string[]).length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detected Threat Indicators</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedProfile.threat_indicators as string[]).map((indicator, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 capitalize"
                    >
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {indicator.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="secondary">Create Investigation</Button>
              <Button variant="secondary">Add Evidence</Button>
              <Button variant="cyber">Run AI Analysis</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
