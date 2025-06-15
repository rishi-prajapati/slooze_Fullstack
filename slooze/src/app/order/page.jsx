'use client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'PAID':
      case 'DISPATCHED':
        return 'text-yellow-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getReadableStatus = (status) => {
    const mapping = {
      PAID: 'Dispatched',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };
    return mapping[status] || status;
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/user');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setCancelingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Failed to cancel order');
        return;
      }

      const updatedOrder = await res.json();

      // Replace the updated order in state
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (err) {
      console.error('Cancel order error:', err);
      alert('Something went wrong while cancelling the order.');
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Head>
        <title>Order History • My Restaurant</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          as="style"
          onLoad={(e) => { e.currentTarget.rel = 'stylesheet'; }}
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900&display=swap"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries,aspect-ratio"></script>
      </Head>

      <div
        className="flex min-h-screen flex-col bg-[#f8fcf8]"
        style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
      >
        <main className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#0e1b0e]">Orders</h2>
            <p className="mt-1 text-green-600">View your past restaurant orders</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500">No past orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                order.items.map((item, itemIdx) => (
                  <div key={`${order.orderId}-${itemIdx}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    {/* Image */}
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
                    />

                    {/* Order Details */}
                    <div className="flex flex-1 flex-col gap-1">
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getReadableStatus(order.status)}
                      </span>
                      <span className="text-lg font-semibold text-[#0e1b0e]">{item.restaurantName || "Unknown Restaurant"}</span>
                      <span className="text-sm text-green-600">{item.quantity}× {item.name}</span>
                      <span className="mt-auto inline-flex w-fit rounded-xl bg-[#e7f3e7] text-black px-3 py-1 text-sm font-medium">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Cancel Button */}
                    {order.status === 'PAID' && (
                      <button
                        onClick={() => cancelOrder(order.orderId)}
                        disabled={cancelingId === order.orderId}
                        className={`rounded-xl px-4 py-1 text-sm font-medium transition ${
                          cancelingId === order.orderId
                            ? 'bg-red-200 text-red-500 cursor-not-allowed'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {cancelingId === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                ))
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
