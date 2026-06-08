import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function DJProfilePage({ params }: { params: { id: string } }) {
  const dj = await prisma.dJProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      media: true,
    },
  })

  if (!dj) notFound()

  const avgRating = dj.reviews.length
    ? dj.reviews.reduce((sum, r) => sum + r.rating, 0) / dj.reviews.length
    : null

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-semibold tracking-tight">DJBooker</Link>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400">Log in</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Sign up</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <Link href="/djs" className="text-sm text-gray-400 hover:text-black mb-6 inline-block">← Back to DJs</Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="h-72 bg-gray-50 rounded-xl flex items-center justify-center text-6xl mb-6">🎧</div>

            {dj.media.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dj.media.slice(0, 3).map((m) => (
                  <div key={m.id} className="h-24 bg-gray-50 rounded-lg overflow-hidden">
                    {m.type === "IMAGE" && <img src={m.url} alt="" className="w-full h-full object-cover" />}
                  </div>
                ))}
              </div>
            )}

            <h1 className="text-2xl font-semibold tracking-tight mb-1">{dj.user.name || "DJ"}</h1>
            <p className="text-gray-400 text-sm mb-4">
              {dj.city}
              {dj.yearsActive ? ` · ${dj.yearsActive} years experience` : ""}
              {avgRating ? ` · ★ ${avgRating.toFixed(1)} (${dj.reviews.length} reviews)` : ""}
            </p>

            <div className="flex gap-2 flex-wrap mb-6">
              {dj.genres.map((g) => (
                <span key={g} className="text-xs px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600">{g}</span>
              ))}
            </div>

            {dj.bio && (
              <div className="mb-8">
                <h2 className="text-base font-medium mb-2">About</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{dj.bio}</p>
              </div>
            )}

            {(dj.instagram || dj.soundcloud) && (
              <div className="mb-8">
                <h2 className="text-base font-medium mb-2">Links</h2>
                <div className="flex gap-4">
                  {dj.instagram && <a href={`https://instagram.com/${dj.instagram}`} target="_blank" className="text-sm text-gray-500 hover:text-black underline">Instagram</a>}
                  {dj.soundcloud && <a href={dj.soundcloud} target="_blank" className="text-sm text-gray-500 hover:text-black underline">SoundCloud</a>}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-base font-medium mb-4">Reviews {dj.reviews.length > 0 && <span className="text-gray-400 font-normal">({dj.reviews.length})</span>}</h2>
              {dj.reviews.length === 0 ? (
                <p className="text-sm text-gray-400">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {dj.reviews.map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">{r.author.name || "Anonymous"}</div>
                        <div className="text-xs text-gray-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                      </div>
                      <p className="text-sm text-gray-500">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="border border-gray-100 rounded-xl p-6 sticky top-8">
              <div className="text-2xl font-semibold mb-1">from €{dj.priceFrom}</div>
              {dj.priceTo && <div className="text-sm text-gray-400 mb-4">up to €{dj.priceTo}</div>}
              {!dj.priceTo && <div className="text-sm text-gray-400 mb-4">per event</div>}

              <div className="space-y-3 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📍</span> {dj.city}
                </div>
                {dj.yearsActive && (
                  <div className="flex items-center gap-2">
                    <span>🎵</span> {dj.yearsActive} years experience
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>✓</span> Verified profile
                </div>
              </div>

              <Link href={`/book/${dj.id}`} className="w-full block text-center bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
                Request booking
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">No charge until confirmed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
