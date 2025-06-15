
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

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const order = await Order.findOne({ _id: id, country: user.country });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (err) {
    console.error('GET /orders/:id error:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    const validatedItems = [];
    for (const { menuItem, quantity } of items) {
      if (!isValidObjectId(menuItem) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid item or quantity' }, { status: 400 });
      }

      const item = await MenuItem.findById(menuItem).populate('restaurant');
      if (!item || item.restaurant.country !== user.country) {
        return NextResponse.json({ error: 'Invalid menu item' }, { status: 403 });
      }
      validatedItems.push({ menuItem, quantity });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, user: user._id, country: user.country },
      { items: validatedItems },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found or not authorized' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error('PUT /orders/:id error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const order = await Order.findOneAndDelete({ _id: id, user: user._id });
    if (!order) return NextResponse.json({ error: 'Order not found or not authorized' }, { status: 404 });

    return NextResponse.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('DELETE /orders/:id error:', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
