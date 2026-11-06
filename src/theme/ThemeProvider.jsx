'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { palettes } from './tokens';
import { buildCssVars } from './cssVars';
import { APP } from '@/config/app.config';
import { storage } from '@/services/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setTheme] = useState(APP.defaultTheme);
  const [bigText, setBigText] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // El servidor pinta el tema por defecto; aquí se aplica el que eligió la persona.
  useEffect(() => {
    const saved = storage.get('theme', APP.defaultTheme);
    setTheme(palettes[saved] ? saved : APP.defaultTheme);
    setBigText(storage.get('bigText', false));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;
    const vars = buildCssVars(themeId, { textScale: bigText ? APP.bigTextScale : 1 });
    Object.entries(vars).forEach(([k, val]) => root.style.setProperty(k, String(val)));
    root.dataset.theme = themeId;
    storage.set('theme', themeId);
    storage.set('bigText', bigText);
  }, [themeId, bigText, loaded]);

  const value = useMemo(
    () => ({
      themeId,
      theme: palettes[themeId],
      themes: Object.entries(palettes).map(([id, p]) => ({ id, ...p })),
      setTheme,
      bigText,
      setBigText,
    }),
    [themeId, bigText]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
