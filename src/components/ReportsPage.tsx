import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, BarChart3, DollarSign, Target } from 'lucide-react';

interface TradeReport {
  id: string;
  date: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  pnl: number;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
  broker: string;
  strategy: string;
}

interface DailyPnL {
  date: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedReport, setSelectedReport] = useState<'trades' | 'pnl' | 'performance' | 'logs'>('trades');

  // Mock data
  const tradeReports: TradeReport[] = [
    {
      id: '1',
      date: '2024-01-15',
      symbol: 'NIFTY 20000 CE',
      action: 'BUY',
      quantity: 75,
      price: 125.50,
      pnl: 2250,
      status: 'EXECUTED',
      broker: 'Angel One',
      strategy: 'Momentum Scalper'
    },
    {
      id: '2',
      date: '2024-01-15',
      symbol: 'BANKNIFTY 45500 PE',
      action: 'SELL',
      quantity: 25,
      price: 180.75,
      pnl: -890,
      status: 'EXECUTED',
      broker: 'Zerodha',
      strategy: 'Mean Reversion'
    },
    {
      id: '3',
      date: '2024-01-14',
      symbol: 'NIFTY 19950 CE',
      action: 'BUY',
      quantity: 150,
      price: 95.25,
      pnl: 1450,
      status: 'EXECUTED',
      broker: 'Angel One',
      strategy: 'Momentum Scalper'
    }
  ];

  const dailyPnL: DailyPnL[] = [
    { date: '2024-01-15', pnl: 1360, trades: 8, winRate: 62.5 },
    { date: '2024-01-14', pnl: 2890, trades: 12, winRate: 75.0 },
    { date: '2024-01-13', pnl: -1250, trades: 6, winRate: 33.3 },
    { date: '2024-01-12', pnl: 3450, trades: 15, winRate: 80.0 },
    { date: '2024-01-11', pnl: 890, trades: 9, winRate: 55.6 }
  ];

  const totalPnL = tradeReports.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalTrades = tradeReports.length;
  const winningTrades = tradeReports.filter(trade => trade.pnl > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const periods = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  const reportTypes = [
    { value: 'trades', label: 'Trade Log', icon: FileText },
    { value: 'pnl', label: 'P&L Report', icon: DollarSign },
    { value: 'performance', label: 'Performance', icon: BarChart3 },
    { value: 'logs', label: 'System Logs', icon: Calendar }
  ];

  const exportReport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`);
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your trading performance and analyze results</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ₹{totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Trades</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalTrades}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{winRate.toFixed(1)}%</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Trade</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            ₹{totalTrades > 0 ? (totalPnL / totalTrades).toFixed(0) : 0}
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {reportTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedReport(type.value as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedReport === type.value
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {type.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Trade Log */}
          {selectedReport === 'trades' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Symbol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">P&L</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Broker</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeReports.map(trade => (
                    <tr key={trade.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trade.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trade.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.action === 'BUY' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trade.quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">₹{trade.price}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${
                          trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'EXECUTED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : trade.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trade.broker}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{trade.strategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* P&L Report */}
          {selectedReport === 'pnl' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily P&L Breakdown</h3>
              <div className="space-y-3">
                {dailyPnL.map(day => (
                  <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{day.date}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {day.trades} trades • {day.winRate}% win rate
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      day.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {day.pnl >= 0 ? '+' : ''}₹{day.pnl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Report */}
          {selectedReport === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Strategy Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Momentum Scalper:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">+₹3,700</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Mean Reversion:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">-₹890</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Broker Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Angel One:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">+₹3,700</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Zerodha:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">-₹890</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Logs */}
          {selectedReport === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Activity Logs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="text-gray-500">[2024-01-15 14:30:25]</span> Strategy "Momentum Scalper" executed BUY order for NIFTY 20000 CE
                </div>
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="text-gray-500">[2024-01-15 14:28:15]</span> Angel One terminal connected successfully
                </div>
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="text-gray-500">[2024-01-15 14:25:10]</span> Market data feed started for NIFTY, BANKNIFTY
                </div>
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="text-gray-500">[2024-01-15 14:20:05]</span> Trading engine initialized
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}