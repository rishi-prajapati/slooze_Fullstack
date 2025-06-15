'use client';
import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  const [editPayment, setEditPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '' });

  const [editUser, setEditUser] = useState(null);
  const [roleForm, setRoleForm] = useState({ role: '' });

  // Redirect non-admins
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== 'ADMIN') {
          router.replace('/login');
        } else {
          fetchPayments();
          fetchUsers();
        }
      })
      .finally(() => setSessionChecked(true));
  }, [router]);

  const fetchPayments = useCallback(async () => {
    const res = await fetch('/api/payments/all');
    if (res.ok) setPayments(await res.json());
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/auth/all');
    if (res.ok) setUsers(await res.json());
  }, []);

  const handlePaymentChange = (e) =>
    setPaymentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRoleChange = (e) => setRoleForm({ role: e.target.value });

  const updatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/payments/${editPayment._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentForm),
    });
    if (res.ok) {
      await fetchPayments();
      setEditPayment(null);
    } else {
      alert((await res.json()).error || 'Update failed');
    }
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/auth/all/${editUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleForm),
    });
    if (res.ok) {
      await fetchUsers();
      setEditUser(null);
    } else {
      alert((await res.json()).error || 'Update failed');
    }
    setLoading(false);
  };

  if (!sessionChecked) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-6 font-sans text-black">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Payments Table */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Card No.</th>
                  <th className="px-4 py-2">Expiry</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-2">{p._id}</td>
                    <td className="px-4 py-2">{p.user?.name} ({p.user?._id})</td>
                    <td className="px-4 py-2">{p.cardNumber}</td>
                    <td className="px-4 py-2">{p.expiry}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setEditPayment(p);
                          setPaymentForm({ cardNumber: p.cardNumber, expiry: p.expiry });
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <form
                onSubmit={updatePayment}
                className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
              >
                <h3 className="text-lg font-bold mb-4">Edit Payment</h3>
                <input
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentChange}
                  className="border p-2 w-full rounded mb-3"
                  placeholder="Card Number"
                  required
                />
                <input
                  name="expiry"
                  value={paymentForm.expiry}
                  onChange={handlePaymentChange}
                  className="border p-2 w-full rounded mb-4"
                  placeholder="MM/YY"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditPayment(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-600'}`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* Users Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Users Management</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t">
                    <td className="px-4 py-2">{u._id}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.country}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setEditUser(u);
                          setRoleForm({ role: u.role });
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <form
                onSubmit={updateUser}
                className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
              >
                <h3 className="text-lg font-bold mb-4">Edit User Role</h3>
                <select
                  name="role"
                  value={roleForm.role}
                  onChange={handleRoleChange}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-green-600'}`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
