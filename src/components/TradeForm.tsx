import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Trade } from '../types/Trade';

interface TradeFormProps {
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Popular Indian stocks for options trading
const INDIAN_SYMBOLS = [
  'NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN',
  'HINDUNILVR', 'ITC', 'KOTAKBANK', 'LT', 'ASIANPAINT', 'AXISBANK', 'MARUTI',
  'BAJFINANCE', 'TITAN', 'NESTLEIND', 'WIPRO', 'ULTRACEMCO', 'TECHM', 'POWERGRID',
  'NTPC', 'ONGC', 'TATASTEEL', 'JSWSTEEL', 'COALINDIA', 'DRREDDY', 'SUNPHARMA',
  'BHARTIARTL', 'ADANIPORTS', 'TATAMOTORS', 'BAJAJFINSV', 'HCLTECH', 'BRITANNIA'
];

export default function TradeForm({ onAddTrade, isOpen, onClose }: TradeFormProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'call' as 'call' | 'put',
    action: 'buy' as 'buy' | 'sell',
    strike: '',
    expiry: '',
    entryPrice: '',
    quantity: '',
    notes: '',
    delta: '',
    gamma: '',
    theta: '',
    vega: ''
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSymbols = INDIAN_SYMBOLS.filter(symbol =>
    symbol.toLowerCase().includes(formData.symbol.toLowerCase())
  ).slice(0, 8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trade: Omit<Trade, 'id'> = {
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      action: formData.action,
      strike: parseFloat(formData.strike),
      expiry: formData.expiry,
      entryPrice: parseFloat(formData.entryPrice),
      quantity: parseInt(formData.quantity),
      entryDate: new Date().toISOString().split('T')[0],
      status: 'open',
      notes: formData.notes,
      delta: formData.delta ? parseFloat(formData.delta) : undefined,
      gamma: formData.gamma ? parseFloat(formData.gamma) : undefined,
      theta: formData.theta ? parseFloat(formData.theta) : undefined,
      vega: formData.vega ? parseFloat(formData.vega) : undefined
    };
    
    onAddTrade(trade);
    setFormData({
      symbol: '',
      type: 'call',
      action: 'buy',
      strike: '',
      expiry: '',
      entryPrice: '',
      quantity: '',
      notes: '',
      delta: '',
      gamma: '',
      theta: '',
      vega: ''
    });
    onClose();
  };

  const handleSymbolSelect = (symbol: string) => {
    setFormData({ ...formData, symbol });
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Options Trade</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol (NSE/BSE)
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => {
                  setFormData({ ...formData, symbol: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NIFTY, RELIANCE, TCS..."
              />
              {showSuggestions && formData.symbol && filteredSymbols.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredSymbols.map(symbol => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleSymbolSelect(symbol)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'call' | 'put' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="call">Call (CE)</option>
                <option value="put">Put (PE)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value as 'buy' | 'sell' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strike Price (₹)
              </label>
              <input
                type="number"
                step="0.50"
                required
                value={formData.strike}
                onChange={(e) => setFormData({ ...formData, strike: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="19900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Price (₹)
              </label>
              <input
                type="number"
                step="0.05"
                required
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="125.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (Lots)
              </label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Greeks (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delta
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.delta}
                  onChange={(e) => setFormData({ ...formData, delta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gamma
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gamma}
                  onChange={(e) => setFormData({ ...formData, gamma: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.05"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theta
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.theta}
                  onChange={(e) => setFormData({ ...formData, theta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="-0.05"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vega
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.vega}
                  onChange={(e) => setFormData({ ...formData, vega: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Trade strategy, market view, etc..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Trade
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}