import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiteConnectService from '../services/kiteConnect';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestToken = urlParams.get('request_token');
        const status = urlParams.get('status');

        if (status === 'success' && requestToken) {
          setMessage('Generating access token...');
          const accessToken = await KiteConnectService.generateSession(requestToken);
          
          if (accessToken) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            throw new Error('Failed to generate access token');
          }
        } else {
          throw new Error('Authentication failed or cancelled');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle size={48} className="mx-auto text-green-600" />
          )}
          {status === 'error' && (
            <AlertCircle size={48} className="mx-auto text-red-600" />
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to App
          </button>
        )}
      </div>
    </div>
  );
}