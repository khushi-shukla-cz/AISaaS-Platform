'use client';

import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary border border-border rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
