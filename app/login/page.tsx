'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
      setLoading(false);
    } else {
      setMessage('🎉 Logged in successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setMessage(`Connecting to ${provider}...`);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    });

    if (error) setMessage(`❌ ${provider} login failed: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto w-full max-w-md">
        <Link href="/" className="text-center block text-2xl font-bold text-indigo-600 mb-6">
          🎁 PermanentGift
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <span className="sr-only">Sign in with Google</span>
              <span className="font-semibold text-red-500 mr-2">G</span> Google
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <span className="sr-only">Sign in with Facebook</span>
              <span className="font-semibold text-blue-600 mr-2">f</span> Facebook
            </button>
          </div>

          {message && (
            <div className="mt-4 p-3 rounded bg-slate-100 text-sm text-center font-medium text-slate-800">
              {message}
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}