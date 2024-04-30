import styles from "./welcome.module.css";
import Image from "next/image";
import { useState,useEffect } from "react";

export default function Welcome({ movieHome }) {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (contador < 15) {
        setContador((prevContador) => prevContador + 1);
      } else {
        clearInterval(intervalo);
      }
    }, 12000); 

    return () => clearInterval(intervalo);
  }, [contador]);
  const movieinfo = movieHome && movieHome.length > 0 ? movieHome[contador] : null;
  return (
    <div className={styles.contendBox}>
      <section className={styles.MovieRelevant}>
        {/* title and overview */}
        <div className={styles.overvierHomeBox}>
          <h1 className={styles.overvierTitle}>
            {movieinfo ? movieinfo.title : ""}
          </h1>
          <article className={styles.overview}>
            <p className={styles.overvierText}>
              {movieinfo ? movieinfo.overview : ""}
            </p>
          </article>
        </div>
        {/* img  */}
        <div className={styles.MovieRelevantImg}>
          <Image
            src={`https://image.tmdb.org/t/p/w500/${
              movieinfo ? movieinfo.poster_path : ""
            }`}
            alt={movieinfo ? movieinfo.name : ""}
            width={100}
            height={100}
            priority={true}
          ></Image>
        </div>
      </section>
    </div>
  );
}
