import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight text-indigo-600">
          🎁 PermanentGift
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm">
            Create Your Profile
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          One permanent link for <br />
          <span className="text-indigo-600">every gift you'll ever want.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop repeating yourself every birthday, holiday, or celebration. Create your lifelong wishlist profile, add items from any online store, and let friends claim them seamlessly.
        </p>

        {/* Action / Link Sandbox */}
        <div className="max-w-md mx-auto p-2 bg-white rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
          <span className="text-slate-400 pl-3 font-medium text-sm sm:text-base select-none">permanentgift.me/</span>
          <input 
            type="text" 
            placeholder="yourname" 
            className="flex-1 bg-transparent border-0 outline-none text-slate-800 font-medium placeholder-slate-300 text-sm sm:text-base p-1"
            disabled
          />
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition whitespace-nowrap">
            Claim Handle
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-3">🔗</div>
            <h3 className="font-bold text-lg mb-2">Single URL Forever</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Your username never changes. Drop it in your social bios or send it directly to family whenever they ask.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-3">🛒</div>
            <h3 className="font-bold text-lg mb-2">Universal Registry</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Add product links from Amazon, local boutiques, or even casual cash funds. Everything lives on one clean page.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">No Double Gifting</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Guests can anonymously mark items as 'claimed' so you never get the exact same thing twice—while keeping it a surprise for you.</p>
          </div>
        </div>
      </main>
    </div>
  );
}