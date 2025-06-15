// pages/member-dashboard.jsx
import React from "react";
import Image from "next/image";

export default function MemberDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#181010]">
            <main className="px-4 md:px-40 py-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-700">Explore restaurants and your activity</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Orders This Week", value: "12" },
            { title: "Total Spent", value: "$520.00" },
            { title: "Favorite Cuisine", value: "Italian" },
            { title: "Saved Cards", value: "2" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#f5f0f0] rounded-xl p-4 shadow-card flex flex-col gap-1"
            >
              <p className="text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Recent Orders</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white">
                <tr>
                  {[
                    "Order ID",
                    "Restaurant",
                    "Amount",
                    "Date",
                    "Status",
                    "Action",
                  ].map((head, i) => (
                    <th key={i} className="px-4 py-3 font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#10101",
                    restaurant: "The Spice Merchant",
                    amount: "$45.50",
                    date: "2024-07-25",
                    status: "Delivered",
                    action: "Reorder",
                  },
                  {
                    id: "#10102",
                    restaurant: "Pasta Paradise",
                    amount: "$30.75",
                    date: "2024-07-23",
                    status: "Cancelled",
                    action: "View",
                  },
                ].map((order, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2 text-gray-700">{order.restaurant}</td>
                    <td className="px-4 py-2 text-gray-700">{order.amount}</td>
                    <td className="px-4 py-2 text-gray-700">{order.date}</td>
                    <td className="px-4 py-2">
                      <span className="bg-gray-100 px-3 py-1 rounded-xl inline-block">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[#8d5e5e] font-semibold">
                      {order.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Payment Methods</h2>
          <div className="bg-white rounded-xl shadow-card p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 05/25</p>
              </div>
              <button className="text-sm text-[#dc3545] font-semibold">Remove</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">UPI: rishi@bank</p>
                <p className="text-sm text-gray-600">Primary</p>
              </div>
              <button className="text-sm text-[#dc3545] font-semibold">Remove</button>
            </div>
            <button className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold w-fit">
              Add Payment Method
            </button>
          </div>
        </section>

        <section className="flex gap-4 flex-wrap">
          <button className="bg-[#f5f0f0] text-[#181010] rounded-xl px-4 py-2 text-sm font-bold">
            Browse Restaurants
          </button>
          <button className="bg-[#f5f0f0] text-[#181010] rounded-xl px-4 py-2 text-sm font-bold">
            My Orders
          </button>
        </section>
      </main>
    </div>
  );
}