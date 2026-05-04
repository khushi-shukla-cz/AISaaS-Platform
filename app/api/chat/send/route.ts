import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';

const sendMessageSchema = z.object({
  conversationId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendMessageSchema.parse(body);

    await AccessLayer.validateUserProjectAccess(validated.userId, validated.projectId);

    const result = await ChatService.sendMessage(validated);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Send message error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
