import { useQuery } from '@tanstack/react-query';

export interface DashboardStats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  activeToday: number;
}

export interface ActivityItem {
  id: string;
  type: 'conversation' | 'user' | 'message';
  title: string;
  description: string;
  timestamp: string;
}

export interface IntegrationStatus {
  enabled: boolean;
  status: string;
  lastSync: string | null;
}

export interface DashboardConfig {
  _id: string;
  projectId: string;
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      config: Record<string, any>;
      order: number;
    }>;
  };
}

export function useDashboardConfig(projectId: string) {
  return useQuery({
    queryKey: ['dashboard-config', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/config?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch dashboard config');
      const data = await res.json();
      return data.config as DashboardConfig | null;
    },
  });
}

export function useDashboardStats(projectId: string) {
  return useQuery({
    queryKey: ['dashboard-stats', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data.stats as DashboardStats;
    },
  });
}

export function useActivity(projectId: string) {
  return useQuery({
    queryKey: ['activity', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/activity?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch activity');
      const data = await res.json();
      return data.activity as ActivityItem[];
    },
  });
}

export function useIntegrations(projectId: string) {
  return useQuery({
    queryKey: ['integrations', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/integrations?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch integrations');
      const data = await res.json();
      return data.integrations as Record<string, IntegrationStatus>;
    },
  });
}
