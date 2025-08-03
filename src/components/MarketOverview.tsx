import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Zap, Clock } from 'lucide-react';
import { getMarketStatus, shouldUpdateMarketData, getMarketStatusColor } from '../utils/marketHours';

interface MarketMetrics {
  niftyPE: number;
  bankNiftyPE: number;
  vixLevel: number;
  advanceDecline: { advances: number; declines: number };
  sectorRotation: { leader: string; laggard: string };
  optionsActivity: { pcr: number; maxPain: number };
  fiiDii: { fii: number; dii: number };
}

export default function MarketOverview() {
  const [metrics, setMetrics] = useState<MarketMetrics>({
    niftyPE: 22.5,
    bankNiftyPE: 15.8,
    vixLevel: 13.45,
    advanceDecline: { advances: 28, declines: 22 },
    sectorRotation: { leader: 'IT', laggard: 'FMCG' },
    optionsActivity: { pcr: 0.85, maxPain: 19900 },
    fiiDii: { fii: -850, dii: 1200 }
  });

  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  // Update market status every minute
  useEffect(() => {
    const updateMarketStatus = () => {
      setMarketStatus(getMarketStatus());
    };

    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 60000);
    
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const updateMetrics = () => {
      // Only update metrics if market should be updating
      if (!shouldUpdateMarketData()) {
        return;
      }

      setMetrics(prev => ({
        ...prev,
        vixLevel: prev.vixLevel + (Math.random() - 0.5) * 0.5,
        advanceDecline: {
          advances: Math.floor(Math.random() * 10) + 25,
          declines: Math.floor(Math.random() * 10) + 20
        },
        optionsActivity: {
          ...prev.optionsActivity,
          pcr: prev.optionsActivity.pcr + (Math.random() - 0.5) * 0.1
        },
        fiiDii: {
          fii: prev.fiiDii.fii + (Math.random() - 0.5) * 200,
          dii: prev.fiiDii.dii + (Math.random() - 0.5) * 150
        }
      }));
    };

    // Only start interval if market should be updating
    if (shouldUpdateMarketData()) {
      const interval = setInterval(updateMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [marketStatus]);

  const getVixStatus = (vix: number) => {
    if (vix < 12) return { status: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (vix < 16) return { status: 'Normal', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (vix < 20) return { status: 'Elevated', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const vixStatus = getVixStatus(metrics.vixLevel);
  const statusColorClass = getMarketStatusColor(marketStatus.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="text-blue-600" size={20} />
          Indian Market Overview
        </h3>
        
        {/* Market Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}`}>
          {marketStatus.isOpen ? (
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
          ) : (
            <Clock size={12} />
          )}
          <span>
            {marketStatus.isOpen ? 'LIVE' : marketStatus.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Market Status Message */}
      {!marketStatus.isOpen && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-400">
            <Clock size={14} className="inline mr-2" />
            {marketStatus.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VIX Status */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">India VIX</h4>
            <AlertTriangle size={16} className={vixStatus.color} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.vixLevel.toFixed(2)}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${vixStatus.bg} dark:bg-opacity-20 ${vixStatus.color}`}>
              {vixStatus.status}
            </span>
          </div>
          {!marketStatus.isOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Previous Session</div>
          )}
        </div>

        {/* Advance/Decline */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Breadth</h4>
            <TrendingUp size={16} className="text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{metrics.advanceDecline.advances}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Advances</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{metrics.advanceDecline.declines}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Declines</div>
            </div>
          </div>
          {!marketStatus.isOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Previous Session</div>
          )}
        </div>

        {/* Options Activity */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Options Flow</h4>
            <Zap size={16} className="text-purple-600" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">PCR:</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.optionsActivity.pcr.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Max Pain:</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.optionsActivity.maxPain}</span>
            </div>
          </div>
          {!marketStatus.isOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Previous Session</div>
          )}
        </div>

        {/* FII/DII Data */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">FII/DII Flow (₹Cr)</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">FII:</span>
              <span className={`font-medium ${metrics.fiiDii.fii >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.fiiDii.fii >= 0 ? '+' : ''}{metrics.fiiDii.fii.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">DII:</span>
              <span className={`font-medium ${metrics.fiiDii.dii >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.fiiDii.dii >= 0 ? '+' : ''}{metrics.fiiDii.dii.toFixed(0)}
              </span>
            </div>
          </div>
          {!marketStatus.isOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Previous Session</div>
          )}
        </div>

        {/* PE Ratios */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valuations</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Nifty PE:</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.niftyPE}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Bank Nifty PE:</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.bankNiftyPE}</span>
            </div>
          </div>
        </div>

        {/* Sector Rotation */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sector Rotation</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Leader:</span>
              <span className="font-medium text-green-600">{metrics.sectorRotation.leader}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Laggard:</span>
              <span className="font-medium text-red-600">{metrics.sectorRotation.laggard}</span>
            </div>
          </div>
          {!marketStatus.isOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Previous Session</div>
          )}
        </div>

        {/* Market Status */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Market Status</h4>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              marketStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {marketStatus.isOpen ? 'NSE Open' : 'NSE Closed'}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {marketStatus.isOpen ? 'Next close: 3:30 PM IST' : 
             marketStatus.nextOpen ? `Next open: ${marketStatus.nextOpen.toLocaleDateString('en-IN', { 
               weekday: 'short', 
               month: 'short', 
               day: 'numeric' 
             })} 9:15 AM` : 'Check schedule'}
          </div>
        </div>

        {/* Currency */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">USD/INR:</span>
              <span className="font-medium text-gray-900 dark:text-white">83.25</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Change:</span>
              <span className="font-medium text-red-600">+0.15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}