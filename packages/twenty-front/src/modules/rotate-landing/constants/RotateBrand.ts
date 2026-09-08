// oxlint-disable twenty/no-hardcoded-colors -- the landing page carries the
// Rotate brand palette (rotate-website design-tokens.css), not the workspace
// theme, which is why these are literals instead of twenty-ui theme variables.
export const ROTATE_BRAND = {
  red: '#EF483A',
  redHover: '#DE3A2C',
  ink: '#0F1111',
  inkHover: '#1E2122',
  slate: '#5F6468',
  mist: '#ECF0EB',
  white: '#FFFFFF',
  teal: '#41C3DC',
  gray300: '#B8BDBC',
  gray150: '#E2E6E1',
  gray50: '#F6F8F5',
  fontSans:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;
