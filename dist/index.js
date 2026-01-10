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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const dbService = new DatabaseService_1.DatabaseService(DatabaseService_1.databaseConfig);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com"
            ],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
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
    crossOriginEmbedderPolicy: false,
}));
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/css', express_1.default.static(path_1.default.join(__dirname, '../css')));
app.use('/js', express_1.default.static(path_1.default.join(__dirname, '../js')));
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../assets')));
app.use(express_1.default.static('public'));
const routes = (0, routes_1.createRoutes)(dbService);
app.use('/api', routes);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve('public/index.html'));
});
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
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
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Database test: http://localhost:${PORT}/db-test`);
});
exports.default = app;
//# sourceMappingURL=index.js.map