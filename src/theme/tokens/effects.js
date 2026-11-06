export const shadows = {
  sm: '0 1px 2px var(--color-shadow)',
  md: '0 10px 30px -20px var(--color-shadow)',
  lg: '0 24px 60px -24px var(--color-shadow)',
  accent: '0 14px 30px -12px var(--color-accent)',
  poster: '0 14px 30px -14px rgba(0,0,0,.55)',
  sheet: '0 30px 80px -20px rgba(0,0,0,.6)',
};

// Glassmorphism: solo para capas flotantes (barra, menús, controles del reproductor).
export const glass = { blur: 24, saturate: 1.8 };

export const motion = {
  duration: { fast: '200ms', base: '300ms', slow: '450ms' },
  easing: {
    standard: 'cubic-bezier(.2,.8,.2,1)',
    spring: 'cubic-bezier(.3,1.4,.5,1)',
    in: 'ease-in',
  },
};
