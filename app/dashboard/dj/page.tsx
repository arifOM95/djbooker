"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

const GENRES = ["House", "Techno", "Trance", "Hip-Hop", "R&B", "Pop", "Rock", "Jazz", "Dancehall", "Reggae", "Wedding", "Commercial", "80s/90s", "Latin", "Electronic"]

export default function DJDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [form, setForm] = useState({
    city: "", bio: "", priceFrom: "", priceTo: "",
    yearsActive: "", instagram: "", soundcloud: "",
  })

  function toggleGenre(g: string) {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/dj/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        priceFrom: parseInt(form.priceFrom),
        priceTo: form.priceTo ? parseInt(form.priceTo) : null,
        yearsActive: form.yearsActive ? parseInt(form.yearsActive) : null,
        genres: selectedGenres,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push(`/djs/${data.id}`), 1500)
    }
  }

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">You need to be logged in to access this page.</p>
        <Link href="/login" className="px-5 py-2 bg-black text-white rounded-lg text-sm">Log in</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-semibold tracking-tight">DJBooker</Link>
        <div className="text-sm text-gray-400">Welcome, {session.user?.name || session.user?.email}</div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Set up your DJ profile</h1>
        <p className="text-gray-400 text-sm mb-8">Fill in your details so clients can find and book you</p>

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 rounded-lg px-4 py-3 text-sm mb-6">
            Profile created! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium">Basic info</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="Berlin" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black resize-none" placeholder="Tell clients about yourself..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Years active</label>
              <input type="number" value={form.yearsActive} onChange={(e) => setForm({ ...form, yearsActive: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Starting price (€) *</label>
                <input required type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max price (€)</label>
                <input type="number" value={form.priceTo} onChange={(e) => setForm({ ...form, priceTo: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="800" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-medium mb-3">Genres *</h2>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${selectedGenres.includes(g) ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium">Social links</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Instagram username</label>
              <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="djmarcus" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SoundCloud URL</label>
              <input value={form.soundcloud} onChange={(e) => setForm({ ...form, soundcloud: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" placeholder="https://soundcloud.com/djmarcus" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading || selectedGenres.length === 0} className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Creating profile..." : "Create my profile"}
          </button>
        </form>
      </div>
    </div>
  )
}
