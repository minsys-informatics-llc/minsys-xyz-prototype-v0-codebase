# Minsys Website Protoype v0

Production-ready website for Minsys, engineered for performance, SEO, and security.

## Architecture
- **Frontend:** React, Tailwind CSS, Vite
- **Infrastructure:** Docker, Caddy Web Server (Automatic HTTPS)
- **Analytics:** GA4 with Intersection Observer for section tracking
- **SEO:** Semantic HTML, Open Graph, Schema.org JSON-LD

## Deployment Instructions (VPS)

1. **Prerequisites:**
   - A VPS (Virtual Private Server) with Docker and Docker Compose installed.
   - Your domain names (`minsys.xyz` and `www.minsys.xyz`) must have their DNS **A Records** pointing to your VPS's public IP address.

2. **Configuration:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the variables in `.env` if necessary.

3. **Deploy:**
   - Navigate to the project root directory on your VPS.
   - Run the following command to build and start the container in the background:
     ```bash
     docker-compose up -d --build
     ```

## Automated SSL Renewal
Caddy automatically handles the issuance and renewal of Let's Encrypt SSL certificates for `minsys.xyz` and `www.minsys.xyz` out of the box. The certificates are securely persisted in Docker volumes (`caddy_data` and `caddy_config`), so no manual intervention is required even if the container restarts.

---

## Appendix: Docker Configuration Files

### 1) `docker-compose.yml`
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: minsys_web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Persist Caddy's SSL certificates and config so you don't hit rate limits
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

### 2) `docker/Caddyfile`
```text
minsys.xyz, www.minsys.xyz {
    # Serve files from the /srv directory
    root * /srv
    
    # Enable gzip compression for faster load times
    encode gzip
    
    # Enable static file serving
    file_server
    
    # SPA Routing: If a file/route isn't found, fallback to index.html
    try_files {path} /index.html
}
```

### 3) `docker/Dockerfile`
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM caddy:2-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv
EXPOSE 80 443
```
