import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access only' },
        { status: 403 }
      );
    }

    await dbConnect();

    const users = await User.find().select('-password').lean(); // remove password if it exists

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error('GET /users/all error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
