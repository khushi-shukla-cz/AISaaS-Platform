import mongoose from 'mongoose';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import { connectDB } from '@/lib/db';

export class AccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export class AccessLayer {
  static async validateUserProjectAccess(
    userId: string,
    projectId: string
  ): Promise<boolean> {
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new AccessDeniedError('User not found');
    }

    const hasAccess = user.projectIds.some(
      (id) => id.toString() === projectId
    );

    if (!hasAccess) {
      throw new AccessDeniedError('User does not have access to this project');
    }

    return true;
  }

  static async validateProjectExists(projectId: string): Promise<boolean> {
    await connectDB();
    
    const project = await Project.findById(projectId);
    if (!project) {
      throw new AccessDeniedError('Project not found');
    }

    return true;
  }

  static async validateAdminAccess(userId: string): Promise<boolean> {
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new AccessDeniedError('User not found');
    }

    if (user.role !== 'admin') {
      throw new AccessDeniedError('Admin access required');
    }

    return true;
  }

  static async getUserProjects(userId: string) {
    await connectDB();
    
    const user = await User.findById(userId).populate('projectIds');
    if (!user) {
      throw new AccessDeniedError('User not found');
    }

    return user.projectIds;
  }
}
