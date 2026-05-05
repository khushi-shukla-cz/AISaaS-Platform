import mongoose, { Model, Schema } from 'mongoose';

export interface IAuditEvent {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  actorRole: 'admin' | 'user' | 'system';
  action: string;
  resourceType?: string;
  resourceId?: string;
  status: 'success' | 'failure' | 'info';
  details?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String, enum: ['admin', 'user', 'system'], required: true },
    action: { type: String, required: true },
    resourceType: { type: String },
    resourceId: { type: String },
    status: { type: String, enum: ['success', 'failure', 'info'], required: true },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

AuditEventSchema.index({ projectId: 1, createdAt: -1 });
AuditEventSchema.index({ projectId: 1, action: 1, createdAt: -1 });

export const AuditEvent: Model<IAuditEvent> =
  mongoose.models.AuditEvent || mongoose.model<IAuditEvent>('AuditEvent', AuditEventSchema);
