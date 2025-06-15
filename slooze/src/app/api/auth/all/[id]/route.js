import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req, { params }) {
  try {
    const adminUser = await authenticateRequest(req);

    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admin can update roles' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { role } = await req.json();

    if (!['ADMIN', 'MANAGER', 'MEMBER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('PUT /users/[id]/role error:', err);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
