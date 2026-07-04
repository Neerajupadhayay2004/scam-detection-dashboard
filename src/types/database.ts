// Database types matching Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type InvestigationStatus = 'open' | 'under_investigation' | 'escalated' | 'closed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type EntityType = 'profile' | 'page' | 'investigation';
export type EvidenceType = 'screenshot' | 'url' | 'document' | 'note' | 'image' | 'log_file' | 'video' | 'other';
export type VerificationStatus = 'pending' | 'verified' | 'disputed' | 'rejected';
export type PageType = 'phishing' | 'fake_business' | 'brand_impersonation' | 'scam_ad' | 'fraudulent_website' | 'other';
export type PlatformType = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'telegram' | 'whatsapp' | 'tiktok' | 'youtube' | 'other';
export type UserType = 'admin' | 'senior_analyst' | 'analyst' | 'viewer';
export type ReportType = 'intelligence' | 'investigation' | 'executive_summary' | 'risk_assessment' | 'pattern_analysis';
export type ReportStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type IndicatorType = 'domain' | 'ip' | 'email' | 'phone' | 'keyword' | 'url_pattern' | 'hash' | 'behavior';
export type PatternType = 'keyword' | 'domain' | 'behavior' | 'visual' | 'network';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserType;
  department?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Investigation {
  id: string;
  case_number: string;
  title: string;
  description?: string;
  priority: Priority;
  status: InvestigationStatus;
  assigned_to?: string;
  created_by: string;
  start_date: string;
  target_close_date?: string;
  actual_close_date?: string;
  tags: string[];
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface ScamProfile {
  id: string;
  investigation_id?: string;
  username: string;
  profile_url: string;
  platform: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  verified_status: boolean;
  account_created_date?: string;
  last_activity?: string;
  risk_score: number;
  risk_level: RiskLevel;
  threat_indicators: Json;
  status: 'active' | 'suspended' | 'removed' | 'under_review';
  notes?: string;
  metadata: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ScamPage {
  id: string;
  investigation_id?: string;
  url: string;
  domain: string;
  page_type: PageType;
  title?: string;
  description?: string;
  screenshot_url?: string;
  ssl_info: Json;
  whois_data: Json;
  reputation_score: number;
  risk_level: RiskLevel;
  threat_indicators: Json;
  first_seen: string;
  last_checked?: string;
  status: 'active' | 'taken_down' | 'inactive' | 'under_review';
  notes?: string;
  metadata: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: string;
  investigation_id?: string;
  scam_profile_id?: string;
  scam_page_id?: string;
  evidence_type: EvidenceType;
  title: string;
  description?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  content?: string;
  tags: string[];
  verification_status: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
  chain_of_custody: Json;
  metadata: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ThreatIndicator {
  id: string;
  indicator_type: IndicatorType;
  value: string;
  description?: string;
  severity: RiskLevel;
  confidence: number;
  source?: string;
  first_seen: string;
  last_seen: string;
  occurrence_count: number;
  related_investigations: string[];
  tags: string[];
  metadata: Json;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  overall_score: number;
  risk_level: RiskLevel;
  confidence_score: number;
  indicators: Json;
  ai_explanation?: string;
  recommendations: Json;
  model_version: string;
  assessed_by?: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  investigation_id?: string;
  report_type: ReportType;
  title: string;
  content: Json;
  summary?: string;
  author: string;
  status: ReportStatus;
  approved_by?: string;
  approved_at?: string;
  version: number;
  tags: string[];
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  old_values?: Json;
  new_values?: Json;
  ip_address?: string;
  user_agent?: string;
  metadata: Json;
  created_at: string;
}

export interface ActivityTimeline {
  id: string;
  investigation_id?: string;
  scam_profile_id?: string;
  scam_page_id?: string;
  activity_type: string;
  description?: string;
  actor?: string;
  metadata: Json;
  occurred_at: string;
  created_at: string;
}

export interface ScamPattern {
  id: string;
  pattern_name: string;
  pattern_type: PatternType;
  description?: string;
  pattern_data: Json;
  confidence_score: number;
  occurrence_count: number;
  related_indicators: string[];
  first_detected: string;
  last_detected: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  total_investigations: number;
  active_investigations: number;
  scam_profiles_tracked: number;
  scam_pages_monitored: number;
  critical_threats: number;
  high_risk_entities: number;
  open_cases: number;
  evidence_items: number;
}

export interface ThreatDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface GeographicRisk {
  country: string;
  count: number;
  risk_level: RiskLevel;
}

// AI Detection Results
export interface AIDetectionResult {
  is_suspicious: boolean;
  confidence_score: number;
  risk_score: number;
  threat_level: RiskLevel;
  indicators: string[];
  explanation: string;
  recommendations: string[];
}
