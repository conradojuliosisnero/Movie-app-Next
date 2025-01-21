import styles from "./about.module.css";
// import Container from "../../../components/LoadingContainer/Container";

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>¡Bienvenido a mi Proyecto Personal!</h1>
      <p className={styles.description}>
        ¡Bienvenido a MoviesCon! Este es un proyecto desarrollado con Next.js
        que te permite explorar una amplia colección de películas de una manera
        divertida y sencilla.
      </p>
      <h2 className={styles.title}>Características Principales 🌟</h2>
      <p className={styles.description}>
        📽️ Gran selección de películas: Desde clásicos atemporales hasta los
        últimos estrenos. <br /> 🎥 Exploración intuitiva: Interfaz de usuario
        fácil de navegar. <br /> 🍿 Listas de reproducción personalizadas: Crea
        tu propia lista de películas favoritas.
        {/* <pre className={styles.pre}>
          <code>en desarrollo</code>
        </pre> */}
        <br /> 📺 Compatibilidad multiplataforma: Disfruta de MoviesCon en
        cualquier dispositivo.
      </p>
      {/* <p className={styles.description}>
        Algunas características que estoy desarrollando incluyen [lista de
        características] y espero lograr [objetivo del proyecto].
      </p> */}
      <p className={styles.description}>
        ¡Gracias por visitar y espero que te guste lo que estoy construyendo!
      </p>
    </div>
  );
}
