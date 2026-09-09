#!/bin/bash
# =============================================================================
# Rotate CRM — local development environment
# =============================================================================
# Wraps upstream's setup-dev-env.sh (Postgres + Redis via Docker, .env files,
# migrations, dev seed) and then switches the server .env into the mode Rotate
# runs in production: multi-workspace with tenant subdomains and a landing
# page on the bare host. Idempotent; safe to re-run.
#
#   bash packages/twenty-utils/rotate-dev-env.sh           # set up
#   bash packages/twenty-utils/rotate-dev-env.sh --reset   # wipe data + redo
#   bash packages/twenty-utils/rotate-dev-env.sh --down    # stop services
#
# Then `yarn start` and open:
#   http://localhost:3001            Rotate landing page
#   http://app.localhost:3001        sign in / sign up (prefilled dev login)
#   http://apple.localhost:3001      seeded "Apple" workspace
#   http://yc.localhost:3001         seeded "YC" workspace
# Browsers resolve *.localhost to loopback; Vite proxies the API, so every
# host stays same-origin. Needs Node 24 (.nvmrc) and Docker.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SERVER_ENV="$REPO_ROOT/packages/twenty-server/.env"

bash "$SCRIPT_DIR/setup-dev-env.sh" "$@"

case "${1:-}" in
  --down) exit 0 ;;
esac

# Overrides on top of upstream's .env.example. `set_env KEY VALUE` replaces an
# existing (possibly commented) line or appends, so re-runs never duplicate.
set_env() {
  local key="$1" value="$2"
  if grep -qE "^#? ?${key}=" "$SERVER_ENV"; then
    sed -i.bak -E "s|^#? ?${key}=.*|${key}=${value}|" "$SERVER_ENV" && rm -f "$SERVER_ENV.bak"
  else
    printf '%s=%s\n' "$key" "$value" >> "$SERVER_ENV"
  fi
}

if ! grep -q "ROTATE LOCAL" "$SERVER_ENV"; then
  printf '\n# ———————— ROTATE LOCAL (rotate-dev-env.sh) ————————\n' >> "$SERVER_ENV"
fi

# Multi-tenant mode: sign-in on app.localhost, one subdomain per workspace,
# landing page on the bare host (see ROTATE.md).
set_env IS_MULTIWORKSPACE_ENABLED true
set_env DEFAULT_SUBDOMAIN app
set_env SERVER_URL http://localhost:3000
set_env FRONTEND_URL http://localhost:3001
# Anyone may create workspaces locally; production limits this to server admins.
set_env IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS false
# The Rotate Cargo app's Sales Cockpit sync is a logic function.
set_env LOGIC_FUNCTION_TYPE LOCAL
set_env IS_BILLING_ENABLED false
set_env TELEMETRY_ENABLED false

echo "=> Rotate CRM local environment ready. Run: yarn start"
echo "   landing  http://localhost:3001"
echo "   sign-in  http://app.localhost:3001"
echo "   tenants  http://apple.localhost:3001  http://yc.localhost:3001"
