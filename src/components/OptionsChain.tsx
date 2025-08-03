import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Activity, Volume } from 'lucide-react';

interface OptionData {
  strike: number;
  call: {
    ltp: number;
    change: number;
    volume: number;
    oi: number;
    iv: number;
  };
  put: {
    ltp: number;
    change: number;
    volume: number;
    oi: number;
    iv: number;
  };
}

export default function OptionsChain() {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState('2024-01-25');
  const [optionsData, setOptionsData] = useState<OptionData[]>([]);
  const [spotPrice, setSpotPrice] = useState(19850);

  const symbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK'];
  const expiries = ['2024-01-25', '2024-02-01', '2024-02-08', '2024-02-15'];

  useEffect(() => {
    // Generate mock options chain data
    const generateOptionsData = () => {
      const strikes = [];
      const baseStrike = Math.floor(spotPrice / 50) * 50;
      
      for (let i = -10; i <= 10; i++) {
        strikes.push(baseStrike + (i * 50));
      }

      const data = strikes.map(strike => {
        const isITM = selectedSymbol.includes('CALL') ? strike < spotPrice : strike > spotPrice;
        const distance = Math.abs(strike - spotPrice);
        
        return {
          strike,
          call: {
            ltp: Math.max(0.05, (spotPrice - strike) + Math.random() * 50),
            change: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 100000),
            oi: Math.floor(Math.random() * 500000),
            iv: 15 + Math.random() * 20
          },
          put: {
            ltp: Math.max(0.05, (strike - spotPrice) + Math.random() * 50),
            change: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 100000),
            oi: Math.floor(Math.random() * 500000),
            iv: 15 + Math.random() * 20
          }
        };
      });

      setOptionsData(data);
    };

    generateOptionsData();
    const interval = setInterval(generateOptionsData, 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol, selectedExpiry, spotPrice]);

  const getRowHighlight = (strike: number) => {
    const diff = Math.abs(strike - spotPrice);
    if (diff <= 25) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Options Chain</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
            
            <select
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {expiries.map(expiry => (
                <option key={expiry} value={expiry}>{expiry}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Spot:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">₹{spotPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Options Chain Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th colSpan={6} className="px-4 py-3 text-center text-sm font-medium text-green-700 dark:text-green-400 border-r border-gray-200 dark:border-gray-600">
                  CALLS
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">
                  STRIKE
                </th>
                <th colSpan={6} className="px-4 py-3 text-center text-sm font-medium text-red-700 dark:text-red-400">
                  PUTS
                </th>
              </tr>
              <tr className="bg-gray-100 dark:bg-gray-600">
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">OI</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Volume</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">IV</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">LTP</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Change</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Bid/Ask</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 border-x border-gray-200 dark:border-gray-600">Price</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Bid/Ask</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Change</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">LTP</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">IV</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Volume</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {optionsData.map((option, index) => (
                <tr key={option.strike} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getRowHighlight(option.strike)}`}>
                  {/* Call Options */}
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {(option.call.oi / 1000).toFixed(0)}K
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {(option.call.volume / 1000).toFixed(0)}K
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {option.call.iv.toFixed(1)}%
                  </td>
                  <td className="px-2 py-2 text-xs text-center font-medium text-gray-900 dark:text-white">
                    ₹{option.call.ltp.toFixed(2)}
                  </td>
                  <td className={`px-2 py-2 text-xs text-center font-medium ${
                    option.call.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {option.call.change >= 0 ? '+' : ''}{option.call.change.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-500 dark:text-gray-400">
                    {(option.call.ltp - 0.05).toFixed(2)}/{(option.call.ltp + 0.05).toFixed(2)}
                  </td>
                  
                  {/* Strike Price */}
                  <td className={`px-4 py-3 text-center font-bold border-x border-gray-200 dark:border-gray-600 ${
                    option.strike === Math.round(spotPrice / 50) * 50 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {option.strike}
                  </td>
                  
                  {/* Put Options */}
                  <td className="px-2 py-2 text-xs text-center text-gray-500 dark:text-gray-400">
                    {(option.put.ltp - 0.05).toFixed(2)}/{(option.put.ltp + 0.05).toFixed(2)}
                  </td>
                  <td className={`px-2 py-2 text-xs text-center font-medium ${
                    option.put.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {option.put.change >= 0 ? '+' : ''}{option.put.change.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center font-medium text-gray-900 dark:text-white">
                    ₹{option.put.ltp.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {option.put.iv.toFixed(1)}%
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {(option.put.volume / 1000).toFixed(0)}K
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {(option.put.oi / 1000).toFixed(0)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Call OI</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {(optionsData.reduce((sum, opt) => sum + opt.call.oi, 0) / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-red-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Put OI</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {(optionsData.reduce((sum, opt) => sum + opt.put.oi, 0) / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Volume className="text-purple-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">PCR (OI)</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {(optionsData.reduce((sum, opt) => sum + opt.put.oi, 0) / 
              optionsData.reduce((sum, opt) => sum + opt.call.oi, 0)).toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Max Pain</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round(spotPrice / 50) * 50}
          </div>
        </div>
      </div>
    </div>
  );
}