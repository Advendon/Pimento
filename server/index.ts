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

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - simplified approach
app.use(express.static('public'));

// API routes
const routes = createRoutes(dbService);
app.use

('/api', routes);

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DROP OF COLOUR CRM server running on port ${PORT}`);
  console.log(`🌐 Landing page: http://localhost:${PORT}`);
  console.log(`📊 Database host: ${databaseConfig.host}:${databaseConfig.port}`);
  console.log(`🔧 Environment: ${process.env.NODE

_ENV}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  await dbService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  await dbService.close();
  process.exit(0);
});