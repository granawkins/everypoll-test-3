import { useState, useEffect } from 'react';
import Background from './components/Background';
import Header from './components/Header';

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendMessage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api');

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBackendMessage();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f0f0f0',
        gap: '1rem',
        paddingTop: '90px', // Add padding to account for fixed header
      }}
    >
      <Background />
      <Header />
      <h1>Mentat Template JS</h1>
      <ul>
        <li>Frontend: React, Vite, Vitest</li>
        <li>Backend: Node.js, Express, Jest</li>
        <li>Utilities: Typescript, ESLint, Prettier</li>
      </ul>
      <p>
        <b>Message from server:</b>{' '}
        {loading
          ? 'Loading message from server...'
          : error
            ? `Error: ${error}`
            : message
              ? message
              : 'No message from server'}
      </p>

      <p>Create a new GitHub issue at tag '@MentatBot' to get started.</p>
    </div>
  );
}

export default App;
