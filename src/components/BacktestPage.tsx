import React, { useState } from 'react';
import { TestTube, Play, BarChart3, TrendingUp, TrendingDown, Calendar, Target, Zap } from 'lucide-react';

interface BacktestResult {
  id: string;
  strategyName: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  runDate: string;
}

export default function BacktestPage() {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([
    {
      id: '1',
      strategyName: 'Nifty Momentum Scalper',
      symbol: 'NIFTY',
      timeframe: '1m',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      totalTrades: 156,
      winRate: 67.3,
      totalReturn: 23.45,
      maxDrawdown: -8.2,
      sharpeRatio: 1.85,
      profitFactor: 2.1,
      avgWin: 1250,
      avgLoss: -580,
      runDate: '2024-01-15'
    },
    {
      id: '2',
      strategyName: 'Bank Nifty Mean Reversion',
      symbol: 'BANKNIFTY',
      timeframe: '5m',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      totalTrades: 89,
      winRate: 72.1,
      totalReturn: 18.92,
      maxDrawdown: -5.6,
      sharpeRatio: 2.15,
      profitFactor: 2.8,
      avgWin: 1890,
      avgLoss: -675,
      runDate: '2024-01-14'
    }
  ]);

  const [showBacktestForm, setShowBacktestForm] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [newBacktest, setNewBacktest] = useState({
    strategyName: '',
    symbol: 'NIFTY',
    timeframe: '1m',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    initialCapital: 100000,
    riskPerTrade: 2
  });

  const runBacktest = async () => {
    if (!newBacktest.strategyName) return;

    setIsRunning(true);
    
    // Simulate backtesting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResult: BacktestResult = {
      id: Date.now().toString(),
      strategyName: newBacktest.strategyName,
      symbol: newBacktest.symbol,
      timeframe: newBacktest.timeframe,
      startDate: newBacktest.startDate,
      endDate: newBacktest.endDate,
      totalTrades: Math.floor(Math.random() * 200) + 50,
      winRate: Math.random() * 30 + 50, // 50-80%
      totalReturn: Math.random() * 40 - 10, // -10% to 30%
      maxDrawdown: -(Math.random() * 15 + 5), // -5% to -20%
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
      profitFactor: Math.random() * 2 + 1, // 1 to 3
      avgWin: Math.random() * 2000 + 500,
      avgLoss: -(Math.random() * 1000 + 300),
      runDate: new Date().toISOString().split('T')[0]
    };
    
    setBacktestResults(prev => [mockResult, ...prev]);
    setIsRunning(false);
    setShowBacktestForm(false);
    setNewBacktest({
      strategyName: '',
      symbol: 'NIFTY',
      timeframe: '1m',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      initialCapital: 100000,
      riskPerTrade: 2
    });
  };

  const symbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK'];
  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategy Backtesting</h2>
          <p className="text-gray-600 dark:text-gray-400">Test your strategies against historical data</p>
        </div>
        <button
          onClick={() => setShowBacktestForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <TestTube size={20} />
          New Backtest
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TestTube className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tests</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{backtestResults.length}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Return</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {backtestResults.length > 0 ? 
              (backtestResults.reduce((sum, r) => sum + r.totalReturn, 0) / backtestResults.length).toFixed(1) : 0}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {backtestResults.length > 0 ? 
              (backtestResults.reduce((sum, r) => sum + r.winRate, 0) / backtestResults.length).toFixed(1) : 0}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Sharpe</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {backtestResults.length > 0 ? 
              (backtestResults.reduce((sum, r) => sum + r.sharpeRatio, 0) / backtestResults.length).toFixed(2) : 0}
          </div>
        </div>
      </div>

      {/* Backtest Results */}
      <div className="space-y-4">
        {backtestResults.map(result => (
          <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Result Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{result.strategyName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{result.symbol} • {result.timeframe}</span>
                  <span>{result.startDate} to {result.endDate}</span>
                  <span>Run on {new Date(result.runDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.totalReturn >= 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn.toFixed(2)}%
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.totalTrades}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Trades</div>
              </div>

              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.winRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Win Rate</div>
              </div>

              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.totalReturn.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Return</div>
              </div>

              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{result.maxDrawdown.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Max Drawdown</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{result.sharpeRatio.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Sharpe Ratio</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{result.profitFactor.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Profit Factor</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">₹{result.avgWin.toFixed(0)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Avg Win</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">₹{Math.abs(result.avgLoss).toFixed(0)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Avg Loss</div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {backtestResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TestTube size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No backtests run yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Run your first backtest to see how your strategy performs</p>
            <button
              onClick={() => setShowBacktestForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Run Backtest
            </button>
          </div>
        )}
      </div>

      {/* Backtest Form Modal */}
      {showBacktestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Run New Backtest</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={newBacktest.strategyName}
                  onChange={(e) => setNewBacktest({ ...newBacktest, strategyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter strategy name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol
                  </label>
                  <select
                    value={newBacktest.symbol}
                    onChange={(e) => setNewBacktest({ ...newBacktest, symbol: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {symbols.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={newBacktest.timeframe}
                    onChange={(e) => setNewBacktest({ ...newBacktest, timeframe: e.target.value })}
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
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newBacktest.startDate}
                    onChange={(e) => setNewBacktest({ ...newBacktest, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newBacktest.endDate}
                    onChange={(e) => setNewBacktest({ ...newBacktest, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={newBacktest.initialCapital}
                    onChange={(e) => setNewBacktest({ ...newBacktest, initialCapital: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Per Trade (%)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={newBacktest.riskPerTrade}
                    onChange={(e) => setNewBacktest({ ...newBacktest, riskPerTrade: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={runBacktest}
                disabled={isRunning}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running Backtest...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Backtest
                  </>
                )}
              </button>
              <button
                onClick={() => setShowBacktestForm(false)}
                disabled={isRunning}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
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