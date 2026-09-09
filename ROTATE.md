# Rotate CRM — fork notes

This repository is Rotate's fork of [twentyhq/twenty](https://github.com/twentyhq/twenty), deployed as **Rotate CRM** at `crm.letsrotate.com` (`crm.dev.letsrotate.com`, `crm.test.letsrotate.com`). Upstream docs and `CLAUDE.md` still apply to the code; this file covers what is different here.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Tracks `upstream/main` (twentyhq). Never commit Rotate changes here. |
| `dev` / `test` / `prod` | Rotate's environment branches, the same promotion model as every other letsrotate repo. Pushing builds and publishes `ghcr.io/letsrotate/rotate-crm:<branch>`; argocd-image-updater rolls the digest into `argocd-workloads/apps/crm`. |

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
| Landing page | `packages/twenty-front/src/modules/rotate-landing/*`, hook in `modules/app/components/DomainShell.tsx` | In multi-workspace mode the bare apex (`crm.letsrotate.com`) is neither the sign-in domain (`app.crm...`) nor a workspace, so it serves the Rotate landing page. |
| Tenant cap | `packages/twenty-server/src/engine/core-modules/auth/constants/max-workspaces-without-enterprise-key.constants.ts` | Upstream caps self-hosted instances at 5 workspaces without an enterprise key; Rotate runs one workspace per airline. The file is AGPL (not `@license Enterprise`). |
| Cargo app | `packages/twenty-apps/internal/rotate-cargo/` | Stations, lanes, sales initiatives, forwarder fields on Company, Sales Cockpit dashboard + sync. See its README. |

Everything else is upstream. Prefer adding features as Twenty **applications** (`packages/twenty-apps/internal/`) over editing server or front code: apps survive upstream merges untouched and fall under Twenty's Section-7 application exception.

## Multi-tenancy model

- `IS_MULTIWORKSPACE_ENABLED=true`, `DEFAULT_SUBDOMAIN=app`: sign-in and sign-up live at `https://app.crm.<env>.letsrotate.com`, each airline gets `https://<tenant>.crm.<env>.letsrotate.com`.
- `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=true`: only Rotate server admins create workspaces; airline users join through invitations. The **first user** to sign up on a fresh instance becomes server admin automatically; later admins are granted in Settings → Admin Panel → Server admins.
- Provisioning a tenant: sign in as a server admin → Settings → Workspaces → create workspace → set the subdomain to the airline slug → invite the airline's first admin → Settings → Applications → Rotate Cargo → set `SALES_COCKPIT_TENANT`.
- Per-tenant custom domains (e.g. `crm.airline.com`) need Cloudflare for SaaS upstream (`CLOUDFLARE_*`); not enabled.

## Infrastructure

- Kubernetes: [`argocd-workloads/apps/crm`](https://github.com/letsrotate/argocd-workloads) (`charts/crm` umbrella: `server` + `worker`, PreSync migration job).
- AWS: [`infrastructure/apps/crm.tf`](https://github.com/letsrotate/infrastructure) (RDS Postgres 16, ACM wildcard cert, prod hosted zone, S3 bucket, IRSA, secrets).
- Redis is the shared in-cluster Valkey on DB index `/7`.
- Files: S3 `apps-<env>-rotate-crm-storage` through IRSA (`STORAGE_TYPE=S_3`, no static keys).
- Email: Mailjet SMTP (`apps-<env>/crm` secret, hand-injected).

## Local development

One command on top of upstream's setup (needs Docker and Node 24, see `.nvmrc`):

```bash
bash packages/twenty-utils/rotate-dev-env.sh   # Postgres + Redis in Docker, .env files, migrations, then Rotate's multi-tenant overrides
npx nx database:reset twenty-server            # first time only: seeds the "Apple" and "YC" demo workspaces
yarn start                                     # server :3000, front :3001, worker
```

Then, exactly like production but on `localhost`:

| URL | What |
|---|---|
| `http://localhost:3001` | Rotate landing page |
| `http://app.localhost:3001` | sign in / sign up (dev login is prefilled) |
| `http://apple.localhost:3001`, `http://yc.localhost:3001` | seeded tenant workspaces |

Browsers resolve `*.localhost` to loopback and Vite proxies every API path, so no hosts-file edits and no CORS. `--reset` wipes the data, `--down` stops the containers. Local differences from prod: anyone may create workspaces, the file store is on disk, email is logged instead of sent.

To work on the cargo app against that server: create an API key in the workspace (Settings → APIs & Webhooks), then from `packages/twenty-apps/internal/rotate-cargo` run `yarn twenty remote:add --url http://apple.localhost:3000 --api-key <key> --as local` and `yarn twenty dev --remote local` for live sync (see the app's README).
