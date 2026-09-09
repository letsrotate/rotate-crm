# Rotate CRM — fork notes

This repository is Rotate's fork of [twentyhq/twenty](https://github.com/twentyhq/twenty), deployed as **Rotate CRM** at `crm.dev.letsrotate.com` (only the dev environment is deployed for now; `crm.test.letsrotate.com` and `crm.letsrotate.com` follow the same pattern when needed). Upstream docs and `CLAUDE.md` still apply to the code; this file covers what is different here.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Tracks `upstream/main` (twentyhq). Never commit Rotate changes here. |
| `dev` / `test` / `prod` | Rotate's environment branches, the same promotion model as every other letsrotate repo. Only `dev` builds today (`ghcr.io/letsrotate/rotate-crm:dev`; add `test`/`prod` to `rotate-build.yml` when those environments exist); argocd-image-updater rolls the digest into `argocd-workloads/apps/crm`. |

Sync with upstream:

```bash
git fetch upstream
git checkout main && git merge --ff-only upstream/main && git push origin main
git checkout dev && git merge main            # resolve conflicts in the files listed below
```

Upstream's own GitHub workflows stay in `.github/workflows/` so merges are conflict-free, but they are **disabled on this fork** through the Actions API (`gh workflow disable`). Only `rotate-build.yml` runs. After an upstream merge that adds new workflow files, disable them the same way.

## What the fork changes (keep this list current)

| Area | Files | Why |
|---|---|---|
| Deploy | `.github/workflows/rotate-build.yml` | Builds the `twenty` Docker target from the repo root and pushes to GHCR. |
| Branding | `packages/twenty-front/index.html`, `public/manifest.json`, `public/images/rotate/*`, `public/images/icons/{android,ios,windows11}/*` (subset), `twenty-front/.../DefaultWorkspaceLogo.ts`, `twenty-emails/src/{components/Logo.tsx,constants/DefaultWorkspaceLogo.ts}` | Rotate mark and name instead of Twenty's. |
| Theme | `packages/twenty-ui/design-tokens/color/rotateRed.ts`, `color/gray.ts`, `color/index.ts`, `color/mainColors.ts`, `tag.ts`, `background.ts` (then `npx nx generateTokens twenty-ui`) | Twenty's interactive hue (`blue` scale + accent: primary buttons, checkboxes, links, selection) resolves to the Rotate Red ramp; the grey scale is Rotate's mist/slate/ink neutrals. Select-option and tag "blue" stay blue. Regenerate tokens after editing; never hand-edit `src/theme*`. |
| Landing page | `packages/twenty-front/src/modules/rotate-landing/*`, hook in `modules/app/components/DomainShell.tsx` | The root path (`/`) serves the Rotate landing page while no workspace is selected; `/welcome` is sign-in / workspace creation. (With subdomain routing on, the landing page is the bare apex instead.) |
| Single-host workspaces | server: `IS_WORKSPACE_SUBDOMAIN_ROUTING_ENABLED` in `twenty-config/config-variables.ts`, `client-config.*`, `domain-server-config.service.ts` (`isWorkspaceSubdomainRoutingEnabled`, `getBaseUrl`), `workspace-domains.service.ts` (`buildWorkspaceURL`); front: `modules/domain-manager/hooks/useWorkspaceSelection.ts` + the `domain-manager` hooks that read it (`useOrigin`, `useIsCurrentLocationOn*`, `useBuildWorkspaceUrl`, `useRedirectToDefaultDomain`, …) | See *Multi-tenancy model*: all workspaces live on one hostname, selected with `?w=<subdomain>`. |
| Tenant cap | `packages/twenty-server/src/engine/core-modules/auth/constants/max-workspaces-without-enterprise-key.constants.ts` | Upstream caps self-hosted instances at 5 workspaces without an enterprise key; Rotate runs one workspace per airline. The file is AGPL (not `@license Enterprise`). |
| Cargo app | `packages/twenty-apps/internal/rotate-cargo/` | Stations, lanes, sales initiatives, forwarder fields on Company, Sales Cockpit dashboard + sync. See its README. |

Everything else is upstream. Prefer adding features as Twenty **applications** (`packages/twenty-apps/internal/`) over editing server or front code: apps survive upstream merges untouched and fall under Twenty's Section-7 application exception.

## Multi-tenancy model

