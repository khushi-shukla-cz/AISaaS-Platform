'use client';

import { StatCard } from './StatCard';
import { IntegrationStatus } from './IntegrationStatus';
import { ActivityFeed } from './ActivityFeed';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  order: number;
}

export interface WidgetProps {
  config: WidgetConfig;
  data?: any;
}

export const WidgetRegistry: Record<string, React.ComponentType<WidgetProps>> = {
  'stat-card': ({ config, data }) => (
    <StatCard
      title={config.title}
      value={data?.value || 0}
      description={config.config?.description}
      trend={data?.trend}
    />
  ),
  'integration-status': ({ data }) => {
    const integrations = Object.entries(data || {}).map(([name, info]: [string, any]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      enabled: info.enabled,
      status: info.status,
      lastSync: info.lastSync,
    }));

    return <IntegrationStatus integrations={integrations} />;
  },
  'activity-feed': ({ data }) => (
    <ActivityFeed activities={data || []} />
  ),
  'chart': ({ config }) => (
    <div className="bg-secondary border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{config.title}</h3>
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Chart widget - {config.config?.chartType || 'line'}
      </div>
    </div>
  ),
  'custom-section': ({ config }) => (
    <div className="bg-secondary border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{config.title}</h3>
      <p className="text-muted-foreground">{config.config?.content || 'Custom content'}</p>
    </div>
  ),
};

export function DynamicWidget({ config, data }: WidgetProps) {
  const WidgetComponent = WidgetRegistry[config.type];

  if (!WidgetComponent) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-6">
        <p className="text-muted-foreground">Unknown widget type: {config.type}</p>
      </div>
    );
  }

  return <WidgetComponent config={config} data={data} />;
}
