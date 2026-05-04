'use client';

import ChatInterface from '@/components/ChatInterface';
import { useEffect, useState } from 'react';
import { useConversations, useCreateConversation } from '@/hooks/useChat';
import {
  DEMO_PRODUCT_INSTANCE_ID,
  DEMO_PROJECT_ID,
  DEMO_USER_ID,
} from '@/lib/demo-identity';

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { data: conversations, isLoading: conversationsLoading } = useConversations(
    DEMO_USER_ID,
    DEMO_PROJECT_ID
  );
  const createConversation = useCreateConversation();

  useEffect(() => {
    if (conversationId || conversationsLoading || !conversations) {
      return;
    }

    const existingConversation = conversations[0];
    if (existingConversation) {
      setConversationId(existingConversation._id.toString());
      return;
    }

    const initConversation = async () => {
      try {
        const conversation = await createConversation.mutateAsync({
          userId: DEMO_USER_ID,
          projectId: DEMO_PROJECT_ID,
          productInstanceId: DEMO_PRODUCT_INSTANCE_ID,
        });
        setConversationId(conversation._id.toString());
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    };

    initConversation();
  }, [conversationId, conversations, conversationsLoading, createConversation]);

  if (conversationsLoading || !conversationId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      conversationId={conversationId}
      projectId={DEMO_PROJECT_ID}
      userId={DEMO_USER_ID}
    />
  );
}
