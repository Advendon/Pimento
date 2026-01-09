export

 interface PricingTemplate {
  id: string;
  organizationId: string;
  templateName: string;
  rules: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}