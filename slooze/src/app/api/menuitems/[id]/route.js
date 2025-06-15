import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET one menu item (ADMIN, MANAGER, MEMBER)
export async function GET(req, context) {
  try {
    await dbConnect();

    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
    }

    const menuItem = await MenuItem.findById(id).populate('restaurant');

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    if (menuItem.restaurant.country !== user.country) {
      return NextResponse.json({ error: 'Access denied: Menu item belongs to another country' }, { status: 403 });
    }

    return NextResponse.json(menuItem, { status: 200 });
  } catch (err) {
    console.error('GET /menuitems/:id error:', err);
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

// PUT update menu item (ADMIN, MANAGER)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager access required' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { name, price, image } = await req.json();

    if (!name && !price && !image) {
      return NextResponse.json({ error: 'At least one of name, price, or image is required' }, { status: 400 });
    }

    const menuItem = await MenuItem.findById(id).populate('restaurant');
    if (!menuItem || menuItem.restaurant.country !== user.country) {
      return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    }

    if (name) menuItem.name = name;
    if (price) menuItem.price = price;
    if (image) menuItem.image = image;

    await menuItem.save();

    return NextResponse.json(menuItem, { status: 200 });
  } catch (err) {
    console.error('PUT /menuitems/:id error:', err);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE menu item (ADMIN only)
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const menuItem = await MenuItem.findById(id).populate('restaurant');
    if (!menuItem || menuItem.restaurant.country !== user.country) {
      return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    }

    await MenuItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Menu item deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /menuitems/:id error:', err);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
