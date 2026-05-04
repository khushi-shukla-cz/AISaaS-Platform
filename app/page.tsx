'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            AI SaaS Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            Multi-tenant AI assistant with config-driven admin dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/chat">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-secondary border border-border rounded-xl p-8 cursor-pointer group"
            >
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Chat Interface
              </h2>
              <p className="text-muted-foreground">
                AI-powered chat with integration support (Shopify, CRM)
              </p>
              <div className="mt-4 text-primary text-sm font-medium">
                Launch Chat →
              </div>
            </motion.div>
          </Link>

          <Link href="/admin">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-secondary border border-border rounded-xl p-8 cursor-pointer group"
            >
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Admin Dashboard
              </h2>
              <p className="text-muted-foreground">
                Config-driven dashboard with dynamic widgets and analytics
              </p>
              <div className="mt-4 text-primary text-sm font-medium">
                Open Dashboard →
              </div>
            </motion.div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Built with Next.js, MongoDB, Gemini AI, and TanStack Query
          </p>
          <div className="flex gap-4 justify-center">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              Multi-tenant
            </span>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              Config-driven UI
            </span>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              Production-ready
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
