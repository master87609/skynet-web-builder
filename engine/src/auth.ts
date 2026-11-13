import jwt from "jsonwebtoken"
import { projectStore } from "./project-store.js"

const { sign, verify } = jwt
const JWT_SECRET = process.env.SKYNET_SECRET || "skynet-dev-secret"
const JWT_EXPIRES_IN = "7d"

export interface TokenPayload {
  userId: string
  email: string
}

export function createToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<
  | { userId: string; name: string; email: string }
  | null
> {
  const user = await projectStore.getUserByEmail(email)
  if (!user) return null

  const bcryptModule = await import("bcryptjs")
  const bcrypt = (bcryptModule as { default?: typeof import("bcryptjs") }).default ?? bcryptModule
  const match = await bcrypt.compare(password, (user as { passwordHash: string }).passwordHash)
  if (!match) return null

  return { userId: user.id, name: user.name, email: user.email }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<{ userId: string; name: string; email: string } | null> {
  if (await projectStore.userExists(email)) return null
  const bcryptModule = await import("bcryptjs")
  const bcrypt = (bcryptModule as { default?: typeof import("bcryptjs") }).default ?? bcryptModule
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await projectStore.createUser({ email, passwordHash, name })
  return { userId: user.id, name: user.name, email: user.email }
}

export function setAuthCookie(
  res: { cookie: (name: string, value: string, options?: unknown) => void },
  token: string,
): void {
  res.cookie("skynet_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(
  res: { cookie: (name: string, value: string, options?: unknown) => void },
): void {
  res.cookie("skynet_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}
