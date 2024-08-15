"use client";
import Link from "next/link";
import styles from "@/styles/verify.module.css";
import { Email } from "@/assets/svg";

export default function Verify() {
  return (
    <div className={styles.container}>
      <div className={styles.containerVerify}>
        <span className={styles.titleVerify}>
          Te hemos enviado un correo electronico de verificación
        </span>
        <Email />
      </div>
      <Link href="/" className={styles.buttonVerify}>
        Volver al inicio
      </Link>
    </div>
  );
}
