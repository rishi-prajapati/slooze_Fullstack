// File: src/app/api/payment-methods/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PaymentMethod from '@/models/PaymentMethod';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET: Fetch payment method details (Owner only)
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const payment = await PaymentMethod.findById(id);
    if (!payment || payment.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden or not found' }, { status: 403 });
    }

    return NextResponse.json(payment);
  } catch (err) {
    console.error('GET /payment-methods/:id error:', err);
    return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
  }
}

// PUT: Update payment method (Admin only)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { cardNumber, expiry } = await req.json();
    if (!cardNumber || !expiry) {
      return NextResponse.json({ error: 'cardNumber and expiry are required' }, { status: 400 });
    }

    const payment = await PaymentMethod.findByIdAndUpdate(
      id,
      { cardNumber, expiry },
      { new: true, runValidators: true }
    );

    if (!payment) return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    return NextResponse.json(payment);
  } catch (err) {
    console.error('PUT /payment-methods/:id error:', err);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

// DELETE: Delete payment method (Admin only)
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const payment = await PaymentMethod.findByIdAndDelete(id);
    if (!payment) return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });

    return NextResponse.json({ message: 'Payment method deleted successfully' });
  } catch (err) {
    console.error('DELETE /payment-methods/:id error:', err);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}
