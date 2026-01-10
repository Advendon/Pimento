import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { DatabaseService, databaseConfig } from './database/DatabaseService';
import { createRoutes } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const dbService = new DatabaseService(databaseConfig);

// Configure Helmet with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline styles for development
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline scripts for now
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow cross-origin resources
}));

// Add this route to handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use(cors());
app.use(express.json());

// Serve static files with proper MIME types
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static('public'));

// API routes
const routes = createRoutes(dbService);
app.use('/api', routes);

// Serve landing page for root route
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const result = await dbService.query('SELECT NOW() as current_time');
    res.json({ 
      status: 'Database connected', 
      currentTime: result.rows[0].current_time 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database connection failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Database test: http://localhost:${PORT}/db-test`);
});

export default app;