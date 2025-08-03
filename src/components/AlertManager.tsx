import React from 'react';
import { Bell, BellOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, Trade } from '../types/Trade';

interface AlertManagerProps {
  alerts: Alert[];
  trades: Trade[];
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
}

export default function AlertManager({ alerts, trades, onToggleAlert, onDeleteAlert }: AlertManagerProps) {
  const getTradeSymbol = (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    return trade?.symbol || 'Unknown';
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const triggeredAlerts = alerts.filter(alert => alert.triggered);

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts configured</h3>
          <p className="text-gray-500">Create alerts from your open trades to get notified when prices hit your targets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            Active Alerts ({activeAlerts.length})
          </h3>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'target' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {alert.type === 'target' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTradeSymbol(alert.tradeId)} - {alert.type === 'target' ? 'Target' : 'Stop Loss'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Alert when price {alert.type === 'target' ? 'reaches' : 'falls to'} ${alert.targetPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      Current: ${alert.currentPrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Disable alert"
                  >
                    <BellOff size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Triggered Alerts ({triggeredAlerts.length})
          </h3>
          <div className="space-y-3">
            {triggeredAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTradeSymbol(alert.tradeId)} - {alert.type === 'target' ? 'Target Hit' : 'Stop Loss Hit'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Target price: ${alert.targetPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      Triggered: {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteAlert(alert.id)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}