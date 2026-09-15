FROM oven/bun:1-alpine AS base
WORKDIR /app

# Prune the monorepo for the 'server' app
FROM base AS pruner
RUN bun add -g turbo
COPY . .
RUN turbo prune server --docker

# Install dependencies using pruned workspace files
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN bun install

# Copy pruned source files
COPY --from=pruner /app/out/full/ .

# Production Runner
FROM base AS runner
WORKDIR /app

# Copy compiled dependencies and source from installer
COPY --from=installer /app .

WORKDIR /app/apps/server

ENV NODE_ENV=production
EXPOSE 8000

CMD ["bun", "run", "src/server.ts"]
