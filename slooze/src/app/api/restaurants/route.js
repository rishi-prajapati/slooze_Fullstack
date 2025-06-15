import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Restaurant from '@/models/Restaurant';

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

    const { name, country, image } = await req.json();

    if (!name || !country || !image) {
      return NextResponse.json(
        { error: 'Name, country, and image are required' },
        { status: 400 }
      );
    }

    if (country !== user.country) {
      return NextResponse.json(
        { error: 'Cannot create restaurant for another country' },
        { status: 403 }
      );
    }

    await dbConnect();
    const restaurant = await Restaurant.create({ name, country, image });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (err) {
    console.error('POST /restaurants error:', err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: 'Restaurant with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const restaurants = await Restaurant.find({ country: user.country }).lean();

    return NextResponse.json(restaurants, { status: 200 });
  } catch (err) {
    console.error('GET /restaurants error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
