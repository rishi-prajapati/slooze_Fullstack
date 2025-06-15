"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [form, setForm] = useState({ countryName: "India" });
  const [cart, setCart] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: "", expiry: "" });
  const [cardFormError, setCardFormError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchPaymentMethods();
  }, []);

  async function fetchCartItems() {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(await res.text());
      setCart(await res.json());
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      alert("Could not load cart.");
    }
  }

  async function fetchPaymentMethods() {
    try {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCards(data.map((c) => ({
        id: c._id,
        last4: c.cardNumber.slice(-4),
      })));
    } catch (err) {
      console.error("Failed to fetch cards:", err);
      alert("Could not load payment methods.");
    }
  }

  const handleInputChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!selectedCard) {
      alert("Select a payment method.");
      return;
    }

    for (let field of ["street", "city", "state", "zip", "countryName"]) {
      if (!form[field]?.trim()) {
        alert(`Please fill in the ${field}.`);
        return;
      }
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        orderIds: cart.map((item) => item.orderId), // ✅ use orderId
        addresses: [form], // single address for all orders
      };

      const res = await fetch("/api/orders/place", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || res.statusText;
        throw new Error(msg);
      }

      alert("Orders placed successfully!");
    } catch (err) {
      console.error("Place-order error:", err);
      alert("Failed to place orders: " + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getCurrencySymbol = () => {
    const c = form.countryName?.toLowerCase();
    if (["india", "bharat"].includes(c)) return "₹";
    if (["usa", "america", "united states"].includes(c)) return "$";
    return "₹";
  };

  const currency = getCurrencySymbol();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = 5;
  const taxes = 10;

  const handleAddCard = async (e) => {
    e.preventDefault();
    setCardFormError(null);

    if (!newCard.cardNumber || !newCard.expiry) {
      setCardFormError("Please enter card number and expiry.");
      return;
    }

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const formatted = {
        id: data._id,
        last4: data.cardNumber.slice(-4),
      };

      setCards((prev) => [...prev, formatted]);
      setSelectedCard(formatted.id);
      setNewCard({ cardNumber: "", expiry: "" });
      setShowAddCardForm(false);
    } catch (err) {
      console.error("Add card error:", err);
      setCardFormError(err.message || "Failed to add card.");
    }
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <div className="min-h-screen bg-gray-50 p-6 text-black">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Delivery Form */}
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-4">
              {[
                { label: "Street", name: "street" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Zip", name: "zip" },
                { label: "Country", name: "countryName" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    value={form[name] || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Summary & Payment */}
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.orderId}
                    className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg"
                  >
                    <div
                      className="w-16 h-16 bg-cover bg-center rounded"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">
                        Qty: {item.quantity} × {currency}{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {[
                  ["Subtotal", subtotal],
                  ["Delivery", delivery],
                  ["Taxes", taxes],
                ].map(([label, amt]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span>{currency}{amt}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span>{currency}{subtotal + delivery + taxes}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>

              {/* List existing cards */}
              <div className="space-y-2">
                {cards.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <input
                      type="radio"
                      name="card"
                      checked={selectedCard === c.id}
                      onChange={() => setSelectedCard(c.id)}
                      className="h-5 w-5"
                    />
                    <span>Card ending in {c.last4}</span>
                  </label>
                ))}
              </div>

              {/* Add new card toggle */}
              <button
                onClick={() => setShowAddCardForm(!showAddCardForm)}
                className="text-blue-600 text-sm"
              >
                {showAddCardForm ? "Cancel" : "+ Add New Card"}
              </button>

              {/* Add new card form */}
              {showAddCardForm && (
                <form onSubmit={handleAddCard} className="space-y-3 mt-3">
                  {cardFormError && (
                    <p className="text-red-600 text-sm">{cardFormError}</p>
                  )}
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={newCard.cardNumber}
                    onChange={(e) =>
                      setNewCard({ ...newCard, cardNumber: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Expiry (MM/YY)"
                    value={newCard.expiry}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiry: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded"
                  >
                    Save Card
                  </button>
                </form>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedCard || isPlacingOrder}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
