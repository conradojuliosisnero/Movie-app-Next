'use client';
import Icon from '../Icon/Icon';
import { cx } from '@/utils/cx';
import s from './Button.module.css';

const ICON_SIZE = { sm: 'xs', md: 'sm', lg: 'md', xl: 'md' };

/**
 * variant: primary | secondary | inverse | ghost | link | outline | media
 * size: sm | md | lg | xl  (alturas en tokens.controlHeights)
 * Con `href` se pinta como enlace (<a>) con el mismo aspecto.
 */
export default function Button({ variant = 'secondary', size = 'md', icon, iconRight, active = false, block = false, type = 'button', href, className, children, ...rest }) {
  const iconOnly = children == null || children === false;
  const classes = cx(s.btn, s[variant], s[size], active && s.active, block && s.block, iconOnly && s.iconOnly, href && s.anchor, className);
  const content = (
    <>
      {icon && <Icon name={icon} size={ICON_SIZE[size]} />}
      {!iconOnly && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={ICON_SIZE[size]} />}
    </>
  );
  if (href) return <a href={href} className={classes} {...rest}>{content}</a>;
  return <button type={type} className={classes} {...rest}>{content}</button>;
}
