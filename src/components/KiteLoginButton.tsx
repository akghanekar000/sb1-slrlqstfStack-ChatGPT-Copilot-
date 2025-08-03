import React from 'react';
import { LogIn, Shield } from 'lucide-react';
import KiteConnectService from '../services/kiteConnect';

interface KiteLoginButtonProps {
  onLoginSuccess?: () => void;
}

export default function KiteLoginButton({ onLoginSuccess }: KiteLoginButtonProps) {
  const handleLogin = () => {
    const loginUrl = KiteConnectService.getLoginUrl();
    window.location.href = loginUrl;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="mb-4">
          <Shield size={48} className="mx-auto text-blue-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect to Zerodha Kite
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Login with your Zerodha account to access real-time market data and place trades
        </p>
        
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <LogIn size={20} />
          Login with Zerodha
        </button>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>✓ SEBI registered broker</p>
          <p>✓ Secure OAuth authentication</p>
          <p>✓ Real-time tick-by-tick data</p>
        </div>
      </div>
    </div>
  );
}