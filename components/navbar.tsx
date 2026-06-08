"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
      <Link href="/" className="text-lg font-semibold tracking-tight">DJBooker</Link>
      <div className="hidden md:flex gap-6 text-sm text-gray-500">
        <Link href="/djs" className="hover:text-black">Browse DJs</Link>
        <a href="#how-it-works" className="hover:text-black">How it works</a>
        <Link href="/dashboard/dj" className="hover:text-black">For DJs</Link>
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                {session.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              {session.user?.name?.split(" ")[0] || "Account"}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-xl shadow-sm py-1 w-48 z-50">
                <Link href="/dashboard/dj" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">DJ Dashboard</Link>
                <Link href="/dashboard/client" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">My Bookings</Link>
                <hr className="my-1 border-gray-100" />
                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">Log in</Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
