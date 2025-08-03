import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import MiniChart from './MiniChart';

interface MarketCardProps {
  title: string;
  data: any;
  isLoading: boolean;
  error?: string | null;
  lastUpdated?: string;
}

function MarketCard({ title, data, isLoading, error, lastUpdated }: MarketCardProps) {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} />;
    if (change < 0) return <TrendingDown size={16} />;
    return <Activity size={16} />;
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <AlertCircle className="text-red-500" size={20} />
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="animate-spin">
            <RefreshCw size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const price = Number(data.price) || 0;
  const change = Number(data.change) || 0;
  const changePercent = Number(data.changePercent) || 0;
  const volume = Number(data.volume) || 0;
  const dayHigh = Number(data.dayHigh) || price;
  const dayLow = Number(data.dayLow) || price;
  const previousClose = Number(data.previousClose) || price;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {data.isMockData && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded">
              DEMO
            </span>
          )}
          {data.isMarketOpen && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.isMarketOpen ? 'LIVE' : 'CLOSED'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Price and Change */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{price.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(change)}`}>
              {getChangeIcon(change)}
              <span>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}
              </span>
              <span>
                ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          {data.chartData && Array.isArray(data.chartData) && data.chartData.length > 0 && (
            <div className="w-24 h-16">
              <MiniChart 
                data={data.chartData} 
                color={change >= 0 ? '#10b981' : '#ef4444'}
                width={96}
                height={64}
              />
            </div>
          )}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">High:</span>
            <div className="font-medium text-green-600 dark:text-green-400">
              ₹{dayHigh.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Low:</span>
            <div className="font-medium text-red-600 dark:text-red-400">
              ₹{dayLow.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {volume > 0 ? (volume / 1000000).toFixed(1) + 'M' : 'N/A'}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Prev Close:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              ₹{previousClose.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Clock size={12} />
            <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionsCard({ title, data, isLoading, error, lastUpdated }: MarketCardProps) {
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <AlertCircle className="text-red-500" size={20} />
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          {data?.isMockData && (
            <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-2">
              Showing simulated data
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="animate-spin">
            <RefreshCw size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const underlyingValue = Number(data.underlyingValue) || 0;
  const metrics = data.metrics || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {data.isMockData && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded">
              DEMO
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Options Chain
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Underlying Value */}
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            Underlying: ₹{underlyingValue.toFixed(2)}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400">PCR</div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
              {Number(metrics.pcr || 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400">Max Pain</div>
            <div className="text-lg font-bold text-purple-900 dark:text-purple-300">
              ₹{Number(metrics.maxPain || 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* OI Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Call OI:</span>
            <div className="font-medium text-green-600 dark:text-green-400">
              {metrics.totalCallOI ? (Number(metrics.totalCallOI) / 1000000).toFixed(1) + 'M' : 'N/A'}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Put OI:</span>
            <div className="font-medium text-red-600 dark:text-red-400">
              {metrics.totalPutOI ? (Number(metrics.totalPutOI) / 1000000).toFixed(1) + 'M' : 'N/A'}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Call Vol:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {metrics.totalCallVolume ? (Number(metrics.totalCallVolume) / 1000).toFixed(0) + 'K' : 'N/A'}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Put Vol:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {metrics.totalPutVolume ? (Number(metrics.totalPutVolume) / 1000).toFixed(0) + 'K' : 'N/A'}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Clock size={12} />
            <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveMarketCards() {
  const WS_URL = 'ws://localhost:3001';
  const { data: wsData, isConnected, error: wsError, reconnect } = useWebSocket(WS_URL);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  useEffect(() => {
    if (wsData && wsData.lastUpdated) {
      setLastUpdateTime(wsData.lastUpdated);
    }
  }, [wsData]);

  const connectionStatus = () => {
    if (wsError) {
      return (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <WifiOff size={16} />
          <span className="text-sm">Connection Error</span>
          <button 
            onClick={reconnect}
            className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        <span className="text-sm">
          {isConnected ? 'Live Data' : 'Connecting...'}
        </span>
        {isConnected && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Market Data</h2>
        {connectionStatus()}
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nifty Card */}
        <MarketCard
          title="Nifty 50"
          data={wsData?.nifty}
          isLoading={!wsData}
          error={wsData?.errors?.find((e: string) => e.includes('Nifty'))}
          lastUpdated={lastUpdateTime}
        />

        {/* Nifty Options Card */}
        <OptionsCard
          title="Nifty Options"
          data={wsData?.niftyOptions}
          isLoading={!wsData}
          error={wsData?.errors?.find((e: string) => e.includes('Nifty Options'))}
          lastUpdated={lastUpdateTime}
        />

        {/* Bank Nifty Options Card */}
        <OptionsCard
          title="Bank Nifty Options"
          data={wsData?.bankNiftyOptions}
          isLoading={!wsData}
          error={wsData?.errors?.find((e: string) => e.includes('Bank Nifty Options'))}
          lastUpdated={lastUpdateTime}
        />
      </div>

      {/* Data Summary */}
      {wsData && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Update:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {wsData.lastUpdated ? new Date(wsData.lastUpdated).toLocaleString() : 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Data Sources:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                Yahoo Finance + Mock NSE
              </div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Update Frequency:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                Every 5 seconds
              </div>
            </div>
          </div>
          
          {wsData.errors && Array.isArray(wsData.errors) && wsData.errors.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Data Warnings:</h4>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                {wsData.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}