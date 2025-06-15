// app/api/orders/route.js

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const cartOrders = await Order.find({
      user: user._id,
      status: 'CART',
    }).lean();

    return NextResponse.json(cartOrders, { status: 200 });
  } catch (err) {
    console.error('GET /orders error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Manager access required' },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { items, status } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    // Validate each order item
    for (const { menuItem, quantity } of items) {
      if (!mongoose.isValidObjectId(menuItem)) {
        return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
      }
      if (typeof quantity !== 'number' || quantity < 1) {
        return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 });
      }
    }

    await dbConnect();
    const order = await Order.create({
      user: user._id,
      country: user.country,
      status: 'CART',
      items,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('POST /orders error:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
