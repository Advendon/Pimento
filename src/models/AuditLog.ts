export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  objectType: string;
  objectId: string;
  payload: Record<string, any>;
  createdAt: Date;
}