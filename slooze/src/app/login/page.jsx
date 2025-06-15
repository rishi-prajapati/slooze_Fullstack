'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store';
import { LoaderCircle } from 'lucide-react';
export default function LoginPage() {
  const router = useRouter();
  
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setMessage(`❌ ${res.error}`);
      } else {
        const session = await getSession();
        if (session?.user) {
          dispatch(setUser(session.user)); // ✅ Store user in Redux
        }
        router.push('/');
      }
    } catch (error) {
      setMessage('⚠️ Login failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans text-[#111418] bg-white">
  <div className="flex flex-col lg:flex-row flex-1 w-full">
    
    {/* Left: Login Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Login to your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-14 px-4 rounded-lg bg-[#f0f2f5] outline-none"
          />
          <button
            type="submit"
            className="w-full h-12 bg-[#3d98f4] text-white rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <LoaderCircle className="animate-spin w-5 h-5 text-white" /> : 'Login'}
          </button>
        </form>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>

    {/* Right: Image */}
    <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-100">
      <img
        src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80"
        alt="Login Illustration"
        className="object-cover w-full h-full"
      />
    </div>

  </div>
</main>

  );
}
