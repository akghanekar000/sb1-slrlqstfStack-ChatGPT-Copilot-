import React, { useState } from 'react';
import { Plus, X, TrendingUp, Bell, Calculator, BookOpen } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    { icon: TrendingUp, label: 'Add Trade', action: onClick, color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Bell, label: 'Quick Alert', action: () => {}, color: 'bg-green-600 hover:bg-green-700' },
    { icon: Calculator, label: 'Calculator', action: () => {}, color: 'bg-purple-600 hover:bg-purple-700' },
    { icon: BookOpen, label: 'Journal', action: () => {}, color: 'bg-orange-600 hover:bg-orange-700' }
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Quick Actions */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-bottom duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                  {action.label}
                </span>
                <button
                  onClick={() => {
                    action.action();
                    setIsExpanded(false);
                  }}
                  className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110`}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isExpanded ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}