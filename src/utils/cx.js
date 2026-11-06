// Une clases condicionales: cx('a', cond && 'b')
export const cx = (...c) => c.filter(Boolean).join(' ');
