import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Brain, 
  BookOpen, 
  TestTube, 
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  Star,
  Calendar,
  Calculator,
  Target,
  Zap,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['trading', 'analysis']);
  const { isDark, toggleTheme } = useTheme();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuSections = [
    {
      id: 'trading',
      title: 'Trading',
      icon: TrendingUp,
      items: [
        { id: 'live-market', label: 'Live Market', icon: Activity, badge: 'LIVE' },
        { id: 'my-trades', label: 'My Trades', icon: BarChart3 },
        { id: 'options-chain', label: 'Options Chain', icon: Target },
        { id: 'watchlist', label: 'Watchlist', icon: Star }
      ]
    },
    {
      id: 'analysis',
      title: 'Analysis & AI',
      icon: Brain,
      items: [
        { id: 'strategies', label: 'AI Strategies', icon: Brain, badge: 'AI' },
        { id: 'smart-alerts', label: 'Smart Alerts', icon: Bell },
        { id: 'backtest', label: 'Backtesting', icon: TestTube },
        { id: 'sentiment', label: 'Market Sentiment', icon: Eye }
      ]
    },
    {
      id: 'tools',
      title: 'Tools & Calculators',
      icon: Calculator,
      items: [
        { id: 'journal', label: 'Trade Journal', icon: BookOpen },
        { id: 'calculator', label: 'Options Calculator', icon: Calculator },
        { id: 'calendar', label: 'Expiry Calendar', icon: Calendar },
        { id: 'risk-manager', label: 'Risk Manager', icon: Zap }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 z-50 flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">NSE Trader</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pro Analytics</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuSections.map(section => (
            <div key={section.id} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <section.icon size={14} />
                    {section.title}
                  </span>
                  {expandedSections.includes(section.id) ? 
                    <ChevronDown size={14} /> : 
                    <ChevronRight size={14} />
                  }
                </button>
              )}
              
              {(isCollapsed || expandedSections.includes(section.id)) && (
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon size={20} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left font-medium">{item.label}</span>
                            {item.badge && (
                              <span className={`
                                px-2 py-1 text-xs font-bold rounded-full
                                ${item.badge === 'LIVE' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                }
                              `}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onTabChange('settings')}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${isCollapsed ? 'justify-center' : ''}
              ${activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-800' : ''}
            `}
          >
            <Settings size={20} />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </div>
    </>
  );
}