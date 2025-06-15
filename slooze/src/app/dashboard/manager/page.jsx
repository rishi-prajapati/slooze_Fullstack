// pages/manager-dashboard.jsx
import React from "react";
import Image from "next/image";

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#181010]">
    
      <main className="px-4 md:px-40 py-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Restaurants", value: "120" },
              { title: "Total Orders Today", value: "350" },
              { title: "Revenue Today", value: "$15,000" },
              { title: "Cancelled Orders", value: "15" },
            ].map((card, i) => (
              <div key={i} className="bg-[#f5f0f0] p-6 rounded-xl flex flex-col gap-1">
                <p className="text-base font-medium">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">My Restaurants</h2>
          <div className="flex overflow-x-auto gap-4 p-2">
            {[
              {
                name: "The Spice Merchant",
                type: "Indian Cuisine",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTYakmEN48-r-Zxc3alYcLpb7GPa-i3QdPFbvPS7Bgf-KOZ9FgkyxM9_9MQFXBRS6mpGVLFRh90GU9-thbP7NZUiBeu604Bw2xARxPRCrgGhGH6vvz0DakstKwwVu40Z_5HY9CSlc8ldUo_tMyzrCw--qIkXR1HFt93iV4hTQCZGMNCrKZ8d1dAjKFKPyck-Si1s6a3kQVcEmLEd7q_vUwoLeFJ1LtPUiE0-KBr1Y9LBikUMh8vUbwFe9MHzzMb1-Q_UU6bj-p_QGH",
              },
              {
                name: "The Cozy Corner Bistro",
                type: "Italian Comfort Food",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-5YDYSp72hjlTbmolp6GnrZIpGis7CtHxG9vkha_PtowUEDmO6Wn3E7OjUdiQzExaau9kQbdx0XZsOIEFq7YJR_gus9jXUGcY6Z8iRHwM2IxI8DQPULkFjR0VgzdHUSOnmpPLzK3oPPRBcoCSvXsTzYTUaBCFHmTuXMIVDf5_KbIAd-JhiH21M4MBxmngBe9WFKxbP6D80_z3LuM9GNr_FMFL656Wx_5mCJseCMwjbN0iU_eUg0mCoNl2krZ68yv5FzV7PckUdQ_X",
              },
            ].map((rest, i) => (
              <div key={i} className="min-w-[160px] w-40 flex flex-col gap-2">
                <div
                  className="aspect-square rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${rest.image}')` }}
                />
                <p className="font-medium">{rest.name}</p>
                <p className="text-sm text-[#8d5e5e]">{rest.type}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Recent Orders</h2>
          <div className="overflow-x-auto border border-[#e7dada] rounded-xl">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-white">
                  {["Order ID", "Customer", "Restaurant", "Date", "Status", "Action"].map((head, i) => (
                    <th key={i} className="px-4 py-3 text-left font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#12345", user: "Sophia Clark", restaurant: "The Spice Merchant", date: "2024-07-26", status: "Delivered" },
                  { id: "#12346", user: "Ethan Miller", restaurant: "The Cozy Corner Bistro", date: "2024-07-26", status: "Preparing" },
                ].map((order, i) => (
                  <tr key={i} className="border-t border-[#e7dada]">
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.id}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.user}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.restaurant}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{order.date}</td>
                    <td className="px-4 py-2">
                      <span className="bg-[#f5f0f0] px-4 py-1 rounded-xl inline-block">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-bold text-[#8d5e5e]">
                      {order.status === "Preparing" ? "Cancel" : "View Details"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-[#fe4c4c] text-white rounded-xl px-4 py-2 text-sm font-bold">
              Add Restaurant
            </button>
            <button className="bg-[#f5f0f0] text-[#181010] rounded-xl px-4 py-2 text-sm font-bold">
              Add Menu Item
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}