# DROP OF COLOUR CRM - Database Schema Documentation

## Overview
This CRM system is designed specifically for print shops

 offering DTF, UV, screen printing, vinyl cutting, 3D printing, laser engraving, and more.

## Database Schema

### Core Entities

#### Users
- Manages system users with role-based access
- Roles: admin, sales, production, client
- Supports authentication and authorization

#### Organizations
- Multi-tenant support for different print shops
- Plan tier management for subscription features

#### Customers & Contacts
- Customer management with multiple contact points
- Separate billing and shipping contacts
- Account numbering system

#### Quotes & Line Items
- Comprehensive quote management
- JSONB fields for flexible size breakdowns
- Status workflow: draft → approval_sent → approved → in_production → completed
- Automatic total calculation with markup

#### Orders
- Production workflow management
- Scheduling system for production and shipping
- Status tracking throughout the process

#### Machines
- Equipment management for different print technologies
- Maintenance scheduling with JSONB flexibility
- Cost

 tracking and depreciation

#### Costing Records
- Detailed cost analysis per job
- Comprehensive cost breakdown including:
  - Consumables, power, labor, overhead
  - Depreciation, maintenance, insurance
  - Waste and miscellaneous costs
- Cost per square millimeter calculation

## Relationships


## Key Features

- **UUID Primary Keys**: Ensures scalability across distributed systems
- **JSONB Fields**: Flexible data structures for size breakdowns and maintenance schedules
- **Audit Fields**: created_at and updated_at on all tables
- **Status Enums**: Clear workflow definitions
- **Foreign Key Constraints**: Data integrity enforcement
- **Indexes**: Optimized query performance

## Setup

 Instructions

1. Install PostgreSQL on your QNAP NAS
2. Create database: `createdb drop_of_colour_crm`
3. Run the schema SQL script
4. Configure environment variables
5. Run Prisma migrations: `npm run db:push`
6. Seed the database: `npm run db:seed`

## Environment Configuration

```bash
# Database
DB_HOST=your-qnap-nas-host
DB_PORT=5432
DB_NAME=drop_of_colour_crm
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=true

erDiagram
    Organization ||--o{ Customer : has
    Organization ||--o{ Quote : has
    Organization ||--o{ Machine : has
    Organization ||--o{ Consumable : has
    
    Customer ||--o{ CustomerContact : has
    Customer ||--o{ Quote : has
    
    Quote ||--o{ QuoteLineItem : contains
    Quote ||--|| Order : becomes
    
    User ||--o{ Quote : creates
    User ||--o{ Quote : approves
    User ||--o{ Order : manages
    User ||--o{ Order : ships
    
    Machine ||--o{ CostingRecord : has


## 8. Updated Database Service Configuration

```typescript
// src/config/database.config.ts
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
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'drop_of_colour_crm',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20')
};