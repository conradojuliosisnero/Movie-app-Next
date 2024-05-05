import React from "react";
import styles from "../WatchMovie/watch.module.css";
import Image from "next/image";
import GetWatchSerie from "../../services/WatchSerie/WatchSerie";
import { useState, useEffect } from "react";

export default function WatchSerie({ id }) {
  const [watch, setWatch] = useState([]);

  useEffect(() => {
    const getWatch = async () => {
      const response = await GetWatchSerie(id, setWatch);
    };
    getWatch();
  }, []);

  if (!watch || watch.length === 0) {
    return (
      <span className={styles.nullWatch}>No hay Plataformas de renta</span>
    ); // No renderizar nada si no hay datos en watch.results
  }

  return (
    <div className={styles.BoxWatch}>
      <div className={styles.WatchTitle}>
        <span>Ver en </span>
      </div>
      <div className={styles.cards}>
        {watch?.map((icon) => (
          <div key={icon.provider_id} className={styles.cardWatch}>
            <span key={icon.provider_id} className={styles.cardWatchTitle}>
              {icon.provider_name}
            </span>
            <Image
              className={styles.iconWatch}
              src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
              width={70}
              height={70}
              alt={""}
              priority={false}
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
}

// <div key={icon.provider_id}>
//   <span>{icon.provider_name}</span>
//   <Image
//     src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
//     width={100}
//     height={100}
//     alt={""}
//     priority={false}
//   ></Image>
// </div>
