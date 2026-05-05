import { NextRequest } from 'next/server';
import { DEMO_PROJECT_ID, DEMO_USER_ID } from '@/lib/demo-identity';

export interface RequestContext {
  userId: string;
  projectId: string;
  source: 'headers' | 'query' | 'demo';
}

function readHeader(request: NextRequest, name: string) {
  return request.headers.get(name)?.trim() || '';
}

export function getRequestContext(request: NextRequest): RequestContext {
  const headerUserId = readHeader(request, 'x-user-id');
  const headerProjectId = readHeader(request, 'x-project-id');

  if (headerUserId && headerProjectId) {
    return {
      userId: headerUserId,
      projectId: headerProjectId,
      source: 'headers',
    };
  }

  const queryUserId = request.nextUrl.searchParams.get('userId')?.trim() || '';
  const queryProjectId = request.nextUrl.searchParams.get('projectId')?.trim() || '';

  if (queryUserId && queryProjectId) {
    return {
      userId: queryUserId,
      projectId: queryProjectId,
      source: 'query',
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    return {
      userId: DEMO_USER_ID,
      projectId: DEMO_PROJECT_ID,
      source: 'demo',
    };
  }

  throw new Error('Missing request identity. Send x-user-id and x-project-id headers.');
}
