import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLetters}>
        <span className="leyend">
          Desing and Programing By{" "}
          <a href="https://github.com/conradojuliosisnero">Conrado Julio</a>
        </span>
      </div>
    </footer>
  );
}
