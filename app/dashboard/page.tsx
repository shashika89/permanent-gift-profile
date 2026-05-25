'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface GiftItem {
  id: string;
  title: string;
  url: string;
  price: string;
  is_claimed: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      // 1. Authenticate user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 2. Load custom username handle
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (profile) setUsername(profile.username);

      // 3. Fetch user's existing gifts from Supabase Cloud
      const { data: userGifts } = await supabase
        .from('gifts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userGifts) setGifts(userGifts);
      setLoading(false);
    };

    initializeDashboard();
  }, [router]);

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !user) return;

    const formattedPrice = price ? `${price}` : 'N/A';

    // Save the item live to your Supabase PostgreSQL database
    const { data, error } = await supabase
      .from('gifts')
      .insert([
        {
          user_id: user.id,
          title: title,
          url: url || null,
          price: formattedPrice,
          is_claimed: false
        }
      ])
      .select()
      .single();

    if (error) {
      alert(`Error saving gift: ${error.message}`);
      return;
    }

    // Append to local view instantly on success
    if (data) {
      setGifts([data, ...gifts]);
      setTitle('');
      setUrl('');
      setPrice('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-medium">
        Loading your control panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            🎁 PermanentGift
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              🔗 gift.me/{username || 'loading'}
            </span>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-500 hover:text-rose-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>✨</span> Add a New Wish
            </h2>
            
            <form onSubmit={handleAddGift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Item Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="Mechanical Keyboard, Coffee Beans..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Store Link (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://amazon.com/item..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Approx. Price (Optional)</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">$</span>
                  <input 
                    type="number" 
                    placeholder="75"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
              >
                Add to My Wishlist
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight">Your Registry Items</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md">
              {gifts.length} Items Total
            </span>
          </div>

          {gifts.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-white shadow-sm">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Your wishlist is completely empty</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">Add your first item using the left panel to test persistent data storage!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gifts.map((gift) => (
                <div key={gift.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center hover:border-slate-300 transition">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-slate-900 truncate">{gift.title}</h4>
                    <div className="flex gap-3 items-center mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {gift.price !== 'N/A' ? `$${gift.price}` : 'N/A'}
                      </span>
                      {gift.url && (
                        <a href={gift.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate max-w-[200px]">
                          View Store Page ↗
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}