export interface Trade {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  action: 'buy' | 'sell';
  strike: number;
  expiry: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  currentPrice?: number;
  notes?: string;
  status: 'open' | 'closed';
  
  // Greeks
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  
  // Calculated fields
  pnl?: number;
  pnlPercent?: number;
  totalValue?: number;
}

export interface Alert {
  id: string;
  tradeId: string;
  symbol: string;
  type: 'target' | 'stopLoss';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface TradeStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
}