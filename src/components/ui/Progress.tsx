import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    default: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    cyber: 'bg-gradient-to-r from-cyber-accent to-primary-500',
  };

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getVariantFromValue = (val: number): typeof variant => {
    if (val >= 80) return 'danger';
    if (val >= 60) return 'warning';
    if (val >= 40) return 'default';
    return 'success';
  };

  const effectiveVariant = variant === 'default' ? getVariantFromValue(percentage) : variant;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-slate-900 dark:text-white font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeStyles[size]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`${sizeStyles[size]} ${variantStyles[effectiveVariant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'cyber';
  showValue?: boolean;
  label?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  variant = 'default',
  showValue = true,
  label,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeConfig = {
    sm: { dimension: 48, fontSize: 'text-xs' },
    md: { dimension: 80, fontSize: 'text-sm' },
    lg: { dimension: 120, fontSize: 'text-base' },
  };

  const { dimension, fontSize } = sizeConfig[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantStyles = {
    default: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    cyber: '#00d4ff',
  };

  const getVariantFromValue = (val: number): typeof variant => {
    if (val >= 80) return 'danger';
    if (val >= 60) return 'warning';
    if (val >= 40) return 'default';
    return 'success';
  };

  const effectiveVariant = variant === 'default' ? getVariantFromValue(percentage) : variant;
  const color = variantStyles[effectiveVariant];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dimension} height={dimension} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-bold ${fontSize} text-slate-900 dark:text-white`}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface RiskMeterProps {
  score: number;
  showLabel?: boolean;
}

export function RiskMeter({ score, showLabel = true }: RiskMeterProps) {
  const getRiskInfo = (s: number) => {
    if (s >= 80) return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' };
    if (s >= 60) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' };
    if (s >= 40) return { level: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' };
    return { level: 'Low', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' };
  };

  const risk = getRiskInfo(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <span className={`text-sm font-medium ${risk.textColor}`}>{risk.level} Risk</span>
        )}
        <span className="text-sm font-bold text-slate-900 dark:text-white">{score}%</span>
      </div>
      <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${risk.color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
