import { token } from '../token';

// Rotate fork: the neutral ramp is Rotate's (rotate-website design-tokens.css):
// white -> mist (#ECF0EB) -> slate (#5F6468) -> ink (#0F1111), with a faint
// green cast instead of Twenty's pure greys. Dark mode mirrors it from ink.
export const GRAY_COLOR_TOKENS = {
  scale: {
    gray1: token({
      light: '#FFFFFF',
      dark: '#0F1111',
    }),
    gray2: token({
      light: '#FAFBF9',
      dark: '#151717',
    }),
    gray3: token({
      light: '#F6F8F5',
      dark: '#1B1E1E',
    }),
    gray4: token({
      light: '#ECF0EB',
      dark: '#202424',
    }),
    gray5: token({
      light: '#E2E6E1',
      dark: '#262A2A',
    }),
    gray6: token({
      light: '#D7DCD9',
      dark: '#333838',
    }),
    gray7: token({
      light: '#C9CFCB',
      dark: '#3F4445',
    }),
    gray8: token({
      light: '#B8BDBC',
      dark: '#525758',
    }),
    gray9: token({
      light: '#8A8F92',
      dark: '#6F7477',
    }),
    gray10: token({
      light: '#6F7477',
      dark: '#8A8F92',
    }),
    gray11: token({
      light: '#4C5153',
      dark: '#B8BDBC',
    }),
    gray12: token({
      light: '#0F1111',
      dark: '#ECF0EB',
    }),
  },
  transparent: {
    gray1: token({
      light: 'color(display-p3 0 0 0 / 0.02)',
      dark: 'color(display-p3 1 1 1 / 0.031)',
    }),
    gray2: token({
      light: 'color(display-p3 0 0 0 / 0.039)',
      dark: 'color(display-p3 1 1 1 / 0.059)',
    }),
    gray3: token({
      light: 'color(display-p3 0 0 0 / 0.047)',
      dark: 'color(display-p3 1 1 1 / 0.047)',
    }),
    gray4: token({
      light: 'color(display-p3 0 0 0 / 0.071)',
      dark: 'color(display-p3 1 1 1 / 0.071)',
    }),
    gray5: token({
      light: 'color(display-p3 0 0 0 / 0.078)',
      dark: 'color(display-p3 1 1 1 / 0.102)',
    }),
    gray6: token({
      light: 'color(display-p3 0 0 0 / 0.114)',
      dark: 'color(display-p3 1 1 1 / 0.114)',
    }),
    gray7: token({
      light: 'color(display-p3 0 0 0 / 0.161)',
      dark: 'color(display-p3 1 1 1 / 0.141)',
    }),
    gray8: token({
      light: 'color(display-p3 0 0 0 / 0.22)',
      dark: 'color(display-p3 1 1 1 / 0.22)',
    }),
    gray9: token({
      light: 'color(display-p3 0 0 0 / 0.361)',
      dark: 'color(display-p3 1 1 1 / 0.427)',
    }),
    gray10: token({
      light: 'color(display-p3 0 0 0 / 0.478)',
      dark: 'color(display-p3 1 1 1 / 0.478)',
    }),
    gray11: token({
      light: 'color(display-p3 0 0 0 / 0.722)',
      dark: 'color(display-p3 1 1 1 / 0.565)',
    }),
    gray12: token({
      light: 'color(display-p3 0 0 0 / 0.91)',
      dark: 'color(display-p3 1 1 1 / 0.91)',
    }),
  },
};
