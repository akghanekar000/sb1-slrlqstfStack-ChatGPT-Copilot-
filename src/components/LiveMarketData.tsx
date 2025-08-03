import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Wifi, WifiOff, TrendingUp, TrendingDown, Activity, AlertCircle, LogIn } from 'lucide-react';
import MultiBrokerService from '../services/brokerServices';
import BrokerLoginModal from './BrokerLoginModal';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  lastUpdated: string;
  source: string;
}

export default function LiveMarketData() {
  const [niftyData, setNiftyData] = useState<MarketData | null>(null);
  const [bankNiftyData, setBankNiftyData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeBroker, setActiveBroker] = useState<string | null>(null);

  const checkConnection = useCallback(() => {
    const authenticated = MultiBrokerService.getAuthenticatedBrokers();
    const active = MultiBrokerService.getActiveBroker();
    setIsConnected(authenticated.length > 0);
    setActiveBroker(active);
  }, []);

  const fetchMarketData = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    
    try {
      // Try to fetch live data from authenticated broker
      const niftyQuote = await MultiBrokerService.getQuote('NIFTY 50');
      const bankNiftyQuote = await MultiBrokerService.getQuote('NIFTY BANK');

      if (niftyQuote) {
        setNiftyData({
          symbol: 'NIFTY 50',
          price: niftyQuote.ltp,
          change: niftyQuote.change,
          changePercent: niftyQuote.changePercent,
          volume: niftyQuote.volume,
          high: niftyQuote.high,
          low: niftyQuote.low,
          lastUpdated: new Date().toISOString(),
          source: activeBroker || 'Live'
        });
      } else {
        // Fallback to demo data
        setNiftyData(generateDemoData('NIFTY 50', 19850));
      }

      if (bankNiftyQuote) {
        setBankNiftyData({
          symbol: 'BANK NIFTY',
          price: bankNiftyQuote.ltp,
          change: bankNiftyQuote.change,
          changePercent: bankNiftyQuote.changePercent,
          volume: bankNiftyQuote.volume,
          high: bankNiftyQuote.high,
          low: bankNiftyQuote.low,
          lastUpdated: new Date().toISOString(),
          source: activeBroker || 'Live'
        });
      } else {
        // Fallback to demo data
        setBankNiftyData(generateDemoData('BANK NIFTY', 45320));
      }
      
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      // Fallback to demo data
      setNiftyData(generateDemoData('NIFTY 50', 19850));
      setBankNiftyData(generateDemoData('BANK NIFTY', 45320));
    } finally {
      if (showLoader) setIsRefreshing(false);
    }
  }, [activeBroker]);

  const generateDemoData = (symbol: string, basePrice: number): MarketData => {
    const change = (Math.random() - 0.5) * (basePrice * 0.02);
    const price = basePrice + change;
    
    return {
      symbol,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(((change / basePrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      high: Number((price * 1.01).toFixed(2)),
      low: Number((price * 0.99).toFixed(2)),
      lastUpdated: new Date().toISOString(),
      source: 'Demo'
    };
  };

  const handleManualRefresh = useCallback(async () => {
    await fetchMarketData(true);
  }, [fetchMarketData]);

  const handleLoginSuccess = useCallback((brokerName: string) => {
    setActiveBroker(brokerName);
    checkConnection();
    fetchMarketData(true);
  }, [checkConnection, fetchMarketData]);

  // Auto-refresh every 2 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMarketData();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchMarketData]);

  // Initial data fetch and connection check
  useEffect(() => {
    checkConnection();
    fetchMarketData(true);
  }, [checkConnection, fetchMarketData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(1)}Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(1)}L`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const MarketCard = ({ data }: { data: MarketData | null }) => {
    if (!data) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      );
    }

    const isPositive = data.change >= 0;
    const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const bgColor = isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

    return (
      <div className={`rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${bgColor} transition-colors`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{data.symbol}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              data.source === 'Demo' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {data.source === 'Demo' ? 'DEMO' : 'LIVE'}
            </span>
            {isPositive ? (
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{formatPrice(data.price)}
            </span>
            <span className={`text-sm font-medium ${changeColor}`}>
              {isPositive ? '+' : ''}{formatPrice(data.change)}
            </span>
            <span className={`text-sm font-medium ${changeColor}`}>
              ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">High:</span>
              <div className="font-medium text-green-600 dark:text-green-400">₹{formatPrice(data.high)}</div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Low:</span>
              <div className="font-medium text-red-600 dark:text-red-400">₹{formatPrice(data.low)}</div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Volume:</span>
              <div className="font-medium text-gray-900 dark:text-white">{formatVolume(data.volume)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
            <span>Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'LIVE' : 'DEMO'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="text-blue-600" size={24} />
          Live Market Data
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi size={20} className="text-green-600" />
            ) : (
              <WifiOff size={20} className="text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? `Connected (${activeBroker})` : 'Not Connected'}
            </span>
          </div>

          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-refresh</span>
          </label>

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>

          {/* Login button */}
          {!isConnected && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LogIn size={16} />
              Connect Broker
            </button>
          )}
        </div>
      </div>

      {/* Connection prompt */}
      {!isConnected && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-300">Connect Your Broker for Live Data</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Connect with any SEBI-registered broker to get real-time market data and trading capabilities.
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

      {/* Market data cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketCard data={niftyData} />
        <MarketCard data={bankNiftyData} />
      </div>

      {/* Data source info */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-gray-600 dark:text-gray-400" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-300">Data Source Information</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected 
                ? `Live data from ${activeBroker} • Updates every 2 seconds • SEBI registered broker`
                : 'Demo mode • Connect your broker for real-time data • Supports all major Indian brokers'
              }
            </p>
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