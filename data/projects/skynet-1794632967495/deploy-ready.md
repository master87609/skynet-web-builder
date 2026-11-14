```markdown
# Skynet DevOps Deployment Specification: Project APEX (3D Cinematic Apparel)
**Document ID:** SKY-NET-OPS-202X-APEX-09
**Status:** APPROVED
**Target Environment:** Global Production (Edge)

---

## 1. Deployment Packaging & Build Pipeline

The application is containerized using a multi-stage Docker build optimized for high-performance WebGL/Three.js execution, minimizing bundle payload and eliminating non-essential runtime dependencies.

### `Dockerfile`
```dockerfile
# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production Runtime (Nginx Alpine)
FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf` (Performance & Security Hardening)
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Compression for 3D assets and scripts
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml model/gltf-binary;

    # Client-side routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static asset immutable caching handled at edge, fallback definitions here
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|glb|gltf|bin)$ {
        expires 1y;
        add_header Cache-Control "public, immutable, no-transform";
    }
}
```

---

## 2. Edge CDN Caching Headers & Optimization

To ensure a seamless 60fps cinematic scrolling experience globally, assets are routed through our Edge network with strict cache control rules tailored for heavy 3D GLTF/GLB models and compressed textures.

### Edge Caching Policy Matrix

| Asset Path / Type | Cache-Control Directive | Edge TTL | Browser TTL | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `/assets/*.{glb,gltf}` | `public, max-age=31536000, immutable` | 1 Year | 1 Year | Hashed/Versioned 3D models never change. |
| `/textures/*` | `public, max-age=31536000, immutable` | 1 Year | 1 Year | High-res normal/roughness maps. |
| `/js/*.js`, `/css/*.css` | `public, max-age=31536000, immutable` | 1 Year | 1 Year | Vite-bundled asset hashes. |
| `/index.html` | `public, max-age=0, must-revalidate` | 0 Sec | 0 Sec | Ensures immediate propagation of hotfixes. |

---

## 3. Live Preview & Verification Protocol

Deployment to the staging and production edge nodes is finalized. Execute the following automated verification suite to confirm system integrity.

### Verification Runbook

1. **Edge Propagation Check:**
   ```bash
   curl -I https://apex.skynet-internal.net/
   ```
   *Expected Response:* `HTTP/2 200 OK`, `Cache-Control: public, max-age=0, must-revalidate`, `X-Skynet-Edge-Node: active`.

2. **WebGL Context & Performance Benchmark:**
   - Access the live preview URL: `https://apex.skynet-internal.net`
   - Run automated headless browser latency test via CLI:
     ```bash
     npx lighthouse https://apex.skynet-internal.net --view --preset=desktop
     ```
   - **Performance Thresholds Required:**
     - Performance Score: $\ge 90$
     - First Contentful Paint (FCP): $< 1.2s$
     - Time to Interactive (TTI): $< 2.0s$
     - Frame Rate (FPS) during scroll-driven 3D camera path: Stable $\ge 58$ FPS.

3. **Asset Integrity Check:**
   - Verify 3D model streaming chunks load via HTTP range requests without 404/CORS errors in the browser console.

---
**Skynet Infrastructure Automation Complete. Systems nominal.**
```