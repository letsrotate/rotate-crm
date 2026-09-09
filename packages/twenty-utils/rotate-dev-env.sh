#!/bin/bash
# =============================================================================
# Rotate CRM — local development environment
# =============================================================================
# Wraps upstream's setup-dev-env.sh (Postgres + Redis via Docker, .env files,
# migrations, dev seed) and then switches the server .env into the mode Rotate
# runs in production: multi-workspace with tenant subdomains and a landing
# page on the bare host. Idempotent; safe to re-run.
#
#   bash packages/twenty-utils/rotate-dev-env.sh              # set up
#   bash packages/twenty-utils/rotate-dev-env.sh --reset      # wipe data + redo
#   bash packages/twenty-utils/rotate-dev-env.sh --down       # stop services
#   bash packages/twenty-utils/rotate-dev-env.sh --seed-cargo # with the server
#       running: install the Rotate Cargo app into both tenants and load the
#       demo airline datasets (regions, stations, staff, forwarders, lanes,
#       Sales Cockpit initiatives, opportunities, notes, tasks)
#
# Then `yarn start` and open:
#   http://localhost:3001            Rotate landing page
#   http://app.localhost:3001        sign in (prefilled: admin@rotate.dev / rotate-dev)
#   http://etihad.localhost:3001     Etihad Airways tenant
#   http://rotate.localhost:3001     Rotate Airlines tenant
# Every seeded user (see rotate-staff.constant.ts) signs in with `rotate-dev`.
# Browsers resolve *.localhost to loopback; Vite proxies the API, so every
# host stays same-origin. Needs Node 24 (.nvmrc) and Docker.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SERVER_ENV="$REPO_ROOT/packages/twenty-server/.env"

SERVER_URL="${SERVER_URL:-http://localhost:3000}"
CARGO_APP_DIR="$REPO_ROOT/packages/twenty-apps/internal/rotate-cargo"
ADMIN_EMAIL="admin@rotate.dev"
ADMIN_PASSWORD="rotate-dev"

# Bash 3.2 (macOS) mis-parses quotes nested inside "$( … )", so request bodies
# are built by python from arguments and never inlined.
graphql_body() { # <query> [key=value ...] -> JSON body
  python3 - "$@" <<'PY'
import json, sys
query, *pairs = sys.argv[1:]
variables = dict(pair.split('=', 1) for pair in pairs)
print(json.dumps({"query": query, "variables": variables}))
PY
}

# The workspace is selected by the `origin` GraphQL argument; no Origin header
# on purpose, the cookie-session check only admits browser origins.
graphql() { # <origin> <json body> [bearer]
  local origin="$1" body="$2" bearer="${3:-}"
  local auth=()
  if [ -n "$bearer" ]; then auth=(-H "Authorization: Bearer $bearer"); fi
  curl -sS "$SERVER_URL/metadata" \
    -H "Content-Type: application/json" ${auth[@]+"${auth[@]}"} \
    -d "$body"
}

