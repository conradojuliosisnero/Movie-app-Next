import { posterColor } from '@/theme/tokens';

const { highlight: h, top, bottom, avatar } = posterColor;

/** Fondo de póster generado a partir de dos tonos OKLCH. Reemplazar por imagen cuando exista. */
export function posterBackground([h0, h1], imageUrl) {
  if (imageUrl) return `url(${imageUrl}) center / cover`;
  return `radial-gradient(130% 90% at 15% 0%, oklch(${h.l} ${h.c} ${h0} / ${h.alpha}) 0%, transparent 55%), linear-gradient(160deg, oklch(${top.l} ${top.c} ${h0}) 0%, oklch(${bottom.l} ${bottom.c} ${h1}) 100%)`;
}

export const avatarColor = (hue) => `oklch(${avatar.l} ${avatar.c} ${hue})`;
