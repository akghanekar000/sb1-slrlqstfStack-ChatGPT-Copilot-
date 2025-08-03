import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, Volume, Zap, X } from 'lucide-react';
import { StockIndicators } from '../types/MarketData';

interface StockIndicatorPanelProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockIndicatorPanel({ symbol, isOpen, onClose }: StockIndicatorPanelProps) {
  const [indicators, setIndicators] = useState<StockIndicators | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && symbol) {
      setLoading(true);
      setError(null);
      
      // Simulate API call with error handling
      const timer = setTimeout(() => {
        try {
          const mockIndicators: StockIndicators = {
            symbol,
            ltp: 150.25 + Math.random() * 10,
            dayHigh: 155.80,
            dayLow: 148.20,
            change: 2.35,
            changePercent: 1.58,
            volume: 2450000,
            avgVolume: 1800000,
            openInterest: 15000000,
            oiChange: 5.2,
            impliedVolatility: 18.5,
            putCallRatio: 0.85,
            
            ema20: 149.80,
            ema50: 147.25,
            ema200: 142.10,
            rsi: 65.4,
            macd: 1.25,
            macdSignal: 0.95,
            adx: 28.5,
            
            delta: 0.65,
            gamma: 0.05,
            theta: -0.08,
            vega: 0.12,
            
            trendSuggestion: {
              signal: 'bullish',
              strength: 'strong',
              message: 'Strong bullish momentum above EMA200 with high volume',
              color: 'text-green-600'
            }
          };
          setIndicators(mockIndicators);
          setLoading(false);
        } catch (err) {
          console.error('Indicator loading error:', err);
          setError('Failed to load indicators');
          setLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, symbol]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Indicators - {symbol}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading live data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Activity size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : indicators ? (
          <div className="space-y-6">
            {/* Price Action */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="text-blue-600" size={20} />
                Price Action
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">LTP</p>
                  <p className="text-xl font-bold text-gray-900">${(indicators.ltp || 0).toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Day High</p>
                  <p className="text-lg font-semibold text-green-600">${(indicators.dayHigh || 0).toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Day Low</p>
                  <p className="text-lg font-semibold text-red-600">${(indicators.dayLow || 0).toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Change</p>
                  <p className={`text-lg font-semibold ${(indicators.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(indicators.change || 0) >= 0 ? '+' : ''}{(indicators.change || 0).toFixed(2)} ({(indicators.changePercent || 0).toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="text-purple-600" size={20} />
                Technical Indicators
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">EMA 20</p>
                  <p className="font-semibold">${(indicators.ema20 || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMA 50</p>
                  <p className="font-semibold">${(indicators.ema50 || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMA 200</p>
                  <p className="font-semibold">${(indicators.ema200 || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RSI</p>
                  <p className={`font-semibold ${
                    (indicators.rsi || 0) > 70 ? 'text-red-600' : (indicators.rsi || 0) < 30 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {(indicators.rsi || 0).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MACD</p>
                  <p className="font-semibold">{(indicators.macd || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MACD Signal</p>
                  <p className="font-semibold">{(indicators.macdSignal || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ADX</p>
                  <p className={`font-semibold ${
                    (indicators.adx || 0) > 25 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {(indicators.adx || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Volume & OI Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Volume className="text-orange-600" size={20} />
                Volume & Open Interest
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Live Volume</p>
                  <p className="font-semibold">{((indicators.volume || 0) / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Volume</p>
                  <p className="font-semibold">{((indicators.avgVolume || 0) / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Interest</p>
                  <p className="font-semibold">{((indicators.openInterest || 0) / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">OI Change</p>
                  <p className={`font-semibold ${(indicators.oiChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(indicators.oiChange || 0) >= 0 ? '+' : ''}{(indicators.oiChange || 0).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Implied Volatility</p>
                  <p className="font-semibold">{(indicators.impliedVolatility || 0).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Put/Call Ratio</p>
                  <p className="font-semibold">{(indicators.putCallRatio || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Option Greeks */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-600" size={20} />
                Live Option Greeks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Delta</p>
                  <p className="font-semibold">{(indicators.delta || 0).toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gamma</p>
                  <p className="font-semibold">{(indicators.gamma || 0).toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Theta</p>
                  <p className="font-semibold text-red-600">{(indicators.theta || 0).toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vega</p>
                  <p className="font-semibold">{(indicators.vega || 0).toFixed(3)}</p>
                </div>
              </div>
            </div>

            {/* Trend Suggestion */}
            {indicators.trendSuggestion && (
              <div className={`rounded-lg p-4 ${
                indicators.trendSuggestion.signal === 'bullish' ? 'bg-green-50 border border-green-200' :
                indicators.trendSuggestion.signal === 'bearish' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  {indicators.trendSuggestion.signal === 'bullish' ? (
                    <TrendingUp className="text-green-600" size={20} />
                  ) : indicators.trendSuggestion.signal === 'bearish' ? (
                    <TrendingDown className="text-red-600" size={20} />
                  ) : (
                    <Activity className="text-yellow-600" size={20} />
                  )}
                  Trend Analysis
                </h3>
                <p className={`font-medium ${indicators.trendSuggestion.color || 'text-gray-900'}`}>
                  {indicators.trendSuggestion.message || 'No trend analysis available'}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-gray-600">Signal:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    indicators.trendSuggestion.signal === 'bullish' ? 'bg-green-100 text-green-800' :
                    indicators.trendSuggestion.signal === 'bearish' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(indicators.trendSuggestion.signal || 'neutral').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">Strength:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">
                    {(indicators.trendSuggestion.strength || 'moderate').toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Activity size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Unable to load indicator data for {symbol}</p>
          </div>
        )}
      </div>
    </div>
  );
}