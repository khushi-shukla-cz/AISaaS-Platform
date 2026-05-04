import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  projectIds: mongoose.Types.ObjectId[];
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
