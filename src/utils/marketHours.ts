export interface MarketStatus {
  isOpen: boolean;
  nextOpen: Date | null;
  nextClose: Date | null;
  status: 'pre-market' | 'open' | 'closed' | 'post-market';
  message: string;
}

export interface MarketHoliday {
  date: string;
  name: string;
}

// Indian market holidays for 2024 (NSE/BSE)
const INDIAN_MARKET_HOLIDAYS: MarketHoliday[] = [
  { date: '2024-01-26', name: 'Republic Day' },
  { date: '2024-03-08', name: 'Holi' },
  { date: '2024-03-29', name: 'Good Friday' },
  { date: '2024-04-11', name: 'Id-Ul-Fitr' },
  { date: '2024-04-17', name: 'Ram Navami' },
  { date: '2024-05-01', name: 'Maharashtra Day' },
  { date: '2024-06-17', name: 'Bakri Id' },
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-08-26', name: 'Ganesh Chaturthi' },
  { date: '2024-10-02', name: 'Gandhi Jayanti' },
  { date: '2024-10-31', name: 'Diwali Laxmi Puja' },
  { date: '2024-11-01', name: 'Diwali Balipratipada' },
  { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
  { date: '2024-12-25', name: 'Christmas' }
];

export function isMarketHoliday(date: Date): MarketHoliday | null {
  const dateStr = date.toISOString().split('T')[0];
  return INDIAN_MARKET_HOLIDAYS.find(holiday => holiday.date === dateStr) || null;
}

export function getMarketStatus(): MarketStatus {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  // Check if it's a weekend (Saturday = 6, Sunday = 0)
  const dayOfWeek = istTime.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const nextMonday = new Date(istTime);
    nextMonday.setDate(istTime.getDate() + (dayOfWeek === 0 ? 1 : 2));
    nextMonday.setHours(9, 15, 0, 0);
    
    return {
      isOpen: false,
      nextOpen: nextMonday,
      nextClose: null,
      status: 'closed',
      message: `Markets closed for weekend. Next open: ${nextMonday.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })} at 9:15 AM`
    };
  }
  
  // Check if it's a market holiday
  const holiday = isMarketHoliday(istTime);
  if (holiday) {
    const nextDay = new Date(istTime);
    nextDay.setDate(istTime.getDate() + 1);
    
    // Find next trading day (skip weekends and holidays)
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6 || isMarketHoliday(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    nextDay.setHours(9, 15, 0, 0);
    
    return {
      isOpen: false,
      nextOpen: nextDay,
      nextClose: null,
      status: 'closed',
      message: `Markets closed for ${holiday.name}. Next open: ${nextDay.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })} at 9:15 AM`
    };
  }
  
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  // Market timings in IST
  const preMarketStart = 9 * 60; // 9:00 AM
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  const postMarketEnd = 16 * 60; // 4:00 PM
  
  const today = new Date(istTime);
  const tomorrow = new Date(istTime);
  tomorrow.setDate(istTime.getDate() + 1);
  
  if (currentTime < preMarketStart) {
    // Before pre-market
    const nextOpen = new Date(today);
    nextOpen.setHours(9, 15, 0, 0);
    
    return {
      isOpen: false,
      nextOpen,
      nextClose: null,
      status: 'closed',
      message: `Markets open at 9:15 AM (${Math.floor((preMarketStart - currentTime) / 60)}h ${(preMarketStart - currentTime) % 60}m remaining)`
    };
  } else if (currentTime < marketOpen) {
    // Pre-market session
    const nextOpen = new Date(today);
    nextOpen.setHours(9, 15, 0, 0);
    const nextClose = new Date(today);
    nextClose.setHours(15, 30, 0, 0);
    
    return {
      isOpen: false,
      nextOpen,
      nextClose,
      status: 'pre-market',
      message: `Pre-market session. Trading starts at 9:15 AM (${Math.floor((marketOpen - currentTime) / 60)}h ${(marketOpen - currentTime) % 60}m remaining)`
    };
  } else if (currentTime < marketClose) {
    // Market is open
    const nextClose = new Date(today);
    nextClose.setHours(15, 30, 0, 0);
    
    return {
      isOpen: true,
      nextOpen: null,
      nextClose,
      status: 'open',
      message: `Market is LIVE! Closes at 3:30 PM (${Math.floor((marketClose - currentTime) / 60)}h ${(marketClose - currentTime) % 60}m remaining)`
    };
  } else if (currentTime < postMarketEnd) {
    // Post-market session
    let nextTradingDay = new Date(tomorrow);
    
    // Skip weekends and holidays
    while (nextTradingDay.getDay() === 0 || nextTradingDay.getDay() === 6 || isMarketHoliday(nextTradingDay)) {
      nextTradingDay.setDate(nextTradingDay.getDate() + 1);
    }
    nextTradingDay.setHours(9, 15, 0, 0);
    
    return {
      isOpen: false,
      nextOpen: nextTradingDay,
      nextClose: null,
      status: 'post-market',
      message: `Post-market session. Next trading: ${nextTradingDay.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })} at 9:15 AM`
    };
  } else {
    // After market hours
    let nextTradingDay = new Date(tomorrow);
    
    // Skip weekends and holidays
    while (nextTradingDay.getDay() === 0 || nextTradingDay.getDay() === 6 || isMarketHoliday(nextTradingDay)) {
      nextTradingDay.setDate(nextTradingDay.getDate() + 1);
    }
    nextTradingDay.setHours(9, 15, 0, 0);
    
    return {
      isOpen: false,
      nextOpen: nextTradingDay,
      nextClose: null,
      status: 'closed',
      message: `Markets closed. Next trading: ${nextTradingDay.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })} at 9:15 AM`
    };
  }
}

export function shouldUpdateMarketData(): boolean {
  const status = getMarketStatus();
  return status.isOpen || status.status === 'pre-market';
}

export function getMarketStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    case 'pre-market':
      return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    case 'post-market':
      return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
    case 'closed':
      return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
  }
}