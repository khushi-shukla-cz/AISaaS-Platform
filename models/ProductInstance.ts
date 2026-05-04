import mongoose, { Schema, Model } from 'mongoose';

export interface IProductInstance {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  aiConfig: {
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductInstanceSchema = new Schema<IProductInstance>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    aiConfig: {
      systemPrompt: { type: String, default: 'You are a helpful AI assistant.' },
      temperature: { type: Number, default: 0.7 },
      maxTokens: { type: Number, default: 2000 },
    },
  },
  { timestamps: true }
);

export const ProductInstance: Model<IProductInstance> = 
  mongoose.models.ProductInstance || mongoose.model<IProductInstance>('ProductInstance', ProductInstanceSchema);
