import http from 'http';
import app from './app.js';
import initializeDatabase from './config/initDb.js';
import { initSocket } from './socket.js';

const PORT = Number(process.env.PORT) || 8000;

async function startServer() {
  try {
    await initializeDatabase();

    // Create HTTP server and initialize Socket.IO
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
