import React, { useState, useEffect } from 'react';
import { X, LogIn, Shield, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import MultiBrokerService from '../services/brokerServices';

interface BrokerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (brokerName: string) => void;
}

export default function BrokerLoginModal({ isOpen, onClose, onLoginSuccess }: BrokerLoginModalProps) {
  const [selectedBroker, setSelectedBroker] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'select' | 'login' | 'callback'>('select');

  const brokers = MultiBrokerService.getAvailableBrokers();
  const authenticatedBrokers = MultiBrokerService.getAuthenticatedBrokers();

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || urlParams.get('request_token');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setError(`Authentication failed: ${error}`);
      setStep('select');
      return;
    }

    if (code && selectedBroker) {
      handleAuthCallback(code, state);
    }
  }, [selectedBroker]);

  const handleAuthCallback = async (code: string, state: string | null) => {
    setStep('callback');
    setIsLoading(true);
    setError('');

    try {
      const success = await MultiBrokerService.authenticateWithCode(selectedBroker, code, state || undefined);
      
      if (success) {
        onLoginSuccess(selectedBroker);
        onClose();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setError('Authentication failed. Please try again.');
        setStep('select');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStep('select');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrokerLogin = async (brokerName: string) => {
    setSelectedBroker(brokerName);
    setIsLoading(true);
    setError('');
    setStep('login');

    try {
      const loginUrl = MultiBrokerService.getLoginUrl(brokerName);
      
      // Open login in same window for OAuth flow
      window.location.href = loginUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate login');
      setStep('select');
      setIsLoading(false);
    }
  };

  const handleLogout = (brokerName: string) => {
    MultiBrokerService.logout(brokerName);
    setError('');
  };

  const getBrokerStatus = (brokerName: string) => {
    return authenticatedBrokers.includes(brokerName);
  };

  const getBrokerFeatures = (broker: any) => {
    const features = [];
    if (broker.features.liveData) features.push('Live Data');
    if (broker.features.optionsChain) features.push('Options Chain');
    if (broker.features.trading) features.push('Trading');
    if (broker.features.portfolio) features.push('Portfolio');
    return features;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Connect Your Broker
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {step === 'callback' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Completing Authentication...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your credentials.
            </p>
          </div>
        )}

        {step !== 'callback' && (
          <>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Secure Authentication
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Connect securely with SEBI-registered brokers for real-time market data and trading capabilities.
                    Your credentials are never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brokers.map((broker) => {
                const isAuthenticated = getBrokerStatus(broker.name);
                const features = getBrokerFeatures(broker);

                return (
                  <div
                    key={broker.name}
                    className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
                      isAuthenticated
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{broker.logo}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {broker.displayName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {isAuthenticated ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                              <span className="text-sm text-green-700 dark:text-green-400">Connected</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Not connected</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {features.map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {isAuthenticated ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => MultiBrokerService.setActiveBroker(broker.name)}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Set as Active
                          </button>
                          <button
                            onClick={() => handleLogout(broker.name)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBrokerLogin(broker.name)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          {isLoading && selectedBroker === broker.name ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <LogIn size={16} />
                          )}
                          Connect
                        </button>
                      )}
                    </div>

                    {!broker.apiKey && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-400">
                        API key not configured. Please add your API credentials.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                How to get API credentials:
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span><strong>Zerodha:</strong> Visit Kite Connect developer console</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span><strong>Upstox:</strong> Register at Upstox Developer API</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span><strong>Angel One:</strong> Apply for SmartAPI access</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span><strong>Others:</strong> Check respective broker's developer documentation</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}