import Head from 'next/head';
import React from 'react';

const IMAGE_URL1 = "https://content3.jdmagicbox.com/comp/def_content_category/kfc/306789372-5898305976866581-8798661991762743391-n-kfc-1003-8e0w6.jpg";

export default function OrderHistory() {
    const orders = [
        { status: 'Delivered', name: 'The Spice Merchant', detail: '2× Chicken Tikka Masala', price: '$25.00', img: IMAGE_URL1 },
        { status: 'Dispatched', name: 'Pasta Paradise', detail: '1× Spaghetti Carbonara', price: '$18.50', img: IMAGE_URL1 },
        { status: 'Cancelled', name: 'Burger Barn', detail: '1× Classic Cheeseburger', price: '$12.75', img: IMAGE_URL1 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'text-green-600';
            case 'Dispatched':
                return 'text-yellow-600';
            case 'Cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

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
              

                {/* Main Content */}
                <main className="mx-auto w-full max-w-4xl px-6 py-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#0e1b0e]">Orders</h2>
                        <p className="mt-1 text-green-600">View your past restaurant orders</p>
                    </div>

                    <div className="space-y-4">
                        {orders.map((order, idx) => (
                            <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                {/* Image */}
                                <img
                                    src={order.img}
                                    alt={`${order.name} dish`}
                                    className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
                                />

                                {/* Order Details */}
                                <div className="flex flex-1 flex-col gap-1">
                                    <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-lg font-semibold text-[#0e1b0e]">{order.name}</span>
                                    <span className="text-sm text-green-600">{order.detail}</span>
                                    <span className="mt-auto inline-flex w-fit rounded-xl bg-[#e7f3e7] text-black px-3 py-1 text-sm font-medium">
                                        {order.price}
                                    </span>
                                </div>

                                {/* Cancel Button: only if status is "Dispatched" */}
                                {order.status === 'Dispatched' && (
                                    <button
                                        className="rounded-xl bg-red-100 px-4 py-1 text-sm font-medium text-red-600 transition hover:bg-red-200"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
