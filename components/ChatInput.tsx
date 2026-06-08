'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            aria-label="Message input"
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-secondary rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          aria-label="Send message"
          aria-disabled={!input.trim() || Boolean(disabled)}
          disabled={!input.trim() || disabled}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </motion.button>
      </div>
    </form>
  );
}
