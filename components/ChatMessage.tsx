'use client';

import { motion } from 'framer-motion';
import { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.metadata && !isUser && (
          <div className="mt-2 space-y-1">
            {message.metadata.integrationsUsed && message.metadata.integrationsUsed.length > 0 && (
              <div className="flex gap-2 items-center">
                {message.metadata.integrationsUsed.map((integration) => (
                  <span
                    key={integration}
                    className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground"
                  >
                    {integration.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {message.metadata.processingTime && (
              <p className="text-xs text-muted-foreground">
                Processed in {(message.metadata.processingTime / 1000).toFixed(2)}s
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
