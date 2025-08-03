import React, { useState } from 'react';
import { Bell, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { AlertTrigger } from '../types/MarketData';

export default function IndicatorAlerts() {
  const [alerts, setAlerts] = useState<AlertTrigger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'rsi' as AlertTrigger['type'],
    symbol: '',
    condition: 'crosses_above',
    threshold: 70
  });

  const alertTypes = [
    { value: 'rsi', label: 'RSI' },
    { value: 'oi_buildup', label: 'OI Build-up' },
    { value: 'iv_spike', label: 'IV Spike' },
    { value: 'volume_surge', label: 'Volume Surge' }
  ];

  const conditions = {
    rsi: ['crosses_above', 'crosses_below'],
    oi_buildup: ['increases_by', 'decreases_by'],
    iv_spike: ['spikes_by', 'drops_by'],
    volume_surge: ['exceeds', 'falls_below']
  };

  const handleCreateAlert = () => {
    if (newAlert.symbol && newAlert.threshold) {
      const alert: AlertTrigger = {
        id: Date.now().toString(),
        type: newAlert.type,
        symbol: newAlert.symbol.toUpperCase(),
        condition: newAlert.condition,
        threshold: newAlert.threshold,
        currentValue: 0,
        triggered: false,
        createdAt: new Date().toISOString()
      };
      
      setAlerts(prev => [...prev, alert]);
      setNewAlert({ type: 'rsi', symbol: '', condition: 'crosses_above', threshold: 70 });
      setShowForm(false);
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="text-blue-600" size={20} />
          Indicator-Based Alerts
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Alert
        </button>
      </div>

      {/* Alert Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Create New Alert</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
              <input
                type="text"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NIFTY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Indicator</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as AlertTrigger['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {alertTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conditions[newAlert.type]?.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Threshold</label>
              <input
                type="number"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreateAlert}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Active Alerts ({alerts.length})</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map(alert => (
              <div key={alert.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    alert.triggered ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {alert.triggered ? (
                      <AlertTriangle size={16} className="text-red-600" />
                    ) : (
                      <Bell size={16} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.symbol} - {alertTypes.find(t => t.value === alert.type)?.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      Alert when {alert.condition.replace('_', ' ')} {alert.threshold}
                      {alert.type === 'rsi' && ''}
                      {alert.type === 'oi_buildup' && '%'}
                      {alert.type === 'iv_spike' && '%'}
                      {alert.type === 'volume_surge' && 'x'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Current</p>
                    <p className="font-medium">{alert.currentValue.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No indicator alerts configured</h3>
          <p className="text-gray-500">Create alerts based on RSI, OI changes, IV spikes, and volume surges.</p>
        </div>
      )}
    </div>
  );
}