import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, Target, TrendingUp, Calendar, Zap, RefreshCw } from 'lucide-react';

interface ExpiryAlert {
  id: string;
  symbol: string;
  expiry: string;
  type: 'position' | 'strategy' | 'custom';
  alertType: 'expiry' | 'iv_crush' | 'theta_decay' | 'roll_opportunity';
  daysRemaining: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: boolean;
  createdAt: string;
}

interface CustomAlert {
  id: string;
  name: string;
  targetDate: string;
  alertDays: number[];
  isActive: boolean;
  type: 'position_review' | 'target_watch' | 'iv_crush' | 'custom';
}

export default function ExpiryAlertSystem() {
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    targetDate: '',
    alertDays: [1, 3, 7],
    type: 'position_review' as CustomAlert['type']
  });

  useEffect(() => {
    generateMockAlerts();
    const interval = setInterval(generateMockAlerts, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const generateMockAlerts = () => {
    const alerts: ExpiryAlert[] = [
      {
        id: '1',
        symbol: 'NIFTY 20000 CE',
        expiry: '2024-01-25',
        type: 'position',
        alertType: 'expiry',
        daysRemaining: 1,
        urgency: 'critical',
        message: 'Position expires tomorrow! Consider closing or rolling.',
        actionRequired: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        symbol: 'BANKNIFTY Iron Condor',
        expiry: '2024-01-25',
        type: 'strategy',
        alertType: 'iv_crush',
        daysRemaining: 1,
        urgency: 'high',
        message: 'IV crush expected post-expiry. Review strategy legs.',
        actionRequired: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        symbol: 'RELIANCE 2500 CE',
        expiry: '2024-01-31',
        type: 'position',
        alertType: 'theta_decay',
        daysRemaining: 7,
        urgency: 'medium',
        message: 'Theta decay accelerating. Monitor position closely.',
        actionRequired: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        symbol: 'TCS 3700 PE',
        expiry: '2024-02-08',
        type: 'position',
        alertType: 'roll_opportunity',
        daysRemaining: 14,
        urgency: 'low',
        message: 'Consider rolling to next month for better premium.',
        actionRequired: false,
        createdAt: new Date().toISOString()
      }
    ];

    setExpiryAlerts(alerts);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'expiry':
        return <Clock size={16} />;
      case 'iv_crush':
        return <TrendingUp size={16} />;
      case 'theta_decay':
        return <Target size={16} />;
      case 'roll_opportunity':
        return <RefreshCw size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const handleCreateCustomAlert = () => {
    if (!newAlert.name || !newAlert.targetDate) return;

    const customAlert: CustomAlert = {
      id: Date.now().toString(),
      name: newAlert.name,
      targetDate: newAlert.targetDate,
      alertDays: newAlert.alertDays,
      isActive: true,
      type: newAlert.type
    };

    setCustomAlerts(prev => [...prev, customAlert]);
    setNewAlert({
      name: '',
      targetDate: '',
      alertDays: [1, 3, 7],
      type: 'position_review'
    });
    setShowCreateAlert(false);
  };

  const dismissAlert = (alertId: string) => {
    setExpiryAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const snoozeAlert = (alertId: string) => {
    setExpiryAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, urgency: 'low' as const, actionRequired: false }
          : alert
      )
    );
  };

  const criticalAlerts = expiryAlerts.filter(alert => alert.urgency === 'critical');
  const actionRequiredAlerts = expiryAlerts.filter(alert => alert.actionRequired);

  return (
    <div className="space-y-4">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-300">
                🚨 Critical Expiry Alerts ({criticalAlerts.length})
              </h4>
              <p className="text-sm text-red-800 dark:text-red-400">
                Immediate action required for positions expiring within 24 hours!
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Review All
            </button>
          </div>
        </div>
      )}

      {/* Expiry Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="text-orange-600" size={20} />
            Position Management Alerts
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {actionRequiredAlerts.length} require action
            </span>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              + Custom Alert
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {expiryAlerts.map(alert => (
            <div key={alert.id} className={`p-4 rounded-lg border ${getUrgencyColor(alert.urgency)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-current/20 rounded-full">
                    {getAlertIcon(alert.alertType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.symbol}</h4>
                      <span className="px-2 py-1 bg-current/20 text-current rounded text-xs font-medium">
                        {alert.type.toUpperCase()}
                      </span>
                      {alert.actionRequired && (
                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium animate-pulse">
                          ACTION REQUIRED
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs opacity-75">
                      <span>Expires: {new Date(alert.expiry).toLocaleDateString('en-IN')}</span>
                      <span>{alert.daysRemaining} days remaining</span>
                      <span>Alert: {alert.alertType.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {alert.actionRequired && (
                    <>
                      <button
                        onClick={() => snoozeAlert(alert.id)}
                        className="px-3 py-1 bg-current/20 text-current rounded text-xs hover:bg-current/30 transition-colors"
                      >
                        Snooze
                      </button>
                      <button className="px-3 py-1 bg-current text-white rounded text-xs hover:opacity-90 transition-opacity">
                        Take Action
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Progress Bar for Days Remaining */}
              <div className="mt-3">
                <div className="w-full bg-current/20 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full bg-current transition-all duration-500"
                    style={{ 
                      width: `${Math.max(0, 100 - (alert.daysRemaining / 30 * 100))}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Alerts */}
      {customAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="text-purple-600" size={20} />
            Custom Countdown Alerts
          </h3>
          
          <div className="space-y-3">
            {customAlerts.map(alert => {
              const daysUntil = Math.ceil((new Date(alert.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={alert.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900 dark:text-purple-300">{alert.name}</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        {daysUntil > 0 ? `${daysUntil} days remaining` : 'Due today!'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {daysUntil}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Custom Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Custom Alert</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Name
                </label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Portfolio Review"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newAlert.targetDate}
                  onChange={(e) => setNewAlert({ ...newAlert, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Type
                </label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as CustomAlert['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="position_review">Position Review</option>
                  <option value="target_watch">Target Price Watch</option>
                  <option value="iv_crush">IV Crush Alert</option>
                  <option value="custom">Custom Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Days Before (comma separated)
                </label>
                <input
                  type="text"
                  value={newAlert.alertDays.join(', ')}
                  onChange={(e) => setNewAlert({ 
                    ...newAlert, 
                    alertDays: e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d))
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1, 3, 7"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCustomAlert}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Alert
              </button>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rolling Opportunity Reminder */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <RefreshCw size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 dark:text-green-300">Rolling Opportunity</h4>
            <p className="text-sm text-green-800 dark:text-green-400">
              Consider rolling NIFTY 20000 CE to next month. Current premium: ₹125, Next month: ₹180
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Analyze Roll
          </button>
        </div>
      </div>
    </div>
  );
}