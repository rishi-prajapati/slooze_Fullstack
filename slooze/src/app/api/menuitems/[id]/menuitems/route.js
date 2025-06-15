import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req, context) {
  try {
    await dbConnect();

    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    const { id: restaurantId } = params;

    if (!isValidObjectId(restaurantId)) {
      return NextResponse.json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }

    // Make sure the restaurant exists and belongs to the same country as user
    const restaurant = await Restaurant.findOne({ _id: restaurantId, country: user.country });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found or access denied' }, { status: 404 });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurantId });

    return NextResponse.json(menuItems, { status: 200 });
  } catch (err) {
    console.error('GET /restaurants/:id/menuitems error:', err);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}
