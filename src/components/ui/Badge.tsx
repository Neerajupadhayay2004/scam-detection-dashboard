import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'cyber';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    cyber: 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'cyber' }> = {
    active: { label: 'Active', variant: 'cyber' },
    open: { label: 'Open', variant: 'primary' },
    under_investigation: { label: 'Under Investigation', variant: 'warning' },
    under_review: { label: 'Under Review', variant: 'warning' },
    escalated: { label: 'Escalated', variant: 'danger' },
    closed: { label: 'Closed', variant: 'default' },
    archived: { label: 'Archived', variant: 'default' },
    suspended: { label: 'Suspended', variant: 'warning' },
    removed: { label: 'Removed', variant: 'danger' },
    taken_down: { label: 'Taken Down', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'default' },
    verified_safe: { label: 'Verified Safe', variant: 'success' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  showScore?: boolean;
  score?: number;
}

export function RiskBadge({ level, showScore = false, score }: RiskBadgeProps) {
  const levelConfig = {
    low: { label: 'Low', variant: 'success' as const, bg: 'bg-emerald-500' },
    medium: { label: 'Medium', variant: 'warning' as const, bg: 'bg-amber-500' },
    high: { label: 'High', variant: 'danger' as const, bg: 'bg-orange-500' },
    critical: { label: 'Critical', variant: 'danger' as const, bg: 'bg-red-500' },
  };

  const config = levelConfig[level];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} dot>
        {config.label}
      </Badge>
      {showScore && score !== undefined && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {score}%
        </span>
      )}
    </div>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { label: 'Low', variant: 'default' as const },
    medium: { label: 'Medium', variant: 'warning' as const },
    high: { label: 'High', variant: 'danger' as const },
    critical: { label: 'Critical', variant: 'danger' as const },
  };

  const config = priorityConfig[priority];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
