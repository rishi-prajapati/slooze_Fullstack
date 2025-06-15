import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { authenticateRequest } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all menu items for user's country (ADMIN, MANAGER, MEMBER)
export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Login required' }, { status: 401 });
    }

    const restaurants = await Restaurant.find({ country: user.country }).select('_id');
    const restaurantIds = restaurants.map(r => r._id);

    const menuItems = await MenuItem.find({ restaurant: { $in: restaurantIds } });

    return NextResponse.json(menuItems, { status: 200 });
  } catch (err) {
    console.error('[GET /menuitems] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch menu items. Please try again later.' },
      { status: 500 }
    );
  }
}

// POST new menu item (ADMIN, MANAGER)
export async function POST(req) {
  try {
    await dbConnect();

    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Login required' }, { status: 401 });
    }

    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only ADMIN or MANAGER can create menu items' },
        { status: 403 }
      );
    }

    const { name, price, restaurant,image } = await req.json();

    if (!name || typeof name !== 'string' || !price || !restaurant) {
      return NextResponse.json(
        { error: 'Invalid input: name, price, and restaurant are required' },
        { status: 400 }
      );
    }

    if (!isValidObjectId(restaurant)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    const restaurantDoc = await Restaurant.findOne({ _id: restaurant, country: user.country });

    if (!restaurantDoc) {
      return NextResponse.json(
        { error: 'Restaurant not found or not accessible in your country' },
        { status: 403 }
      );
    }

    const menuItem = await MenuItem.create({ name, price, restaurant,image });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (err) {
    console.error('[POST /menuitems] Error:', err);
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create menu item. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET one menu item (ADMIN, MANAGER, MEMBER)
// export async function GET (req, { params }) {
//   try {
//     await dbConnect();

//     const user = await authenticateRequest(req);
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized: Login required' }, { status: 401 });
//     }

//     const { id } = params;
//     if (!isValidObjectId(id)) {
//       return NextResponse.json({ error: 'Invalid menu item ID' }, { status: 400 });
//     }

//     const menuItem = await MenuItem.findById(id).populate('restaurant');

//     if (!menuItem) {
//       return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
//     }

//     if (menuItem.restaurant.country !== user.country) {
//       return NextResponse.json(
//         { error: 'Access denied: Menu item belongs to another country' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json(menuItem, { status: 200 });
//   } catch (err) {
//     console.error('[GET /menuitems/:id] Error:', err);
//     return NextResponse.json(
//       { error: 'Failed to fetch menu item. Please try again later.' },
//       { status: 500 }
//     );
//   }
// }
