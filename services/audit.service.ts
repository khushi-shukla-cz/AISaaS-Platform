import { connectDB } from '@/lib/db';
import { AuditEvent, IAuditEvent } from '@/models/AuditEvent';

export interface LogAuditEventParams {
  projectId: string;
  userId?: string;
  actorRole: 'admin' | 'user' | 'system';
  action: string;
  resourceType?: string;
  resourceId?: string;
  status?: 'success' | 'failure' | 'info';
  details?: Record<string, unknown>;
}

export interface AuditActivityItem {
  id: string;
  type: 'audit';
  title: string;
  description: string;
  timestamp: Date;
}

export class AuditService {
  static async logEvent(params: LogAuditEventParams): Promise<IAuditEvent> {
    await connectDB();

    const event = await AuditEvent.create({
      ...params,
      status: params.status ?? 'success',
    });

    return event;
  }

  static async getRecentEvents(projectId: string, limit: number = 10): Promise<AuditActivityItem[]> {
    await connectDB();

    const events = await AuditEvent.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return events.map((event) => ({
      id: event._id.toString(),
      type: 'audit' as const,
      title: this.formatTitle(event.action, event.status),
      description: this.formatDescription(event),
      timestamp: event.createdAt,
    }));
  }

  private static formatTitle(action: string, status: string) {
    const readableAction = action
      .split('.')
      .map((segment) => segment.replace(/_/g, ' '))
      .join(' ');

    return `${readableAction} (${status})`;
  }

  private static formatDescription(event: Pick<IAuditEvent, 'actorRole' | 'resourceType' | 'resourceId' | 'details'>) {
    const resource = event.resourceType
      ? `${event.resourceType}${event.resourceId ? ` ${event.resourceId}` : ''}`
      : 'system';

    const detailEntries = event.details ? Object.entries(event.details) : [];
    const detailSummary = detailEntries.length > 0
      ? ` | ${detailEntries
          .slice(0, 2)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(', ')}`
      : '';

    return `${event.actorRole} on ${resource}${detailSummary}`;
  }
}
