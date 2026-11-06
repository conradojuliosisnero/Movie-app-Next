'use client';
import { ICONS } from '@/icons/registry';
import { iconSizes } from '@/theme/tokens';

/** <Icon name="save" size="md" /> — name viene de icons/registry.js, size de tokens.iconSizes */
export default function Icon({ name, size = 'md', strokeWidth = 2, ...rest }) {
  const Cmp = ICONS[name];
  if (!Cmp) {
    if (process.env.NODE_ENV !== 'production') console.warn(`Icon "${name}" no está en icons/registry.js`);
    return null;
  }
  const px = typeof size === 'number' ? size : iconSizes[size];
  return <Cmp size={px} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />;
}
