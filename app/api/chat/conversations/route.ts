import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';

const createConversationSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  productInstanceId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createConversationSchema.parse(body);

    await AccessLayer.validateUserProjectAccess(validated.userId, validated.projectId);

    const conversation = await ChatService.createConversation(
      validated.userId,
      validated.projectId,
      validated.productInstanceId
    );

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
