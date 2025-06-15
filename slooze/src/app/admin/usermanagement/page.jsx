import React from "react";
import Head from "next/head";

export default function AdminUserManagement() {
  return (
    <>
      <Head>
        <title>User Management</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
      </Head>
      <div
        className="min-h-screen flex flex-col bg-slate-50 text-[#0d141c]"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b border-[#e7edf4] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold tracking-[-0.015em]">Acme Co</h2>
            </div>
            <nav className="flex gap-9">
              {["Dashboard", "Members", "Groups", "Events", "Content", "Templates"].map((item, idx) => (
                <a key={idx} className="text-sm font-medium" href="#">
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex bg-[#e7edf4] rounded-lg h-10 items-center max-w-64">
              <span className="pl-4 pr-2 text-[#49709c]">🔍</span>
              <input
                className="w-full px-4 bg-transparent text-sm placeholder-[#49709c] focus:outline-none"
                placeholder="Search"
              />
            </div>
            <button className="bg-[#e7edf4] h-10 rounded-lg px-2.5 font-bold text-sm">🔔</button>
            <div className="rounded-full bg-cover bg-center size-10" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCRYN4500brSyssZCF_fdyAdjEWc_o_JWtT4JSj7wths2PDU5xRimEwmGvrucP83GE0zbOAORBbNR3q87uc4NlCyaBmSfybiszAS3IJytdpfYXGTTlYceuuTeyEfuaTe6glrhcGtBUH8bnMEF8ns9141_6p6vqXKNgjtR_B6a_ZCLLjN0QzNX9rB2Bghjz41ox_5ECSowHNqpQH1TCH7GJZdo3wr36CiPd0CihlO8r05lklmpg3h2F5TzkRSfalHutpIBd8MFvkWL4)' }}></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-40 py-5">
          <h1 className="text-[32px] font-bold mb-4">User Management</h1>

          <div className="mb-4">
            <div className="flex bg-[#e7edf4] rounded-lg h-12 items-center">
              <span className="pl-4 pr-2 text-[#49709c]">🔍</span>
              <input
                placeholder="Search by name or email"
                className="w-full px-4 bg-transparent text-base placeholder-[#49709c] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mb-4">
            <button className="flex items-center gap-2 bg-[#e7edf4] text-sm font-medium px-4 py-1.5 rounded-lg">
              Role <span>▼</span>
            </button>
            <button className="flex items-center gap-2 bg-[#e7edf4] text-sm font-medium px-4 py-1.5 rounded-lg">
              Status <span>▼</span>
            </button>
          </div>

          <div className="overflow-auto rounded-lg border border-[#cedae8]">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["User ID", "Name", "Email", "Role", "Status", "Created Date", "Actions"].map((head, i) => (
                    <th key={i} className="px-4 py-3 text-left font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#12345",
                    name: "Ethan Harper",
                    email: "ethan.harper@example.com",
                    role: "Admin",
                    status: "Active",
                    created: "2023-01-15",
                  },
                  {
                    id: "#67890",
                    name: "Olivia Bennett",
                    email: "olivia.bennett@example.com",
                    role: "Manager",
                    status: "Active",
                    created: "2023-02-20",
                  },
                ].map((user, idx) => (
                  <tr key={idx} className="border-t border-[#cedae8]">
                    <td className="px-4 py-2 text-[#49709c]">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2 text-[#49709c]">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-3 py-1 bg-[#e7edf4] rounded-lg">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-3 py-1 bg-[#e7edf4] rounded-lg">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[#49709c]">{user.created}</td>
                    <td className="px-4 py-2 text-[#49709c] font-bold">Edit | Delete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}