json_get() { python3 -c 'import json,sys
raw = sys.stdin.read()
try:
    d = json.loads(raw)
    for key in sys.argv[1].split("."):
        d = d[key] if isinstance(d, dict) else d[int(key)]
except Exception as error:
    sys.exit(f"FAIL reading {sys.argv[1]}: {error}\n{raw[:600]}")
print(d)' "$1"; }

LOGIN_QUERY='mutation($e:String!,$p:String!,$o:String!){getLoginTokenFromCredentials(email:$e,password:$p,origin:$o){loginToken{token}}}'
AUTH_TOKENS_QUERY='mutation($t:String!,$o:String!){getAuthTokensFromLoginToken(loginToken:$t,origin:$o){tokens{accessOrWorkspaceAgnosticToken{token}}}}'
API_KEYS_QUERY='query{apiKeys{id name}}'
API_KEY_ROLES_QUERY='query{getApiKeyRoles{id label}}'
CREATE_API_KEY_QUERY='mutation($name:String!,$exp:String!,$role:UUID!){createApiKey(input:{name:$name,expiresAt:$exp,roleId:$role}){id}}'
API_KEY_QUERY='mutation($id:UUID!,$exp:String!){generateApiKeyToken(apiKeyId:$id,expiresAt:$exp){token}}'
SEED_API_KEY_NAME='rotate-dev-seed'

# Mints a workspace API-key token the way the UI does: password login on the
# tenant origin, then generateApiKeyToken for the seeded key.
mint_api_key() { # <tenant subdomain>
  local origin="http://$1.localhost:3001" body login_token access_token
  body=$(graphql_body "$LOGIN_QUERY" "e=$ADMIN_EMAIL" "p=$ADMIN_PASSWORD" "o=$origin")
  login_token=$(graphql "$origin" "$body" | json_get data.getLoginTokenFromCredentials.loginToken.token)
  body=$(graphql_body "$AUTH_TOKENS_QUERY" "t=$login_token" "o=$origin")
  access_token=$(graphql "$origin" "$body" | json_get data.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token)
  # One admin API key per tenant, created on first run (the dev seeder's own
  # key row exists only in the first workspace: same id, ON CONFLICT ignore).
  local api_key_id
  api_key_id=$(graphql "$origin" "$(graphql_body "$API_KEYS_QUERY")" "$access_token" \
    | python3 -c 'import json,sys; keys=json.load(sys.stdin)["data"]["apiKeys"]; print(next((k["id"] for k in keys if k["name"]==sys.argv[1]), ""))' "$SEED_API_KEY_NAME")
  if [ -z "$api_key_id" ]; then
    local role_id
    role_id=$(graphql "$origin" "$(graphql_body "$API_KEY_ROLES_QUERY")" "$access_token" \
      | python3 -c 'import json,sys; roles=json.load(sys.stdin)["data"]["getApiKeyRoles"]; print(next(r["id"] for r in roles if r["label"]=="Admin"))')
    body=$(graphql_body "$CREATE_API_KEY_QUERY" "name=$SEED_API_KEY_NAME" "exp=2126-01-01T00:00:00.000Z" "role=$role_id")
    api_key_id=$(graphql "$origin" "$body" "$access_token" | json_get data.createApiKey.id)
  fi
  body=$(graphql_body "$API_KEY_QUERY" "id=$api_key_id" "exp=2126-01-01T00:00:00.000Z")
  graphql "$origin" "$body" "$access_token" | json_get data.generateApiKeyToken.token
}

seed_cargo() {
  if ! curl -sf "$SERVER_URL/healthz" >/dev/null; then
    echo "FAIL: server not reachable at $SERVER_URL; run \`yarn start\` first" >&2
    exit 1
  fi
  local tenant api_key
  FIRST_TENANT=etihad
  for tenant in etihad rotate; do
    echo "=> [$tenant] minting API key"
    api_key=$(mint_api_key "$tenant")
    # The twenty CLI's remote:add validates against its docker default instead
    # of --url, so the remote is written directly.
    python3 - "$tenant" "$api_key" "$SERVER_URL" <<'PY'
import json, os, sys
path = os.path.expanduser('~/.twenty/config.json')
os.makedirs(os.path.dirname(path), exist_ok=True)
config = {"version": 1, "remotes": {}}
if os.path.exists(path):
    try:
        config = json.load(open(path))
    except ValueError:
        pass
config.setdefault("remotes", {})[sys.argv[1]] = {"apiUrl": sys.argv[3], "apiKey": sys.argv[2]}
json.dump(config, open(path, 'w'), indent=2)
PY
    # Same model as production: the app is developed against (and registered
    # by) the first tenant, published privately to the server registry once,
    # and installed into every other tenant from there.
    if [ "$tenant" = "$FIRST_TENANT" ]; then
      echo "=> [$tenant] syncing Rotate Cargo (dev registration)"
      (cd "$CARGO_APP_DIR" && yarn install >/dev/null 2>&1 && yarn twenty --remote "$tenant" dev --once 2>&1 | grep -E "Synced|✗|Error|failed" || true)
      echo "=> [$tenant] publishing Rotate Cargo to the server registry"
      (cd "$CARGO_APP_DIR" && yarn twenty --remote "$tenant" app:publish --private 2>&1 | grep -E "Published|✗|Error|failed|already" || true)
    else
      echo "=> [$tenant] installing Rotate Cargo from the server registry"
      (cd "$CARGO_APP_DIR" && yarn twenty --remote "$tenant" app:install 2>&1 | grep -E "installed|✗|Error|failed|already" || true)
    fi
    echo "=> [$tenant] loading demo dataset"
    curl -sS -X POST "$SERVER_URL/s/rotate-cargo/seed-demo" \
      -H "Authorization: Bearer $api_key" -H "Content-Type: application/json" \
      -d "{\"tenant\":\"$tenant\"}" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("   ", "ok" if d.get("success") else "FAILED", json.dumps(d.get("counts") or d.get("error")), "unmatched staff:", d.get("unmatchedStaff"))'
  done
  echo "=> Demo tenants ready: http://etihad.localhost:3001  http://rotate.localhost:3001"
}

case "${1:-}" in
  --seed-cargo) seed_cargo; exit 0 ;;
esac

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

echo "=> Rotate CRM local environment ready."
echo "   1. npx nx database:reset twenty-server   (first time: seeds the Etihad and Rotate Airlines tenants + staff)"
echo "   2. yarn start"
echo "   3. bash packages/twenty-utils/rotate-dev-env.sh --seed-cargo   (installs the cargo app + demo data)"
echo "   landing  http://localhost:3001"
echo "   sign-in  http://app.localhost:3001   admin@rotate.dev / rotate-dev"
echo "   tenants  http://etihad.localhost:3001  http://rotate.localhost:3001"
