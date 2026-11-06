import * as t from './tokens';

const rem = (px) => `${px / 16}rem`;
const kebab = (s) => String(s).replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
const put = (vars, prefix, obj, fmt = (v) => v) =>
  Object.entries(obj).forEach(([k, v]) => { vars[`--${prefix}-${kebab(k)}`] = fmt(v, k); });

/** Convierte los tokens + el tema activo en variables CSS (--color-bg, --space-4, ...). */
export function buildCssVars(themeId, { textScale = 1 } = {}) {
  const palette = t.palettes[themeId] ?? Object.values(t.palettes)[0];
  const { label, description, ambient, ...colors } = palette;
  const v = {};
  put(v, 'color', colors);
  put(v, 'color', t.staticColors);
  put(v, 'space', t.spacing, rem);
  put(v, 'radius', t.radii, (px, k) => (k === 'pill' ? '999px' : rem(px)));
  put(v, 'font', t.fonts);
  put(v, 'fs', t.fontSizes, rem);
  put(v, 'fw', t.fontWeights);
  put(v, 'lh', t.lineHeights);
  put(v, 'ls', t.letterSpacings);
  put(v, 'shadow', t.shadows);
  put(v, 'dur', t.motion.duration);
  put(v, 'ease', t.motion.easing);
  put(v, 'control', t.controlHeights, rem);
  put(v, 'z', t.zIndex);
  put(v, 'layout', t.layout, (px) => `${px}px`);
  v['--blur-glass'] = `${t.glass.blur}px`;
  v['--glass-saturate'] = t.glass.saturate;
  v['--ambient-opacity'] = ambient;
  v['--text-scale'] = textScale;
  return v;
}
