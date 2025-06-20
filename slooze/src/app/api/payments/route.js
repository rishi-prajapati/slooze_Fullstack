
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PaymentMethod from '@/models/PaymentMethod';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const methods = await PaymentMethod.find({ user: user._id });
    return NextResponse.json(methods);
  } catch (err) {
    console.error('GET /payment-methods error:', err);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cardNumber, expiry } = await req.json();
    if (!cardNumber || !expiry) {
      return NextResponse.json({ error: 'cardNumber and expiry are required' }, { status: 400 });
    }

    const method = await PaymentMethod.create({ user: user._id, cardNumber, expiry });
    return NextResponse.json(method, { status: 201 });
  } catch (err) {
    console.error('POST /payment-methods error:', err);
    return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 });
  }
}

