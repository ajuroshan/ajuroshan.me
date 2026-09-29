#!/usr/bin/env bash
# Ship dist/ to the OCI box and atomically swap the `current` symlink.
#   npm run deploy                 build + deploy the working tree (hotfix / local)
#   SKIP_BUILD=1 RELEASE=v0.1.0    deploy an already-built dist/ (used by release CI)
# Rollback: ssh deploy@oci 'ls /var/www/ajuroshan.me/releases' then
#           ln -sfn releases/<old> /var/www/ajuroshan.me/current
set -euo pipefail

HOST="${DEPLOY_HOST:-deploy@oci}"
ROOT=/var/www/ajuroshan.me
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
REL="$(date -u +%Y%m%dT%H%M%SZ)-${RELEASE:-$SHA}"
KEEP=5

[ -n "${SKIP_BUILD:-}" ] || npm run build
rsync -az --delete --link-dest="$ROOT/current/" dist/ "$HOST:$ROOT/releases/$REL/"
ssh "$HOST" "set -e
  ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current
  cd $ROOT/releases && ls -1t | tail -n +$((KEEP + 1)) | xargs -r rm -rf"
echo "deployed $REL -> $HOST"
