// Core types for the printshop CRM system

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  specifications: PrintSpecifications;
}

export interface PrintSpecifications {
  paperType: string;
  paperSize: string;
  colorMode: 'CMYK' | 'RGB' | 'Grayscale';
  finishing: string[];
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  reorderLevel: number;
  location: string;
}

export enum OrderStatus {
  DRAFT = 'draft',
  QUOTED = 'quoted',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum ProductCategory {
  BUSINESS_CARDS = 'business_cards',
  FLYERS = 'flyers',
  BROCHURES = 'brochures',
  POSTERS = 'posters',
  LABELS = 'labels',
  PACKAGING = 'packaging',
  STATIONERY = 'stationery'
}