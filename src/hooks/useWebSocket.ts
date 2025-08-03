import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketData {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketReturn {
  data: any;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current || !url) return;
    
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      console.log('Connecting to WebSocket:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const message: WebSocketData = JSON.parse(event.data);
          if (message && message.type === 'MARKET_DATA' && message.data) {
            setData(message.data);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Error parsing server data');
        }
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not a manual close and component is still mounted
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && mountedRef.current) {
          reconnectAttemptsRef.current++;
          setError(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Failed to reconnect. Please refresh the page.');
        }
      };

      ws.onerror = (error) => {
        if (!mountedRef.current) return;
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

    } catch (err) {
      if (!mountedRef.current) return;
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setError(null);
    setTimeout(() => {
      if (mountedRef.current) {
        connect();
      }
    }, 1000);
  }, [connect, disconnect]);

  useEffect(() => {
    mountedRef.current = true;
    if (url) {
      connect();
    }
    
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [connect, disconnect, url]);

  return {
    data,
    isConnected,
    error,
    reconnect
  };
}