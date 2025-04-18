import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Background />
      <Header />
      
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: 3,
          gap: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
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
      </Container>
    </Box>
  );
}

export default App;
