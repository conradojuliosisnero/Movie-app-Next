import { APP } from '@/config/app.config';

const key = (k) => `${APP.storageKey}:${k}`;

export const storage = {
  get(k, fallback) {
    try {
      const v = localStorage.getItem(key(k));
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(k, value) {
    try { localStorage.setItem(key(k), JSON.stringify(value)); } catch { /* sin espacio o modo privado */ }
  },
  remove(k) {
    try { localStorage.removeItem(key(k)); } catch { /* noop */ }
  },
};
