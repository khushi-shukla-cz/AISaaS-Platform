import { NextRequest, NextResponse } from 'next/server';
import { AccessLayer } from '@/server/access';
import { AdminService } from '@/services/admin.service';
import { getRequestContext } from '@/lib/request-context';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const requestContext = getRequestContext(request);
    await AccessLayer.validateAdminAccess(requestContext.userId);
    await AccessLayer.validateUserProjectAccess(requestContext.userId, projectId);

    const activity = await AdminService.getRecentActivity(projectId);

    return NextResponse.json({ activity });
  } catch (error: any) {
    console.error('Fetch activity error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
