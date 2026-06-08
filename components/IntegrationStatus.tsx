'use client';

import { motion } from 'framer-motion';

interface Integration {
  name: string;
  enabled: boolean;
  status: string;
  lastSync: string | null;
}

interface IntegrationStatusProps {
  integrations: Integration[];
}

export function IntegrationStatus({ integrations }: IntegrationStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary border border-border rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Integrations</h3>
      <div className="space-y-4" role="list" aria-label="Integration list">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-background rounded-lg"
            role="listitem"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  integration.enabled ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
              <div>
                <p className="font-medium text-foreground">{integration.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {integration.status}
                </p>
              </div>
            </div>
            {integration.lastSync && (
              <p className="text-xs text-muted-foreground">
                Synced {new Date(integration.lastSync).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
