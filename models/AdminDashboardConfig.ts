import mongoose, { Schema, Model } from 'mongoose';

export type WidgetType = 
  | 'stat-card' 
  | 'integration-status' 
  | 'activity-feed' 
  | 'chart' 
  | 'custom-section';

export interface IWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  order: number;
}

export interface IAdminDashboardConfig {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  layout: {
    widgets: IWidget[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const WidgetSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['stat-card', 'integration-status', 'activity-feed', 'chart', 'custom-section'],
    required: true 
  },
  title: { type: String, required: true },
  config: { type: Schema.Types.Mixed, default: {} },
  order: { type: Number, required: true },
}, { _id: false });

const AdminDashboardConfigSchema = new Schema<IAdminDashboardConfig>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    layout: {
      widgets: [WidgetSchema],
    },
  },
  { timestamps: true }
);

export const AdminDashboardConfig: Model<IAdminDashboardConfig> = 
  mongoose.models.AdminDashboardConfig || 
  mongoose.model<IAdminDashboardConfig>('AdminDashboardConfig', AdminDashboardConfigSchema);
