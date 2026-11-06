// Ánimos de “¿No sabes qué ver?”. El texto vive en i18n (copy.moods[id]).
// discover: filtros de TMDB para películas (movie) y series (tv). null = no aplica a ese tipo.
export const MOODS = [
  { id: 'short', discover: { movie: { 'with_runtime.lte': 100 }, tv: { 'with_runtime.lte': 30 } } },
  { id: 'laugh', discover: { movie: { with_genres: '35' }, tv: { with_genres: '35' } } },
  { id: 'think', discover: { movie: { with_genres: '18|99|9648' }, tv: { with_genres: '18|99|9648' } } },
  { id: 'scare', discover: { movie: { with_genres: '27' }, tv: null } },
  { id: 'family', discover: { movie: { with_genres: '10751' }, tv: { with_genres: '10751|10762' } } },
];
