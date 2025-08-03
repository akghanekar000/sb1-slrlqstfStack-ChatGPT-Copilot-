import React from 'react';
import { ChartPoint } from '../types/MarketData';

interface MiniChartProps {
  data: ChartPoint[];
  color: string;
  width?: number;
  height?: number;
}

export default function MiniChart({ data, color, width = 64, height = 32 }: MiniChartProps) {
  if (!data || !Array.isArray(data) || data.length < 2) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center text-gray-500 text-xs"
      >
        No data
      </div>
    );
  }

  try {
    const prices = data
      .map(d => d && typeof d.price === 'number' ? Number(d.price) : null)
      .filter(p => p !== null && !isNaN(p) && isFinite(p)) as number[];
    
    if (prices.length < 2) {
      return (
        <div 
          style={{ width, height }} 
          className="flex items-center justify-center text-gray-500 text-xs"
        >
          Loading...
        </div>
      );
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Create path for the line chart
    const points = data
      .filter(point => point && typeof point.price === 'number' && !isNaN(point.price))
      .map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((Number(point.price) - minPrice) / priceRange) * height;
        return `${x},${y}`;
      }).join(' ');

    // Create area fill path
    const areaPoints = `0,${height} ${points} ${width},${height}`;

    // Determine if trend is up or down
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isUpTrend = lastPrice > firstPrice;

    // Ensure color is valid
    const safeColor = color || '#6b7280';

    return (
      <div style={{ width, height }} className="relative">
        <svg width={width} height={height} className="overflow-visible">
          {/* Area fill with gradient */}
          <defs>
            <linearGradient id={`gradient-${safeColor.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={safeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={safeColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill={`url(#gradient-${safeColor.replace('#', '')})`}
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={safeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* End point indicator */}
          {data.length > 0 && (
            <circle
              cx={(data.length - 1) / (data.length - 1) * width}
              cy={height - ((Number(data[data.length - 1]?.price || 0) - minPrice) / priceRange) * height}
              r="2"
              fill={safeColor}
              stroke="white"
              strokeWidth="1"
            />
          )}
        </svg>
        
        {/* Trend indicator */}
        <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
          isUpTrend ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
    );
  } catch (error) {
    console.error('MiniChart render error:', error);
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center text-red-500 text-xs"
      >
        Error
      </div>
    );
  }
}