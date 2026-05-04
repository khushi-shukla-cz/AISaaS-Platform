import mongoose, { Schema, Model } from 'mongoose';

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  productInstanceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    productInstanceId: { type: Schema.Types.ObjectId, ref: 'ProductInstance', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Conversation' },
  },
  { timestamps: true }
);

ConversationSchema.index({ projectId: 1, userId: 1 });

export const Conversation: Model<IConversation> = 
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
