// Las familias las carga next/font en app/layout.js y las expone como variables CSS.
export const fonts = {
  display: "var(--nf-display), system-ui, sans-serif",
  body: "var(--nf-body), system-ui, sans-serif",
  mono: "var(--nf-mono), ui-monospace, monospace",
};

// En px; se convierten a rem (escalan con “Letra más grande”).
export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 44,
  '5xl': 52,
  hero: 84,
};

export const fontWeights = { regular: 400, medium: 500, semibold: 600, bold: 700, black: 800 };
export const lineHeights = { tight: 1, snug: 1.15, normal: 1.45 };
export const letterSpacings = { tighter: '-0.04em', tight: '-0.02em', normal: '0', wide: '0.08em' };
