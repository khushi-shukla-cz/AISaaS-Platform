'use client';

import { motion } from 'framer-motion';

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <span className="sr-only">Loading messages</span>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex justify-start"
        >
          <div className="max-w-[80%] bg-secondary/50 px-4 py-3 rounded-2xl w-full">
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary border border-border rounded-xl p-6"
          >
            <div className="h-4 bg-muted rounded w-1/2 mb-3 animate-pulse" />
            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
