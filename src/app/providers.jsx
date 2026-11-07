'use client';
import { useEffect } from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ToastProvider } from '@/store/ToastContext';
import { SessionProvider } from '@/store/SessionContext';
import { LibraryProvider } from '@/store/LibraryContext';
import { UIProvider } from '@/store/UIContext';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import ToastIsland from '@/components/ui/ToastIsland/ToastIsland';

// El service worker solo se registra en producción (en desarrollo cachearía código viejo).
function useServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV === 'production') { navigator.serviceWorker.register('/sw.js').catch(() => {}); return; }
    // En desarrollo se quita el que haya quedado de una prueba con `npm start` en el mismo puerto:
    // su caché de /_next/static servía archivos viejos (p. ej. textos sin claves nuevas).
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
  }, []);
}

export default function Providers({ children }) {
  useServiceWorker();
  return (
    <ThemeProvider>
      <ToastProvider>
        <SessionProvider>
          <LibraryProvider>
            <UIProvider>
              <LanguageProvider>
                {children}
                <ToastIsland />
              </LanguageProvider>
            </UIProvider>
          </LibraryProvider>
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
