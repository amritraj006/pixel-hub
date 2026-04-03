const app = require('./app');
const initializeDatabase = require('./config/initDb');

const PORT = Number(process.env.PORT) || 8000;

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
