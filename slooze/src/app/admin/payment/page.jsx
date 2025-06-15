// pages/admin-payment-methods.jsx
import React from "react";
import Head from "next/head";

export default function AdminPaymentMethods() {
  return (
    <>
      <Head>
        <title>Admin - Payment Methods</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white font-sans text-[#181010]">
        <main className="px-4 md:px-40 py-6">
         
          {/* Payment Methods Table */}
          <section className="mb-6">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-white">
                  <tr>
                    {[
                      "ID",
                      "Type",
                      "Provider",
                      "Last 4/UPI",
                      "Created Date",
                      "Status",
                      "Actions",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 font-medium text-[#181010]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#12345",
                      type: "Card",
                      provider: "Visa",
                      last: "4242",
                      created: "2023-01-15",
                      status: "Active",
                    },
                    {
                      id: "#67890",
                      type: "UPI",
                      provider: "Paypal",
                      last: "user@paypal",
                      created: "2023-03-20",
                      status: "Inactive",
                    },
                  ].map((method, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-[#8d5e5e]">{method.id}</td>
                      <td className="px-4 py-2 text-gray-700">{method.type}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {method.provider}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{method.last}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {method.created}
                      </td>
                      <td className="px-4 py-2">
                        <span className="bg-gray-100 text-[#181010] px-3 py-1 rounded-xl inline-block">
                          {method.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[#a14545] font-semibold">
                        Edit | Delete
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
