import React, { useState } from 'react';
import { Brain, TrendingUp, Calculator, Target, AlertTriangle, Zap } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  marketCondition: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

const PREDEFINED_STRATEGIES: Strategy[] = [
  {
    id: 'bull-call-spread',
    name: 'Bull Call Spread',
    description: 'Buy lower strike call, sell higher strike call. Limited profit and loss.',
    winRate: 65,
    riskLevel: 'Low',
    marketCondition: 'Bullish',
    complexity: 'Beginner'
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    description: 'Sell OTM call and put, buy further OTM call and put. Profit from low volatility.',
    winRate: 70,
    riskLevel: 'Medium',
    marketCondition: 'Neutral',
    complexity: 'Intermediate'
  },
  {
    id: 'straddle',
    name: 'Long Straddle',
    description: 'Buy ATM call and put. Profit from high volatility in either direction.',
    winRate: 55,
    riskLevel: 'High',
    marketCondition: 'Volatile',
    complexity: 'Intermediate'
  },
  {
    id: 'butterfly',
    name: 'Butterfly Spread',
    description: 'Buy 1 ITM call, sell 2 ATM calls, buy 1 OTM call. Profit from low volatility.',
    winRate: 60,
    riskLevel: 'Medium',
    marketCondition: 'Neutral',
    complexity: 'Advanced'
  }
];

export default function AdvancedStrategy() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [marketCondition, setMarketCondition] = useState<string>('all');
  const [riskLevel, setRiskLevel] = useState<string>('all');

  const filteredStrategies = PREDEFINED_STRATEGIES.filter(strategy => {
    const matchesMarket = marketCondition === 'all' || strategy.marketCondition.toLowerCase() === marketCondition;
    const matchesRisk = riskLevel === 'all' || strategy.riskLevel.toLowerCase() === riskLevel;
    return matchesMarket && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-blue-600 bg-blue-100';
      case 'Intermediate': return 'text-purple-600 bg-purple-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="text-blue-600" size={20} />
          Advanced Options Strategies
        </h3>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Strategy Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market Condition
            </label>
            <select
              value={marketCondition}
              onChange={(e) => setMarketCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Conditions</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
              <option value="neutral">Neutral</option>
              <option value="volatile">Volatile</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Level
            </label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStrategies.map((strategy) => (
          <div
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{strategy.name}</h4>
              <div className="flex items-center gap-1">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-600">{strategy.winRate}%</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {strategy.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                {strategy.riskLevel} Risk
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(strategy.complexity)}`}>
                {strategy.complexity}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {strategy.marketCondition}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Details Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedStrategy.name}
              </h2>
              <button
                onClick={() => setSelectedStrategy(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedStrategy.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Target size={16} className="text-green-600" />
                    Win Rate
                  </h4>
                  <p className="text-2xl font-bold text-green-600">{selectedStrategy.winRate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-600" />
                    Risk Level
                  </h4>
                  <span className={`px-3 py-1 rounded font-medium ${getRiskColor(selectedStrategy.riskLevel)}`}>
                    {selectedStrategy.riskLevel}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Strategy Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Market Condition:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedStrategy.marketCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getComplexityColor(selectedStrategy.complexity)}`}>
                      {selectedStrategy.complexity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Zap size={16} />
                  Quick Setup
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  This strategy is suitable for {selectedStrategy.marketCondition.toLowerCase()} market conditions 
                  with {selectedStrategy.riskLevel.toLowerCase()} risk tolerance. 
                  Recommended for {selectedStrategy.complexity.toLowerCase()} traders.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Use This Strategy
                </button>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calculator size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No strategies found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to see more strategies.</p>
        </div>
      )}
    </div>
  );
}