export interface AuditLog {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
