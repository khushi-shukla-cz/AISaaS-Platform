import { connectDB } from '@/lib/db';
import { AdminDashboardConfig, IAdminDashboardConfig } from '@/models/AdminDashboardConfig';
import { Message } from '@/models/Message';
import { Conversation } from '@/models/Conversation';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import { AuditService } from '@/services/audit.service';

export interface DashboardStats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  activeToday: number;
}

export interface ActivityItem {
  id: string;
  type: 'conversation' | 'user' | 'message' | 'audit';
  title: string;
  description: string;
  timestamp: Date;
}

export class AdminService {
  static async getDashboardConfig(projectId: string): Promise<IAdminDashboardConfig | null> {
    await connectDB();
    
    const config = await AdminDashboardConfig.findOne({ projectId });
    return config;
  }

  static async getDashboardStats(projectId: string): Promise<DashboardStats> {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const totalUsers = await User.countDocuments({
      projectIds: projectId,
    });

    const totalConversations = await Conversation.countDocuments({ projectId });
    const totalMessages = await Message.countDocuments({ projectId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeToday = await Message.countDocuments({
      projectId,
      createdAt: { $gte: today },
    });

    return {
      totalUsers,
      totalConversations,
      totalMessages,
      activeToday,
    };
  }

  static async getRecentActivity(projectId: string, limit: number = 10): Promise<ActivityItem[]> {
    await connectDB();

    const [recentMessages, recentAuditEvents] = await Promise.all([
      Message.find({ projectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('conversationId'),
      AuditService.getRecentEvents(projectId, limit),
    ]);

    const activities: ActivityItem[] = [
      ...recentMessages.map((msg) => ({
        id: msg._id.toString(),
        type: 'message' as const,
        title: msg.role === 'user' ? 'User Message' : 'AI Response',
        description: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
        timestamp: msg.createdAt,
      })),
      ...recentAuditEvents.map((event) => ({
        id: event.id,
        type: 'audit' as const,
        title: event.title,
        description: event.description,
        timestamp: event.timestamp,
      })),
    ];

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  static async getIntegrationStatus(projectId: string) {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    return {
      shopify: {
        enabled: project.enabledIntegrations.shopify,
        status: project.enabledIntegrations.shopify ? 'active' : 'inactive',
        lastSync: project.enabledIntegrations.shopify ? new Date() : null,
      },
      crm: {
        enabled: project.enabledIntegrations.crm,
        status: project.enabledIntegrations.crm ? 'active' : 'inactive',
        lastSync: project.enabledIntegrations.crm ? new Date() : null,
      },
    };
  }

  static async updateDashboardConfig(
    projectId: string,
    config: Partial<IAdminDashboardConfig>
  ): Promise<IAdminDashboardConfig> {
    await connectDB();

    const updatedConfig = await AdminDashboardConfig.findOneAndUpdate(
      { projectId },
      { $set: config },
      { new: true, upsert: true }
    );

    await AuditService.logEvent({
      projectId,
      actorRole: 'admin',
      action: 'admin.dashboard_config_updated',
      resourceType: 'dashboard-config',
      resourceId: updatedConfig._id.toString(),
      details: {
        widgetCount: updatedConfig.layout?.widgets?.length ?? 0,
      },
    });

    return updatedConfig;
  }
}
