'use client';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ToastProvider } from '@/store/ToastContext';
import { SessionProvider } from '@/store/SessionContext';
import { LibraryProvider } from '@/store/LibraryContext';
import { UIProvider } from '@/store/UIContext';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import ToastIsland from '@/components/ui/ToastIsland/ToastIsland';

export default function Providers({ children }) {
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
