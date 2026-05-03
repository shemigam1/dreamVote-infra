# syntax=docker/dockerfile:1.7

# ---- Build stage ----------------------------------------------------------
# node:22-alpine - small, recent LTS. Vite 8 needs a modern Node.
FROM node:22-alpine AS build
WORKDIR /app

# Activate pnpm via corepack (ships with Node). Pinning to v9 (major) gives
# reproducible installs without forcing a specific patch version on you.
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy lockfile + manifest first so `pnpm install` can be cached. As long as
# these two files don't change, Docker reuses the install layer on rebuild.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Now copy the rest of the source. Anything in .dockerignore is skipped.
COPY . .

# This is the runtime-config-injection trick:
#
#   Vite inlines `import.meta.env.VITE_APP_BASE_URL` AT BUILD TIME into the
#   bundled JS. So if we set the env var to a literal placeholder string here,
#   the bundle ends up containing that string verbatim. The runtime entrypoint
#   then sed-replaces the placeholder with whatever VITE_APP_BASE_URL is set
#   to in the container env - meaning the SAME image works in compose,
#   minikube, and EKS, just by passing different env vars.
ENV VITE_APP_BASE_URL=__VITE_APP_BASE_URL__
RUN pnpm build

# ---- Runtime stage --------------------------------------------------------
# nginxinc/nginx-unprivileged is the officially-supported non-root nginx
# variant. Listens on 8080 by default and runs as uid 101 (user "nginx").
# Avoids the awkward dance of running standard nginx as root and dropping
# privileges, which would violate the project's "non-root containers" rule.
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Replace the image's stock server block. The base image includes any *.conf
# file from /etc/nginx/conf.d/ via its main nginx.conf, and the file named
# "default.conf" is the conventional swap-point.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built SPA into nginx's default doc root. Use --chown so the files
# are owned by the nginx user, even though they're world-readable anyway.
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Drop our env-substitution script into the base image's startup hook
# directory. The image's entrypoint executes every *.sh file in
# /docker-entrypoint.d/ before launching nginx; the "40-" prefix orders ours
# after the stock scripts (10-, 20-, 30-) without colliding.
# --chmod=0755 makes it executable; --chown sets ownership consistently.
COPY --chmod=0755 --chown=nginx:nginx docker-entrypoint.sh /docker-entrypoint.d/40-substitute-vite-env.sh

EXPOSE 8080

# Hits the /healthz location defined in nginx.conf - lightweight (no file IO,
# no proxy hop) and works even if the SPA bundle is missing or broken.
# wget is provided by busybox on alpine; no extra install needed.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1
