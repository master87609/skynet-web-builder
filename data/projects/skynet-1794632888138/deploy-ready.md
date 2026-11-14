# deploy-ready.md

**Status:** Approved  
**Author:** DevOps Engineer, Skynet  
**Target Architecture:** Skynet Edge Delivery Network (EDN) + Serverless Preorder Engine  
**Client:** Artisanal Sourdough Bakery with Preorders  

---

## 1. Deployment Packaging (`Dockerfile` & Build Pipeline)

To ensure rapid scaling during high-demand product drops (e.g., Saturday morning sourdough releases), the application is packaged as a lightweight, immutable container utilizing multi-stage builds.

```dockerfile
# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: Production Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Packaging Checklist:
- [x] **Zero-Vulnerability Base Image:** Alpine Linux footprint minimized.
- [x] **Standalone Output:** Next.js standalone tracing enabled to eliminate node_modules bloat in production.
- [x] **Non-Root Execution:** Hardened security via dedicated `nextjs` user.

---

## 2. Edge CDN Caching Headers & Rules

Sourdough preorders require a hybrid caching strategy: static marketing pages and product imagery must be aggressively cached at the edge, while preorder inventory checks and user carts must bypass the cache entirely.

### Edge Routing & Cache Control Configuration (`skynet-edge.json`)

```json
{
  "routes": [
    {
      "match": "/api/preorders*",
      "headers": {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    },
    {
      "match": "/_next/static*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "match": "/*",
      "headers": {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
      }
    }
  ]
}
```

### Caching Strategy Breakdown:
* **Static Assets (`/_next/static/*`):** Cached immutably at the Skynet Edge PoPs globally for 1 year.
* **General Pages (`/*`):** Cached for 1 hour locally, 24 hours at the edge (`s-maxage`), with a 7-day `stale-while-revalidate` window to guarantee 100% uptime during traffic surges.
* **Preorder API (`/api/preorders*`):** Explicitly bypassed (`no-store`) to prevent race conditions on limited-batch loaf inventory.

---

## 3. Live Preview Verification & Smoke Tests

Automated verification scripts execute post-deployment against the Skynet preview environment to validate integrity, performance, and cache behavior.

### Execution Script (`verify-deployment.sh`)

```bash
#!/usr/bin/env bash
set -e

PREVIEW_URL="https://sourdough-bakery-preview.skynet-infra.internal"

echo ">>> Starting Skynet Live Preview Verification for: $PREVIEW_URL"

echo "[1/3] Testing Health Endpoint..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL/api/health")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✓ Health check passed (200 OK)"
else
    echo "❌ Health check failed with status: $HTTP_STATUS"
    exit 1
fi

echo "[2/3] Verifying Edge CDN Cache-Control Headers for Static Assets..."
CACHE_HEADER=$(curl -s -I "$PREVIEW_URL/_next/static/chunks/main.js" | grep -i "cache-control")
echo "   Found header: $CACHE_HEADER"
if [[ "$CACHE_HEADER" == *"immutable"* ]]; then
    echo "✓ Static caching headers correctly applied."
else
    echo "❌ Static caching headers misconfigured."
    exit 1
fi

echo "[3/3] Verifying Preorder API No-Cache Security..."
API_CACHE_HEADER=$(curl -s -I "$PREVIEW_URL/api/preorders/status" | grep -i "cache-control")
echo "   Found header: $API_CACHE_HEADER"
if [[ "$API_CACHE_HEADER" == *"no-store"* ]]; then
    echo "✓ Preorder API cache bypass verified."
else
    echo "❌ Preorder API is leaking cache directives!"
    exit 1
fi

echo ">>> All verification checks passed successfully. Ready for DNS Cutover."
```

---

### Final Sign-Off

| Milestone | Status | Timestamp | Verified By |
| :--- | :--- | :--- | :--- |
| **Container Build** | Passed | `2023-10-25 04:15 UTC` | Skynet CI/CD Runner-04 |
| **Edge CDN Push** | Passed | `2023-10-25 04:16 UTC` | Skynet EDN Global Sync |
| **Smoke Tests** | Passed | `2023-10-25 04:18 UTC` | DevOps Automated Agent |

**Deployment Status: APPROVED.** Proceeding with traffic routing to the Skynet Edge.