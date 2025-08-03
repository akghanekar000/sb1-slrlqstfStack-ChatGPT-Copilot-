export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: string;
  chartData: ChartPoint[];
}

export interface ChartPoint {
  time: string;
  price: number;
}

export interface StockIndicators {
  symbol: string;
  ltp: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  openInterest: number;
  oiChange: number;
  impliedVolatility: number;
  putCallRatio: number;
  
  // Technical Indicators
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  adx: number;
  
  // Greeks
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  
  trendSuggestion: TrendSuggestion;
}

export interface TrendSuggestion {
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  message: string;
  color: string;
}

export interface HeatmapData {
  symbol: string;
  strike: number;
  type: 'CE' | 'PE';
  volume: number;
  oi: number;
  oiChange: number;
  iv: number;
  ltp: number;
  change: number;
  intensity: number; // 0-100 for heatmap coloring
}

export interface AlertTrigger {
  id: string;
  type: 'rsi' | 'oi_buildup' | 'iv_spike' | 'volume_surge';
  symbol: string;
  condition: string;
  threshold: number;
  currentValue: number;
  triggered: boolean;
  createdAt: string;
}