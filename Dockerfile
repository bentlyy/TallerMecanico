# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && cp -r node_modules /node_modules_prod && npm ci
COPY . .
ENV DATABASE_URL="postgresql://p:p@localhost:5432/db"
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache netcat-openbsd && addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
COPY package*.json ./
COPY --from=builder /node_modules_prod ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY healthcheck.js /healthcheck.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node /healthcheck.js

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/server.js"]
