'use client';

import { useState, useEffect, useRef } from 'react';
import { useMessages, useSendMessage } from '@/hooks/useChat';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ThinkingSteps } from '@/components/ThinkingSteps';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  conversationId: string;
  projectId: string;
  userId: string;
}

export default function ChatInterface({
  conversationId,
  projectId,
  userId,
}: ChatInterfaceProps) {
  const { data: messages, isLoading } = useMessages(conversationId, userId, projectId);
  const sendMessage = useSendMessage();
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (content: string) => {
    setIsThinking(true);
    setThinkingSteps(['Processing your request...']);

    try {
      await sendMessage.mutateAsync({
        conversationId,
        projectId,
        userId,
        content,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsThinking(false);
      setThinkingSteps([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b border-border bg-secondary/50 px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">Multi-tenant AI Platform</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {messages?.map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))}

            {isThinking && (
              <ThinkingSteps steps={thinkingSteps} isActive={isThinking} />
            )}

            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={sendMessage.isPending || isThinking} />
    </div>
  );
}
