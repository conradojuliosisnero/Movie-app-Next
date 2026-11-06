// Tamaños de controles, íconos, pósters y layout (px).
export const controlHeights = { sm: 34, md: 44, lg: 54, xl: 60 };

export const iconSizes = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 };

export const posterSizes = {
  xs: { width: 46, height: 64, radius: 'sm' },
  sm: { width: 64, height: 90, radius: 'sm' },
  md: { width: 150, height: 212, radius: 'lg' },
  lg: { width: 300, height: 430, radius: '2xl' },
  fluid: { width: '100%', aspectRatio: '5 / 7', radius: 'lg' },
};

export const avatarSizes = { sm: 30, md: 40, lg: 46, xl: 72, profile: 150 };

export const layout = {
  contentMax: 1200,
  navMax: 880,
  navHeight: 62,
  sheetWidth: 680,
  partyWidth: 320,
  narrowMax: 780,
};

export const zIndex = { base: 1, nav: 40, overlay: 50, sheet: 51, player: 60, toast: 90 };

export const breakpoints = { sm: 640, md: 960, lg: 1200 };
