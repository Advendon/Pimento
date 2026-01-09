export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Record<string, any>;
  isBillingContact: boolean;
  isShippingContact: boolean;
}