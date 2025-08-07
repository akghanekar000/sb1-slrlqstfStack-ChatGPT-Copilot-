import React, { useEffect, useState } from 'react';

interface OptionData {
  symbol: string;
  expiry: string;
  strike: number;
  type: 'CE' | 'PE';
  lastPrice: number;
  volume: number;
  timestamp: string;
}

// Use environment variable for WebSocket URL for better flexibility
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://your-backend-domain/ws/options-stream';

const AdvancedStrategy: React.FC = () => {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setLoading(false);
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        try {
          const data: OptionData = JSON.parse(event.data);
          setOptions((prev) => [data, ...prev].slice(0, 100));
        } catch {
          setError('Received malformed data');
        }
      };

      ws.onerror = () => {
        setError('WebSocket error');
        setLoading(false);
      };
      ws.onclose = () => console.log('WebSocket closed');
    } catch {
      setError('Failed to connect to backend');
      setLoading(false);
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Format timestamp for readability
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return isNaN(date.getTime()) ? ts : date.toLocaleString();
  };

  return (
    <div>
      <h2>Live Options Data (India)</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}
      {!loading && options.length === 0 && <div>No data available.</div>}
      {options.length > 0 && (
        <table>
          <caption>Options stream data</caption>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Expiry</th>
              <th>Strike</th>
              <th>Type</th>
              <th>Last Price</th>
              <th>Volume</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {options.map((o) => (
              <tr key={`${o.symbol}-${o.expiry}-${o.strike}-${o.type}-${o.timestamp}`}> 
                <td>{o.symbol}</td>
                <td>{o.expiry}</td>
                <td>{o.strike}</td>
                <td>{o.type}</td>
                <td>{o.lastPrice}</td>
                <td>{o.volume}</td>
                <td>{formatTimestamp(o.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdvancedStrategy;