import React, { useState } from 'react';
import { TestTube, Play, BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface BacktestResult {
  totalTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
}

export default function BacktestingEngine() {
  const [strategy, setStrategy] = useState({
    name: '',
    symbol: 'NIFTY',
    timeframe: '1D',
    entryCondition: 'RSI < 30',
    exitCondition: 'RSI > 70',
    stopLoss: 5,
    target: 10,
    startDate: '2023-01-01',
    endDate: '2024-01-01'
  });

  const [results, setResults] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtesting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults: BacktestResult = {
      totalTrades: 156,
      winRate: 67.3,
      totalReturn: 23.45,
      maxDrawdown: -8.2,
      sharpeRatio: 1.85,
      profitFactor: 2.1,
      avgWin: 1250,
      avgLoss: -580
    };
    
    setResults(mockResults);
    setIsRunning(false);
  };

  const predefinedStrategies = [
    {
      name: 'RSI Mean Reversion',
      entryCondition: 'RSI < 30 AND Volume > SMA(Volume, 20)',
      exitCondition: 'RSI > 70 OR Profit > 8%'
    },
    {
      name: 'Bollinger Band Breakout',
      entryCondition: 'Close > Upper_BB AND Volume > 1.5 * Avg_Volume',
      exitCondition: 'Close < Middle_BB OR Loss > 5%'
    },
    {
      name: 'Moving Average Crossover',
      entryCondition: 'EMA(9) > EMA(21) AND Price > EMA(9)',
      exitCondition: 'EMA(9) < EMA(21) OR Profit > 12%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TestTube className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategy Backtesting</h2>
      </div>

      {/* Strategy Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strategy Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Strategy Name</label>
            <input
              type="text"
              value={strategy.name}
              onChange={(e) => setStrategy({...strategy, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="My RSI Strategy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symbol</label>
            <select
              value={strategy.symbol}
              onChange={(e) => setStrategy({...strategy, symbol: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="RELIANCE">RELIANCE</option>
              <option value="TCS">TCS</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeframe</label>
            <select
              value={strategy.timeframe}
              onChange={(e) => setStrategy({...strategy, timeframe: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1H">1 Hour</option>
              <option value="1D">1 Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stop Loss (%)</label>
            <input
              type="number"
              value={strategy.stopLoss}
              onChange={(e) => setStrategy({...strategy, stopLoss: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target (%)</label>
            <input
              type="number"
              value={strategy.target}
              onChange={(e) => setStrategy({...strategy, target: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entry Condition</label>
            <textarea
              value={strategy.entryCondition}
              onChange={(e) => setStrategy({...strategy, entryCondition: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="RSI < 30 AND Volume > SMA(Volume, 20)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exit Condition</label>
            <textarea
              value={strategy.exitCondition}
              onChange={(e) => setStrategy({...strategy, exitCondition: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="RSI > 70 OR Profit > 8%"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={strategy.startDate}
              onChange={(e) => setStrategy({...strategy, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={strategy.endDate}
              onChange={(e) => setStrategy({...strategy, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={runBacktest}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Play size={20} />
          {isRunning ? 'Running Backtest...' : 'Run Backtest'}
        </button>
      </div>

      {/* Predefined Strategies */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Predefined Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predefinedStrategies.map((preset, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                 onClick={() => setStrategy({
                   ...strategy,
                   name: preset.name,
                   entryCondition: preset.entryCondition,
                   exitCondition: preset.exitCondition
                 })}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{preset.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Entry:</strong> {preset.entryCondition}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Exit:</strong> {preset.exitCondition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-green-600" size={20} />
            Backtest Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.totalTrades}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Trades</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.winRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.totalReturn}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Return</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{results.maxDrawdown}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Max Drawdown</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{results.sharpeRatio}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Sharpe Ratio</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{results.profitFactor}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Profit Factor</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">₹{results.avgWin}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Win</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">₹{results.avgLoss}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Loss</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}