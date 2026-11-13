"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, Sparkles, Loader } from "lucide-react"
import { register, login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus("idle")
    try {
      let res
      if (mode === "login") {
        res = await login(email, password)
      } else {
        res = await register(email, password, name)
      }
      if (!res.ok) throw new Error(res.error || "Request failed")
      setStatus("ok")
      setMessage(
        mode === "login"
          ? "Welcome back to Skynet."
          : "Account created. Welcome to Skynet!",
      )
      setTimeout(() => router.replace("/dashboard"), 800)
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-skynet-void flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="mx-auto mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-skynet-amber flex items-center justify-center shadow-[0_0_20px_rgba(255,185,0,0.5)]">
              <Sparkles className="w-5 h-5 text-skynet-void" />
            </div>
            <span className="font-bold text-2xl text-skynet-ivory tracking-[-0.02em]">
              Skynet
            </span>
          </div>
        </div>

        {/* Single surface, depth by tone and shadow — no border under a wide shadow */}
        <div className="rounded-xl bg-skynet-surface p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <h2 className="text-2xl font-semibold text-skynet-ivory mb-1 tracking-[-0.02em]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-skynet-dust-sm mb-10">
            {mode === "login"
              ? "Sign in to manage your websites."
              : "Join Skynet and start building your first website."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="field-label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-4"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skynet-dust" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skynet-dust" />
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-skynet-dust mt-1.5">
                {mode === "register" ? "At least 8 characters" : ""}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full btn-primary ${submitting ? "opacity-80 pointer-events-none" : ""}`}
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-skynet-dust">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="link-primary"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {status === "error" && (
            <div className="mt-6 p-4 rounded-md bg-skynet-void text-skynet-error text-sm">
              {message}
            </div>
          )}
          {status === "ok" && (
            <div className="mt-6 p-4 rounded-md bg-skynet-void text-skynet-amber text-sm">
              {message}
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-skynet-dust tracking-wide uppercase">
          Skynet · No code required
        </p>
      </div>
    </div>
  )
}
