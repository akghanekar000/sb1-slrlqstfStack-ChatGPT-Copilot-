import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { TradeStats } from '../types/Trade';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface StatsOverviewProps {
  stats: TradeStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Total P&L',
      value: formatCurrency(stats.totalPnL),
      icon: DollarSign,
      color: stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Open Trades',
      value: stats.openTrades.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Closed Trades',
      value: stats.closedTrades.toString(),
      icon: TrendingDown,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <Icon size={24} className={stat.iconColor} />
              </div>
            </div>
          </div>
        );
      })}

      {stats.closedTrades > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Win</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(stats.avgWin)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Loss</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(stats.avgLoss)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Trades</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalTrades}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Profit Factor</p>
              <p className="text-lg font-semibold text-blue-600">
                {stats.avgLoss > 0 ? (stats.avgWin / stats.avgLoss).toFixed(2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}