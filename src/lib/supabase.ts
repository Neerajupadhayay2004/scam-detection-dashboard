import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<{
  full_name: string;
  avatar_url: string;
  department: string;
}>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Investigations
export async function getInvestigations(options?: {
  status?: string;
  priority?: string;
  limit?: number;
}) {
  let query = supabase
    .from('investigations')
    .select('*, assigned_profile:profiles!investigations_assigned_to_fkey(full_name), created_profile:profiles!investigations_created_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.priority) query = query.eq('priority', options.priority);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getInvestigation(id: string) {
  const { data, error } = await supabase
    .from('investigations')
    .select('*, assigned_profile:profiles!investigations_assigned_to_fkey(*), created_profile:profiles!investigations_created_by_fkey(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createInvestigation(investigation: {
  title: string;
  description?: string;
  priority?: string;
  assigned_to?: string;
  tags?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('investigations')
    .insert({
      ...investigation,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvestigation(id: string, updates: Partial<{
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  tags: string[];
}>) {
  const { data, error } = await supabase
    .from('investigations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Scam Profiles
export async function getScamProfiles(options?: {
  investigation_id?: string;
  platform?: string;
  risk_level?: string;
  status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('scam_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.investigation_id) query = query.eq('investigation_id', options.investigation_id);
  if (options?.platform) query = query.eq('platform', options.platform);
  if (options?.risk_level) query = query.eq('risk_level', options.risk_level);
  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createScamProfile(profile: {
  username: string;
  profile_url: string;
  platform: string;
  display_name?: string;
  bio?: string;
  investigation_id?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('scam_profiles')
    .insert({
      ...profile,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateScamProfile(id: string, updates: Partial<{
  username: string;
  display_name: string;
  bio: string;
  risk_score: number;
  risk_level: string;
  status: string;
  notes: string;
}>) {
  const { data, error } = await supabase
    .from('scam_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Scam Pages
export async function getScamPages(options?: {
  investigation_id?: string;
  page_type?: string;
  risk_level?: string;
  status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('scam_pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.investigation_id) query = query.eq('investigation_id', options.investigation_id);
  if (options?.page_type) query = query.eq('page_type', options.page_type);
  if (options?.risk_level) query = query.eq('risk_level', options.risk_level);
  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createScamPage(page: {
  url: string;
  domain: string;
  page_type: string;
  title?: string;
  description?: string;
  investigation_id?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('scam_pages')
    .insert({
      ...page,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Evidence
export async function getEvidence(options?: {
  investigation_id?: string;
  evidence_type?: string;
  verification_status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('evidence')
    .select('*, created_profile:profiles!evidence_created_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (options?.investigation_id) query = query.eq('investigation_id', options.investigation_id);
  if (options?.evidence_type) query = query.eq('evidence_type', options.evidence_type);
  if (options?.verification_status) query = query.eq('verification_status', options.verification_status);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createEvidence(evidence: {
  investigation_id?: string;
  scam_profile_id?: string;
  scam_page_id?: string;
  evidence_type: string;
  title: string;
  description?: string;
  file_url?: string;
  content?: string;
  tags?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('evidence')
    .insert({
      ...evidence,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Threat Indicators
export async function getThreatIndicators(options?: {
  indicator_type?: string;
  severity?: string;
  is_active?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('threat_indicators')
    .select('*')
    .order('last_seen', { ascending: false });

  if (options?.indicator_type) query = query.eq('indicator_type', options.indicator_type);
  if (options?.severity) query = query.eq('severity', options.severity);
  if (options?.is_active !== undefined) query = query.eq('is_active', options.is_active);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createThreatIndicator(indicator: {
  indicator_type: string;
  value: string;
  description?: string;
  severity?: string;
  source?: string;
  tags?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('threat_indicators')
    .insert({
      ...indicator,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reports
export async function getReports(options?: {
  investigation_id?: string;
  report_type?: string;
  status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('reports')
    .select('*, author_profile:profiles!reports_author_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (options?.investigation_id) query = query.eq('investigation_id', options.investigation_id);
  if (options?.report_type) query = query.eq('report_type', options.report_type);
  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createReport(report: {
  investigation_id?: string;
  report_type: string;
  title: string;
  content: object;
  summary?: string;
  tags?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...report,
      author: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Activity Timeline
export async function getActivityTimeline(investigationId: string) {
  const { data, error } = await supabase
    .from('activity_timeline')
    .select('*')
    .eq('investigation_id', investigationId)
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Audit Logs
export async function getAuditLogs(options?: {
  user_id?: string;
  action?: string;
  entity_type?: string;
  limit?: number;
}) {
  let query = supabase
    .from('audit_logs')
    .select('*, user_profile:profiles!audit_logs_user_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (options?.user_id) query = query.eq('user_id', options.user_id);
  if (options?.action) query = query.eq('action', options.action);
  if (options?.entity_type) query = query.eq('entity_type', options.entity_type);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Risk Assessments
export async function getRiskAssessments(options?: {
  entity_type?: string;
  entity_id?: string;
  limit?: number;
}) {
  let query = supabase
    .from('risk_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.entity_type) query = query.eq('entity_type', options.entity_type);
  if (options?.entity_id) query = query.eq('entity_id', options.entity_id);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Scam Patterns
export async function getScamPatterns(options?: {
  pattern_type?: string;
  is_active?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('scam_patterns')
    .select('*')
    .order('last_detected', { ascending: false });

  if (options?.pattern_type) query = query.eq('pattern_type', options.pattern_type);
  if (options?.is_active !== undefined) query = query.eq('is_active', options.is_active);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Dashboard Statistics
export async function getDashboardStats() {
  const [
    { count: totalInvestigations },
    { count: activeInvestigations },
    { count: scamProfiles },
    { count: scamPages },
    { count: criticalThreats },
    { count: evidence }
  ] = await Promise.all([
    supabase.from('investigations').select('*', { count: 'exact', head: true }),
    supabase.from('investigations').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('scam_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('scam_pages').select('*', { count: 'exact', head: true }),
    supabase.from('scam_profiles').select('*', { count: 'exact', head: true }).eq('risk_level', 'critical'),
    supabase.from('evidence').select('*', { count: 'exact', head: true }),
  ]);

  return {
    total_investigations: totalInvestigations || 0,
    active_investigations: activeInvestigations || 0,
    scam_profiles_tracked: scamProfiles || 0,
    scam_pages_monitored: scamPages || 0,
    critical_threats: criticalThreats || 0,
    high_risk_entities: 0,
    open_cases: activeInvestigations || 0,
    evidence_items: evidence || 0,
  };
}
