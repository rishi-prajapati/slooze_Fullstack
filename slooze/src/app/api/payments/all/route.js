import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PaymentMethod from '@/models/PaymentMethod';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Optionally, enforce admin-only access
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all payment methods and populate user name and ID
    const methods = await PaymentMethod.find().populate('user', '_id name');
    return NextResponse.json(methods);
  } catch (err) {
    console.error('GET /payment-methods error:', err);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}
