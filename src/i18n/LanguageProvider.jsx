'use client';
// Idioma elegido (guardado en el navegador). Al cambiarlo, las pantallas se vuelven a montar
// con el diccionario nuevo; los proveedores de arriba (sesión, lista) no se reinician.
import { createContext, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANGUAGES, setLanguage } from './index';
import { storage } from '@/services/storage';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    const saved = storage.get('lang', DEFAULT_LANG);
    if (LANGUAGES[saved]) { setLanguage(saved); setLang(saved); }
  }, []);

  useEffect(() => {
    setLanguage(lang);
    document.documentElement.lang = LANGUAGES[lang].html;
    storage.set('lang', lang);
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    languages: Object.entries(LANGUAGES).map(([code, l]) => ({ code, label: l.label })),
    setLang: (code) => { if (LANGUAGES[code]) { setLanguage(code); setLang(code); } },
  }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      <Fragment key={lang}>{children}</Fragment>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
