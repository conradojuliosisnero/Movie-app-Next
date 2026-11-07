'use client';
// Ficha del título en panel (no pierde el lugar en la pantalla de atrás).
// El contenedor es Sheet; el contenido, TitleDetails. Se arrastra desde la cabecera.
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import Sheet from '@/components/ui/Sheet/Sheet';
import TitleDetails from '@/components/title/TitleDetails/TitleDetails';
import { useUI } from '@/store/UIContext';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';

export default function TitleDetailSheet() {
  const ui = useUI();
  const router = useRouter();
  const item = ui.detail?.item;
  if (!item) return null;
  // key: al abrir otro título se reinicia el estado interno (temporada elegida, etc.).
  return (
    <Sheet key={item.id} label={item.title || copy.common.loading} onClose={ui.closeDetail}>
      {({ close, dragRef }) => (
        <TitleDetails
          item={item}
          proposed={ui.detail.proposed}
          onBack={close}
          heroRef={dragRef}
          heroAction={<Button variant="media" size="sm" iconRight="expand" onClick={() => router.push(ROUTES.title(item.id))}>{copy.detail.openPage}</Button>}
        />
      )}
    </Sheet>
  );
}
