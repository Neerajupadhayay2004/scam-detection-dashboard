import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  Globe,
  Search,
  FileText,
  FolderOpen,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Target,
  Brain,
  Database
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profiles', label: 'Profile Tracker', icon: Users },
  { id: 'pages', label: 'Page Monitor', icon: Globe },
  { id: 'detection', label: 'AI Detection', icon: Brain },
  { id: 'investigations', label: 'Investigations', icon: FolderOpen },
  { id: 'evidence', label: 'Evidence', icon: Database },
  { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
  { id: 'patterns', label: 'Pattern Analysis', icon: Target },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-accent to-primary-500 flex items-center justify-center shadow-glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">ScamGuard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Threat Intelligence</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </button>

          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2`}>
            {!collapsed && <ThemeToggle />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
