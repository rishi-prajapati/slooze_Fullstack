// pages/checkout.jsx
import Head from "next/head";

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900"
        />
      </Head>
      <div
        className="relative flex min-h-screen flex-col bg-[#fcf9f8] overflow-x-hidden"
        style={{
          fontFamily: `"Plus Jakarta Sans","Noto Sans",sans-serif`,
          "--radio-dot-svg": `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(244,102,51)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e')`,
        }}
      >
       

        <main className="px-4 md:px-40 py-6 flex-1">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1c110d]">Checkout</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Delivery Details */}
            <section className="space-y-4 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1c110d]">Delivery Details</h2>
              <p className="text-sm text-[#9c5f49]">Please provide your delivery information</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Name", placeholder: "Enter your name" },
                  { label: "Mobile Number", placeholder: "Enter your mobile number" },
                  { label: "City", placeholder: "Enter your city" },
                  { label: "Pincode", placeholder: "Enter your pincode" },
                ].map(({ label, placeholder }) => (
                  <label key={label} className="flex flex-col">
                    <span className="text-sm font-medium text-[#1c110d] mb-1">{label}</span>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="h-12 px-4 rounded-lg bg-[#fcf9f8] border border-[#e8d5ce] placeholder:text-[#9c5f49] focus:outline-none"
                    />
                  </label>
                ))}
              </div>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-[#1c110d] mb-1">Delivery Instructions</span>
                <textarea
                  placeholder="Any special instructions?"
                  className="h-24 p-4 rounded-lg bg-[#fcf9f8] border border-[#e8d5ce] placeholder:text-[#9c5f49] focus:outline-none resize-none"
                />
              </label>
            </section>

            {/* Order Summary & Payment */}
            <section className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1c110d] mb-4">Order Summary</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {/* Example items */}
                  {[
                    { title: "Handmade Ceramic Mug", qty: 2, price: 25 },
                    { title: "Artisan Soap Set", qty: 1, price: 40 },
                    { title: "Woven Coasters", qty: 3, price: 15 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[#fcf9f8] p-3 rounded-lg">
                      <div
                        className="w-14 h-14 rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "url('https://source.unsplash.com/80x80/?product," + idx + "')",
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#1c110d] line-clamp-1">{item.title}</p>
                        <p className="text-sm text-[#9c5f49]">
                          Quantity: {item.qty}, Price: ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Totals */}
                <div className="mt-4 space-y-2">
                  {[
                    ["Subtotal", 125],
                    ["Delivery Fee", 5],
                    ["Taxes", 10],
                  ].map(([label, amount]) => (
                    <div key={label} className="flex justify-between text-sm text-[#9c5f49]">
                      <span>{label}</span>
                      <span>${amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-[#e4dddd] text-base font-bold text-[#1c110d]">
                    <span>Total</span>
                    <span>$140</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-[#1c110d]">Payment Method</h2>
                <p className="text-sm text-[#9c5f49] mb-2">Choose your preferred payment method</p>
                <div className="space-y-2">
                  {["UPI", "Credit Card", "Cash on Delivery"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 p-3 border border-[#e8d5ce] rounded-lg"
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="h-5 w-5 border-2 border-[#e8d5ce] rounded-full checked:border-[#f46633] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none"
                      />
                      <span className="text-sm font-medium text-[#1c110d]">{method}</span>
                    </label>
                  ))}
                </div>
              </div>              
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
