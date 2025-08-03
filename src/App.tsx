import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './components/ui/button'; // adjust path as needed

interface Broker {
  id: string;
  name: string;
  logoUrl: string;
}

export default function App() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/brokers');
        setBrokers(res.data);
      } catch (err) {
        setError('Failed to load brokers');
      }
    };

    fetchBrokers();
  }, []);

  const connectToBroker = async (brokerId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/connect/${brokerId}`
      );
      if (response.data.success) {
        setConnectedBroker(brokerId);
        setError('');
      } else {
        setError(response.data.message || 'Connection failed');
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <div className="p-6">
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        {brokers.map((broker) => (
          <div
            key={broker.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <img
                src={broker.logoUrl}
                alt={broker.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{broker.name}</span>
            </div>
            <Button onClick={() => connectToBroker(broker.id)}>
              {connectedBroker === broker.id ? 'Connected' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
