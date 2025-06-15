// pages/admin-dashboard.jsx
import React from "react";
import Image from "next/image";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
    
      <main className="px-4 md:px-40 py-6">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[32px] font-bold leading-tight">Dashboard</h1>
            <p className="text-sm text-[#8d5e5e]">Overview of your platform's performance</p>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Total Users", value: "1,234", change: "+10%" },
            { title: "Total Orders", value: "5,678", change: "+5%" },
            { title: "Total Restaurants", value: "910", change: "+8%" },
            { title: "Total Revenue", value: "$12,345", change: "+12%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#f5f0f0] rounded-xl p-6 flex flex-col gap-2"
            >
              <p className="text-base font-medium">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[#078807] text-base font-medium">{stat.change}</p>
            </div>
          ))}
        </section>

        <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Recent Orders</h2>
        <div className="px-4 py-3">
          <div className="overflow-x-auto rounded-xl border border-[#e7dada] bg-white">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white">
                <tr>
                  {["Order ID", "User", "Restaurant", "Amount", "Status", "Date"].map((head, i) => (
                    <th key={i} className="px-4 py-3 font-medium text-[#181010]">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#12345", user: "Sophia Clark", restaurant: "The Italian Place", amount: "$25.50", status: "Delivered", date: "2024-01-15" },
                  { id: "#12346", user: "Ethan Miller", restaurant: "Burger Joint", amount: "$18.75", status: "Pending", date: "2024-01-16" },
                ].map((order, i) => (
                  <tr key={i} className="border-t border-[#e7dada]">
                    <td className="px-4 py-2 text-[#181010]">{order.id}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.user}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.restaurant}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.amount}</td>
                    <td className="px-4 py-2">
                      <button className="bg-[#f5f0f0] text-[#181010] rounded-xl px-4 h-8 text-sm font-medium">
                        {order.status}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-4 py-3">
          <button className="bg-[#fe4c4c] text-white rounded-xl px-4 py-2 text-sm font-bold">
            Add User
          </button>
          <button className="bg-[#f5f0f0] text-[#181010] rounded-xl px-4 py-2 text-sm font-bold">
            Add Payment Method
          </button>
        </div>
      </main>
    </div>
  );
}