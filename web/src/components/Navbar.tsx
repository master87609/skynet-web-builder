"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Sparkles, Zap, Menu, X, Key } from "lucide-react"
import { me, logout, getSettingsStatus, updateApiKey } from "@/lib/api"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Build a site", icon: Zap },
]

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [keyConfigured, setKeyConfigured] = useState(false)
  const [keyMasked, setKeyMasked] = useState<string | null>(null)
  const [keyStatusMsg, setKeyStatusMsg] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    ;(async () => {
      try {
        const [meRes, keyRes] = await Promise.all([me(), getSettingsStatus()])
        if (meRes.ok && meRes.data?.user) {
          setUser(meRes.data.user)
        }
        if (keyRes.ok && keyRes.data) {
          setKeyConfigured(keyRes.data.configured)
          setKeyMasked(keyRes.data.keyMasked)
        }
      } catch {
        // not logged in
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push("/")
  }

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKeyInput.trim()) return
    const res = await updateApiKey(apiKeyInput.trim())
    if (res.ok) {
      setKeyConfigured(true)
      setKeyStatusMsg("Key saved successfully!")
      setTimeout(() => {
        setShowKeyModal(false)
        setKeyStatusMsg("")
      }, 1200)
    } else {
      setKeyStatusMsg("Failed to update key")
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-skynet-void/90 backdrop-blur-md border-b border-skynet-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.55)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-skynet-amber flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ease-out shadow-[0_0_15px_rgba(255,185,0,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-skynet-void" />
            </div>
            <span className="font-bold text-xl text-skynet-ivory tracking-[-0.02em] group-hover:text-skynet-amber transition-colors duration-300 ease-out">
              Skynet
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 px-2">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-skynet-amber font-semibold"
                      : "text-skynet-dust hover:text-skynet-ivory"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* AI Key Status badge/trigger */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-skynet-surface border border-skynet-border hover:border-skynet-amber text-xs text-skynet-dust hover:text-skynet-ivory transition-colors"
              title="Configure Gemini API Key"
            >
              <Key className="w-3 h-3 text-skynet-amber" />
              <span className="hidden sm:inline">
                {keyConfigured ? "Gemini AI" : "AI Settings"}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  keyConfigured ? "bg-skynet-success" : "bg-skynet-warning"
                }`}
              />
            </button>

            {loading ? (
              <div className="h-8 w-20 rounded-md bg-skynet-surface animate-pulse" />
            ) : user ? (
              <>
                <div className="hidden md:flex items-center gap-2.5 text-sm">
                  <span className="text-skynet-ivory">{user.name}</span>
                  <span className="text-skynet-dust">•</span>
                  <span className="text-skynet-amber text-xs">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-skynet-surface text-sm text-skynet-dust hover:bg-skynet-surface-hover hover:text-skynet-ivory transition-colors duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-md border border-skynet-border text-sm font-medium text-skynet-ivory hover:bg-skynet-surface hover:border-skynet-amber hover:text-skynet-amber transition-colors duration-200"
              >
                Log in
              </Link>
            )}

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-skynet-dust hover:text-skynet-ivory hover:bg-skynet-surface transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-skynet-border bg-skynet-surface px-4 py-4 space-y-3">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-skynet-void text-skynet-amber"
                      : "text-skynet-dust hover:text-skynet-ivory hover:bg-skynet-void"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-skynet-surface border border-skynet-border rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-skynet-dust hover:text-skynet-ivory"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-md bg-skynet-amber text-skynet-void flex items-center justify-center font-bold">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-skynet-ivory">Gemini AI Configuration</h3>
            </div>
            <p className="text-xs text-skynet-dust mb-4 leading-relaxed">
              Skynet runs with full frontier LLM capabilities using Google Gemini. If no key is set, Skynet automatically uses its built-in Autonomous Synthesis Engine so your websites build seamlessly.
            </p>
            {keyConfigured && (
              <div className="mb-4 p-2.5 rounded-md bg-skynet-void border border-skynet-border text-xs text-skynet-success flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-skynet-success animate-pulse" />
                Active key configured: {keyMasked || "••••••••"}
              </div>
            )}
            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="field-label text-xs">Enter GEMINI_API_KEY</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="input-field pl-3 text-xs font-mono"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs">
                Save &amp; Activate Key
              </button>
              {keyStatusMsg && (
                <p className="text-xs text-skynet-amber text-center font-medium mt-2">
                  {keyStatusMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
