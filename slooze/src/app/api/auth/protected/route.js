import { NextResponse } from 'next/server';
import { authenticateRequest, requireRole } from '@/lib/auth';

export async function GET(req) {
  const authResult = await authenticateRequest(req);
  
  if (!authResult) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Attach user to request
  req.user = authResult;
  
  // Check for admin role
  const roleCheck = requireRole('ADMIN')(req, () => NextResponse.next());
  if (roleCheck) return roleCheck;
  
  // If passed all checks
  return NextResponse.json({
    message: 'This is a protected route',
    user: req.user
  });
}