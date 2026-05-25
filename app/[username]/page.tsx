'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { use } from 'react';
import Link from 'next/link';

interface GiftItem {
  id: string;
  title: string;
  url: string;
  price: string;
  is_claimed: boolean;
}

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const targetUsername = resolvedParams.username.toLowerCase();

  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicRegistry = async () => {
      // 1. Look up the profile by username to find their ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', targetUsername)
        .maybeSingle();

      if (profileError || !profile) {
        setProfileExists(false);
        setLoading(false);
        return;
      }

      setProfileExists(true);

      // 2. Fetch all public gifts for this profile
      const { data: publicGifts } = await supabase
        .from('gifts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (publicGifts) setGifts(publicGifts);
      setLoading(false);
    };

    fetchPublicRegistry();
  }, [targetUsername]);

  // Handle a guest claiming an item anonymously
  const handleClaimItem = async (giftId: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already claimed

    const confirmClaim = window.confirm(
      "Mark this item as claimed? This lets others know it is taken, but stays a surprise for the profile owner!"
    );
    if (!confirmClaim) return;

    const { error } = await supabase
      .from('gifts')
      .update({ is_claimed: true })
      .eq('id', giftId);

    if (error) {
      alert(`Could not claim item: ${error.message}`);
    } else {
      // Update our local state array view instantly
      setGifts(gifts.map(item => item.id === giftId ? { ...item, is_claimed: true } : item));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-medium">
        Loading registry wishlist...
      </div>
    );
  }

  if (profileExists === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-6">
        <div className="text-4xl mb-4">🤷‍♂️</div>
        <h2 className="text-2xl font-black mb-1">Profile Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The username "<strong>{targetUsername}</strong>" hasn't been claimed yet.</p>
        <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm shadow hover:bg-indigo-700 transition">
          Claim This Handle Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Visual Top Branding Bar */}
      <div className="bg-indigo-600 h-2 w-full"></div>
      
      <div className="max-w-3xl mx-auto px-6 mt-12">
        {/* Profile Info Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-black text-2xl mb-4 uppercase">
            {targetUsername.charAt(0)}
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">@{targetUsername}'s Wishlist</h1>
          <p className="text-slate-500 text-sm">See something you'd love to gift? Claim it below to keep it unique!</p>
        </div>

        {/* Gift Grid Feed */}
        {gifts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm text-slate-500">
            No wishes added to this profile registry yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-4">
            {gifts.map((gift) => (
              <div 
                key={gift.id} 
                className={`p-5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  gift.is_claimed 
                    ? 'bg-slate-100/70 border-slate-200 opacity-60 select-none' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg truncate ${gift.is_claimed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {gift.title}
                  </h3>
                  <div className="flex gap-4 items-center mt-1.5 text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded ${gift.is_claimed ? 'bg-slate-200 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>
                      {gift.price !== 'N/A' ? `$${gift.price}` : 'Price Flexible'}
                    </span>
                    {gift.url && !gift.is_claimed && (
                      <a href={gift.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium flex items-center gap-1">
                        Buy from Store ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Claim Button Logic */}
                <div>
                  <button
                    onClick={() => handleClaimItem(gift.id, gift.is_claimed)}
                    disabled={gift.is_claimed}
                    className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg tracking-wide transition ${
                      gift.is_claimed
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {gift.is_claimed ? '🎁 Already Claimed' : '🎁 Claim Gift'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}