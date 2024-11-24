"use client";
import styles from "./profile.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import userIconSvg from "@/assets/user.svg";

const PerfilUsuario = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(null);

  console.log("user name", userName);

  useEffect(() => {
    // Obtener el email de la cookie
    const email = Cookies.get("userEmail");
    const photo = Cookies.get("userPhoto");
    const userName = Cookies.get("userName");
    setUserEmail(email);
    setUserImage(photo);
    setUserName(userName);
  }, []);

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <Image
            src={userImage || userIconSvg}
            alt="Avatar del usuario"
            quality={70}
            width={100}
            height={100}
            priority={true}
          />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{userName ? userName : "N/A"}</h2>
          <p className={styles.userHandle}>{userEmail}</p>
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
