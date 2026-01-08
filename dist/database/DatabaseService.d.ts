import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
    maxConnections?: number;
}
export declare const databaseConfig: DatabaseConfig;
export declare class DatabaseService {
    private pool;
    private prisma;
    private config;
    constructor(config: DatabaseConfig);
    private testConnection;
    getPrisma(): PrismaClient;
    getPool(): Pool;
    close(): Promise<void>;
    query(text: string, params?: any[]): Promise<any>;
}
//# sourceMappingURL=DatabaseService.d.ts.map