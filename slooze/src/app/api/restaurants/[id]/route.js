import { NextResponse } from 'next/server';
import Restaurant from '@/models/Restaurant';
import dbConnect from '@/lib/dbConnect';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET restaurant by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }

    const restaurant = await Restaurant.findOne({ _id: id, country: user.country });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
  }
}

// UPDATE restaurant by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager access required' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }

    const { name, image } = await req.json();
    if (!name || !image) {
      return NextResponse.json({ error: 'Name and image are required' }, { status: 400 });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, country: user.country },
      { name, image },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (err) {
    console.error('PUT Error:', err);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Restaurant with this name already exists' }, { status: 409 });
    }
    if (err.name === 'ValidationError') {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}

// DELETE restaurant by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }

    const restaurant = await Restaurant.findOneAndDelete({ _id: id, country: user.country });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Restaurant deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
}
