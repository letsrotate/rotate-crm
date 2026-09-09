# Rotate Cargo (Twenty application)

Air cargo sales for Rotate CRM. Installs into a workspace:

- **Stations** (IATA code, region, hub flag), **Lanes** (origin–destination with leg colour, tonnes and yields) and **Sales initiatives** as first-class objects, with views, a kanban board and a **Sales Cockpit** dashboard in the navigation.
- **Sales organisation**: **Regions** (with a regional manager) group **Stations**; workspace members carry a `cargoRole` and a `station`, so every station lists its account managers and every initiative resolves its cockpit assignee to a person.
- **Forwarder fields on Company**: IATA CASS code, segment (Summit / Non-Summit), tier, home station, and the exact *Sales Cockpit agent name* the sync matches on.
- A **Sales Cockpit** tab on every company record listing that forwarder's initiatives.
- The **Sales Cockpit sync**: every six hours (and on demand from the dashboard, a workflow action, or an AI tool) it pulls the tenant's initiatives from the Rotate customer API (`POST v1/initiatives/get/all`, `X-Tenant`) and upserts them by cockpit id, creating any missing stations and lanes and linking each initiative to its forwarder.

## Demo data

`POST /s/rotate-cargo/seed-demo` with `{"tenant":"etihad"}` or `{"tenant":"rotate"}` (workspace API key) loads a realistic airline dataset: regions, stations, staff roles, forwarders with contacts, lanes, Sales Cockpit initiatives, opportunities, notes and tasks. Staff are matched to existing workspace members by email (see the dev seeder's `rotate-staff.constant.ts`); unmatched emails are reported, not created. Idempotent.

## Configuration

| Where | Variable | Meaning |
|---|---|---|
| Server admin → Applications → Rotate Cargo (server variables) | `SALES_COCKPIT_API_URL` | `https://api.prod.letsrotate.com` (or `api.test` / `api.dev`) |
| | `SALES_COCKPIT_COGNITO_CLIENT_ID` | Cognito app client for that API |
| | `SALES_COCKPIT_BOT_EMAIL` / `SALES_COCKPIT_BOT_PASSWORD` | Service account in the `rotate:platform::admin` group |
| Workspace → Settings → Applications → Rotate Cargo | `SALES_COCKPIT_TENANT` | Airline slug (`etihad`, `jal`, `demo`, …). Empty = sync disabled for that workspace |
| | `SALES_COCKPIT_APP_URL` | Base URL initiatives link back to (default `https://app.prod.letsrotate.com`) |

The server needs `LOGIC_FUNCTION_TYPE=LOCAL` (or `LAMBDA`) for the sync to run; argocd-workloads sets it.

## Publishing to the Rotate CRM server

```bash
cd packages/twenty-apps/internal/rotate-cargo
yarn install
yarn twenty remote:add --url https://app.crm.dev.letsrotate.com --api-key "$TWENTY_API_KEY" --as dev
yarn twenty app:publish --private --remote dev   # bump "version" in package.json first
```

Then, as a server admin: **Settings → Admin Panel → Apps → Rotate Cargo → “Pre-install on new workspaces”**, and run `yarn command:prod install-pre-installed-apps` on the server (or the admin panel backfill) to roll it out to existing workspaces.

## Development

```bash
yarn install
yarn lint
yarn typecheck
yarn test
yarn twenty dev            # live-sync into a local Twenty (see docs.twenty.com/developers/extend/apps)
```

Never change an existing universal identifier in `src/constants/universal-identifiers.ts`.
