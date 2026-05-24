# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (includes devDependencies for build)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma/ prisma/
RUN npx prisma generate

# Copy source code and build config
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/

# Compile TypeScript to JavaScript
RUN npm run build

# ---- Stage 2: Production ----
FROM node:22-alpine

# Install OpenSSL required by Prisma query engine at runtime
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package manifests and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and migrations (needed for prisma migrate deploy)
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma client from builder (includes engine binaries)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose port (Fly.io uses 8080 by default, overridable via PORT env)
EXPOSE 8080

# Health check: pings the core health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||8080)+'/api/core/health',r=>{process.exit(r.statusCode===200?0:1)})"

# Entrypoint: run migrations then start the server
ENTRYPOINT ["/bin/sh", "-c", "npx prisma migrate deploy && exec node dist/main"]
