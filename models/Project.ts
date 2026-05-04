import mongoose, { Schema, Model } from 'mongoose';

export interface IProject {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  enabledIntegrations: {
    shopify: boolean;
    crm: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    enabledIntegrations: {
      shopify: { type: Boolean, default: false },
      crm: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
