export interface Customer {
  id: string;
  organizationId: string;
  companyName: string;
  accountNumber?: string;
  defaultBillingContactId?: string;
  defaultShippingContactId?: string;
  notes?: string;
  planTier?: string;
  createdAt: Date;
  updatedAt: Date;
}