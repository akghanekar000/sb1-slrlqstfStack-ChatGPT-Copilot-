import React, { useState } from 'react';
import { Plus, Wifi, WifiOff, Play, Pause, Settings, TrendingUp, AlertCircle, CheckCircle, Activity } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  logo: string;
  clientCode: string;
  isTerminalConnected: boolean;
  isTradingEngineOn: boolean;
  strategyPerformance: number;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  accessToken?: string;
}

interface BrokerFormData {
  name: string;
  clientCode: string;
  apiKey: string;
  apiSecret: string;
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([
    {
      id: '1',
      name: 'Angel One',
      logo: '🔰',
      clientCode: 'AAAJ453833',
      isTerminalConnected: true,
      isTradingEngineOn: false,
      strategyPerformance: 12450.75,
      lastSync: new Date().toISOString(),
      status: 'connected'
    },
    {
      id: '2',
      name: 'Zerodha Kite',
      logo: '⚡',
      clientCode: 'ZK1234',
      isTerminalConnected: false,
      isTradingEngineOn: false,
      strategyPerformance: -2340.50,
      lastSync: new Date(Date.now() - 300000).toISOString(),
      status: 'disconnected'
    }
  ]);

  const [showAddBroker, setShowAddBroker] = useState(false);
  const [newBroker, setNewBroker] = useState<BrokerFormData>({
    name: '',
    clientCode: '',
    apiKey: '',
    apiSecret: ''
  });

  const handleAddBroker = () => {
    if (!newBroker.name || !newBroker.clientCode) return;

    const broker: Broker = {
      id: Date.now().toString(),
      name: newBroker.name,
      logo: getBrokerLogo(newBroker.name),
      clientCode: newBroker.clientCode,
      isTerminalConnected: false,
      isTradingEngineOn: false,
      strategyPerformance: 0,
      lastSync: new Date().toISOString(),
      status: 'disconnected',
      apiKey: newBroker.apiKey
    };

    setBrokers(prev => [...prev, broker]);
    setNewBroker({ name: '', clientCode: '', apiKey: '', apiSecret: '' });
    setShowAddBroker(false);
  };

  const getBrokerLogo = (brokerName: string): string => {
    const logos: { [key: string]: string } = {
      'Angel One': '🔰',
      'Zerodha Kite': '⚡',
      'Upstox': '📈',
      '5paisa': '💰',
      'Dhan': '🎯',
      'ICICI Direct': '🏦',
      'HDFC Securities': '🏛️',
      'Kotak Securities': '🏢'
    };
    return logos[brokerName] || '📊';
  };

  const toggleTerminal = async (brokerId: string) => {
    setBrokers(prev => prev.map(broker => {
      if (broker.id === brokerId) {
        const newStatus = !broker.isTerminalConnected;
        
        // Simulate connection process
        if (newStatus) {
          // Start connection process
          setTimeout(() => {
            setBrokers(current => current.map(b => 
              b.id === brokerId 
                ? { ...b, status: 'connected', lastSync: new Date().toISOString() }
                : b
            ));
          }, 2000);
          
          return { 
            ...broker, 
            isTerminalConnected: newStatus,
            status: 'connected' as const
          };
        } else {
          // Disconnect and turn off trading engine
          return { 
            ...broker, 
            isTerminalConnected: newStatus,
            isTradingEngineOn: false,
            status: 'disconnected' as const
          };
        }
      }
      return broker;
    }));
  };

  const toggleTradingEngine = (brokerId: string) => {
    setBrokers(prev => prev.map(broker => {
      if (broker.id === brokerId) {
        const newEngineStatus = !broker.isTradingEngineOn;
        
        // Can only turn on trading engine if terminal is connected
        if (newEngineStatus && !broker.isTerminalConnected) {
          alert('Please connect terminal first before enabling trading engine');
          return broker;
        }
        
        return { 
          ...broker, 
          isTradingEngineOn: newEngineStatus
        };
      }
      return broker;
    }));
  };

  const deleteBroker = (brokerId: string) => {
    setBrokers(prev => prev.filter(broker => broker.id !== brokerId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 dark:text-green-400';
      case 'disconnected': return 'text-red-600 dark:text-red-400';
      case 'error': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'disconnected': return <AlertCircle size={16} className="text-red-600 dark:text-red-400" />;
      case 'error': return <AlertCircle size={16} className="text-orange-600 dark:text-orange-400" />;
      default: return <Activity size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const brokerOptions = [
    'Angel One', 'Zerodha Kite', 'Upstox', '5paisa', 'Dhan', 
    'ICICI Direct', 'HDFC Securities', 'Kotak Securities'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Brokers</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your trading accounts and connections</p>
        </div>
        <button
          onClick={() => setShowAddBroker(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Broker
        </button>
      </div>

      {/* Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map(broker => (
          <div key={broker.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Broker Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{broker.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{broker.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{broker.clientCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(broker.status)}
                <button
                  onClick={() => deleteBroker(broker.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* Strategy Performance */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Strategy Performance</span>
                <TrendingUp size={16} className={broker.strategyPerformance >= 0 ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div className={`text-xl font-bold ${
                broker.strategyPerformance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                ₹{broker.strategyPerformance.toFixed(2)}
              </div>
            </div>

            {/* Control Switches */}
            <div className="space-y-4">
              {/* Terminal Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    broker.isTerminalConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Terminal</span>
                  {broker.isTerminalConnected ? (
                    <Wifi size={16} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <WifiOff size={16} className="text-red-600 dark:text-red-400" />
                  )}
                </div>
                <button
                  onClick={() => toggleTerminal(broker.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    broker.isTerminalConnected ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      broker.isTerminalConnected ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Trading Engine Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    broker.isTradingEngineOn ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trading Engine</span>
                  {broker.isTradingEngineOn ? (
                    <Play size={16} className="text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Pause size={16} className="text-red-600 dark:text-red-400" />
                  )}
                </div>
                <button
                  onClick={() => toggleTradingEngine(broker.id)}
                  disabled={!broker.isTerminalConnected}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    broker.isTradingEngineOn ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  } ${!broker.isTerminalConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      broker.isTradingEngineOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Last Sync */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Last sync:</span>
                <span>{new Date(broker.lastSync).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Trading Engine Status */}
            {broker.isTradingEngineOn && (
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Strategy engine running
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {brokers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No brokers connected</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first broker to start automated trading</p>
            <button
              onClick={() => setShowAddBroker(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Broker
            </button>
          </div>
        )}
      </div>

      {/* Add Broker Modal */}
      {showAddBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Broker</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Broker Name
                </label>
                <select
                  value={newBroker.name}
                  onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Broker</option>
                  {brokerOptions.map(broker => (
                    <option key={broker} value={broker}>{broker}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Code
                </label>
                <input
                  type="text"
                  value={newBroker.clientCode}
                  onChange={(e) => setNewBroker({ ...newBroker, clientCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your client code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={newBroker.apiKey}
                  onChange={(e) => setNewBroker({ ...newBroker, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Secret
                </label>
                <input
                  type="password"
                  value={newBroker.apiSecret}
                  onChange={(e) => setNewBroker({ ...newBroker, apiSecret: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter API secret"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddBroker}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Broker
              </button>
              <button
                onClick={() => setShowAddBroker(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}