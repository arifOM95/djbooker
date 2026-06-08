import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface SearchParams {
  city?: string
  eventType?: string
}

export default async function DJsPage({ searchParams }: { searchParams: SearchParams }) {
  const djs = await prisma.dJProfile.findMany({
    where: {
      available: true,
      ...(searchParams.city ? {
        city: { contains: searchParams.city, mode: "insensitive" }
      } : {}),
    },
    include: {
      user: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const djsWithRating = djs.map((dj) => {
    const avg = dj.reviews.length
      ? dj.reviews.reduce((sum, r) => sum + r.rating, 0) / dj.reviews.length
      : null
    return { ...dj, avgRating: avg }
  })

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-semibold tracking-tight">DJBooker</Link>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">Log in</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Sign up</Link>
        </div>
      </nav>

      <div className="px-8 py-6 border-b border-gray-100">
        <form method="GET" className="flex items-center bg-white border border-gray-300 rounded-full px-5 py-2 max-w-2xl gap-3 shadow-sm">
          <div className="flex flex-col flex-1 border-r border-gray-100 pr-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">City</label>
            <input name="city" defaultValue={searchParams.city} className="text-sm outline-none bg-transparent placeholder-gray-300" placeholder="Berlin, Munich..." />
          </div>
          <div className="flex flex-col flex-1 pl-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Event type</label>
            <input name="eventType" defaultValue={searchParams.eventType} className="text-sm outline-none bg-transparent placeholder-gray-300" placeholder="Wedding, Birthday..." />
          </div>
          <button type="submit" className="bg-black text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
            Search
          </button>
        </form>
      </div>

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            {djsWithRating.length > 0
              ? `${djsWithRating.length} DJ${djsWithRating.length !== 1 ? "s" : ""} available`
              : "No DJs found"}
            {searchParams.city ? ` in ${searchParams.city}` : " across Germany"}
          </h1>
        </div>

        {djsWithRating.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🎧</div>
            <h2 className="text-lg font-medium mb-2">No DJs found</h2>
            <p className="text-gray-400 text-sm mb-6">Try a different city or event type</p>
            <Link href="/djs" className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
              Browse all DJs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {djsWithRating.map((dj) => (
              <Link key={dj.id} href={`/djs/${dj.id}`} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                <div className="h-44 bg-gray-50 flex items-center justify-center text-4xl">🎧</div>
                <div className="p-4">
                  <div className="font-medium text-sm mb-0.5">{dj.user.name || "DJ"}</div>
                  <div className="text-xs text-gray-400 mb-2">{dj.city} · {dj.yearsActive ? `${dj.yearsActive} years experience` : "Professional DJ"}</div>
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {dj.genres.slice(0, 3).map((g) => (
                      <span key={g} className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500">{g}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">from €{dj.priceFrom} <span className="font-normal text-gray-400">/ event</span></div>
                    {dj.avgRating ? (
                      <div className="text-xs text-gray-400">★ {dj.avgRating.toFixed(1)} ({dj.reviews.length})</div>
                    ) : (
                      <div className="text-xs text-gray-400">New</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
