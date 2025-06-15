import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);

    // Only ADMIN or MANAGER can cancel orders
    if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager only' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const { street, city, state, zip, countryName } = await req.json().catch(() => ({}));

    // Create update object for optional address update
    const updateFields = { status: 'CANCELLED' };

    if (street && city && state && zip && countryName) {
      Object.assign(updateFields, { street, city, state, zip, countryName });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, country: user.country },
      updateFields,
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('PATCH /orders/:id/cancel error:', err);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
