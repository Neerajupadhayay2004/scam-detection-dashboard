import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, Shield, Activity, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  pageTitle: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({ pageTitle, showSearch = true, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { profile, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const notifications = [
    { id: 1, title: 'New critical threat detected', message: 'Profile @scammer_xyz flagged', time: '5m ago', read: false },
    { id: 2, title: 'Investigation assigned', message: 'Case INV-2024-0042', time: '1h ago', read: false },
    { id: 3, title: 'Report approved', message: 'Intelligence Report #127', time: '2h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">System Active</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {showSearch && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search profiles, pages, cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500"
              />
            </form>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            { (showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <span className="text-xs text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${
                        !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                  <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyber-accent flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {profile?.full_name || 'Analyst'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {profile?.role || 'analyst'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {profile?.full_name || 'Analyst'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </header>
  );
}
