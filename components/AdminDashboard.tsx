'use client';

import { useDashboardConfig, useDashboardStats, useActivity, useIntegrations } from '@/hooks/useAdmin';
import { DynamicWidget } from '@/components/DynamicWidget';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  projectId: string;
  userId: string;
}

export default function AdminDashboard({ projectId, userId }: AdminDashboardProps) {
  const { data: config, isLoading: configLoading } = useDashboardConfig(projectId, userId);
  const { data: stats, isLoading: statsLoading } = useDashboardStats(projectId, userId);
  const { data: activity, isLoading: activityLoading } = useActivity(projectId, userId);
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations(projectId, userId);

  const isLoading = configLoading || statsLoading || activityLoading || integrationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const getWidgetData = (widget: any) => {
    switch (widget.type) {
      case 'stat-card':
        const statKey = widget.config?.statKey;
        return {
          value: stats?.[statKey as keyof typeof stats] || 0,
          trend: widget.config?.trend,
        };
      case 'integration-status':
        return integrations;
      case 'activity-feed':
        return activity;
      default:
        return null;
    }
  };

  const sortedWidgets = config?.layout.widgets.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary/50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Config-driven multi-tenant platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {sortedWidgets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No dashboard configuration found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Run the seed script to initialize the dashboard
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWidgets.map((widget, index) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${
                  widget.type === 'activity-feed' || widget.type === 'integration-status'
                    ? 'md:col-span-2 lg:col-span-1'
                    : ''
                }`}
              >
                <DynamicWidget config={widget} data={getWidgetData(widget)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
