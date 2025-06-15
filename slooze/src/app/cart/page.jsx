"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";

export default function CartPage() {
  const user = useSelector((state) => state.user); // Redux user
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [country, setCountry] = useState("INDIA");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ——— Redirect if not logged in ———
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // ——— Fetch cart after confirming user is logged in ———
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const res = await axios.get("/api/orders", {
            withCredentials: true,
          });
          const items = res.data || [];

          setCart(items);
          if (items.length > 0) {
            setCountry(items[0].country || "INDIA");
          }
        } catch (err) {
          console.error("❌ Failed to fetch cart:", err);
          if (err.response?.status === 401) {
            setErrorMsg("Unauthorized access. Please login again.");
            router.push("/login");
          }
        } finally {
          setLoading(false);
        }
      };


      fetchCart();
    }
  }, [user]);

  const handleCheckout = () => {
    if (!user) {
      setErrorMsg("Please log in to continue.");
      return;
    }

    if (user.role === "MEMBER") {
      setErrorMsg("members cannot checkout.");
      return;
    }

    router.push("/checkout");
  };

  const getCurrencySymbol = (country) => {
    return country === "INDIA" ? "₹" : "$";
  };

  const currency = getCurrencySymbol(country);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const delivery = 2.5;
  const tax = 1.5;
  const total = subtotal + delivery + tax;

  if (!user) {
    return (
      <p className="p-6 text-center">
        Redirecting to login...
      </p>
    );
  }

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
            <p className="text-sm text-[#82686a]">
              Review your order before checkout
            </p>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="grid md:grid-cols-[2fr_1fr] gap-6">
              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                {cart.map((item, index) => (
                  <div
                    key={item.id || `${item.name}-${index}`}
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
                      <p className="text-sm text-[#82686a] mt-1">
                        <strong>Restaurant:</strong> {item.restaurant}
                      </p>
                      <p className="text-sm text-[#82686a] mt-1">
                        <strong>Price:</strong> {currency}
                        {Number(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border border-[#e4dddd] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-[#171212]">
                  Cart Summary
                </h2>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Subtotal</span>
                  <span>
                    {currency}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Delivery Charges</span>
                  <span>
                    {currency}
                    {delivery.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm text-[#82686a]">
                  <span>Taxes</span>
                  <span>
                    {currency}
                    {tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-4 text-base font-bold text-[#171212] border-t mt-4">
                  <span>Total</span>
                  <span>
                    {currency}
                    {total.toFixed(2)}
                  </span>
                </div>
                {errorMsg && (
                  <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
                )}
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#e8b4b7] hover:bg-[#e09fa3] transition text-[#171212] font-bold py-3 rounded-full"
                  >
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
