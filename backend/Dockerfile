# Multi-stage build for production optimization

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Remove development files
RUN rm -rf test/ scripts/ seeders/ docs/ *.md

# Production stage
FROM node:18-alpine AS production

# Set environment to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S urlyn -u 1001

WORKDIR /app

# Copy production dependencies and built application
COPY --from=builder --chown=urlyn:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=urlyn:nodejs /app .

# Create logs directory
RUN mkdir -p /app/logs && chown urlyn:nodejs /app/logs

# Switch to non-root user
USER urlyn

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server.js"]
