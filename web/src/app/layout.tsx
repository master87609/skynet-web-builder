import type { Metadata } from "next"
import localFont from "next/font/local"
import "@/app/globals.css"
import Navbar from "@/components/Navbar"

// Archivo — self-hosted (public/fonts). Variable weight 100–900, latin + latin-ext.
// One face at two scales is the world's type rule; hierarchy comes from scale and
// weight contrast, never from mixing in a second voice.
const archivo = localFont({
  src: [
    { path: "../../public/fonts/Archivo-latin.woff2", weight: "100 900", style: "normal" },
    {
      path: "../../public/fonts/Archivo-latin-ext.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
  adjustFontFallback: "Arial",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Skynet",
    default: "Skynet — Build your website without code",
  },
  description:
    "Describe your website in plain language and Skynet's AI agents build and deploy it for you. No coding required.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${archivo.variable}`}>
      <body className="h-full bg-skynet-void text-skynet-ivory antialiased font-sans">
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
