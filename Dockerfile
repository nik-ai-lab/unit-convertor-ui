# Stage 1: Build Svelte SPA static assets
FROM node:26.7.0-alpine3.24 AS builder

WORKDIR /app

# Copy dependency definitions first (layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve static bundle via hardened, non-root Nginx
# Uses the official unprivileged Nginx image that runs as uid 101 (nginx)
# with no root process, no default EXPOSE on privileged ports, and a
# minimal Alpine base.
FROM nginxinc/nginx-unprivileged:1.27-alpine3.21

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose unprivileged HTTP port
EXPOSE 8080

# Health check (against the unprivileged port)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
