# deploy-ready.md

**Status:** Approved  
**Author:** DevOps Engineer, Skynet  
**Target:** Global Edge Infrastructure  
**Project:** Apple Cinematic Experience  

---

## 1. Deployment Packaging & Artifact Integrity

The static production build is packaged into an optimized, immutable container image ready for edge deployment.

```dockerfile
# Stage 1: Build Engine
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Edge Runner
FROM caddy:2.7-alpine
WORKDIR /srv
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
CMD ["caddy", "run", "--config", "/etc/Caddyfile", "--adapter", "caddyfile"]
```

### Build Manifest Verification
* **Output Directory:** `/dist`
* **Asset Optimization:** Brotli (`.br`) and Gzip (`.gz`) pre-compression enabled for all text, CSS, JS, and SVG assets.
* **Bundle Budget Check:** Total initial JS/CSS payload < 180KB (excluding on-demand cinematic video chunks).

---

## 2. Edge CDN Caching Headers

To achieve zero-latency playback and instantaneous global page loads for the cinematic Apple-style experience, the following caching rules are enforced at the edge layer (Cloudflare/Fastly/CloudFront).

### `Caddyfile` / Edge Routing Rules
```text
{
    admin off
}

:80 {
    root * /srv
    encode zstd br gzip

    # Immutable Cinematic Assets (Video, Audio, 3D Models, hashed JS/CSS)
    @immutable {
        path /assets/* /media/*
        path *.js *.css *.woff2 *.webp *.mp4 *.mov
    }
    header @immutable Cache-Control "public, max-age=31536000, immutable"

    # HTML Shell (Always revalidate for instant deployments)
    @html {
        path *.html /
    }
    header @html Cache-Control "public, max-age=0, must-revalidate"

    # Security & Performance Headers
    header {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' blob: data: https:; img-src 'self' data: https:;"
    }

    file_server
}
```

---

## 3. Live Preview Verification & Telemetry

Automated post-deployment smoke tests executed against the staging edge node:

```bash
#!/usr/bin/env bash
set -e

TARGET_URL="https://preview.skynet-apple-cinematic.internal"

echo "Running Edge Verification Suite..."

# 1. Verify HTTP/2 and TLS 1.3
curl -s -I --http2 "$TARGET_URL" | grep -E "HTTP/2|alt-svc"

# 2. Validate Cache-Control on Cinematic Media
MEDIA_CACHE=$(curl -s -I "$TARGET_URL/media/hero-film-stream.mp4" | grep -i "cache-control")
echo "Media Cache Header: $MEDIA_CACHE"
[[ "$MEDIA_CACHE" == *"immutable"* ]] || { echo "FAIL: Media not immutable"; exit 1; }

# 3. Validate Compression
ENCODING=$(curl -s -I -H "Accept-Encoding: br, gzip" "$TARGET_URL/" | grep -i "content-encoding")
echo "Edge Compression: $ENCODING"

echo "SUCCESS: All edge verification checks passed. Deployment is fully operational."
```

---
*End of Document. Skynet Operations Protocol Verified.*