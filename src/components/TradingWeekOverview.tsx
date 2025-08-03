import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { getMarketStatus, isMarketHoliday } from '../utils/marketHours';

interface TradingDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  isTrading: boolean;
  isHoliday: boolean;
  holidayName?: string;
  status: 'completed' | 'current' | 'upcoming';
  economicEvents?: string[];
}

export default function TradingWeekOverview() {
  const [currentWeek, setCurrentWeek] = useState<TradingDay[]>([]);
  const [weekStats, setWeekStats] = useState({
    tradingDaysRemaining: 0,
    totalTradingDays: 0,
    completedDays: 0
  });

  useEffect(() => {
    generateTradingWeek();
  }, []);

  const generateTradingWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    const week: TradingDay[] = [];
    let tradingDays = 0;
    let completedDays = 0;
    
    // Generate 5 trading days (Monday to Friday)
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const isToday = date.toDateString() === today.toDateString();
      const holiday = isMarketHoliday(date);
      const isTrading = !holiday && date.getDay() !== 0 && date.getDay() !== 6;
      
      let status: 'completed' | 'current' | 'upcoming';
      if (date < today) {
        status = 'completed';
        if (isTrading) completedDays++;
      } else if (isToday) {
        status = 'current';
      } else {
        status = 'upcoming';
      }
      
      if (isTrading) tradingDays++;
      
      // Mock economic events
      const economicEvents = getEconomicEvents(date);
      
      week.push({
        date,
        dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        isToday,
        isTrading,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
        status,
        economicEvents
      });
    }
    
    setCurrentWeek(week);
    setWeekStats({
      tradingDaysRemaining: tradingDays - completedDays - (week.find(d => d.isToday)?.isTrading ? 1 : 0),
      totalTradingDays: tradingDays,
      completedDays
    });
  };

  const getEconomicEvents = (date: Date): string[] => {
    // Mock economic events - in real app, this would come from an API
    const events: { [key: string]: string[] } = {
      '2024-01-24': ['RBI Policy Meeting'],
      '2024-01-25': ['GDP Data Release'],
      '2024-01-26': ['Republic Day Holiday'],
      '2024-01-29': ['Union Budget 2024'],
      '2024-01-30': ['Corporate Earnings Season']
    };
    
    const dateKey = date.toISOString().split('T')[0];
    return events[dateKey] || [];
  };

  const getDayStatusIcon = (day: TradingDay) => {
    if (day.isHoliday) {
      return <Calendar size={16} className="text-red-500" />;
    }
    
    switch (day.status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'current':
        return <Clock size={16} className="text-blue-500" />;
      case 'upcoming':
        return <AlertCircle size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getDayStatusColor = (day: TradingDay) => {
    if (day.isHoliday) {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
    
    switch (day.status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'current':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'upcoming':
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={20} />
          Trading Week Overview
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Week of {currentWeek[0]?.date.toLocaleDateString('en-IN', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Week Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {weekStats.completedDays}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {weekStats.tradingDaysRemaining}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Remaining</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {weekStats.totalTradingDays}
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300">Total Days</div>
        </div>
      </div>

      {/* Week Timeline */}
      <div className="space-y-2">
        {currentWeek.map((day, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getDayStatusColor(day)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getDayStatusIcon(day)}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {day.dayName} {day.date.getDate()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {day.isHoliday ? day.holidayName : 
                     day.isTrading ? 'Trading Day' : 'Weekend'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {day.isToday && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full font-medium">
                    TODAY
                  </span>
                )}
                {day.economicEvents && day.economicEvents.length > 0 && (
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs rounded-full">
                      {day.economicEvents.length} Event{day.economicEvents.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Economic Events */}
            {day.economicEvents && day.economicEvents.length > 0 && (
              <div className="mt-2 pl-7">
                {day.economicEvents.map((event, eventIndex) => (
                  <div key={eventIndex} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Week Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Week Progress</span>
          <span>{Math.round((weekStats.completedDays / weekStats.totalTradingDays) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ 
              width: `${(weekStats.completedDays / weekStats.totalTradingDays) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}