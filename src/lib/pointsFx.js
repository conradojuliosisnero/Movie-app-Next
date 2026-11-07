// Aviso de “ganaste puntos”: la lista lo emite y la animación (PointsFx) lo escucha.
const listeners = new Set();
export const onPoints = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const emitPoints = (n) => { if (n > 0) listeners.forEach((fn) => fn(n)); };
