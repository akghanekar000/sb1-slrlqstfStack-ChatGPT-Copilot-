import { Trade, TradeStats } from '../types/Trade';

// Enhanced calculation cache with size limits
const calculationCache = new Map<string, { pnl: number; pnlPercent: number; timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

function cleanCache() {
  const now = Date.now();
  const entries = Array.from(calculationCache.entries());
  
  // Remove expired entries
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_EXPIRY) {
      calculationCache.delete(key);
    }
  });
  
  // If still too large, remove oldest entries
  if (calculationCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, calculationCache.size - MAX_CACHE_SIZE);
    
    sortedEntries.forEach(([key]) => calculationCache.delete(key));
  }
}

export function calculatePnL(trade: Trade): { pnl: number; pnlPercent: number } {
  try {
    // Validate input thoroughly
    if (!trade || typeof trade !== 'object' || !trade.id) {
      return { pnl: 0, pnlPercent: 0 };
    }

    // Safely extract and validate values
    const entryPrice = Number(trade.entryPrice);
    const exitPrice = Number(trade.exitPrice) || Number(trade.currentPrice) || 0;
    const quantity = Number(trade.quantity);
    const action = trade.action;
    
    // Validate all required values
    if (!entryPrice || entryPrice <= 0 || 
        !quantity || quantity <= 0 || 
        isNaN(entryPrice) || isNaN(quantity) ||
        !action || (action !== 'buy' && action !== 'sell')) {
      return { pnl: 0, pnlPercent: 0 };
    }

    // For open positions without current price
    if (!exitPrice || exitPrice <= 0 || isNaN(exitPrice)) {
      return { pnl: 0, pnlPercent: 0 };
    }

    // Create cache key
    const cacheKey = `${trade.id}-${entryPrice}-${exitPrice}-${quantity}-${action}`;
    
    // Check cache
    const cached = calculationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return { pnl: cached.pnl, pnlPercent: cached.pnlPercent };
    }

    // Calculate P&L for Indian options (lot size varies by symbol)
    const multiplier = action === 'buy' ? 1 : -1;
    const priceDiff = exitPrice - entryPrice;
    
    // Indian options lot sizes (approximate)
    let lotSize = 75; // Default Nifty lot size
    if (trade.symbol?.includes('BANKNIFTY')) lotSize = 25;
    else if (trade.symbol?.includes('NIFTY')) lotSize = 75;
    else if (trade.symbol?.includes('FINNIFTY')) lotSize = 40;
    else lotSize = 1; // For individual stocks, quantity is actual lots
    
    const pnl = priceDiff * quantity * lotSize * multiplier;
    const pnlPercent = entryPrice > 0 ? (priceDiff / entryPrice) * 100 * multiplier : 0;
    
    // Validate results
    const safePnl = isNaN(pnl) || !isFinite(pnl) ? 0 : Number(pnl.toFixed(2));
    const safePnlPercent = isNaN(pnlPercent) || !isFinite(pnlPercent) ? 0 : Number(pnlPercent.toFixed(2));
    
    const result = { pnl: safePnl, pnlPercent: safePnlPercent };
    
    // Cache the result with timestamp
    calculationCache.set(cacheKey, { ...result, timestamp: Date.now() });
    
    // Clean cache periodically
    if (calculationCache.size > MAX_CACHE_SIZE) {
      cleanCache();
    }
    
    return result;
  } catch (error) {
    console.error('PnL calculation error:', error, trade);
    return { pnl: 0, pnlPercent: 0 };
  }
}

export function calculateTradeStats(trades: Trade[]): TradeStats {
  try {
    // Validate input
    if (!Array.isArray(trades) || trades.length === 0) {
      return {
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0
      };
    }

    // Filter valid trades
    const validTrades = trades.filter(trade => 
      trade && 
      typeof trade === 'object' && 
      trade.id && 
      typeof trade.id === 'string' &&
      trade.symbol &&
      typeof trade.entryPrice === 'number' &&
      trade.entryPrice > 0 &&
      typeof trade.quantity === 'number' &&
      trade.quantity > 0 &&
      (trade.action === 'buy' || trade.action === 'sell') &&
      (trade.type === 'call' || trade.type === 'put') &&
      (trade.status === 'open' || trade.status === 'closed')
    );

    if (validTrades.length === 0) {
      return {
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0
      };
    }

    const closedTrades = validTrades.filter(t => t.status === 'closed');
    const openTrades = validTrades.filter(t => t.status === 'open');
    
    let totalPnL = 0;
    const winningTrades: number[] = [];
    const losingTrades: number[] = [];
    
    validTrades.forEach(trade => {
      try {
        const { pnl } = calculatePnL(trade);
        if (typeof pnl === 'number' && !isNaN(pnl) && isFinite(pnl)) {
          totalPnL += pnl;
          
          // Only count closed trades for win/loss statistics
          if (trade.status === 'closed') {
            if (pnl > 0) {
              winningTrades.push(pnl);
            } else if (pnl < 0) {
              losingTrades.push(Math.abs(pnl));
            }
          }
        }
      } catch (error) {
        console.error('Trade stats calculation error for trade:', trade.id, error);
      }
    });
    
    // Calculate statistics safely
    const totalClosedTrades = closedTrades.length;
    const winRate = totalClosedTrades > 0 ? (winningTrades.length / totalClosedTrades) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, win) => sum + win, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
      losingTrades.reduce((sum, loss) => sum + loss, 0) / losingTrades.length : 0;

    return {
      totalTrades: validTrades.length,
      openTrades: openTrades.length,
      closedTrades: totalClosedTrades,
      totalPnL: Number(totalPnL.toFixed(2)),
      winRate: Number(winRate.toFixed(2)),
      avgWin: Number(avgWin.toFixed(2)),
      avgLoss: Number(avgLoss.toFixed(2))
    };
  } catch (error) {
    console.error('Trade stats calculation error:', error);
    return {
      totalTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      totalPnL: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0
    };
  }
}

export function formatCurrency(amount: number): string {
  try {
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
      return '₹0.00';
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '₹0.00';
  }
}

export function formatPercent(percent: number): string {
  try {
    if (typeof percent !== 'number' || isNaN(percent) || !isFinite(percent)) {
      return '0.00%';
    }
    
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  } catch (error) {
    console.error('Percent formatting error:', error);
    return '0.00%';
  }
}

export function formatNumber(num: number): string {
  try {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      return '0';
    }
    
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + 'Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  } catch (error) {
    console.error('Number formatting error:', error);
    return '0';
  }
}