/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nadie puede meter PeliBox dentro de un iframe en otro sitio (evita clickjacking:
  // que te hagan tocar botones de PeliBox escondidos bajo otra página).
  // frame-ancestors es la forma moderna; X-Frame-Options cubre navegadores viejos.
  // No afecta los iframes que PeliBox abre adentro (YouTube, reproductor).
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    }];
  },

  // Las URLs de la app anterior siguen funcionando: llevan a su equivalente en PeliBox.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/search', destination: '/buscar', permanent: true },
      { source: '/profile', destination: '/perfil', permanent: true },
      { source: '/about', destination: '/ayuda', permanent: true },
      { source: '/movies', destination: '/buscar?q=peliculas', permanent: true },
      { source: '/series', destination: '/buscar?q=series', permanent: true },
      { source: '/en-cines', destination: '/', permanent: true },
      { source: '/verify-email', destination: '/login', permanent: true },
      { source: '/forgot-password', destination: '/login', permanent: true },
      { source: '/movie-details/:id', destination: '/titulo/movie-:id', permanent: true },
      { source: '/serie-details/:id', destination: '/titulo/tv-:id', permanent: true },
      { source: '/person/:id', destination: '/persona/:id', permanent: true },
      { source: '/season/:serie/:season/:seasonId', destination: '/serie/:serie/temporada/:season', permanent: true },
    ];
  },
};

export default nextConfig;
