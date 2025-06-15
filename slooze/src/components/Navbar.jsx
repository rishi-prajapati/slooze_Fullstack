'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <div className="h-16" />;

  const rolePath = user?.role?.toLowerCase();

  const menuLinks = [
    { name: 'Dashboard', href: rolePath ? `/dashboard/${rolePath}` : '/login' },
    { name: 'Restaurants', href: '/' },
    { name: 'Menu', href: '/menu' },
    ...(rolePath !== 'member' ? [{ name: 'Orders', href: '/order' }] : []),
    {
      name: (
        <span className="flex items-center gap-2">
          <ShoppingCart />
          <span>Cart</span>
        </span>
      ),
      href: '/cart',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-black">Slooze</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#111418]">
          {menuLinks.map((link) => (
            <Link
              key={link.name.toString()}
              href={link.href}
              className="hover:text-[#ff4d4d] transition"
            >
              {link.name}
            </Link>
          ))}

          {user?.name ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-full overflow-hidden border w-9 h-9"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ff4d4d] text-white font-semibold uppercase">
                  {user.name[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-md bg-white border text-sm z-10">
                  <div className="px-4 py-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <div className="border-t">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#ff4d4d]">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-white bg-[#ff4d4d] px-4 py-1.5 rounded-md hover:bg-red-600 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
