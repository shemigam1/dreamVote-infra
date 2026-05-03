#!/bin/sh
# Runtime config-injection for the Vite SPA.
#
# Vite inlines `import.meta.env.VITE_APP_BASE_URL` into the bundle at BUILD
# time. Our Dockerfile builds with the literal placeholder string
# "__VITE_APP_BASE_URL__" so the bundle ships with that placeholder embedded.
# This script - run by nginx's entrypoint hook chain at CONTAINER STARTUP -
# replaces every occurrence of the placeholder in the JS bundles with the
# actual URL passed via the VITE_APP_BASE_URL env var.
#
# Net effect: ONE image, configured per environment (compose/minikube/EKS)
# just by passing different env vars - no rebuild required.

set -eu

# Default to "/api" when not provided. Combined with the nginx /api/ proxy
# block, this routes the SPA's API calls back to the server container with
# no further configuration needed for the standard compose setup.
VITE_APP_BASE_URL="${VITE_APP_BASE_URL:-/api}"

echo "[vite-env] substituting __VITE_APP_BASE_URL__ -> ${VITE_APP_BASE_URL}"

# `find` over the served directory, looking only at JS files (the placeholder
# only appears in the bundled JS - HTML/CSS don't reference env vars).
#
# `-exec ... +` batches multiple files into each sed invocation - faster than
# `\;` (one process per file) for the typical Vite output of several chunks.
#
# `|` is the sed delimiter because VITE_APP_BASE_URL almost always contains
# `/`. Limitation: if your value itself contains `|`, this breaks - but no
# realistic URL or path would.
find /usr/share/nginx/html -type f -name "*.js" -exec \
    sed -i "s|__VITE_APP_BASE_URL__|${VITE_APP_BASE_URL}|g" {} +

echo "[vite-env] done"
