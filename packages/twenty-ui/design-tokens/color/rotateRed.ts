import { token } from '../token';

// Rotate brand ramp built around Rotate Red #EF483A (step 9). Used by the
// fork as the app's interactive hue (see color/index.ts) and as the accent.
// Steps follow Twenty's 1–12 convention: 1–2 tinted grounds, 3–5 soft
// fills/selection, 6–8 borders and disabled states, 9 solid brand,
// 10 hover, 11 pressed / text on light, 12 deep text.
export const ROTATE_RED_COLOR_TOKENS = {
  scale: {
    rotateRed1: token({ light: '#FFFCFB', dark: '#1A100F' }),
    rotateRed2: token({ light: '#FEF6F5', dark: '#231413' }),
    rotateRed3: token({ light: '#FDECEA', dark: '#3A1714' }),
    rotateRed4: token({ light: '#FBDDD9', dark: '#4C1A16' }),
    rotateRed5: token({ light: '#FBD5D0', dark: '#5C1F1A' }),
    rotateRed6: token({ light: '#F7BDB6', dark: '#712721' }),
    rotateRed7: token({ light: '#F29E95', dark: '#8E2F27' }),
    rotateRed8: token({ light: '#EF7A6E', dark: '#B63A2E' }),
    rotateRed9: token('#EF483A'),
    rotateRed10: token({ light: '#DE3A2C', dark: '#F45E51' }),
    rotateRed11: token({ light: '#C22F23', dark: '#FF8A7E' }),
    rotateRed12: token({ light: '#5A1711', dark: '#FDD5D0' }),
  },
  transparent: {
    rotateRed3: token({ light: '#EF483A14', dark: '#EF483A2D' }),
    rotateRed5: token({ light: '#EF483A32', dark: '#EF483A56' }),
  },
};
