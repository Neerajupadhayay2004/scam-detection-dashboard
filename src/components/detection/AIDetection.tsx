import React, { useState } from 'react';
import {
  Brain,
  Search,
  AlertTriangle,
  Shield,
  Target,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  TrendingUp,
  Eye,
  MessageSquare,
  Globe,
  Users,
  Link,
  FileWarning,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StatusBadge, Badge } from '../ui/Badge';
import { CircularProgress, RiskMeter, ProgressBar } from '../ui/Progress';
import type { AIDetectionResult } from '../../types/database';

// Mock AI Analysis Function
const analyzeContent = async (content: string, type: 'profile' | 'website' | 'message'): Promise<AIDetectionResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const keywords = {
    scam: ['guaranteed', 'investment', 'crypto', 'winner', 'prize', 'urgent', 'verify', 'account', 'suspended', 'click here', 'act now', 'limited time', 'congratulations', 'free', 'claim', 'prize'],
    phishing: ['login', 'password', 'security', 'verify', 'account', 'update', 'confirm', 'suspended', 'unusual activity'],
    romance: ['military', 'contractor', 'overseas', 'widowed', 'love', 'serious relationship', 'trust', 'help me'],
  };

  const lowerContent = content.toLowerCase();
  const detectedKeywords = [];

  for (const [category, words] of Object.entries(keywords)) {
    words.forEach(word => {
      if (lowerContent.includes(word)) {
        detectedKeywords.push({ category, word });
      }
    });
  }

  const uniqueCategories = [...new Set(detectedKeywords.map(d => d.category))];
  const score = Math.min(95, detectedKeywords.length * 8 + uniqueCategories.length * 15);

  return {
    is_suspicious: score > 30,
    confidence_score: Math.min(98, score + Math.random() * 5),
    risk_score: score,
    threat_level: score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low',
    indicators: [...new Set(detectedKeywords.map(d => d.word))],
    explanation: generateExplanation(detectedKeywords, type),
    recommendations: generateRecommendations(score, uniqueCategories),
  };
};

const generateExplanation = (keywords: { category: string; word: string }[], type: string): string => {
  if (keywords.length === 0) {
    return 'No significant threat indicators detected in the analyzed content. The content appears to be legitimate.';
  }

  const categories = [...new Set(keywords.map(k => k.category))];
  const words = keywords.map(k => k.word);

  return `This ${type} analysis detected ${keywords.length} concerning indicators across ${categories.length} threat categories. Key indicators include: "${words.slice(0, 5).join('", "')}". ${categories.includes('scam') ? 'Financial scam indicators suggest attempts to solicit money or personal financial information.' : ''} ${categories.includes('phishing') ? 'Phishing indicators suggest attempts to steal credentials or personal information.' : ''} ${categories.includes('romance') ? 'Romance scam indicators suggest potential social engineering tactics.' : ''}`;
};

const generateRecommendations = (score: number, categories: string[]): string[] => {
  const recommendations = [];

  if (score >= 50) {
    recommendations.push('Immediately flag and report this content to the platform.');
    recommendations.push('Do not engage with or respond to this content.');
    recommendations.push('Block the source and prevent further communication.');
  } else if (score >= 25) {
    recommendations.push('Exercise caution when interacting with this content.');
    recommendations.push('Verify the identity through official channels.');
  }

  if (categories.includes('phishing')) {
    recommendations.push('Never provide login credentials or personal information.');
    recommendations.push('Contact the official organization through verified channels.');
  }

  if (categories.includes('scam')) {
    recommendations.push('Do not send money or share financial information.');
    recommendations.push('Report to financial authorities if funds were shared.');
  }

  if (categories.includes('romance')) {
    recommendations.push('Be wary of requests for money from online contacts.');
    recommendations.push('Perform reverse image searches on profile photos.');
  }

  if (score < 25) {
    recommendations.push('Continue monitoring for suspicious activity.');
  }

  return recommendations;
};

