// /api/orders/place.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function PATCH(req) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);

    if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager only' }, { status: 403 });
    }

    const body = await req.json();
    const { orderIds, addresses } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'orderIds must be a non-empty array' }, { status: 400 });
    }

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json({ error: 'addresses must be a non-empty array' }, { status: 400 });
    }

    if (addresses.length !== 1 && addresses.length !== orderIds.length) {
      return NextResponse.json({
        error: 'addresses array must either have exactly 1 item or match orderIds length',
      }, { status: 400 });
    }

    const getAddressFor = (i) => addresses.length === 1 ? addresses[0] : addresses[i];

    for (let i = 0; i < addresses.length; i++) {
      const { street, city, state, zip, countryName } = addresses[i];
      if (![street, city, state, zip, countryName].every(Boolean)) {
        return NextResponse.json({
          error: `All address fields are required at addresses[${i}]`,
        }, { status: 400 });
      }
    }

    const updatedOrders = [];
    const errors = [];

    for (let i = 0; i < orderIds.length; i++) {
      const id = orderIds[i];
      if (!isValidObjectId(id)) {
        errors.push({ id, error: 'Invalid ObjectId' });
        continue;
      }

      const { street, city, state, zip, countryName } = getAddressFor(i);

      const order = await Order.findById(id);
      if (!order) {
        errors.push({ id, error: 'Order not found or access denied' });
        continue;
      }

      order.status = 'PAID';
      order.street = street;
      order.city = city;
      order.state = state;
      order.zip = zip;
      order.countryName = countryName;
      order.updatedAt = new Date();

      await order.save();
      updatedOrders.push(order);
    }

    return NextResponse.json({ updatedOrders, errors }, { status: 200 });

  } catch (err) {
    console.error('PATCH /orders/place error:', err);
    return NextResponse.json({ error: 'Failed to update orders' }, { status: 500 });
  }
}
