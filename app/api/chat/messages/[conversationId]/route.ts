import { NextRequest, NextResponse } from 'next/server';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';
import { getRequestContext } from '@/lib/request-context';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const requestContext = getRequestContext(request);
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || requestContext.userId;
    const projectId = searchParams.get('projectId') || requestContext.projectId;

    if (searchParams.get('userId') && searchParams.get('userId') !== requestContext.userId) {
      return NextResponse.json({ error: 'userId does not match request context' }, { status: 400 });
    }

    if (searchParams.get('projectId') && searchParams.get('projectId') !== requestContext.projectId) {
      return NextResponse.json({ error: 'projectId does not match request context' }, { status: 400 });
    }

    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const messages = await ChatService.getConversationMessages(conversationId, userId, projectId);

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Fetch messages error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
