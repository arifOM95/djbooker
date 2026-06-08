import Link from "next/link"

const featuredDJs = [
  { name: "DJ Marcus", city: "Berlin", years: 8, genres: ["House", "Techno", "Wedding"], price: 400, rating: 4.9, reviews: 42, top: true },
  { name: "DJ Lena", city: "Munich", years: 5, genres: ["Pop", "R&B", "Wedding"], price: 300, rating: 4.8, reviews: 28, top: false },
  { name: "DJ Stefan", city: "Hamburg", years: 12, genres: ["Hip-Hop", "Dancehall"], price: 500, rating: 5.0, reviews: 61, top: false },
]

const categories = ["Wedding", "Corporate", "Birthday", "Club night", "Festival"]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="text-lg font-semibold tracking-tight">DJBooker</div>
        <div className="hidden md:flex gap-6 text-sm text-gray-500">
          <Link href="/djs" className="hover:text-black">Browse DJs</Link>
          <a href="#how-it-works" className="hover:text-black">How it works</a>
          <a href="#" className="hover:text-black">For DJs</a>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">Log in</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Sign up</Link>
        </div>
      </nav>

      <div className="px-8 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-3">
          Find the perfect DJ<br />
          <span className="text-gray-400">for your event</span>
        </h1>
        <p className="text-gray-500 text-base mb-8">Book verified DJs across Germany — weddings, corporate events, and more</p>

        <form action="/djs" method="GET" className="flex items-center bg-white border border-gray-300 rounded-full px-5 py-2 max-w-2xl mx-auto gap-3 shadow-sm">
          <div className="flex flex-col flex-1 border-r border-gray-100 pr-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">City</label>
            <input name="city" className="text-sm outline-none bg-transparent placeholder-gray-300" placeholder="Berlin, Munich..." />
          </div>
          <div className="flex flex-col flex-1 border-r border-gray-100 px-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Event type</label>
            <input name="eventType" className="text-sm outline-none bg-transparent placeholder-gray-300" placeholder="Wedding, Birthday..." />
          </div>
          <div className="flex flex-col flex-1 pl-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</label>
            <input name="date" type="date" className="text-sm outline-none bg-transparent text-gray-400" />
          </div>
          <button type="submit" className="bg-black text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Search
          </button>
        </form>
      </div>

      <div className="px-8 pb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link key={cat} href={`/djs?eventType=${cat}`} className="flex flex-col items-center gap-1 px-5 py-3 border border-gray-200 rounded-xl text-xs text-gray-500 hover:border-black hover:text-black transition-colors whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Featured DJs</h2>
          <Link href="/djs" className="text-sm text-gray-400 underline hover:text-black">See all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredDJs.map((dj) => (
            <Link key={dj.name} href={`/djs`} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors group">
              <div className="h-44 bg-gray-50 flex items-center justify-center text-4xl relative">
                🎧
                {dj.top && (
                  <span className="absolute top-3 left-3 bg-white border border-gray-100 rounded-full px-3 py-1 text-xs font-medium">Top rated</span>
                )}
              </div>
              <div className="p-4">
                <div className="font-medium text-sm mb-0.5">{dj.name}</div>
                <div className="text-xs text-gray-400 mb-2">{dj.city} · {dj.years} years experience</div>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {dj.genres.map((g) => (
                    <span key={g} className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500">{g}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">from €{dj.price} <span className="font-normal text-gray-400">/ event</span></div>
                  <div className="text-xs text-gray-400">★ {dj.rating} ({dj.reviews})</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div id="how-it-works" className="px-8 py-12 bg-gray-50">
        <h2 className="text-xl font-semibold tracking-tight mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { num: "01", title: "Search & filter", desc: "Browse DJs by city, genre, and event type. Read reviews from real clients." },
            { num: "02", title: "Send a booking request", desc: "Pick your date and send a request. DJs typically respond within 24 hours." },
            { num: "03", title: "Pay securely", desc: "Pay a deposit to confirm. The rest is released after your event." },
          ].map((step) => (
            <div key={step.num} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-300 mb-2">{step.num}</div>
              <h3 className="text-sm font-medium mb-1">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="px-8 py-8 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
        <div>© 2026 DJBooker</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black">Privacy</a>
          <a href="#" className="hover:text-black">Terms</a>
          <a href="#" className="hover:text-black">Contact</a>
        </div>
      </footer>
    </div>
  )
}
