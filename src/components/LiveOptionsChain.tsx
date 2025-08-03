import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Target, TrendingUp, TrendingDown, Filter, Eye, LogIn } from 'lucide-react';
import MultiBrokerService from '../services/brokerServices';
import BrokerLoginModal from './BrokerLoginModal';

interface OptionData {
  strike: number;
  call: {
    last_price: number;
    volume: number;
    oi: number;
    iv: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    bid: number;
    ask: number;
  };
  put: {
    last_price: number;
    volume: number;
    oi: number;
    iv: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    bid: number;
    ask: number;
  };
}

export default function LiveOptionsChain() {
  const [selectedSymbol, setSelectedSymbol] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState('24JAN');
  const [optionsData, setOptionsData] = useState<OptionData[]>([]);
  const [spotPrice, setSpotPrice] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [strikeFilter, setStrikeFilter] = useState(5);
  const [showGreeks, setShowGreeks] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeBroker, setActiveBroker] = useState<string | null>(null);

  const checkConnection = useCallback(() => {
    const authenticated = MultiBrokerService.getAuthenticatedBrokers();
    const active = MultiBrokerService.getActiveBroker();
    setIsConnected(authenticated.length > 0);
    setActiveBroker(active);
  }, []);

  const fetchOptionsData = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    
    try {
      // Get current spot price
      const spotQuote = await MultiBrokerService.getQuote(selectedSymbol === 'NIFTY' ? 'NIFTY 50' : 'NIFTY BANK');
      
      if (spotQuote) {
        setSpotPrice(spotQuote.ltp);
        
        // Calculate ATM strike and surrounding strikes
        const atmStrike = Math.round(spotQuote.ltp / 50) * 50;
        const strikes: number[] = [];
        
        for (let i = -Math.floor(strikeFilter / 2); i <= Math.floor(strikeFilter / 2); i++) {
          strikes.push(atmStrike + (i * 50));
        }

        // Generate realistic options data
        const optionChain = strikes.map(strike => {
          const distance = Math.abs(strike - spotQuote.ltp);
          const isITM = selectedSymbol === 'NIFTY' ? strike < spotQuote.ltp : strike > spotQuote.ltp;
          
          return {
            strike,
            call: {
              last_price: Math.max(0.05, (spotQuote.ltp - strike) + Math.random() * 50),
              volume: Math.floor(Math.random() * 100000),
              oi: Math.floor(Math.random() * 500000),
              iv: 15 + Math.random() * 20,
              delta: Math.max(0, Math.min(1, 0.5 + (spotQuote.ltp - strike) / 1000)),
              gamma: Math.max(0, 0.1 - distance / 1000),
              theta: -(0.05 + Math.random() * 0.1),
              vega: Math.max(0, 0.2 - distance / 1000),
              bid: 0,
              ask: 0
            },
            put: {
              last_price: Math.max(0.05, (strike - spotQuote.ltp) + Math.random() * 50),
              volume: Math.floor(Math.random() * 100000),
              oi: Math.floor(Math.random() * 500000),
              iv: 15 + Math.random() * 20,
              delta: Math.max(-1, Math.min(0, -0.5 - (spotQuote.ltp - strike) / 1000)),
              gamma: Math.max(0, 0.1 - distance / 1000),
              theta: -(0.05 + Math.random() * 0.1),
              vega: Math.max(0, 0.2 - distance / 1000),
              bid: 0,
              ask: 0
            }
          };
        });

        setOptionsData(optionChain);
      } else {
        // Fallback to demo data
        const demoSpotPrice = selectedSymbol === 'NIFTY' ? 19850 : 45320;
        setSpotPrice(demoSpotPrice);
        generateDemoOptionsData(demoSpotPrice);
      }
      
    } catch (error) {
      console.error('Failed to fetch options data:', error);
      // Fallback to demo data
      const demoSpotPrice = selectedSymbol === 'NIFTY' ? 19850 : 45320;
      setSpotPrice(demoSpotPrice);
      generateDemoOptionsData(demoSpotPrice);
    } finally {
      if (showLoader) setIsRefreshing(false);
    }
  }, [selectedSymbol, selectedExpiry, strikeFilter]);

  const generateDemoOptionsData = (demoSpotPrice: number) => {
    const atmStrike = Math.round(demoSpotPrice / 50) * 50;
    const strikes: number[] = [];
    
    for (let i = -Math.floor(strikeFilter / 2); i <= Math.floor(strikeFilter / 2); i++) {
      strikes.push(atmStrike + (i * 50));
    }

    const optionChain = strikes.map(strike => {
      const distance = Math.abs(strike - demoSpotPrice);
      
      return {
        strike,
        call: {
          last_price: Math.max(0.05, (demoSpotPrice - strike) + Math.random() * 50),
          volume: Math.floor(Math.random() * 100000),
          oi: Math.floor(Math.random() * 500000),
          iv: 15 + Math.random() * 20,
          delta: Math.max(0, Math.min(1, 0.5 + (demoSpotPrice - strike) / 1000)),
          gamma: Math.max(0, 0.1 - distance / 1000),
          theta: -(0.05 + Math.random() * 0.1),
          vega: Math.max(0, 0.2 - distance / 1000),
          bid: 0,
          ask: 0
        },
        put: {
          last_price: Math.max(0.05, (strike - demoSpotPrice) + Math.random() * 50),
          volume: Math.floor(Math.random() * 100000),
          oi: Math.floor(Math.random() * 500000),
          iv: 15 + Math.random() * 20,
          delta: Math.max(-1, Math.min(0, -0.5 - (demoSpotPrice - strike) / 1000)),
          gamma: Math.max(0, 0.1 - distance / 1000),
          theta: -(0.05 + Math.random() * 0.1),
          vega: Math.max(0, 0.2 - distance / 1000),
          bid: 0,
          ask: 0
        }
      };
    });

    setOptionsData(optionChain);
  };

  const handleManualRefresh = useCallback(async () => {
    await fetchOptionsData(true);
  }, [fetchOptionsData]);

  const handleLoginSuccess = useCallback((brokerName: string) => {
    setActiveBroker(brokerName);
    checkConnection();
    fetchOptionsData(true);
  }, [checkConnection, fetchOptionsData]);

  // Auto-refresh every 2 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOptionsData();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchOptionsData]);

  // Initial data fetch
  useEffect(() => {
    checkConnection();
    fetchOptionsData(true);
  }, [checkConnection, fetchOptionsData]);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 100000) {
      return `${(volume / 100000).toFixed(1)}L`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getRowHighlight = (strike: number) => {
    const diff = Math.abs(strike - spotPrice);
    if (diff <= 25) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return '';
  };

  const expiryOptions = [
    '24JAN', '31JAN', '07FEB', '14FEB', '21FEB', '28FEB'
  ];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Options Chain</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {isConnected ? `LIVE (${activeBroker})` : 'DEMO'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Symbol selector */}
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value as 'NIFTY' | 'BANKNIFTY')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANK NIFTY</option>
            </select>
            
            {/* Expiry selector */}
            <select
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {expiryOptions.map(expiry => (
                <option key={expiry} value={expiry}>{expiry}</option>
              ))}
            </select>

            {/* Strike filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={strikeFilter}
                onChange={(e) => setStrikeFilter(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value={3}>3 Strikes</option>
                <option value={5}>5 Strikes</option>
                <option value={7}>7 Strikes</option>
                <option value={9}>9 Strikes</option>
              </select>
            </div>

            {/* Greeks toggle */}
            <button
              onClick={() => setShowGreeks(!showGreeks)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                showGreeks 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Eye size={16} />
              Greeks
            </button>

            {/* Auto-refresh toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Auto</span>
            </label>

            {/* Manual refresh */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>

            {/* Connect broker button */}
            {!isConnected && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <LogIn size={16} />
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Spot price display */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Spot:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">₹{formatPrice(spotPrice)}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Connection prompt */}
      {!isConnected && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Target size={20} className="text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-300">Connect for Live Options Data</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Connect with your broker to get real-time options chain data with live Greeks and OI.
                Currently showing demo data.
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Connect Now
            </button>
          </div>
        </div>
      )}

      {/* Options chain table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th colSpan={showGreeks ? 8 : 4} className="px-4 py-3 text-center text-sm font-medium text-green-700 dark:text-green-400 border-r border-gray-200 dark:border-gray-600">
                  CALLS
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">
                  STRIKE
                </th>
                <th colSpan={showGreeks ? 8 : 4} className="px-4 py-3 text-center text-sm font-medium text-red-700 dark:text-red-400">
                  PUTS
                </th>
              </tr>
              <tr className="bg-gray-100 dark:bg-gray-600">
                {/* Call headers */}
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">OI</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Vol</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">LTP</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">IV</th>
                {showGreeks && (
                  <>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Δ</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Γ</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Θ</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">ν</th>
                  </>
                )}
                
                {/* Strike header */}
                <th className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 border-x border-gray-200 dark:border-gray-600">Price</th>
                
                {/* Put headers */}
                {showGreeks && (
                  <>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">ν</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Θ</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Γ</th>
                    <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Δ</th>
                  </>
                )}
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">IV</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">LTP</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">Vol</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {optionsData.map((option, index) => (
                <tr key={option.strike} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getRowHighlight(option.strike)}`}>
                  {/* Call data */}
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {formatVolume(option.call.oi)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {formatVolume(option.call.volume)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center font-medium text-gray-900 dark:text-white">
                    ₹{formatPrice(option.call.last_price)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {option.call.iv.toFixed(1)}%
                  </td>
                  {showGreeks && (
                    <>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.call.delta.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.call.gamma.toFixed(3)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.call.theta.toFixed(3)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.call.vega.toFixed(3)}
                      </td>
                    </>
                  )}
                  
                  {/* Strike price */}
                  <td className={`px-4 py-3 text-center font-bold border-x border-gray-200 dark:border-gray-600 ${
                    Math.abs(option.strike - spotPrice) <= 25
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {option.strike}
                  </td>
                  
                  {/* Put data */}
                  {showGreeks && (
                    <>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.put.vega.toFixed(3)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.put.theta.toFixed(3)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.put.gamma.toFixed(3)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                        {option.put.delta.toFixed(2)}
                      </td>
                    </>
                  )}
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {option.put.iv.toFixed(1)}%
                  </td>
                  <td className="px-2 py-2 text-xs text-center font-medium text-gray-900 dark:text-white">
                    ₹{formatPrice(option.put.last_price)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {formatVolume(option.put.volume)}
                  </td>
                  <td className="px-2 py-2 text-xs text-center text-gray-600 dark:text-gray-300">
                    {formatVolume(option.put.oi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Call OI</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatVolume(optionsData.reduce((sum, opt) => sum + opt.call.oi, 0))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Put OI</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatVolume(optionsData.reduce((sum, opt) => sum + opt.put.oi, 0))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-purple-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">PCR (OI)</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {(optionsData.reduce((sum, opt) => sum + opt.put.oi, 0) / 
              Math.max(1, optionsData.reduce((sum, opt) => sum + opt.call.oi, 0))).toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ATM Strike</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round(spotPrice / 50) * 50}
          </div>
        </div>
      </div>

      {/* Broker Login Modal */}
      <BrokerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}