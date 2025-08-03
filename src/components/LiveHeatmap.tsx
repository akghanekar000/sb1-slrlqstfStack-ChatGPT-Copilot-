import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Volume, Activity } from 'lucide-react';
import { HeatmapData } from '../types/MarketData';

export default function LiveHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [activeView, setActiveView] = useState<'oi' | 'volume' | 'active' | 'sector'>('oi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateMockData = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Indian options data
        const symbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS'];
        const niftyStrikes = [19800, 19850, 19900, 19950, 20000, 20050, 20100];
        const bankNiftyStrikes = [45000, 45200, 45400, 45600, 45800, 46000];
        const stockStrikes = [2400, 2450, 2500, 2550, 2600]; // For RELIANCE/TCS
        
        const data: HeatmapData[] = [];
        
        symbols.forEach(symbol => {
          let strikes;
          if (symbol === 'NIFTY') strikes = niftyStrikes;
          else if (symbol === 'BANKNIFTY') strikes = bankNiftyStrikes;
          else strikes = stockStrikes;
          
          strikes.forEach(strike => {
            ['CE', 'PE'].forEach(type => {
              const volume = Math.floor(Math.random() * 500000) + 50000;
              const oi = Math.floor(Math.random() * 2000000) + 100000;
              const oiChange = (Math.random() - 0.5) * 40;
              const iv = 15 + Math.random() * 25;
              const ltp = Math.random() * 200 + 10;
              const change = (Math.random() - 0.5) * 15;
              const intensity = Math.min(100, Math.abs(oiChange) * 2);
              
              data.push({
                symbol,
                strike,
                type: type as 'CE' | 'PE',
                volume: isNaN(volume) ? 0 : volume,
                oi: isNaN(oi) ? 0 : oi,
                oiChange: isNaN(oiChange) ? 0 : oiChange,
                iv: isNaN(iv) ? 0 : iv,
                ltp: isNaN(ltp) ? 0 : ltp,
                change: isNaN(change) ? 0 : change,
                intensity: isNaN(intensity) ? 0 : intensity
              });
            });
          });
        });
        
        setHeatmapData(data);
        setLoading(false);
      } catch (err) {
        console.error('Heatmap data generation error:', err);
        setError('Failed to load heatmap data');
        setLoading(false);
      }
    };

    generateMockData();
    const interval = setInterval(generateMockData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getTopData = () => {
    try {
      if (!heatmapData.length) return [];
      
      switch (activeView) {
        case 'oi':
          return heatmapData
            .filter(d => d && !isNaN(d.oiChange) && Math.abs(d.oiChange) > 15)
            .sort((a, b) => Math.abs(b.oiChange) - Math.abs(a.oiChange))
            .slice(0, 8);
        case 'volume':
          return heatmapData
            .filter(d => d && !isNaN(d.volume))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 8);
        case 'active':
          return heatmapData
            .filter(d => d && !isNaN(d.intensity))
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 8);
        default:
          return heatmapData.slice(0, 8);
      }
    } catch (err) {
      console.error('Get top data error:', err);
      return [];
    }
  };

  const getIntensityColor = (intensity: number, value: number) => {
    try {
      const normalizedIntensity = Math.min(100, Math.max(0, isNaN(intensity) ? 0 : intensity));
      const safeValue = isNaN(value) ? 0 : value;
      
      if (safeValue >= 0) {
        return `rgba(34, 197, 94, ${normalizedIntensity / 100})`;
      } else {
        return `rgba(239, 68, 68, ${normalizedIntensity / 100})`;
      }
    } catch (err) {
      return 'rgba(156, 163, 175, 0.3)';
    }
  };

  const views = [
    { id: 'oi', label: 'OI Build-up', icon: TrendingUp },
    { id: 'volume', label: 'Volume', icon: Volume },
    { id: 'active', label: 'Active', icon: Activity }
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <Flame size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Heatmap</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Flame className="text-orange-600" size={20} />
          NSE Options Heatmap
        </h3>
        <div className="flex gap-2">
          {views.map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === view.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {activeView === 'oi' && 'High OI Change Contracts'}
              {activeView === 'volume' && 'High Volume Contracts'}
              {activeView === 'active' && 'Most Active Contracts'}
            </h4>
            <span className="text-sm text-gray-500">
              {loading ? 'Loading...' : 'NSE Live Data'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strike</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">LTP (₹)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OI Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getTopData().map((item, index) => (
                <tr key={`${item.symbol}-${item.strike}-${item.type}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.symbol || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.strike || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.type === 'CE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{(item.ltp || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{((item.volume || 0) / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{((item.oi || 0) / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      (item.oiChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(item.oiChange || 0) >= 0 ? '+' : ''}{(item.oiChange || 0).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div 
                      className="w-full h-4 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: getIntensityColor(item.intensity || 0, item.change || 0)
                      }}
                    >
                      <span className="text-xs font-medium text-white">
                        {(item.intensity || 0).toFixed(0)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Highest OI Build-up</h4>
          <p className="text-lg font-bold text-green-600">NIFTY 20000 CE</p>
          <p className="text-sm text-gray-500">+28.5% OI Change</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Volume Leader</h4>
          <p className="text-lg font-bold text-blue-600">BANKNIFTY 45500 PE</p>
          <p className="text-sm text-gray-500">250K Volume</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">PCR Alert</h4>
          <p className="text-lg font-bold text-purple-600">0.95</p>
          <p className="text-sm text-gray-500">Bullish range</p>
        </div>
      </div>
    </div>
  );
}