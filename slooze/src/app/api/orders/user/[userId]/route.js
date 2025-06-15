import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = params;
    if (!isValidObjectId(userId)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });

    const orders = await Order.find({ user: userId, country: user.country });
    return NextResponse.json(orders);
  } catch (err) {
    console.error('GET /orders/user/:userId error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders by user' }, { status: 500 });
  }
}
