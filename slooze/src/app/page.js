"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addRestaurant } from "./store/restaurantSlice";

export default function ViewRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "", image: "" });

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();
        if (res.ok) {
          setRestaurants(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    }

    if (user) {
      fetchRestaurants();
    }
  }, [user]);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setRestaurants((prev) => [...prev, data]);
        dispatch(addRestaurant(data)); // Add to Redux
        setIsModalOpen(false);
        setFormData({ name: "", country: "", image: "" });
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error adding restaurant:", err);
    }
  };

  // Optional: loading/flicker prevention
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        Redirecting to login...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>View Restaurants</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Work+Sans:wght@400;500;700;900"
        />
      </Head>

      <div
        className="relative flex min-h-screen flex-col bg-slate-50 overflow-x-hidden"
        style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
      >
        <main className="px-4 md:px-40 py-5 w-full max-w-[960px] mx-auto">
          {user?.role !== "MEMBER" && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-4 rounded-full bg-[#3490f3] text-white text-sm font-bold"
              >
                Add Restaurant
              </button>
            </div>
          )}

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {restaurants.map((r) => (
              <Link
                key={r._id}
                href={`/menu?restaurantId=${r._id}`}
                className="flex flex-col gap-2 pb-3"
              >
                <div
                  className="w-full bg-center bg-cover aspect-square rounded-xl"
                  style={{ backgroundImage: `url("${r.image}")` }}
                ></div>
                <div>
                  <p className="text-[#0d141c] text-base font-medium">{r.name}</p>
                  <p className="text-[#49719c] text-sm">{r.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-black">Add New Restaurant</h2>
              <form onSubmit={handleAddRestaurant} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border px-3 py-2 rounded text-black"
                  required
                />

                {/* Country Dropdown */}
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="border px-3 py-2 rounded text-black"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="INDIA">India</option>
                  <option value="AMERICA">America</option>
                </select>

                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border px-3 py-2 rounded text-black"
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
