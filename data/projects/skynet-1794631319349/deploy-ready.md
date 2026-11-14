# deploy-ready.md

**Status:** Approved  
**Author:** DevOps Engineer, Skynet  
**Target Architecture:** Global Edge-Native LLM Interface (Skynet Core UI)

---

## 1. Deployment Packaging (`Dockerfile` & Build Pipeline)

To ensure immutable, high-performance deployments for the Skynet chat interface, we utilize a multi-stage Docker build optimized for Node.js / Next.js static and edge output.

```dockerfile
# ==========================================
# Stage 1: Dependencies Installation
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# Stage 2: Build Application
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables injected at build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ==========================================
# Stage 3: Production Runner (Edge/Node Optimized)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 2. Edge CDN Caching & Security Headers

Configured via `vercel.json` / Edge Middleware to guarantee sub-50ms global TTFB while maintaining strict security policies for streaming AI responses.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/chat",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-transform, private"
        },
        {
          "key": "X-Accel-Buffering",
          "value": "no"
        }
      ]
    }
  ]
}
```

---

## 3. Live Preview & Smoke Verification

Post-deployment verification script (`verify-live.sh`) to execute automated checks against the edge network.

```bash
#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="${1:-https://chat.skynet.internal}"

echo "initiating deployment verification for: $TARGET_URL"

# 1. Check HTTP Status & TLS
echo "[-] Verifying TLS and base routing..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "[✔] Base route active (Status: 200)"
else
    echo "[✖] Base route failed with status: $HTTP_STATUS"
    exit 1
fi

# 2. Check Security & Edge Headers
echo "[-] Verifying Edge security headers..."
SECURITY_HEADER=$(curl -s -I "$TARGET_URL" | grep -i "X-Frame-Options: DENY")
if [ -n "$SECURITY_HEADER" ]; then
    echo "[✔] Security headers verified."
else
    echo "[✖] Missing expected security headers."
    exit 1
fi

# 3. Check SSE / Streaming API Endpoint readiness
echo "[-] Verifying chat streaming endpoint response..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$TARGET_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"ping"}]}')

if [ "$API_STATUS" -eq 200 ] || [ "$API_STATUS" -eq 401 ]; then
    echo "[✔] Chat endpoint responsive (Status: $API_STATUS)"
else
    echo "[✖] Chat endpoint error (Status: $API_STATUS)"
    exit 1
fi

echo "=========================================="
echo " Skynet Deployment Verification: PASSED"
echo "=========================================="
```

---
*Signed,  
Lead DevOps Engineer, Skynet Neural Infrastructure*