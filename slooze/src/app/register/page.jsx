'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('🚨 Passwords do not match!');
      return;
    }

    setLoading(true); // Show loading state

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: 'MEMBER',
          country: formData.country,
        }),
      });

      const data = await res.json();
      setMessage(data.message || `❌ ${data.error}`);

      if (res.status === 201) {
        router.push('/login'); // Redirect upon success
      }
    } catch (error) {
      setMessage('⚠️ Something went wrong. Please try again!');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans text-[#111418] bg-white">
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-center">Get started for free</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none" />
              <select name="country" value={formData.country} onChange={handleChange} className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none">
                <option value="" disabled>Select country</option>
                <option value="INDIA">India</option>
                <option value="AMERICA">America</option>
              </select>
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none" />
              <button
                type="submit"
                className="w-full h-12 bg-[#3d98f4] text-white rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center"
                disabled={loading} // Disable button while loading
              >
                {loading ? <LoaderCircle className="animate-spin w-5 h-5 text-white" /> : 'Create account'}
              </button>
            </form>
            {message && <p className="text-center text-sm text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
