"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const DatabaseService_1 = require("./database/DatabaseService");
const routes_1 = require("./routes");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Initialize database
const dbService = new DatabaseService_1.DatabaseService(DatabaseService_1.databaseConfig);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files - simplified approach
app.use(express_1.default.static('public'));
// API routes
const routes = (0, routes_1.createRoutes)(dbService);
app.use('/api', routes);
// Serve landing page for root route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve('public/index.html'));
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
    }
    catch (error) {
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
    console.log(`📊 Database host: ${DatabaseService_1.databaseConfig.host}:${DatabaseService_1.databaseConfig.port}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    await dbService.close();
    process.exit(0);
});
//# sourceMappingURL=index.js.map