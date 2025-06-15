'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestPage() {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setRestaurants(data);
      setError('');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🔍 Restaurant API Tester</h1>

      {status === 'loading' ? (
        <p>Loading session...</p>
      ) : session ? (
        <>
          <p className="mb-2">
            Logged in as: <strong>{session.user.email}</strong>
          </p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Sign out
          </button>

          <div className="mb-4">
            <button
              onClick={fetchRestaurants}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Fetch Restaurants
            </button>
          </div>

          {error && <p className="text-red-600 mb-2">❌ {error}</p>}

          <ul className="list-disc pl-6">
            {restaurants.map((rest) => (
              <li key={rest._id}>{rest.name} ({rest.country})</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="mb-2 text-gray-600">Not signed in</p>
          <button
            onClick={() =>
              signIn('credentials', {
                email: 'sidd@gmail.com',
                password: 'sidd',
                redirect: false,
              })
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Sign in as Sidd
          </button>
        </>
      )}
    </div>
  );
}
