import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/services/chat.service';
import { AccessLayer } from '@/server/access';
import { getRequestContext } from '@/lib/request-context';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestContext = getRequestContext(request);
    const userId = searchParams.get('userId') || requestContext.userId;
    const projectId = searchParams.get('projectId') || requestContext.projectId;

    if (searchParams.get('userId') && searchParams.get('userId') !== requestContext.userId) {
      return NextResponse.json({ error: 'userId does not match request context' }, { status: 400 });
    }

    if (searchParams.get('projectId') && searchParams.get('projectId') !== requestContext.projectId) {
      return NextResponse.json({ error: 'projectId does not match request context' }, { status: 400 });
    }

    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const conversations = await ChatService.getUserConversations(userId, projectId);

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
