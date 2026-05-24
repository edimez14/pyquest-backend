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
# prisma CLI is now in dependencies so release_command works in Fly.io
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (needed by release_command: prisma migrate deploy)
COPY --from=builder /app/prisma ./prisma

# Regenerate Prisma client for the production environment
RUN npx prisma generate

# Expose port (Fly.io passes PORT via environment, defaults to 8080)
EXPOSE 8080

# Health check: pings the core health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||8080)+'/api/core/health',r=>{process.exit(r.statusCode===200?0:1)})"

# Start the server (release_command runs prisma migrate deploy before this)
ENTRYPOINT ["node", "dist/main"]
