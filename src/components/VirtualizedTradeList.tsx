import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Bell, BellOff, TrendingUp } from 'lucide-react';
import { Trade, Alert } from '../types/Trade';
import { calculatePnL, formatCurrency, formatPercent } from '../utils/calculations';

interface VirtualizedTradeListProps {
  trades: Trade[];
  alerts: Alert[];
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
  onCreateAlert: (tradeId: string, type: 'target' | 'stopLoss', targetPrice: number) => void;
  onToggleAlert: (alertId: string) => void;
  onUpdateCurrentPrice: (tradeId: string, price: number) => void;
}

const ITEMS_PER_PAGE = 10;

export default function VirtualizedTradeList({
  trades,
  alerts,
  onUpdateTrade,
  onDeleteTrade,
  onCreateAlert,
  onToggleAlert,
  onUpdateCurrentPrice
}: VirtualizedTradeListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlertForm, setShowAlertForm] = useState<string | null>(null);
  const [alertForm, setAlertForm] = useState({
    type: 'target' as 'target' | 'stopLoss',
    price: ''
  });

  // Memoize paginated trades with error handling
  const paginatedTrades = useMemo(() => {
    try {
      if (!Array.isArray(trades) || trades.length === 0) return [];
      const validTrades = trades.filter(trade => 
        trade && 
        typeof trade === 'object' && 
        trade.id && 
        trade.symbol
      );
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return validTrades.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Pagination error:', error);
      return [];
    }
  }, [trades, currentPage]);

  const totalPages = Math.max(1, Math.ceil((trades?.length || 0) / ITEMS_PER_PAGE));

  const handleClosePosition = (trade: Trade) => {
    try {
      if (!trade || !trade.id) return;
      const exitPrice = trade.currentPrice || trade.entryPrice || 0;
      onUpdateTrade(trade.id, {
        status: 'closed',
        exitPrice,
        exitDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Close position error:', error);
    }
  };

  const handleCreateAlert = (tradeId: string) => {
    try {
      if (!alertForm.price || !tradeId) return;
      const price = parseFloat(alertForm.price);
      if (isNaN(price) || price <= 0) return;
      
      onCreateAlert(tradeId, alertForm.type, price);
      setShowAlertForm(null);
      setAlertForm({ type: 'target', price: '' });
    } catch (error) {
      console.error('Create alert error:', error);
    }
  };

  const getTradeAlerts = (tradeId: string) => {
    try {
      if (!Array.isArray(alerts) || !tradeId) return [];
      return alerts.filter(alert => alert && alert.tradeId === tradeId);
    } catch (error) {
      console.error('Get trade alerts error:', error);
      return [];
    }
  };

  const handlePriceUpdate = (tradeId: string, value: string) => {
    try {
      const price = parseFloat(value);
      if (!isNaN(price) && price >= 0) {
        onUpdateCurrentPrice(tradeId, price);
      }
    } catch (error) {
      console.error('Price update error:', error);
    }
  };

  if (!Array.isArray(trades) || trades.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <TrendingUp size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trades yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Start by adding your first options trade.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pagination info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, trades.length)} of {trades.length} trades
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Trade list */}
      {paginatedTrades.map((trade) => {
        if (!trade || !trade.id) return null;
        
        try {
          const { pnl, pnlPercent } = calculatePnL(trade);
          const tradeAlerts = getTradeAlerts(trade.id);
          const isProfitable = pnl > 0;

          return (
            <div
              key={trade.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trade.symbol || 'Unknown'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'call' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {(trade.type || 'unknown').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.action === 'buy' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' 
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                    }`}>
                      {(trade.action || 'unknown').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.status === 'open' 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                    }`}>
                      {(trade.status || 'unknown').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Strike:</span>
                      <div className="font-medium text-gray-900 dark:text-white">₹{(trade.strike || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Expiry:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{trade.expiry || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{trade.quantity || 0} lots</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Entry:</span>
                      <div className="font-medium text-gray-900 dark:text-white">₹{(trade.entryPrice || 0).toFixed(2)}</div>
                    </div>
                  </div>

                  {trade.status === 'open' && (
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Current Price:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={trade.currentPrice || ''}
                          onChange={(e) => handlePriceUpdate(trade.id, e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}

                  {trade.notes && (
                    <div className="mt-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{trade.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                  <div className="mb-3">
                    <div className={`text-2xl font-bold ${
                      isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isProfitable ? '+' : ''}{formatCurrency(pnl)}
                    </div>
                    <div className={`text-sm ${
                      isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercent(pnlPercent)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trade.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleClosePosition(trade)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Close Position
                        </button>
                        <button
                          onClick={() => setShowAlertForm(trade.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Bell size={14} />
                          Alert
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>

                  {/* Display active alerts */}
                  {tradeAlerts.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {tradeAlerts.map(alert => (
                        <div key={alert.id} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                          <span className="text-gray-700 dark:text-gray-300">
                            {alert.type === 'target' ? 'Target' : 'Stop Loss'}: ₹{(alert.targetPrice || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => onToggleAlert(alert.id)}
                            className={`p-1 rounded ${
                              alert.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            {alert.isActive ? <Bell size={12} /> : <BellOff size={12} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Alert creation form */}
              {showAlertForm === trade.id && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Create Price Alert</h4>
                  <div className="flex gap-3">
                    <select
                      value={alertForm.type}
                      onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value as 'target' | 'stopLoss' })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="target">Target Price</option>
                      <option value="stopLoss">Stop Loss</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={alertForm.price}
                      onChange={(e) => setAlertForm({ ...alertForm, price: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleCreateAlert(trade.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAlertForm(null)}
                      className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        } catch (error) {
          console.error('Trade render error:', error);
          return null;
        }
      })}
    </div>
  );
}