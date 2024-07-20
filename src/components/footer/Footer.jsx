import styles from "./footer.module.css";
import Link from "next/link";

export default function Component() {
  return (
    <footer className={styles.footer}>
      <div
        className={`${styles.container} ${styles.grid} ${styles.gridCols2} ${styles.smGridCols3} ${styles.mdGridCols4} ${styles.gap8} ${styles.textSm}`}
      >
        <div className={styles.flex}>
          <Link
            href="#"
            className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}
            prefetch={false}
          >
            {/* <MountainIcon className={styles.h6} /> */}
            <span className={styles.fontMedium}>MoviesCon v2</span>
          </Link>
        </div>
        <div className={styles.grid}>
          <h3 className={styles.fontSemibold}>Páginas</h3>
          <Link
            href="#"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Inicio
          </Link>
          <Link
            href="#"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Acerca de
          </Link>
          <Link
            href="https://github.com/conradojuliosisnero"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Servicios
          </Link>
          <Link
            href="https://github.com/conradojuliosisnero"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Contacto
          </Link>
        </div>
        <div className={styles.grid}>
          <h3 className={styles.fontSemibold}>Recursos</h3>
          <Link
            href="#"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Blog
          </Link>
          <Link
            href="https://github.com/conradojuliosisnero"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Developer
          </Link>
          <Link
            href="/about/section"
            className={`${styles.hoverUnderline} ${styles.underlineOffset4}`}
            prefetch={false}
          >
            Ayuda
          </Link>
        </div>
        <div className={styles.grid}>
          <h3 className={styles.fontSemibold}>Contacto</h3>
          <p>&copy; 2024 moviesCon Inc. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}


