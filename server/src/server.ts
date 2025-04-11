import { app, PORT } from './app';
import { connectDatabase } from './config/database';

// Connect to the database first
connectDatabase()
  .then(() => {
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start application:', error);
  });
