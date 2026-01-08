import { Pool, PoolConfig } from 'pg';
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

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || '192.168.16.26',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres_qnap_user',
  password: process.env.DB_PASSWORD || 'postgres_qnap_pwd',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20')
};

export class DatabaseService {
  private pool: Pool;
  private prisma: PrismaClient;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    
    const poolConfig: PoolConfig = {
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

    this.pool = new Pool(poolConfig);
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
        }
      }
    });

    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Database connection established');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  getPool(): Pool {
    return this.pool;
  }

  async close(): Promise<void> {
    await this.prisma.$disconnect();
    await this.pool.end();
  }

  // Helper method to execute raw SQL
  async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}