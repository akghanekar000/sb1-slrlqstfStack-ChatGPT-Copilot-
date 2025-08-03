import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Eye, EyeOff, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { IndexData } from '../types/MarketData';
import { getMarketStatus, shouldUpdateMarketData, getMarketStatusColor } from '../utils/marketHours';
import MiniChart from './MiniChart';

// Comprehensive list of Indian stock market indices
const INDIAN_INDICES: IndexData[] = [
  // Major Indices
  {
    symbol: 'NIFTY',
    name: 'Nifty 50',
    price: 19850.25,
    change: 125.30,
    changePercent: 0.63,
    high: 19875.50,
    low: 19720.80,
    volume: 2450000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'SENSEX',
    name: 'BSE Sensex',
    price: 66589.93,
    change: 245.86,
    changePercent: 0.37,
    high: 66750.12,
    low: 66320.45,
    volume: 3200000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Bank Nifty',
    price: 45320.75,
    change: -180.25,
    changePercent: -0.40,
    high: 45580.30,
    low: 45200.15,
    volume: 1850000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  
  // Sectoral Indices - NSE
  {
    symbol: 'NIFTYIT',
    name: 'Nifty IT',
    price: 31245.80,
    change: 156.45,
    changePercent: 0.50,
    high: 31350.25,
    low: 31100.60,
    volume: 850000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYFMCG',
    name: 'Nifty FMCG',
    price: 52180.35,
    change: -89.25,
    changePercent: -0.17,
    high: 52350.80,
    low: 52050.15,
    volume: 420000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYPHARMA',
    name: 'Nifty Pharma',
    price: 14250.60,
    change: 78.90,
    changePercent: 0.56,
    high: 14320.45,
    low: 14180.25,
    volume: 320000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYAUTO',
    name: 'Nifty Auto',
    price: 16890.40,
    change: -125.80,
    changePercent: -0.74,
    high: 17050.20,
    low: 16820.15,
    volume: 280000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYMETAL',
    name: 'Nifty Metal',
    price: 7845.30,
    change: 98.75,
    changePercent: 1.27,
    high: 7890.60,
    low: 7720.45,
    volume: 450000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYREALTY',
    name: 'Nifty Realty',
    price: 520.85,
    change: 12.40,
    changePercent: 2.44,
    high: 525.30,
    low: 508.20,
    volume: 180000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYENERGY',
    name: 'Nifty Energy',
    price: 28450.70,
    change: -156.30,
    changePercent: -0.55,
    high: 28680.90,
    low: 28320.40,
    volume: 380000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYPSE',
    name: 'Nifty PSE',
    price: 4680.25,
    change: 45.80,
    changePercent: 0.99,
    high: 4720.60,
    low: 4620.15,
    volume: 220000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  
  // BSE Sectoral Indices
  {
    symbol: 'BSEIT',
    name: 'BSE IT',
    price: 35680.45,
    change: 189.60,
    changePercent: 0.53,
    high: 35750.20,
    low: 35480.30,
    volume: 650000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'BSEHC',
    name: 'BSE Healthcare',
    price: 28950.80,
    change: 145.25,
    changePercent: 0.50,
    high: 29080.40,
    low: 28820.60,
    volume: 290000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'BSEAUTO',
    name: 'BSE Auto',
    price: 32450.90,
    change: -198.70,
    changePercent: -0.61,
    high: 32720.50,
    low: 32380.25,
    volume: 340000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  
  // Mid & Small Cap Indices
  {
    symbol: 'NIFTYMIDCAP',
    name: 'Nifty Midcap 100',
    price: 42680.35,
    change: 234.80,
    changePercent: 0.55,
    high: 42850.70,
    low: 42420.90,
    volume: 1200000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'NIFTYSMALLCAP',
    name: 'Nifty Smallcap 100',
    price: 13890.60,
    change: 89.45,
    changePercent: 0.65,
    high: 13950.30,
    low: 13780.25,
    volume: 890000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'BSEMIDCAP',
    name: 'BSE Midcap',
    price: 28450.75,
    change: 156.90,
    changePercent: 0.55,
    high: 28580.40,
    low: 28320.60,
    volume: 980000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  {
    symbol: 'BSESMALLCAP',
    name: 'BSE Smallcap',
    price: 31250.80,
    change: 198.45,
    changePercent: 0.64,
    high: 31380.20,
    low: 31120.50,
    volume: 750000,
    lastUpdated: new Date().toISOString(),
    chartData: []
  },
  
  // Volatility Index
  {
    symbol: 'VIX',
    name: 'India VIX',
    price: 13.45,
    change: 0.85,
    changePercent: 6.75,
    high: 13.80,
    low: 12.60,
    volume: 0,
    lastUpdated: new Date().toISOString(),
    chartData: []
  }
];

export default function LiveIndicesBar() {
  const [indices, setIndices] = useState<IndexData[]>(INDIAN_INDICES);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'major' | 'sectoral' | 'midsmall'>('major');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m'>('1m');
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  // Categorize indices
  const majorIndices = indices.filter(idx => 
    ['NIFTY', 'SENSEX', 'BANKNIFTY'].includes(idx.symbol)
  );
  
  const sectoralIndices = indices.filter(idx => 
    idx.symbol.includes('NIFTY') && !['NIFTY', 'BANKNIFTY', 'NIFTYMIDCAP', 'NIFTYSMALLCAP'].includes(idx.symbol) ||
    idx.symbol.includes('BSE') && !['BSEMIDCAP', 'BSESMALLCAP'].includes(idx.symbol)
  );
  
  const midSmallCapIndices = indices.filter(idx => 
    ['NIFTYMIDCAP', 'NIFTYSMALLCAP', 'BSEMIDCAP', 'BSESMALLCAP'].includes(idx.symbol)
  );

  const getCurrentIndices = () => {
    switch (selectedCategory) {
      case 'major': return majorIndices;
      case 'sectoral': return sectoralIndices;
      case 'midsmall': return midSmallCapIndices;
      default: return majorIndices;
    }
  };

  // Generate realistic chart data
  const generateChartData = (basePrice: number, points: number = 20) => {
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * (selectedTimeframe === '1m' ? 60000 : 300000));
      const volatility = 0.002;
      const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
      currentPrice = Math.max(basePrice * 0.98, Math.min(basePrice * 1.02, currentPrice + change));
      
      data.push({
        time: time.toISOString(),
        price: currentPrice
      });
    }
    
    return data;
  };

  // Update market status every minute
  useEffect(() => {
    const updateMarketStatus = () => {
      setMarketStatus(getMarketStatus());
    };

    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 60000); // Check every minute
    
    return () => clearInterval(statusInterval);
  }, []);

  // Update indices with realistic price movements ONLY when market is open
  useEffect(() => {
    const updateIndices = () => {
      // Only update if market should be updating
      if (!shouldUpdateMarketData()) {
        return;
      }

      setIndices(prevIndices => 
        prevIndices.map(index => {
          const volatility = index.symbol === 'VIX' ? 0.05 : 0.003;
          const maxChange = index.price * volatility;
          const randomChange = (Math.random() - 0.5) * 2 * maxChange;
          const newPrice = Math.max(0, index.price + randomChange);
          const change = newPrice - (index.price - index.change);
          const changePercent = (change / (newPrice - change)) * 100;
          
          const chartData = generateChartData(newPrice);
          
          return {
            ...index,
            price: Number(newPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            chartData,
            lastUpdated: new Date().toISOString()
          };
        })
      );
    };

    // Initial chart data generation
    setIndices(prevIndices => 
      prevIndices.map(index => ({
        ...index,
        chartData: generateChartData(index.price)
      }))
    );

    // Only start interval if market should be updating
    if (shouldUpdateMarketData()) {
      const interval = setInterval(updateIndices, selectedTimeframe === '1m' ? 5000 : 15000);
      return () => clearInterval(interval);
    }
  }, [selectedTimeframe]);

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getBackgroundColor = (change: number) => {
    if (change > 0) return 'bg-green-900/20';
    if (change < 0) return 'bg-red-900/20';
    return 'bg-gray-800';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
  };

  const statusColorClass = getMarketStatusColor(marketStatus.status);

  return (
    <div className="bg-gray-900 text-white border-b border-gray-700 relative z-30">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        {/* Compact view - Always visible */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
            {majorIndices.slice(0, 3).map((index) => (
              <div key={index.symbol} className={`flex items-center gap-2 min-w-0 flex-shrink-0 px-3 py-1 rounded-md transition-colors ${getBackgroundColor(index.change)}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-300">{index.symbol}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{formatNumber(index.price)}</span>
                    <div className={`flex items-center gap-1 text-xs ${getChangeColor(index.change)}`}>
                      {index.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}</span>
                      <span>({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>
                {index.chartData.length > 0 && marketStatus.isOpen && (
                  <div className="ml-2">
                    <MiniChart 
                      data={index.chartData} 
                      color={index.change >= 0 ? '#10b981' : '#ef4444'}
                      width={40}
                      height={20}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${statusColorClass}`}>
              {marketStatus.isOpen ? (
                <Eye size={12} className="animate-pulse" />
              ) : (
                <Clock size={12} />
              )}
              <span className="font-medium">
                {marketStatus.isOpen ? 'LIVE' : marketStatus.status.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Activity size={16} />
              <span className="text-sm hidden sm:inline">Markets</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
        
        {/* Expanded view - Overlay style to not affect main content */}
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-2xl z-40">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 pb-6 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Indian Stock Market Dashboard</h3>
                <div className="flex items-center gap-4">
                  {/* Category Selector */}
                  <div className="flex bg-gray-800 rounded-md overflow-hidden">
                    <button
                      onClick={() => setSelectedCategory('major')}
                      className={`px-3 py-1 text-xs transition-colors ${
                        selectedCategory === 'major' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Major
                    </button>
                    <button
                      onClick={() => setSelectedCategory('sectoral')}
                      className={`px-3 py-1 text-xs transition-colors ${
                        selectedCategory === 'sectoral' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Sectoral
                    </button>
                    <button
                      onClick={() => setSelectedCategory('midsmall')}
                      className={`px-3 py-1 text-xs transition-colors ${
                        selectedCategory === 'midsmall' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Mid/Small
                    </button>
                  </div>
                  
                  {/* Timeframe Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Timeframe:</span>
                    <div className="flex bg-gray-800 rounded-md overflow-hidden">
                      <button
                        onClick={() => setSelectedTimeframe('1m')}
                        className={`px-3 py-1 text-xs transition-colors ${
                          selectedTimeframe === '1m' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        1M
                      </button>
                      <button
                        onClick={() => setSelectedTimeframe('5m')}
                        className={`px-3 py-1 text-xs transition-colors ${
                          selectedTimeframe === '5m' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        5M
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Status Banner */}
              <div className={`mb-6 p-4 rounded-lg border ${statusColorClass.replace('text-', 'border-').replace('bg-', 'bg-').replace('/30', '/20')}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {marketStatus.isOpen ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    ) : (
                      <Clock size={16} className="text-current" />
                    )}
                    <div>
                      <h4 className="font-semibold text-current">
                        {marketStatus.isOpen ? 'Market is LIVE' : 'Market Closed'}
                      </h4>
                      <p className="text-sm opacity-80">{marketStatus.message}</p>
                    </div>
                  </div>
                  {marketStatus.nextOpen && (
                    <div className="text-right text-sm opacity-80">
                      <div>Next Open:</div>
                      <div className="font-medium">
                        {marketStatus.nextOpen.toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })} at 9:15 AM
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Indices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {getCurrentIndices().map((index) => (
                  <div key={index.symbol} className={`rounded-lg p-4 border transition-colors ${
                    index.change >= 0 
                      ? 'bg-green-900/10 border-green-500/20' 
                      : 'bg-red-900/10 border-red-500/20'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-200">{index.name}</h4>
                        <span className="text-xs text-gray-400">{index.symbol}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        index.change >= 0 
                          ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                          : 'bg-red-900/50 text-red-300 border border-red-500/30'
                      }`}>
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold">{index.price.toFixed(2)}</div>
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(index.change)}`}>
                        {index.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mb-3 bg-gray-800/50 rounded p-2">
                      {index.chartData.length > 0 && marketStatus.isOpen ? (
                        <MiniChart 
                          data={index.chartData} 
                          color={index.change >= 0 ? '#10b981' : '#ef4444'}
                          width={180}
                          height={50}
                        />
                      ) : (
                        <div className="h-12 flex items-center justify-center text-gray-500 text-xs">
                          {marketStatus.isOpen ? 'Loading chart...' : 'Market Closed'}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span>High: </span>
                        <span className="text-green-400">{index.high.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Low: </span>
                        <span className="text-red-400">{index.low.toFixed(2)}</span>
                      </div>
                      {index.volume > 0 && (
                        <div className="col-span-2">
                          <span>Volume: </span>
                          <span className="text-blue-400">{(index.volume / 1000000).toFixed(1)}M</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {marketStatus.isOpen ? new Date(index.lastUpdated).toLocaleTimeString() : 'Market Closed'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Market Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Market Sentiment</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      indices.filter(i => i.change > 0).length > indices.filter(i => i.change < 0).length
                        ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      {indices.filter(i => i.change > 0).length > indices.filter(i => i.change < 0).length
                        ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">VIX Alert</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      indices.find(i => i.symbol === 'VIX')?.price! > 15 ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm">
                      {indices.find(i => i.symbol === 'VIX')?.price! > 15 ? 'High Volatility' : 'Normal'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Market Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      marketStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      {marketStatus.isOpen ? 'NSE Open' : 'NSE Closed'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Active Indices</h4>
                  <div className="text-lg font-bold text-white">
                    {indices.length}
                  </div>
                  <div className="text-xs text-gray-400">NSE + BSE</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}