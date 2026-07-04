import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProfileTracker } from './components/profiles/ProfileTracker';
import { PageMonitor } from './components/pages/PageMonitor';
import { AIDetection } from './components/detection/AIDetection';
import { EvidenceCenter } from './components/evidence/EvidenceCenter';
import { InvestigationManager } from './components/investigations/InvestigationManager';
import { ThreatIntelDashboard } from './components/threats/ThreatIntelDashboard';
import { PatternAnalysis } from './components/patterns/PatternAnalysis';
import { ReportCenter } from './components/reports/ReportCenter';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  profiles: 'Profile Tracker',
  pages: 'Page Monitor',
  detection: 'AI Detection Engine',
  evidence: 'Evidence Center',
  investigations: 'Investigations',
  threats: 'Threat Intelligence',
  patterns: 'Pattern Analysis',
  reports: 'Report Center',
  analytics: 'Analytics',
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'profiles':
        return <ProfileTracker />;
      case 'pages':
        return <PageMonitor />;
      case 'detection':
        return <AIDetection />;
      case 'evidence':
        return <EvidenceCenter />;
      case 'investigations':
        return <InvestigationManager />;
      case 'threats':
        return <ThreatIntelDashboard />;
      case 'patterns':
        return <PatternAnalysis />;
      case 'reports':
        return <ReportCenter />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cyber-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-cyber-accent/5 dark:from-primary-900/20 dark:to-cyber-accent/10" />
        <div className="absolute inset-0 cyber-grid-bg opacity-50 dark:opacity-100" />
      </div>

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="ml-64 relative">
        <Header pageTitle={pageTitles[currentPage] || 'Dashboard'} />

        {/* Page Content */}
        <main className="relative">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
