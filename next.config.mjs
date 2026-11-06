/** @type {import('next').NextConfig} */
const nextConfig = {
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
