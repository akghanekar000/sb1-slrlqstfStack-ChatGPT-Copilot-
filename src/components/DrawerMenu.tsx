import React, { useEffect, useRef } from 'react';
import { 
  X, 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Brain, 
  BookOpen, 
  TestTube, 
  Activity,
  Star,
  Calendar,
  Calculator,
  Target,
  Zap,
  Eye,
  Settings,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DrawerMenu({ isOpen, onClose, activeTab, onTabChange }: DrawerMenuProps) {
  const { isDark, toggleTheme } = useTheme();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  // Handle touch events to prevent propagation
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    // Allow scrolling within the drawer content
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const height = target.clientHeight;
    
    // Prevent overscroll
    if (scrollTop === 0 && e.touches[0].clientY > e.touches[0].clientY) {
      e.preventDefault();
    }
    if (scrollTop + height >= scrollHeight && e.touches[0].clientY < e.touches[0].clientY) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Handle tab change and close drawer
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const menuSections = [
    {
      title: 'Trading',
      items: [
        { id: 'live-market', label: 'Live Market', icon: Activity, badge: 'LIVE' },
        { id: 'my-trades', label: 'My Trades', icon: BarChart3 },
        { id: 'options-chain', label: 'Options Chain', icon: Target },
        { id: 'watchlist', label: 'Watchlist', icon: Star }
      ]
    },
    {
      title: 'Analysis & AI',
      items: [
        { id: 'strategies', label: 'AI Strategies', icon: Brain, badge: 'AI' },
        { id: 'smart-alerts', label: 'Smart Alerts', icon: Bell },
        { id: 'backtest', label: 'Backtesting', icon: TestTube },
        { id: 'sentiment', label: 'Market Sentiment', icon: Eye }
      ]
    },
    {
      title: 'Time & Risk Management',
      items: [
        { id: 'time-manager', label: 'Time Manager', icon: Clock, badge: 'NEW' },
        { id: 'journal', label: 'Trade Journal', icon: BookOpen },
        { id: 'calculator', label: 'Options Calculator', icon: Calculator },
        { id: 'calendar', label: 'Expiry Calendar', icon: Calendar },
        { id: 'risk-manager', label: 'Risk Manager', icon: Zap }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with proper event handling */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleBackdropClick}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      />

      {/* Drawer with proper touch handling */}
      <div 
        ref={drawerRef}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">NSE Trader</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pro Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Content with proper scrolling */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{ 
            height: 'calc(100vh - 140px)',
            overscrollBehavior: 'contain'
          }}
        >
          {menuSections.map(section => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors touch-target ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      <Icon size={20} />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          item.badge === 'LIVE' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : item.badge === 'NEW'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 touch-target"
            style={{ minHeight: '44px' }}
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mt-2 touch-target ${
              activeTab === 'settings' 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={{ minHeight: '44px' }}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}