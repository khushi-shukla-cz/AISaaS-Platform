'use client';

import ChatInterface from '@/components/ChatInterface';
import { useEffect, useState } from 'react';
import { useCreateConversation } from '@/hooks/useChat';

const DEMO_USER_ID = '000000000000000000000001';
const DEMO_PROJECT_ID = '000000000000000000000002';
const DEMO_PRODUCT_INSTANCE_ID = '000000000000000000000003';

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const createConversation = useCreateConversation();

  useEffect(() => {
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
  }, []);

  if (!conversationId) {
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
