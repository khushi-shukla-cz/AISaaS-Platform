import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';
import { getRequestContext } from '@/lib/request-context';

const createConversationSchema = z.object({
  userId: z.string().optional(),
  projectId: z.string().optional(),
  productInstanceId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createConversationSchema.parse(body);
    const requestContext = getRequestContext(request);
    const userId = validated.userId || requestContext.userId;
    const projectId = validated.projectId || requestContext.projectId;

    if (validated.userId && validated.userId !== requestContext.userId) {
      return NextResponse.json({ error: 'userId does not match request context' }, { status: 400 });
    }

    if (validated.projectId && validated.projectId !== requestContext.projectId) {
      return NextResponse.json({ error: 'projectId does not match request context' }, { status: 400 });
    }

    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const conversation = await ChatService.createConversation(
      userId,
      projectId,
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
