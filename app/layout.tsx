import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import Provider from "@/components/session-provider"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "DJBooker",
  description: "Find and book the best DJs in Germany",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
