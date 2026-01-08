"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = exports.databaseConfig = void 0;
const pg_1 = require("pg");
const client_1 = require("@prisma/client");
exports.databaseConfig = {
    host: process.env.DB_HOST || '192.168.16.26',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres_qnap_user',
    password: process.env.DB_PASSWORD || 'postgres_qnap_pwd',
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20')
};
class DatabaseService {
    constructor(config) {
        this.config = config;
        const poolConfig = {
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.username,
            password: config.password,
            max: config.maxConnections || 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };
        if (config.ssl) {
            poolConfig.ssl = { rejectUnauthorized: false };
        }
        this.pool = new pg_1.Pool(poolConfig);
        this.prisma = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
                }
            }
        });
        this.testConnection();
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log('✅ Database connection established');
            client.release();
        }
        catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }
    getPrisma() {
        return this.prisma;
    }
    getPool() {
        return this.pool;
    }
    async close() {
        await this.prisma.$disconnect();
        await this.pool.end();
    }
    // Helper method to execute raw SQL
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text, duration, rows: res.rowCount });
            return res;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map