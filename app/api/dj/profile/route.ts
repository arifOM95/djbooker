import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { city, bio, priceFrom, priceTo, yearsActive, genres, instagram, soundcloud } = await req.json()

  if (!city || !priceFrom || !genres?.length) {
    return NextResponse.json({ error: "City, price and genres are required" }, { status: 400 })
  }

  const existing = await prisma.dJProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (existing) {
    const updated = await prisma.dJProfile.update({
      where: { userId: session.user.id },
      data: { city, bio, priceFrom, priceTo, yearsActive, genres, instagram, soundcloud }
    })
    return NextResponse.json(updated)
  }

  const profile = await prisma.dJProfile.create({
    data: {
      userId: session.user.id,
      city, bio, priceFrom, priceTo, yearsActive, genres, instagram, soundcloud
    }
  })

  return NextResponse.json(profile)
}
