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

const WS_URL = 'ws://your-backend-domain/ws/options-stream'; // Update with your backend's WebSocket endpoint

const AdvancedStrategy: React.FC = () => {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket;

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        try {
          const data: OptionData = JSON.parse(event.data);
          setOptions((prev) => [data, ...prev].slice(0, 100)); // Most recent 100
        } catch (err) {
          setError('Received malformed data');
        }
      };

      ws.onerror = () => setError('WebSocket error');
      ws.onclose = () => console.log('WebSocket closed');
    } catch (err) {
      setError('Failed to connect to backend');
    }

    return () => { if (ws) ws.close(); };
  }, []);

  return (
    <div>
      <h2>Live Options Data (India)</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table>
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
          {options.map((o, idx) => (
            <tr key={idx}>
              <td>{o.symbol}</td>
              <td>{o.expiry}</td>
              <td>{o.strike}</td>
              <td>{o.type}</td>
              <td>{o.lastPrice}</td>
              <td>{o.volume}</td>
              <td>{o.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvancedStrategy;
