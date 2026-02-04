# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app


# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci


# Copy source code
COPY . .

# Vite embeds env at build time; pass from build-arg so Docker build gets correct API URL
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install serve globally to serve static files and curl for healthcheck
RUN npm install -g serve && \
    apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port  3001
EXPOSE 3005

# Start serve
CMD ["serve", "-s", "dist", "-l", "3005"]