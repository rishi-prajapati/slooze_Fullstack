// components/MenuItems.jsx
'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Trash2,
  Pencil,
  ShoppingCart,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [restaurantName, setRestaurantName] = useState('This Restaurant');
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState({});
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const dispatch = useDispatch();

  const { data: session, status } = useSession();
  const userRole = session?.user?.role || '';
  const axiosConfig = {
    headers: session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {},
  };

  const fetchMenu = async () => {
    if (!restaurantId) return;
    try {
      const res = await axios.get(
        `/api/menuitems/${restaurantId}/menuitems`,
        axiosConfig
      );
      setItems(res.data);
      if (res.data[0]?.restaurant?.name) {
        setRestaurantName(res.data[0].restaurant.name);
      }
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
      } else {
        setError(err.message || 'Failed to load menu.');
      }
    }
  };

  useEffect(() => {
    if (status !== 'loading') {
      fetchMenu();
    }
  }, [restaurantId, status]);

  const increaseQty = (id) =>
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  const decreaseQty = (id) =>
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));

  const handleAddToCart = async (itemId) => {
    if (!session) {
      alert('Please sign in to add items to cart');
      return;
    }
    const quantity = quantities[itemId] || 1;
    setLoadingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      const res = await axios.post(
        '/api/orders',
        { items: [{ menuItem: itemId, quantity }] },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(session.accessToken && {
              Authorization: `Bearer ${session.accessToken}`,
            }),
          },
        }
      );
      // dispatch exactly the shape our reducer expects:
      dispatch(addToCart({ menuItem: itemId, quantity }));
      alert('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(
        err.response?.data?.error ||
          err.message ||
          'Failed to add to cart.'
      );
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAddMenuItem = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        '/api/menuitems',
        { ...newItem, restaurant: restaurantId },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(session?.accessToken && {
              Authorization: `Bearer ${session.accessToken}`,
            }),
          },
        }
      );
      setItems(prev => [...prev, res.data]);
      setNewItem({ name: '', price: '', image: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add menu item:', err);
      alert(
        err.response?.data?.error ||
          err.message ||
          'Failed to add menu item.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div
        className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
        style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
      >
        <main className="px-4 md:px-40 py-6 w-full max-w-[960px] mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-3 p-4">
            <div className="min-w-72">
              <h1 className="text-2xl font-bold text-[#111418]">
                {restaurantName}
              </h1>
              <p className="text-sm text-[#617289]">
                Explore delicious items from this restaurant
              </p>
              {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
            {userRole !== 'MEMBER' && (
              <button
                onClick={() => setShowModal(true)}
                className="h-8 px-4 bg-[#f0f2f4] text-sm font-medium text-[#111418] rounded-full"
              >
                + Add Menu Item
              </button>
            )}
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {items.map(item => (
              <div key={item._id} className="flex flex-col gap-3 pb-3 group">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-square rounded-xl relative"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                      <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                    {userRole === 'ADMIN' && (
                      <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-[#111418]">
                    {item.name}
                  </p>
                  <p className="text-sm font-normal text-[#617289]">
                    ₹{item.price}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    disabled={loadingItems[item._id]}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full text-[#111418] 
                      ${loadingItems[item._id]
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#e4e6e8] hover:bg-[#dcdfe2]'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {loadingItems[item._id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="p-1 bg-[#f0f2f4] rounded-full hover:bg-[#e2e4e6]"
                    >
                      <Minus className="w-4 h-4 text-[#111418]" />
                    </button>
                    <span className="text-sm">{quantities[item._id] || 1}</span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="p-1 bg-[#f0f2f4] rounded-full hover:bg-[#e2e4e6]"
                    >
                      <Plus className="w-4 h-4 text-[#111418]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Add Menu Item
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={e =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-black"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={e =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-black"
                  required
                  min="0"
                  step="0.01"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newItem.image}
                  onChange={e =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-black"
                />
                <button
                  onClick={handleAddMenuItem}
                  disabled={
                    isLoading || !newItem.name || !newItem.price
                  }
                  className={`mt-2 text-white px-4 py-2 rounded ${
                    isLoading || !newItem.name || !newItem.price
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
