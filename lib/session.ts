import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AccessDeniedError } from '@/server/access';

export async function getSessionContext() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new AccessDeniedError('No session found');
  }

  return {
    userId: session.user.id,
    userRole: (session.user as any).role || 'user',
    userEmail: session.user.email,
  };
}