export function AIDetection() {
  const [contentType, setContentType] = useState<'profile' | 'website' | 'message'>('profile');
  const [inputContent, setInputContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ input: string; result: AIDetectionResult; timestamp: Date }>>([]);

  const handleAnalyze = async () => {
    if (!inputContent.trim()) return;

    setAnalyzing(true);
    try {
      const analysisResult = await analyzeContent(inputContent, contentType);
      setResult(analysisResult);
      setAnalysisHistory(prev => [
        { input: inputContent.substring(0, 100), result: analysisResult, timestamp: new Date() },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary-500" />
            AI-Powered Detection Engine
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced threat detection using machine learning</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30">
          <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Model v2.4.1</span>
        </div>
      </div>

      {/* Main Analysis Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant={contentType === 'profile' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setContentType('profile')}
                icon={<Users className="w-4 h-4" />}
              >
                Profile
              </Button>
              <Button
                variant={contentType === 'website' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setContentType('website')}
                icon={<Globe className="w-4 h-4" />}
              >
                Website
              </Button>
              <Button
                variant={contentType === 'message' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setContentType('message')}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Message
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content to Analyze
              </label>
              <TextArea
                placeholder={
                  contentType === 'profile'
                    ? 'Paste profile bio, posts, or any content from a suspicious profile...'
                    : contentType === 'website'
                    ? 'Paste website URL, content, or HTML...'
                    : 'Paste message content, email text, or chat logs...'
                }
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <Button
              variant="cyber"
              className="w-full"
              icon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              onClick={handleAnalyze}
              disabled={analyzing || !inputContent.trim()}
            >
              {analyzing ? 'Analyzing...' : 'Run Threat Analysis'}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="card p-6">
          {result ? (
            <div className="space-y-6">
              {/* Risk Score Header */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CircularProgress
                    value={result.risk_score}
                    size="lg"
                    variant={result.threat_level === 'critical' ? 'danger' : result.threat_level === 'high' ? 'warning' : 'default'}
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  {result.is_suspicious ? (
                    <AlertTriangle className={`w-5 h-5 ${getRiskColor(result.threat_level)}`} />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                  <span className={`text-lg font-semibold ${getRiskColor(result.threat_level)}`}>
                    {result.is_suspicious ? 'Suspicious Content Detected' : 'Content Appears Safe'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Confidence: {result.confidence_score.toFixed(1)}% | Risk Level: {result.threat_level.toUpperCase()}
                </p>
              </div>

              {/* Risk Meter */}
              <RiskMeter score={result.risk_score} />

              {/* Indicators */}
              {result.indicators.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Detected Indicators ({result.indicators.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.indicators.map((indicator, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 capitalize"
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  AI Explanation
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  {result.explanation}
                </p>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Recommendations
                  </p>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="secondary" icon={<FileWarning className="w-4 h-4" />}>
                  Create Report
                </Button>
                <Button variant="secondary" icon={<Users className="w-4 h-4" />}>
                  Create Investigation
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <Brain className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No Analysis Yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Enter content and click "Run Threat Analysis" to begin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detection Capabilities */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detection Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, title: 'Phishing Detection', accuracy: 96, description: 'Identifies fake login pages and credential harvesting attempts' },
            { icon: Users, title: 'Fake Profiles', accuracy: 94, description: 'Detects impersonation and romance scam indicators' },
            { icon: TrendingUp, title: 'Financial Scams', accuracy: 92, description: 'Recognizes investment fraud and money solicitation' },
            { icon: MessageSquare, title: 'Social Engineering', accuracy: 89, description: 'Identifies manipulation tactics and urgency patterns' },
          ].map((cap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <cap.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{cap.title}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{cap.accuracy}% Accuracy</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cap.description}</p>
              <ProgressBar value={cap.accuracy} variant="success" size="sm" className="mt-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Analyses</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {analysisHistory.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.result.is_suspicious ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    {item.result.is_suspicious ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-md">
                      {item.input.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.timestamp.toLocaleTimeString()} | Risk: {item.result.risk_score}%
                    </p>
                  </div>
                </div>
                <RiskBadge level={item.result.threat_level as 'low' | 'medium' | 'high' | 'critical'} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
