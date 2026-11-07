'use client';
import { Blobatar } from '@blobatar/react';
import { avatarSizes } from '@/theme/tokens';
import { avatarColor } from '@/utils/poster';
import { cx } from '@/utils/cx';
import s from './Avatar.module.css';

/** Semilla del avatar de un perfil: la que eligió en ajustes o, si no, su id. */
export const avatarSeed = (profile) => profile?.avatar ?? profile?.id ?? profile?.name ?? '';

/**
 * Avatar circular. Con `seed` dibuja un blobatar (perfiles); sin seed, la inicial sobre un color (reparto, chat).
 * size: sm | md | lg | xl | profile (tokens.avatarSizes)
 * frame: marco equipado de la tienda (butaca | neon | rebobinar) o nada.
 */
export default function Avatar({ seed, name, hue, size = 'md', onClick, label, animate = false, frame, className }) {
  const px = avatarSizes[size];
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={cx(s.avatar, seed && s.blob, frame && s[`f_${frame}`], className)}
      onClick={onClick}
      aria-label={label}
      style={{ width: px, height: px, background: seed ? undefined : avatarColor(hue ?? 220), fontSize: px * 0.38 }}
    >
      {seed
        ? <Blobatar name={seed} background="circle" size={px} alt="" {...(animate ? { animate } : {})} />
        : name?.[0]}
    </Tag>
  );
}
