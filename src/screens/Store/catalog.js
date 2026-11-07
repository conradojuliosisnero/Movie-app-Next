// Catálogo de coleccionables PeliBox (el stock real está en Firestore: storeStock).
// shortcut: nombres y descripciones solo en español; traducirlos cuando la tienda tenga versión en inglés.
// base = precio base en pts (anclado a la mediana semanal ≈ 1.400 pts).
export const RARITY = {
  COMÚN: { color: "#a8a49d", base: 700 },
  RARO: { color: "#6ab8e6", base: 1400 },
  ÉPICO: { color: "#c79be8", base: 4200 },
  LEGENDARIO: { color: "#f5c04a", base: null }, // no se vende: se sortea
};

export const CATEGORIES = ["Todos", "Pósters", "Marcos", "Fondos", "Títulos", "Efectos", "Insignias", "Pines", "Reacciones"];

export const CATALOG = [
  { id: "estreno", name: "Póster “Noche de estreno”", kind: "Pósters", rarity: "RARO", total: 40, desc: "Se cuelga en tu perfil, en la pared de tu sala." },
  { id: "doble", name: "Póster “Doble función”", kind: "Pósters", rarity: "RARO", total: 40, desc: "Dos películas, un solo póster. Edición numerada." },
  { id: "vhs", name: "Póster “Cinta VHS”", kind: "Pósters", rarity: "COMÚN", total: 120, desc: "Sé amable, rebobina." },
  { id: "butaca", name: "Marco de avatar “Butaca roja”", kind: "Marcos", rarity: "ÉPICO", total: 25, desc: "Tu avatar sentado en primera fila." },
  { id: "neon", name: "Marco “Neón animé”", kind: "Marcos", rarity: "ÉPICO", total: 25, desc: "Brilla cuando estás viendo algo." },
  { id: "rebobinar", name: "Marco “Rebobinado”", kind: "Marcos", rarity: "RARO", total: 40, desc: "Borde de cinta VHS que gira al pasar el cursor." },
  { id: "aire", name: "Fondo “Cine al aire libre”", kind: "Fondos", rarity: "ÉPICO", total: 30, desc: "Portada de perfil con proyección bajo las estrellas." },
  { id: "lluvia", name: "Fondo “Lluvia de neón”", kind: "Fondos", rarity: "RARO", total: 50, desc: "Calle mojada, letreros encendidos." },
  { id: "culto", name: "Título “Director de culto”", kind: "Títulos", rarity: "ÉPICO", total: 15, desc: "Aparece bajo tu nombre en el ranking." },
  { id: "final", name: "Título “Fan del final alternativo”", kind: "Títulos", rarity: "RARO", total: 50, desc: "Para los que siempre esperan la escena post-créditos." },
  { id: "spoiler", name: "Título “Libre de spoilers”", kind: "Títulos", rarity: "COMÚN", total: 150, desc: "Un juramento público." },
  { id: "creditos", name: "Efecto “Créditos finales”", kind: "Efectos", rarity: "ÉPICO", total: 20, desc: "Tu nombre sube como créditos al entrar al top 3." },
  { id: "saltan", name: "Efecto “Palomitas que saltan”", kind: "Efectos", rarity: "RARO", total: 40, desc: "Explosión de palomitas cada vez que subes de puesto." },
  { id: "maraton", name: "Insignia “Maratonista”", kind: "Insignias", rarity: "RARO", total: 60, desc: "Para quien termina una temporada en un fin de semana." },
  { id: "primera", name: "Insignia “Primera función”", kind: "Insignias", rarity: "RARO", total: 60, desc: "Viste un estreno el mismo día que salió." },
  { id: "critico", name: "Insignia “Crítico”", kind: "Insignias", rarity: "RARO", total: 40, desc: "Agotada. Volverá otra temporada con otro diseño." },
  { id: "claqueta", name: "Pin “Claqueta”", kind: "Pines", rarity: "COMÚN", total: 200, desc: "Clásico de la casa." },
  { id: "palomitas", name: "Pin “Palomitas”", kind: "Pines", rarity: "COMÚN", total: 200, desc: "Mantequilla extra." },
  { id: "rollo", name: "Pin “Rollo de 35 mm”", kind: "Pines", rarity: "COMÚN", total: 200, desc: "Para los nostálgicos del celuloide." },
  { id: "grito", name: "Reacciones “Noche de terror”", kind: "Reacciones", rarity: "COMÚN", total: 200, desc: "6 reacciones animadas para comentarios." },
].map((it) => ({ ...it, base: RARITY[it.rarity].base }));
