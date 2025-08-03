import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, BellOff, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { Alert, Trade } from '../types/Trade';

interface SwipeableAlertsProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  trades: Trade[];
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
}

export default function SwipeableAlerts({ 
  isOpen, 
  onClose, 
  alerts, 
  trades, 
  onToggleAlert, 
  onDeleteAlert 
}: SwipeableAlertsProps) {
  const [swipedAlert, setSwipedAlert] = useState<string | null>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const getTradeSymbol = (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    return trade?.symbol || 'Unknown';
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const triggeredAlerts = alerts.filter(alert => alert.triggered);

  // Prevent background scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const currentY = e.touches[0].clientY;
    setCurrentY(currentY);
    
    // Only allow downward swipe to close
    const deltaY = currentY - startY;
    if (deltaY > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const deltaY = currentY - startY;
    if (deltaY > 100) { // Swipe down threshold
      onClose();
    }
    
    setIsDragging(false);
    setCurrentY(0);
    setStartY(0);
  };

  // Handle content scroll
  const handleContentTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    if (!contentRef.current) return;
    
    const target = contentRef.current;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const height = target.clientHeight;
    
    // Prevent overscroll at top and bottom
    if (scrollTop === 0 && e.touches[0].clientY > startY) {
      // At top, prevent scroll up
      return;
    }
    if (scrollTop + height >= scrollHeight && e.touches[0].clientY < startY) {
      // At bottom, prevent scroll down
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  const translateY = isDragging ? Math.max(0, currentY - startY) : 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      {/* Swipeable Panel */}
      <div 
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl z-50 max-h-[80vh] overflow-hidden shadow-2xl"
        style={{ 
          transform: `translateY(${translateY}px)`,
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center py-3 bg-white dark:bg-gray-900">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content with proper scrolling */}
        <div 
          ref={contentRef}
          className="overflow-y-auto px-6 pb-6"
          style={{ 
            maxHeight: 'calc(80vh - 120px)',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
          onTouchMove={handleContentTouchMove}
        >
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts configured</h3>
              <p className="text-gray-500 dark:text-gray-400">Create alerts from your trades to get notified.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-blue-600" />
                    Active Alerts ({activeAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              alert.type === 'target' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              {alert.type === 'target' ? (
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {getTradeSymbol(alert.tradeId)} - {alert.type === 'target' ? 'Target' : 'Stop Loss'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Alert when price {alert.type === 'target' ? 'reaches' : 'falls to'} ₹{alert.targetPrice}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Current: ₹{alert.currentPrice}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onToggleAlert(alert.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-target"
                              style={{ minHeight: '44px', minWidth: '44px' }}
                            >
                              <BellOff size={16} />
                            </button>
                            <button
                              onClick={() => onDeleteAlert(alert.id)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors touch-target"
                              style={{ minHeight: '44px', minWidth: '44px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggered Alerts */}
              {triggeredAlerts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    Triggered Alerts ({triggeredAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {triggeredAlerts.map(alert => (
                      <div key={alert.id} className="bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {getTradeSymbol(alert.tradeId)} - {alert.type === 'target' ? 'Target Hit' : 'Stop Loss Hit'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Target price: ₹{alert.targetPrice}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Triggered: {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteAlert(alert.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-target"
                            style={{ minHeight: '44px', minWidth: '44px' }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Swipe Hint */}
        <div className="text-center py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          Swipe down to close
        </div>
      </div>
    </>
  );
}