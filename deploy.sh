#!/usr/bin/env bash
# Build locally, ship to the OCI box, atomically swap the `current` symlink.
# Rollback: ssh oci 'ls /var/www/ajuroshan.me/releases' then point `current` at an older one.
set -euo pipefail

HOST="${DEPLOY_HOST:-oci}"
ROOT=/var/www/ajuroshan.me
REL="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
KEEP=5

npm run build
rsync -az --delete --link-dest="$ROOT/current/" dist/ "$HOST:$ROOT/releases/$REL/"
ssh "$HOST" "set -e
  ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current
  cd $ROOT/releases && ls -1t | tail -n +$((KEEP + 1)) | xargs -r rm -rf"
echo "deployed $REL -> $HOST"
