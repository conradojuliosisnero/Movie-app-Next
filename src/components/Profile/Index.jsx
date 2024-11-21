"use client";
import styles from "./profile.module.css";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Image from "next/image";

const PerfilUsuario = () => {
  const { userData } = useContext(AuthContext);

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <Image
            src={userData?.photoURL}
            alt="Avatar del usuario"
            quality={30}
            width={100}
            height={100}
            priority={true}
          />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{userData?.displayName}</h2>
          <p className={styles.userHandle}>{userData?.email}</p>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.bio}>
          <h3 className={styles.sectionTitle}>Biografía</h3>
          <p>...</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <p className={styles.statValue}>0</p>
            <p className={styles.statLabel}>Seguidores</p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statValue}>0</p>
            <p className={styles.statLabel}>Siguiendo</p>
          </div>
          {/* <div className={styles.statItem}>
            <p className={styles.statValue}>32</p>
            <p className={styles.statLabel}>Proyectos</p>
          </div> */}
        </div>
        <div className={styles.actions}>
          {/* <button className={`${styles.button} ${styles.primaryButton}`}>
            Editar Perfil
          </button> */}
          {/* <button className={`${styles.button} ${styles.secondaryButton}`}>
            Compartir Perfil
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
