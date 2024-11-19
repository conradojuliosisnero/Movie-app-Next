import styles from "./footer.module.css";

const date = new Date().getFullYear();

export default function Footer() {
  const PROGRAMER_NAME = "ConradoJulio";
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLetters}>
        <span className={styles.leyend}>
          <a
            href="https://github.com/conradojuliosisnero"
            className={styles.name}
          >
            {" "}
            © {date} MoviesConV2. Todos los derechos reservados.
          </a>
        </span>
      </div>
    </footer>
  );
}
