// app/api/orders/route.js

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import order from '@/models/Order';

export async function GET(req) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Step 1: Find all cart orders for the authenticated user
    const cartOrders = await Order.find({
      user: user._id,
      status: "CART",
    }).lean();

    if (!cartOrders.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 2: Consolidate menu items and quantities
    const menuItemMap = new Map(); // key = menuItemId, value = quantity
    for (const order of cartOrders) {
      for (const item of order.items) {
        const key = item.menuItem.toString();
        menuItemMap.set(key, (menuItemMap.get(key) || 0) + item.quantity);
      }
    }

    const menuItemIds = [...menuItemMap.keys()];

    // Step 3: Fetch full menuItem details and populate restaurant
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } })
      .populate("restaurant", "name") // populate only name of restaurant
      .lean();

    // Step 4: Merge quantity and details
    const mergedItems = menuItems.map((menuItem) => ({
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: menuItemMap.get(menuItem._id.toString()) || 0,
      restaurant: menuItem.restaurant?.name || "Unknown",
      orderId: cartOrders.find(order =>
        order.items.some(item => item.menuItem.toString() === menuItem._id.toString())
      )?._id || null,
      restaurantId: menuItem.restaurant?._id || null,
      description: menuItem.description || "",
      category: menuItem.category || "Uncategorized",
      isAvailable: menuItem.isAvailable || false,
      createdAt: menuItem.createdAt || new Date(),
      updatedAt: menuItem.updatedAt || new Date(),
    }));

    return NextResponse.json(mergedItems, { status: 200 });
  } catch (err) {
    console.error("GET /orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
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