- Twenty's multi-workspace mode (`IS_MULTIWORKSPACE_ENABLED=true`) gives every airline its own **workspace**: isolated data, users, roles, API keys and automations. Upstream selects the workspace by hostname (`<tenant>.crm...`); the fork adds `IS_WORKSPACE_SUBDOMAIN_ROUTING_ENABLED=false` so every workspace is served from the one hostname `crm.<env>.letsrotate.com` instead: no wildcard DNS, no wildcard certificate, no per-tenant hosts.
- How single-host mode works: each workspace still has a `subdomain` (its short name, e.g. `etihad`). The front remembers the selected one per browser (`?w=etihad` selects it and is then removed from the address bar, `?w=` clears it) and keeps sending Twenty's server the virtual origin `https://etihad.crm.<env>.letsrotate.com` it already knows how to resolve. Only links and redirects (workspace switcher, sign-in, invitation and verification emails) are translated to `https://crm.<env>.letsrotate.com/<path>?w=etihad`. The Twenty API and REST/GraphQL clients are untouched: API keys are workspace-scoped and need no origin.
- Landing page at `/` (no workspace selected) → **Create a workspace** goes to `/welcome`, where signing up creates a new workspace (`IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=false`); **Open workspace** takes the short name and opens `/?w=<name>`. Existing users sign in at `/welcome` and land in their last workspace, or pick one when they belong to several.
- Provisioning a tenant: sign up from the landing page (or, as an existing user, Settings → Workspaces → create workspace) → set the short name in Settings → General → Domain (this is the `?w=` value) → invite the airline's first admin → Settings → Applications → Rotate Cargo → set `SALES_COCKPIT_TENANT`.
- Switching back to subdomain routing is one env var (`IS_WORKSPACE_SUBDOMAIN_ROUTING_ENABLED=true`) plus the wildcard DNS/cert in `infrastructure` and a wildcard host on the Ingress in argocd-workloads.
- Per-tenant custom domains (e.g. `crm.airline.com`) need Cloudflare for SaaS upstream (`CLOUDFLARE_*`); not enabled.

## Infrastructure

- Kubernetes: [`argocd-workloads/apps/crm`](https://github.com/letsrotate/argocd-workloads) (`charts/crm` umbrella: `server` + `worker`, PreSync migration job).
- AWS: [`infrastructure/apps/crm.tf`](https://github.com/letsrotate/infrastructure) (RDS Postgres 16, ACM cert, S3 bucket, IRSA, secrets). Every resource is gated on `apps-dev` (`local.crm_enabled`); test and prod get nothing until that gate is widened.
- Redis is the shared in-cluster Valkey on DB index `/7`.
- Files: S3 `apps-<env>-rotate-crm-storage` through IRSA (`STORAGE_TYPE=S_3`, no static keys).
- Email: Mailjet SMTP (`apps-<env>/crm` secret, hand-injected).

## Local development

One command on top of upstream's setup (needs Docker and Node 24, see `.nvmrc`):

```bash
bash packages/twenty-utils/rotate-dev-env.sh   # Postgres + Redis in Docker, .env files, migrations, then Rotate's multi-tenant overrides
npx nx database:reset twenty-server            # first time only: seeds the two airline tenants and their staff
yarn start                                     # server :3000, front :3001, worker
bash packages/twenty-utils/rotate-dev-env.sh --seed-cargo   # installs the Rotate Cargo app into both tenants and loads the demo datasets
```

Then, exactly like production but on `localhost`:

| URL | What |
|---|---|
| `http://localhost:3001` | Rotate landing page (create a workspace / open one by name) |
| `http://localhost:3001/welcome` | sign in (prefilled `admin@rotate.dev` / `rotate-dev`) |
| `http://localhost:3001/?w=etihad` | **Etihad Airways** tenant: hub AUH, four regions, 22 stations, 12 forwarders, 20 Sales Cockpit initiatives |
| `http://localhost:3001/?w=rotate` | **Rotate Airlines** tenant (fictional): hub AMS, four regions, 16 stations, 10 forwarders, 18 initiatives |

The selected workspace is remembered per browser (`?w=` clears it, which brings the landing page back). `--reset` wipes the data, `--down` stops the containers.

### Seed data

The fork replaces Twenty's demo seed (Apple/YC, pets, rockets, surveys) with an airline sales organisation. Two layers:

- **Dev seeder** (`packages/twenty-server/.../dev-seeder/core/constants/rotate-staff.constant.ts`): the two workspaces and their users. Every user signs in with `rotate-dev`. `admin@rotate.dev` is the Rotate platform admin (server admin, member of both tenants); each airline has a head of cargo sales (workspace admin), regional managers and station account managers. Twenty's demo objects and records are switched off (`ROTATE_DEV_SEEDED_TABLES`).
- **Rotate Cargo app** (`packages/twenty-apps/internal/rotate-cargo/src/logic-functions/constants/demo-data/`): everything else, loaded by `POST /s/rotate-cargo/seed-demo {"tenant":"etihad"|"rotate"}`. Regions (with regional manager), stations (in a region, with account managers), forwarders (with IATA CASS code, segment, tier, home station, account owner), contacts, lanes, Sales Cockpit initiatives (linked to forwarder, station, lane, assignee), opportunities, notes and tasks. Idempotent, so it doubles as the way to (re)load a demo tenant in dev/test.

The hierarchy is: **Region** → `regionalManager` (workspace member) and `stations` → **Station** → `accountManagers` (workspace members with `station` set) → forwarders via `homeStation` and `accountOwner`. Every workspace member carries a `cargoRole` (head of sales, regional manager, station manager, account manager).

To work on the cargo app against a running tenant, the `--seed-cargo` step already wrote a remote per tenant into `~/.twenty/config.json`; run `yarn twenty --remote etihad dev` from the app directory for live sync.
