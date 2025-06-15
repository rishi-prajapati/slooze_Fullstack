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

    // Only ADMIN or MANAGER can place orders
    if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager only' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const { street, city, state, zip, countryName } = await req.json();

    // Validate address fields
    if (![street, city, state, zip, countryName].every(Boolean)) {
      return NextResponse.json({ error: 'All address fields are required' }, { status: 400 });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, country: user.country },
      {
        status: 'PAID',
        street,
        city,
        state,
        zip,
        countryName,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (err) {
    console.error('PATCH /orders/:id/place error:', err);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
