# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration and lockfile
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json* ./

# Copy ONLY the gateway package (avoids unnecessary packages)
COPY packages/gateway ./packages/gateway

# Install dependencies for gateway using workspace
RUN pnpm install --frozen-lockfile --filter @tessera/gateway...

# Build the gateway
WORKDIR /app/packages/gateway
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json
COPY --from=builder /app/packages/gateway/package.json ./

# Install ONLY production dependencies
RUN pnpm install --prod

# Copy the built dist folder
COPY --from=builder /app/packages/gateway/dist ./dist

# Expose port (Railway will override this with PORT env var)
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
