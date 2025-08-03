import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, Bell, TrendingUp, Activity, Timer, Target } from 'lucide-react';
import { getMarketStatus, shouldUpdateMarketData, getMarketStatusColor } from '../utils/marketHours';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ExpiryContract {
  symbol: string;
  expiry: string;
  type: 'weekly' | 'monthly';
  daysRemaining: number;
}

interface MarketEvent {
  date: string;
  event: string;
  type: 'expiry' | 'holiday' | 'economic';
}

export default function MarketTimeManager() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const [showCountdowns, setShowCountdowns] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setMarketStatus(getMarketStatus());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const getNextMarketEvent = () => {
    if (marketStatus.isOpen && marketStatus.nextClose) {
      return {
        event: 'Market Close',
        time: marketStatus.nextClose,
        type: 'close' as const
      };
    } else if (marketStatus.nextOpen) {
      return {
        event: 'Market Open',
        time: marketStatus.nextOpen,
        type: 'open' as const
      };
    }
    return null;
  };

  const nextEvent = getNextMarketEvent();
  const timeToEvent = nextEvent ? calculateTimeRemaining(nextEvent.time) : null;

  // Mock upcoming expiries (in real app, this would come from user's positions)
  const upcomingExpiries: ExpiryContract[] = [
    { symbol: 'NIFTY 20000 CE', expiry: '2024-01-25', type: 'weekly', daysRemaining: 2 },
    { symbol: 'BANKNIFTY 45500 PE', expiry: '2024-01-25', type: 'weekly', daysRemaining: 2 },
    { symbol: 'RELIANCE 2500 CE', expiry: '2024-01-31', type: 'monthly', daysRemaining: 8 }
  ];

  // Mock market events
  const marketEvents: MarketEvent[] = [
    { date: '2024-01-25', event: 'Weekly Options Expiry', type: 'expiry' },
    { date: '2024-01-26', event: 'Republic Day Holiday', type: 'holiday' },
    { date: '2024-01-31', event: 'Monthly Options Expiry', type: 'expiry' },
    { date: '2024-02-01', event: 'RBI Policy Meeting', type: 'economic' }
  ];

  const getMarketStateDisplay = () => {
    const statusColorClass = getMarketStatusColor(marketStatus.status);
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}`}>
        {marketStatus.isOpen ? (
          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
        ) : (
          <Clock size={12} />
        )}
        <span>
          {marketStatus.status === 'open' ? 'LIVE' : 
           marketStatus.status === 'pre-market' ? 'PRE-MARKET' :
           marketStatus.status === 'post-market' ? 'POST-MARKET' : 'CLOSED'}
        </span>
      </div>
    );
  };

  const formatTimeRemaining = (time: TimeRemaining) => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.minutes}m ${time.seconds}s`;
    }
  };

  const getExpiryUrgency = (daysRemaining: number) => {
    if (daysRemaining <= 1) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
    if (daysRemaining <= 3) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    if (daysRemaining <= 7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
  };

  return (
    <div className="space-y-4">
      {/* Live Market Clock & Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Live Market Clock (IST)
          </h3>
          {getMarketStateDisplay()}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              {currentTime.toLocaleTimeString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                hour12: false 
              })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {currentTime.toLocaleDateString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          {nextEvent && timeToEvent && (
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
                {formatTimeRemaining(timeToEvent)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                Until {nextEvent.event}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {marketStatus.message}
        </div>
      </div>

      {/* Market Session Countdown */}
      {showCountdowns && nextEvent && timeToEvent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Timer className="text-purple-600" size={20} />
              Market Session Countdown
            </h3>
            <button
              onClick={() => setShowCountdowns(!showCountdowns)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Hide
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timeToEvent.days}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Days</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timeToEvent.hours}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Hours</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timeToEvent.minutes}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Minutes</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timeToEvent.seconds}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Seconds</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Session Progress</span>
              <span>{nextEvent.type === 'close' ? 'Market Open' : 'Previous Close'} → {nextEvent.event}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  nextEvent.type === 'close' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ 
                  width: nextEvent.type === 'close' ? 
                    `${((6.25 * 60) - (timeToEvent.hours * 60 + timeToEvent.minutes)) / (6.25 * 60) * 100}%` : 
                    '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Expiry Timer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="text-orange-600" size={20} />
            Contract Expiry Tracker
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {upcomingExpiries.length} Active Positions
          </span>
        </div>
        
        <div className="space-y-3">
          {upcomingExpiries.map((contract, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getExpiryUrgency(contract.daysRemaining)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{contract.symbol}</div>
                  <div className="text-sm opacity-80">
                    Expires: {new Date(contract.expiry).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {contract.daysRemaining}
                  </div>
                  <div className="text-xs">
                    {contract.daysRemaining === 1 ? 'Day' : 'Days'} Left
                  </div>
                </div>
              </div>
              
              {/* Expiry Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-white/50 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full bg-current transition-all duration-500"
                    style={{ 
                      width: `${Math.max(0, 100 - (contract.daysRemaining / 30 * 100))}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Action Buttons for Critical Expiries */}
              {contract.daysRemaining <= 3 && (
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-current/20 text-current rounded text-xs font-medium hover:bg-current/30 transition-colors">
                    Roll Forward
                  </button>
                  <button className="px-3 py-1 bg-current/20 text-current rounded text-xs font-medium hover:bg-current/30 transition-colors">
                    Close Position
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Derivative Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-green-600" size={20} />
            Market Event Calendar
          </h3>
        </div>
        
        <div className="space-y-2">
          {marketEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    event.type === 'expiry' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    event.type === 'holiday' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {event.type === 'expiry' ? <Timer size={16} className="text-orange-600 dark:text-orange-400" /> :
                     event.type === 'holiday' ? <Calendar size={16} className="text-red-600 dark:text-red-400" /> :
                     <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{event.event}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {eventDate.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {daysUntil === 0 ? 'Today' : 
                     daysUntil === 1 ? 'Tomorrow' : 
                     `${daysUntil} days`}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    event.type === 'expiry' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                    event.type === 'holiday' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {event.type.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* End-of-Day Risk Warning */}
      {marketStatus.isOpen && timeToEvent && timeToEvent.hours === 0 && timeToEvent.minutes <= 10 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-300">End-of-Day Risk Warning</h4>
              <p className="text-sm text-red-800 dark:text-red-400">
                Market closes in {timeToEvent.minutes} minutes. Review your open positions and consider closing risky trades.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekend Detection */}
      {!marketStatus.isOpen && (new Date().getDay() === 0 || new Date().getDay() === 6) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">Weekend Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Markets are closed for the weekend. Use this time to plan your strategies and review your portfolio.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}