// keywords: fragmentos (español e inglés) que, si aparecen en la pregunta, apuntan a esta respuesta.
// La pregunta y la respuesta están en el diccionario: copy.faq[id] = { q, a }.
export const FAQ = [
  { id: 'playback', keywords: ['reproduc', 'ver pel', 'dónde', 'donde', 'plataforma', 'complet', 'play', 'where', 'platform', 'full'] },
  { id: 'episodes', keywords: ['episod', 'capítulo', 'capitulo', 'marc', 'temporada', 'season', 'mark'] },
  { id: 'remove', keywords: ['borr', 'quit', 'elimin', 'remov', 'delet'] },
  { id: 'kids', keywords: ['infantil', 'niñ', 'peque', 'hij', 'perfil', 'kid', 'child', 'profile'] },
  { id: 'suggest', keywords: ['suger', 'decid', 'recomend', 'qué veo', 'que veo', 'suggest', 'recommend', 'what to watch'] },
  { id: 'sync', keywords: ['guard', 'nube', 'celular', 'dispositivo', 'perd', 'sincron', 'save', 'cloud', 'phone', 'device', 'sync'] },
  { id: 'party', keywords: ['amig', 'junt', 'grupo', 'sala', 'friend', 'together', 'room'], feature: 'watchParty' },
];

export const HELP_TOPICS = [
  { id: 'account', faqId: 'sync' },
  { id: 'library', faqId: 'episodes' },
  { id: 'platforms', faqId: 'playback' },
  { id: 'profiles', faqId: 'kids' },
];
