-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'sales', 'production', 'client');
CREATE TYPE quote_status AS ENUM ('draft', 'approval_sent', 'approved', 'in_production', 'completed', 'on_hold');
CREATE TYPE order_status AS ENUM ('created', 'scheduled', 'in_production', 'completed', 'shipped');
CREATE TYPE machine_type AS ENUM ('DTF', 'UV', 'Screen', 'Laser', 'Vinyl', '3D');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    password_hash VARCHAR(255) NOT

 NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer contacts table
CREATE TABLE customer_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES

 customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    is_billing BOOLEAN DEFAULT FALSE,
    is_shipping BOOLEAN DEFAULT FALSE
);

-- Quotes table
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    status quote_status NOT NULL DEFAULT 'draft',
    production_due DATE,
    customer_due DATE,
    total_quantity INTEGER DEFAULT 0,
    total_amount NUMERIC(10,2) DEFAULT 0,
    production_notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quote line items table
CREATE TABLE quote_line_items (
   

 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    item_code VARCHAR(100),
    description TEXT,
    color VARCHAR(50),
    size_breakdown JSONB,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    markup_pct NUMERIC(5,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    production_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status NOT NULL DEFAULT 'created',
    production_manager_id UUID REFERENCES users(id),
    shipping_manager_id UUID REFERENCES users(id),
    scheduled_production_at TIMESTAMP WITH TIME ZONE,
    scheduled_shipping_at TIMESTAMP WITH

 TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Machines table
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    machine_type machine_type NOT NULL,
    purchase_price NUMERIC(10,2),
    purchase_date DATE,
    useful_life_years INTEGER,
    power_kw NUMERIC(5,2),
    maintenance_schedule JSONB,
    insurance_cost_yr NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consumables table
CREATE TABLE consumables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    unit_measure VARCHAR(50) NOT NULL,
    stock_qty

 NUMERIC(10,2) DEFAULT 0,
    reorder_point NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Costing records table
CREATE TABLE costing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    job_area_sqmm NUMERIC(10,2) NOT NULL,
    consumables_cost NUMERIC(10,2) DEFAULT 0,
    power_cost NUMERIC(10,2) DEFAULT 0,
    labor_cost NUMERIC(10,2) DEFAULT 0,
    overhead_cost NUMERIC(10,2) DEFAULT 0,
    depreciation NUMERIC(10,2) DEFAULT 0,
    maintenance_savings NUMERIC(10,2) DEFAULT 0,
    printhead_savings NUMERIC(10,2) DEFAULT 0,
    insurance_cost NUMERIC(10,2) DEFAULT 0,
    waste_cost NUMERIC(10,2) DEFAULT 0,
    misc_cost NUMERIC(10,2) DEFAULT 0,
    total_cost NUMERIC(10,2) NOT NULL,
    cost_per_sqmm NUMERIC(10,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create

 indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_quotes_organization_id ON quotes(organization_id);
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quote_line_items_quote_id ON quote_line_items(quote_id);
CREATE INDEX idx_orders_quote_id ON orders(quote_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_machines_organization_id ON machines(organization_id);
CREATE INDEX idx_consumables_organization_id ON consumables(organization_id);
CREATE INDEX idx_costing_records_machine_id ON costing_records(machine_id);