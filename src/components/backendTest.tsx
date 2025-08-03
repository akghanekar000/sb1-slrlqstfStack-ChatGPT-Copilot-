import { useEffect, useState } from 'react';

function BackendTest() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2>Test Connection to Backend</h2>
      <p>{message}</p>
    </div>
  );
}

export default BackendTest;