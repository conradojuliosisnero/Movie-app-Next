'use client';
// Ficha del título en panel (no pierde el lugar en la pantalla de atrás).
// El contenedor es Sheet; el contenido, TitleDetails. Se arrastra desde la cabecera.
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import Sheet from '@/components/ui/Sheet/Sheet';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import TitleDetails from '@/components/title/TitleDetails/TitleDetails';
import { useUI } from '@/store/UIContext';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './TitleDetailSheet.module.css';

export default function TitleDetailSheet() {
  const ui = useUI();
  const router = useRouter();
  const detail = ui.detail;
  if (!detail) return null;
  const { item, proposed } = detail;
  // Las sugerencias comparten panel (de esqueleto a ficha sin cerrar y abrir); el resto se reinicia por título.
  return (
    <Sheet key={proposed ? 'proposed' : item.id} label={item?.title || copy.common.loading} onClose={ui.closeDetail}>
      {({ close, dragRef }) => (item ? (
        <TitleDetails
          key={item.id}
          item={item}
          proposed={proposed}
          onBack={close}
          heroRef={dragRef}
          heroAction={<Button variant="media" size="sm" iconRight="expand" onClick={() => router.push(ROUTES.title(item.id))}>{copy.detail.openPage}</Button>}
        />
      ) : (
        <div className={s.loading}>
          <div ref={dragRef} className={s.hero}>
            <span className={s.finding}><Icon name="suggest" size="sm" />{copy.home.suggestLoading}</span>
            <Skeleton kind="heroText" />
          </div>
          <div className={s.body}><Skeleton kind="detail" /><Skeleton kind="rail" /></div>
        </div>
      ))}
    </Sheet>
  );
}
