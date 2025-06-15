"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart orders from /api/orders
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await axios.get("/api/orders");
        const orders = res.data;

        if (orders.length > 0) {
          const latestCart = orders[orders.length - 1]; // assuming latest cart
          const cartItems = latestCart.items.map((item) => ({
            id: item.menuItem._id,
            name: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity,
            image: item.menuItem.image,
          }));
          setCart(cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 2.5;
  const tax = 1.5;
  const total = subtotal + delivery + tax;

  return (
    <>
      <Head>
        <title>Your Cart</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800"
        />
      </Head>

      <div className="flex min-h-screen bg-white font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
        <main className="flex flex-col w-full max-w-[960px] mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#171212]">Your Cart</h1>
            <p className="text-sm text-[#82686a]">Review your order before checkout</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading your cart...</p>
          ) : cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="grid md:grid-cols-[2fr_1fr] gap-6">
              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border border-[#e4dddd] p-4 rounded-xl"
                  >
                    <div
                      className="w-28 h-20 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-[#171212]">
                        {item.name}
                      </h2>
                      <p className="text-sm text-[#82686a]">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 bg-[#ff0000] hover:bg-[#aa0000] rounded text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 bg-[#ff0000] hover:bg-[#aa0000] rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

            
              <div className="border border-[#e4dddd] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-[#171212]">
                  Cart Summary
                </h2>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Delivery Charges</span>
                  <span>${delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Taxes</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 text-base font-bold text-[#171212] border-t mt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="mt-6">
                  <input
                    className="w-full p-3 mb-3 border border-[#e4dddd] rounded-xl placeholder:text-[#82686a]"
                    placeholder="Add delivery instructions"
                  />
                  <input
                    className="w-full p-3 mb-4 border border-[#e4dddd] rounded-xl placeholder:text-[#82686a]"
                    placeholder="Apply promo code"
                  />
                  <button className="w-full bg-[#e8b4b7] hover:bg-[#e09fa3] transition text-[#171212] font-bold py-3 rounded-full">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
