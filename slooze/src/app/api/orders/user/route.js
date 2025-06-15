
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

    // Get all orders for the user except those with status "CART"
    const orders = await Order.find({
      user: user._id,
      status: { $ne: "CART" }, // ✅ Exclude "CART" orders
    })
      .populate("items.menuItem") // populate menuItem details
      .lean();

    if (!orders.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Format each order
    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        menuItemId: item.menuItem?._id,
        name: item.menuItem?.name,
        price: item.menuItem?.price,
        quantity: item.quantity,
        image: item.menuItem?.image,
        description: item.menuItem?.description,
        category: item.menuItem?.category,
        isAvailable: item.menuItem?.isAvailable,
        restaurantName: item.menuItem?.restaurant?.name || "Unknown",
        restaurantId: item.menuItem?.restaurant?._id || null,
      })),
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (err) {
    console.error("GET /orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
