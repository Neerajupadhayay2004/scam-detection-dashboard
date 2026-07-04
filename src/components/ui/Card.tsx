import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'cyber';
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-primary-500',
  trend,
  variant = 'default'
}: StatCardProps) {
  const variantStyles = {
    default: 'card',
    primary: 'card bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20',
    success: 'card bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
    warning: 'card bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20',
    danger: 'card bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20',
    cyber: 'card bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-cyber-accent/20',
  };

  const iconBgStyles = {
    default: iconBg,
    primary: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    cyber: 'bg-cyber-accent',
  };

  return (
    <div className={`${variantStyles[variant]} p-6 relative overflow-hidden group hover-lift`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-current" />
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <span className={`flex items-center text-sm font-medium ${
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                trend === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-slate-600 dark:text-slate-400'
              }`}>
                {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`${iconBgStyles[variant]} p-3 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClass = 'card';
  const hoverClass = hover ? 'card-hover cursor-pointer' : '';

  return (
    <div
      className={`${baseClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="font-semibold text-slate-900 dark:text-white">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
