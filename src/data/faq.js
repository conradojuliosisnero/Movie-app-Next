// keywords: fragmentos que, si aparecen en la pregunta del usuario, apuntan a esta respuesta.
export const FAQ = [
  { id: 'playback', q: '¿PeliBox reproduce películas?', a: 'PeliBox reproduce tráilers y, en la ficha de cada título, “Ver completa”. En “Dónde verla” te mostramos las plataformas oficiales donde está disponible en tu país.', keywords: ['reproduc', 'ver pel', 'dónde', 'donde', 'plataforma', 'complet'] },
  { id: 'episodes', q: '¿Cómo marco episodios vistos?', a: 'Abre la serie o entra a Mi lista › Viendo y toca el número del episodio. Puedes cambiar de temporada en la ficha. Al terminar la última temporada pasa a “Vistas” para que la califiques.', keywords: ['episod', 'capítulo', 'capitulo', 'marc', 'temporada'] },
  { id: 'remove', q: '¿Cómo borro algo de mi lista?', a: 'Abre el título y toca otra vez el botón que está activo (Guardar, Ya la vi o No me interesa). Se quita al instante.', keywords: ['borr', 'quit', 'elimin'] },
  { id: 'kids', q: '¿Cómo creo un perfil infantil?', a: 'Avatar › Cambiar perfil › Nuevo, y activa “Perfil infantil”. Solo verá títulos familiares.', keywords: ['infantil', 'niñ', 'peque', 'hij', 'perfil'] },
  { id: 'suggest', q: '¿Qué es “Sugerirme algo”?', a: 'Elige por ti un título que no viste, según tu ánimo. Si tienes “Solo mis plataformas” activo, solo sugiere lo que está en tus servicios. Si no te convence, pide otra.', keywords: ['suger', 'decid', 'recomend', 'qué veo', 'que veo'] },
  { id: 'sync', q: '¿Mi lista se guarda?', a: 'Sí. Con tu cuenta, tu lista se guarda en la nube y la ves igual en el celular y en el computador. En modo explorar solo se guarda en este navegador.', keywords: ['guard', 'nube', 'celular', 'dispositivo', 'perd', 'sincron'] },
  { id: 'party', q: '¿Cómo veo con amigos?', a: 'En cualquier tráiler toca “Ver juntos” e invita a tu gente.', keywords: ['amig', 'junt', 'grupo', 'sala'], feature: 'watchParty' },
];

export const HELP_TOPICS = [
  { id: 'account', faqId: 'sync' },
  { id: 'library', faqId: 'episodes' },
  { id: 'platforms', faqId: 'playback' },
  { id: 'profiles', faqId: 'kids' },
];
