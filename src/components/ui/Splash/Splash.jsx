import Logo from '../Logo/Logo';
import s from './Splash.module.css';

/** Pantalla de carga mínima mientras se resuelve la sesión. */
export default function Splash() {
  return (
    <div className={s.splash} role="status" aria-label="Cargando">
      <Logo size="lg" />
    </div>
  );
}
