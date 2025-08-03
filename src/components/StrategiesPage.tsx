import React, { useState } from 'react';
import { Plus, Play, Pause, Settings, TrendingUp, TrendingDown, Brain, Target, Zap, BarChart3 } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'scalping' | 'swing' | 'momentum' | 'mean_reversion' | 'arbitrage';
  isActive: boolean;
  performance: {
    totalTrades: number;
    winRate: number;
    pnl: number;
    maxDrawdown: number;
  };
  parameters: {
    timeframe: string;
    riskPerTrade: number;
    maxPositions: number;
    stopLoss: number;
    target: number;
  };
  lastSignal?: {
    time: string;
    action: 'BUY' | 'SELL';
    symbol: string;
    price: number;
  };
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Nifty Momentum Scalper',
      description: 'Quick scalping strategy for Nifty options based on momentum indicators',
      type: 'scalping',
      isActive: true,
      performance: {
        totalTrades: 156,
        winRate: 67.3,
        pnl: 23450.75,
        maxDrawdown: -8200
      },
      parameters: {
        timeframe: '1m',
        riskPerTrade: 2,
        maxPositions: 3,
        stopLoss: 5,
        target: 10
      },
      lastSignal: {
        time: new Date().toISOString(),
        action: 'BUY',
        symbol: 'NIFTY 20000 CE',
        price: 125.50
      }
    },
    {
      id: '2',
      name: 'Bank Nifty Mean Reversion',
      description: 'Mean reversion strategy for Bank Nifty options during oversold/overbought conditions',
      type: 'mean_reversion',
      isActive: false,
      performance: {
        totalTrades: 89,
        winRate: 72.1,
        pnl: 18920.30,
        maxDrawdown: -5600
      },
      parameters: {
        timeframe: '5m',
        riskPerTrade: 3,
        maxPositions: 2,
        stopLoss: 8,
        target: 15
      }
    }
  ]);

  const [showCreateStrategy, setShowCreateStrategy] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: '',
    type: 'scalping' as Strategy['type'],
    timeframe: '1m',
    riskPerTrade: 2,
    maxPositions: 3,
    stopLoss: 5,
    target: 10
  });

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, isActive: !strategy.isActive }
        : strategy
    ));
  };

  const handleCreateStrategy = () => {
    if (!newStrategy.name || !newStrategy.description) return;

    const strategy: Strategy = {
      id: Date.now().toString(),
      name: newStrategy.name,
      description: newStrategy.description,
      type: newStrategy.type,
      isActive: false,
      performance: {
        totalTrades: 0,
        winRate: 0,
        pnl: 0,
        maxDrawdown: 0
      },
      parameters: {
        timeframe: newStrategy.timeframe,
        riskPerTrade: newStrategy.riskPerTrade,
        maxPositions: newStrategy.maxPositions,
        stopLoss: newStrategy.stopLoss,
        target: newStrategy.target
      }
    };

    setStrategies(prev => [...prev, strategy]);
    setNewStrategy({
      name: '',
      description: '',
      type: 'scalping',
      timeframe: '1m',
      riskPerTrade: 2,
      maxPositions: 3,
      stopLoss: 5,
      target: 10
    });
    setShowCreateStrategy(false);
  };

  const getStrategyTypeIcon = (type: string) => {
    switch (type) {
      case 'scalping': return <Zap className="text-yellow-600" size={20} />;
      case 'swing': return <TrendingUp className="text-blue-600" size={20} />;
      case 'momentum': return <Target className="text-green-600" size={20} />;
      case 'mean_reversion': return <BarChart3 className="text-purple-600" size={20} />;
      case 'arbitrage': return <Brain className="text-orange-600" size={20} />;
      default: return <Settings className="text-gray-600" size={20} />;
    }
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type) {
      case 'scalping': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'swing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'momentum': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'mean_reversion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'arbitrage': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const strategyTypes = [
    { value: 'scalping', label: 'Scalping' },
    { value: 'swing', label: 'Swing Trading' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'mean_reversion', label: 'Mean Reversion' },
    { value: 'arbitrage', label: 'Arbitrage' }
  ];

  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Strategies</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your algorithmic trading strategies</p>
        </div>
        <button
          onClick={() => setShowCreateStrategy(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Strategy
        </button>
      </div>

      {/* Active Strategies Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Strategies</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{strategies.length}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Play className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {strategies.filter(s => s.isActive).length}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total P&L</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ₹{strategies.reduce((sum, s) => sum + s.performance.pnl, 0).toFixed(0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {strategies.length > 0 ? (strategies.reduce((sum, s) => sum + s.performance.winRate, 0) / strategies.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map(strategy => (
          <div key={strategy.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Strategy Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStrategyTypeIcon(strategy.type)}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{strategy.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStrategyTypeColor(strategy.type)}`}>
                    {strategy.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    strategy.isActive ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      strategy.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {strategy.isActive ? (
                  <Play size={16} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Pause size={16} className="text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{strategy.description}</p>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Trades</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{strategy.performance.totalTrades}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Win Rate</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{strategy.performance.winRate}%</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">P&L</div>
                <div className={`text-lg font-bold ${
                  strategy.performance.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ₹{strategy.performance.pnl.toFixed(0)}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Max DD</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">₹{Math.abs(strategy.performance.maxDrawdown).toFixed(0)}</div>
              </div>
            </div>

            {/* Parameters */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <div className="text-blue-600 dark:text-blue-400">Timeframe</div>
                  <div className="font-medium text-gray-900 dark:text-white">{strategy.parameters.timeframe}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <div className="text-green-600 dark:text-green-400">Risk/Trade</div>
                  <div className="font-medium text-gray-900 dark:text-white">{strategy.parameters.riskPerTrade}%</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <div className="text-purple-600 dark:text-purple-400">Max Pos</div>
                  <div className="font-medium text-gray-900 dark:text-white">{strategy.parameters.maxPositions}</div>
                </div>
              </div>
            </div>

            {/* Last Signal */}
            {strategy.lastSignal && strategy.isActive && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-300">Last Signal</div>
                    <div className="text-xs text-blue-700 dark:text-blue-400">
                      {strategy.lastSignal.action} {strategy.lastSignal.symbol} @ ₹{strategy.lastSignal.price}
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {new Date(strategy.lastSignal.time).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}

            {/* Strategy Status */}
            {strategy.isActive && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Strategy running - monitoring signals
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {strategies.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Brain size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No strategies created</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first algorithmic trading strategy</p>
            <button
              onClick={() => setShowCreateStrategy(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Strategy
            </button>
          </div>
        )}
      </div>

      {/* Create Strategy Modal */}
      {showCreateStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Strategy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter strategy name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe your strategy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Strategy Type
                  </label>
                  <select
                    value={newStrategy.type}
                    onChange={(e) => setNewStrategy({ ...newStrategy, type: e.target.value as Strategy['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {strategyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={newStrategy.timeframe}
                    onChange={(e) => setNewStrategy({ ...newStrategy, timeframe: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {timeframes.map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Per Trade (%)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={newStrategy.riskPerTrade}
                    onChange={(e) => setNewStrategy({ ...newStrategy, riskPerTrade: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newStrategy.maxPositions}
                    onChange={(e) => setNewStrategy({ ...newStrategy, maxPositions: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stop Loss (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newStrategy.stopLoss}
                    onChange={(e) => setNewStrategy({ ...newStrategy, stopLoss: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newStrategy.target}
                    onChange={(e) => setNewStrategy({ ...newStrategy, target: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateStrategy}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Strategy
              </button>
              <button
                onClick={() => setShowCreateStrategy(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}