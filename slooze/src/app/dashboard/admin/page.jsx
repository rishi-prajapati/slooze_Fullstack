'use client';
import React, { useEffect, useState, useCallback } from 'react';

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ cardNumber: '', expiry: '' });
  const [loading, setLoading] = useState(false);

  // Fetch all payment methods
  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/all');
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/${editData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await fetchPayments(); // Refresh list after update
        setEditData(null); // Close modal
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update');
      }
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="px-4 md:px-40 py-6">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[32px] font-bold leading-tight">Dashboard</h1>
            <p className="text-sm text-[#8d5e5e]">Update user payments method</p>
          </div>
        </div>

        

        <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">All Payment Methods</h2>
        <div className="px-4 py-3">
          <div className="overflow-x-auto rounded-xl border border-[#e7dada] bg-white">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white">
                <tr>
                  {['Payment ID', 'User ID', 'User Name', 'Card Number', 'Expiry', 'Actions'].map((head, i) => (
                    <th key={i} className="px-4 py-3 font-medium text-[#181010]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-t border-[#e7dada]">
                    <td className="px-4 py-2 text-[#181010]">{payment._id}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{payment.user?._id}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{payment.user?.name}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{payment.cardNumber}</td>
                    <td className="px-4 py-2 text-[#8d5e5e]">{payment.expiry}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setEditData(payment);
                          setForm({ cardNumber: payment.cardNumber, expiry: payment.expiry });
                        }}
                        className="bg-[#e2e2ff] text-[#181010] rounded-xl px-4 h-8 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal */}
            {editData && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                  <h3 className="text-xl font-bold mb-4">Edit Payment Method</h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      placeholder="Card Number"
                      className="border px-4 py-2 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="Expiry (MM/YY)"
                      className="border px-4 py-2 rounded-md"
                      required
                    />
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditData(null)}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </main>
    </div>
  );
}
