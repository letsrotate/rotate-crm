// Rotate fork: upstream caps a self-hosted instance at 5 workspaces without an
// enterprise key. Rotate CRM provisions one workspace per airline tenant, so
// the cap is lifted here (this file is AGPL, not `@license Enterprise`).
export const MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY = 1000;
